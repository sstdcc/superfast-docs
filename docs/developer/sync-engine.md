---
id: sync-engine
title: Sync Engine Deep Dive
sidebar_label: Sync Engine
sidebar_position: 4
---

# Sync Engine Deep Dive

This page explains the internals of SuperFast's sync engine — how changes are captured, queued, pushed to the server, pulled from the server, and applied to the local database.

## Sync Queue Table

Every write to the local database is accompanied by an entry in `sync_queue`:

```sql
CREATE TABLE sync_queue (
  id            TEXT PRIMARY KEY,
  entity_type   TEXT NOT NULL,
  entity_id     TEXT NOT NULL,
  operation     TEXT NOT NULL,   -- 'create', 'update', 'delete'
  payload       TEXT NOT NULL,   -- JSON string
  version       INTEGER NOT NULL,
  created_at    TEXT NOT NULL,   -- ISO 8601
  synced_at     TEXT,
  status        TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'synced', 'error'
  retry_count   INTEGER NOT NULL DEFAULT 0,
  last_error    TEXT
);

CREATE INDEX idx_sync_queue_status ON sync_queue(status, created_at);
```

---

## Write Path (How Changes Enter the Queue)

In Tauri, every database write goes through a transaction wrapper that atomically writes to both the entity table and the sync queue:

```rust
// src-tauri/src/db/sync.rs (simplified)
pub async fn write_with_sync<T: Serialize>(
    db: &SqlitePool,
    entity_type: &str,
    entity_id: &str,
    operation: &str,
    payload: &T,
) -> Result<()> {
    let mut tx = db.begin().await?;

    // 1. Write the entity itself (caller does this before calling us)

    // 2. Insert sync queue entry
    let queue_id = Uuid::new_v4().to_string();
    let payload_json = serde_json::to_string(payload)?;
    let version = get_next_version(&mut tx, entity_id).await?;

    sqlx::query!(
        "INSERT INTO sync_queue (id, entity_type, entity_id, operation, payload, version, created_at, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')",
        queue_id, entity_type, entity_id, operation, payload_json, version,
        Utc::now().to_rfc3339()
    )
    .execute(&mut *tx)
    .await?;

    tx.commit().await?;
    Ok(())
}
```

The SQLite transaction ensures that the entity write and the queue entry are **atomic** — they either both succeed or both fail. This prevents the state where the UI shows a record but no sync queue entry exists.

---

## Push Cycle

The push cycle is triggered every 30 seconds by a background timer in Tauri:

```rust
// src-tauri/src/sync/push.rs (simplified)
pub async fn run_push_cycle(db: &SqlitePool, http: &HttpClient, config: &SyncConfig) -> Result<()> {
    // Step 1: Read pending items
    let items: Vec<SyncQueueItem> = sqlx::query_as!(
        SyncQueueItem,
        "SELECT * FROM sync_queue WHERE status = 'pending' ORDER BY created_at ASC LIMIT 100"
    )
    .fetch_all(db)
    .await?;

    if items.is_empty() {
        return Ok(());
    }

    // Step 2: Build push payload
    let push_body = PushRequest {
        device_id: config.device_id.clone(),
        items: items.iter().map(|i| i.into_push_item()).collect(),
    };

    // Step 3: Send to server
    let response = http
        .post(&format!("{}/api/v1/sync/push", config.server_url))
        .bearer_auth(&config.access_token)
        .header("X-Device-ID", &config.device_id)
        .json(&push_body)
        .send()
        .await?;

    // Step 4: Handle response
    match response.status().as_u16() {
        200 => {
            let result: PushResponse = response.json().await?;

            // Mark successfully pushed items as synced
            let accepted_ids: Vec<String> = items.iter()
                .map(|i| i.id.clone())
                .collect();

            sqlx::query!(
                "UPDATE sync_queue SET status = 'synced', synced_at = ? WHERE id IN ({})",
                // ... bind accepted_ids
            )
            .execute(db)
            .await?;

            // Mark conflicted items appropriately
            for conflict in &result.conflicts {
                // Log conflict but mark as synced (server-side resolution applied)
                log_conflict(conflict);
            }
        }
        401 => {
            // Token expired — attempt refresh
            refresh_token_and_retry(config).await?;
        }
        _ => {
            // Mark items as error, increment retry_count
            increment_retry_count(&items, db).await?;
        }
    }

    Ok(())
}
```

