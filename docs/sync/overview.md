---
id: overview
title: How Sync Works
sidebar_label: How Sync Works
sidebar_position: 1
---

# How Sync Works

SuperFast uses a **push/pull sync engine** built on top of a local SQLite database on each device and a central PostgreSQL database on the server. The architecture ensures the app is fully usable without internet while keeping all devices consistent when connectivity is available.

## Architecture Overview

```
Device A (Phone)                Server (Go API)           Device B (Tablet)
─────────────────────           ─────────────────          ─────────────────────
SQLite DB                       PostgreSQL DB              SQLite DB
sync_queue (pending)            sync_log (all changes)     sync_queue (pending)
     │                               ▲  │                        │
     │ PUSH (POST /sync/push)        │  │ PUSH                   │
     ├──────────────────────────────►│  │◄───────────────────────┤
     │                               │  │                        │
     │ PULL (GET /sync/pull?since=T) │  │ PULL                   │
     │◄──────────────────────────────┘  └───────────────────────►│
     │                               │                           │
     ▼                               │                           ▼
Local DB updated               Authoritative source      Local DB updated
```

---

## The Sync Queue

Every write operation (create, update, delete) on a device adds a row to the local `sync_queue` table **before** it touches the main entity table. This ensures no change is ever lost, even if the app crashes mid-operation.

### sync_queue Table Structure

```sql
CREATE TABLE sync_queue (
  id            TEXT PRIMARY KEY,   -- UUID
  entity_type   TEXT NOT NULL,      -- 'customer', 'supplier', 'transaction', etc.
  entity_id     TEXT NOT NULL,      -- UUID of the affected record
  operation     TEXT NOT NULL,      -- 'create', 'update', 'delete'
  payload       TEXT NOT NULL,      -- JSON snapshot of the record
  version       INTEGER NOT NULL,   -- Monotonic version counter per entity
  created_at    TEXT NOT NULL,      -- ISO 8601 timestamp
  synced_at     TEXT,               -- NULL until successfully pushed
  status        TEXT DEFAULT 'pending'  -- 'pending', 'synced', 'error'
);
```

---

## Push (Device → Server)

The push cycle runs every 30 seconds (when the app is foregrounded) or immediately when a sync is manually triggered.

### Push Steps

1. **Read pending items**: Query `sync_queue WHERE status = 'pending'` ordered by `created_at ASC`.
2. **Batch the items**: Group into batches of up to 100 items.
3. **POST to server**: Send `POST /api/v1/sync/push` with the batch.
4. **Server processes**: The server validates each item, applies it to PostgreSQL, and stores it in `sync_log`.
5. **Mark synced**: On success (HTTP 200), update the local sync_queue rows to `status = 'synced'` and set `synced_at`.
6. **Handle conflicts**: If the server returns a conflict (HTTP 409), see [Conflict Resolution](#conflict-resolution) below.

### Push Payload Example

```json
{
  "device_id": "dev-abc123",
  "items": [
    {
      "id": "sq-uuid-001",
      "entity_type": "customer",
      "entity_id": "cust-uuid-001",
      "operation": "create",
      "payload": {
        "id": "cust-uuid-001",
        "name": "Mohammed Al-Rashid",
        "phone": "967712345678",
        "credit_limit": 10000,
        "created_at": "2026-07-21T08:00:00Z"
      },
      "version": 1,
      "created_at": "2026-07-21T08:00:00Z"
    }
  ]
}
```

---

## Pull (Server → Device)

The pull cycle runs immediately after a successful push, or when the app comes back online.

### Pull Steps

1. **Get last pull timestamp**: Read `last_pull_at` from local settings.
2. **GET from server**: Send `GET /api/v1/sync/pull?since=<last_pull_at>&device_id=<id>`.
3. **Server responds**: Returns all changes made by **other devices** since the given timestamp.
4. **Apply changes in FK order**: The client applies changes in a specific entity priority order to avoid foreign key constraint violations:
   - Customers first
   - Suppliers second
   - Customer transactions third
   - Supplier transactions fourth
   - Reminders last
5. **Update timestamp**: Set `last_pull_at` to the current server time.
6. **Recalculate balances**: After applying all changes, recalculate `current_balance` for affected customers and suppliers.

---

## Conflict Resolution

Conflicts occur when two devices modify the same record while offline.

**Strategy: Last-Write-Wins (LWW) with Server Timestamp**

- The server assigns a `server_timestamp` to each change when it is received.
- If two devices push conflicting changes for the same `entity_id`, the change with the **later `server_timestamp`** wins.
- The losing change is discarded on the server and overwritten on the losing device during its next pull.

### Example

```
Device A (offline): Updates customer "Mohammed" name to "Mohammed Ahmed"  → pushed at 10:01
Device B (offline): Updates customer "Mohammed" name to "Mohammed Ali"    → pushed at 10:02

Server receives A's change at 10:01 → stores it.
Server receives B's change at 10:02 → stores it, overwriting A's change.
Device A pulls and gets B's version → "Mohammed Ali" wins.
```

:::note
For financial transactions, conflicts are much rarer because transactions are immutable once created. Each transaction has a unique UUID. Two devices can both create new transactions for the same customer without conflict — both are preserved.
:::

---

## Version Vectors

Each entity tracks a `version` counter that increments on every update. This helps the server detect out-of-order arrivals and skipped updates.

If the server receives `version: 5` but has only seen up to `version: 3` for an entity, it queues the item and waits for `version: 4` before applying.

---

## What Gets Synced

| Entity | Synced |
|---|---|
| Customers | Yes |
| Suppliers | Yes |
| Customer Transactions | Yes |
| Supplier Transactions | Yes |
| Reminders | Yes |
| Store-level Settings (name, currency) | Yes |
| Product Templates | Yes |
| Device-level Settings (theme, biometric, PIN) | No — stays local |
| WhatsApp Connection State | No — per-device |