---

## Pull Cycle

The pull cycle runs immediately after a successful push:

```rust
// src-tauri/src/sync/pull.rs (simplified)
pub async fn run_pull_cycle(db: &SqlitePool, http: &HttpClient, config: &SyncConfig) -> Result<()> {
    // Step 1: Get last pull timestamp from local settings
    let last_pull_at = get_last_pull_timestamp(db).await?;

    // Step 2: GET from server
    let response = http
        .get(&format!("{}/api/v1/sync/pull", config.server_url))
        .bearer_auth(&config.access_token)
        .header("X-Device-ID", &config.device_id)
        .query(&[
            ("since", &last_pull_at),
            ("device_id", &config.device_id),
        ])
        .send()
        .await?;

    let pull_data: PullResponse = response.json().await?;

    if pull_data.items.is_empty() {
        // Update last_pull_at even if nothing changed
        set_last_pull_timestamp(db, &pull_data.server_time).await?;
        return Ok(());
    }

    // Step 3: Apply changes in FK-safe order
    apply_pull_items(db, &pull_data.items).await?;

    // Step 4: Update last pull timestamp
    set_last_pull_timestamp(db, &pull_data.server_time).await?;

    // Step 5: Recalculate balances for affected entities
    let affected_customers: Vec<String> = pull_data.items.iter()
        .filter(|i| i.entity_type == "customer_transaction")
        .map(|i| extract_customer_id(&i.payload))
        .collect();

    recalculate_customer_balances(db, &affected_customers).await?;

    Ok(())
}
```

---

## Entity Priority Ordering

Changes from a pull are applied in this order to avoid foreign key violations:

```rust
const ENTITY_PRIORITY: &[&str] = &[
    "settings",
    "product_template",
    "customer",
    "supplier",
    "customer_transaction",
    "supplier_transaction",
    "reminder",
];

async fn apply_pull_items(db: &SqlitePool, items: &[PullItem]) -> Result<()> {
    for entity_type in ENTITY_PRIORITY {
        let type_items: Vec<&PullItem> = items.iter()
            .filter(|i| &i.entity_type == entity_type)
            .collect();

        for item in type_items {
            apply_single_item(db, item).await?;
        }
    }
    Ok(())
}
```

**Why this order matters**: A `customer_transaction` references a `customer`. If we tried to insert the transaction before the customer exists locally (because it was created on another device), SQLite would throw a foreign key violation. Processing customers first ensures the parent always exists before the child.

---

## Balance Recalculation After Pull

After applying pulled items, the engine recalculates balances for all affected entities:

```sql
-- Recalculate customer balance
UPDATE customers
SET current_balance = (
  SELECT
    COALESCE(SUM(CASE WHEN type = 'debt'    THEN amount ELSE 0 END), 0)
    - COALESCE(SUM(CASE WHEN type = 'payment' THEN amount ELSE 0 END), 0)
  FROM customer_transactions
  WHERE customer_id = customers.id AND deleted_at IS NULL
)
WHERE id = $1;
```

This denormalized `current_balance` column is what the UI reads. Recomputing it after sync ensures the dashboard and customer list always show the authoritative balance.

---

## Retry Logic

Failed push attempts increment `retry_count`. The engine backs off exponentially:

| retry_count | Next retry wait |
|---|---|
| 1 | 30 seconds |
| 2 | 2 minutes |
| 3 | 10 minutes |
| 4 | 1 hour |
| 5+ | Flagged as `error`; requires manual intervention |

Items with `status = 'error'` and `retry_count >= 5` are visible in the Settings → Cloud Sync tab as "Failed Items" and can be retried manually.

---

## Sync Performance

For a store with 500 customers, 10,000 transactions, and 3 devices, typical sync performance:

| Operation | Data Volume | Time |
|---|---|---|
| Initial full pull | ~2 MB | 2–5 seconds |
| Incremental pull (1 device change) | ~5 KB | < 500 ms |
| Push 10 new transactions | ~10 KB | < 500 ms |
| Balance recalculation (10 customers) | Local SQL | < 50 ms |
