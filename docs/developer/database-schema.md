---
id: database-schema
title: Database Schema
sidebar_label: Database Schema
sidebar_position: 3
---

# Database Schema

SuperFast uses **two databases**:
1. **Local SQLite** — on each device, full read/write, works offline
2. **PostgreSQL** — cloud authoritative store, receives pushes from all devices

The schemas are largely identical. The PostgreSQL schema adds sync-specific columns (`device_id`, `server_time`) that are not present in SQLite.

---

## Stores

```sql
CREATE TABLE stores (
  id           TEXT PRIMARY KEY,           -- UUID
  name         TEXT NOT NULL,              -- "Ahmed's Supermarket"
  owner_name   TEXT NOT NULL,
  currency     TEXT NOT NULL DEFAULT 'YER',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Devices

```sql
CREATE TABLE devices (
  id           TEXT PRIMARY KEY,           -- UUID generated on device
  store_id     TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,              -- "Ahmed's Phone"
  last_seen_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_devices_store_id ON devices(store_id);
```

---

## Customers

```sql
CREATE TABLE customers (
  id              TEXT PRIMARY KEY,         -- UUID
  store_id        TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  phone           TEXT,
  credit_limit    NUMERIC(15, 2) NOT NULL DEFAULT 0,
  notes           TEXT,
  current_balance NUMERIC(15, 2) NOT NULL DEFAULT 0,  -- denormalized; recalculated after sync
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ             -- soft delete
);

CREATE INDEX idx_customers_store_id ON customers(store_id);
CREATE INDEX idx_customers_phone   ON customers(phone);
CREATE INDEX idx_customers_deleted ON customers(deleted_at) WHERE deleted_at IS NULL;
```

---

## Suppliers

```sql
CREATE TABLE suppliers (
  id              TEXT PRIMARY KEY,         -- UUID
  store_id        TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  phone           TEXT,
  contact_person  TEXT,
  address         TEXT,
  notes           TEXT,
  current_balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_suppliers_store_id ON suppliers(store_id);
```

---

## Customer Transactions

```sql
CREATE TABLE customer_transactions (
  id          TEXT PRIMARY KEY,             -- UUID
  store_id    TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('debt', 'payment')),
  amount      NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  reference   TEXT,                         -- e.g. TXN-20260721-004
  date        DATE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

CREATE INDEX idx_cust_txn_customer_id ON customer_transactions(customer_id);
CREATE INDEX idx_cust_txn_store_id    ON customer_transactions(store_id);
CREATE INDEX idx_cust_txn_date        ON customer_transactions(date DESC);
CREATE INDEX idx_cust_txn_deleted     ON customer_transactions(deleted_at) WHERE deleted_at IS NULL;
```

---

## Supplier Transactions

```sql
CREATE TABLE supplier_transactions (
  id           TEXT PRIMARY KEY,            -- UUID
  store_id     TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  supplier_id  TEXT NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN ('purchase', 'payment')),
  amount       NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  description  TEXT,
  invoice_number TEXT,
  reference    TEXT,
  date         DATE NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at   TIMESTAMPTZ
);

CREATE INDEX idx_supp_txn_supplier_id ON supplier_transactions(supplier_id);
CREATE INDEX idx_supp_txn_store_id    ON supplier_transactions(store_id);
CREATE INDEX idx_supp_txn_date        ON supplier_transactions(date DESC);
```

---

## Reminders

```sql
CREATE TABLE reminders (
  id                TEXT PRIMARY KEY,       -- UUID
  store_id          TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  customer_id       TEXT REFERENCES customers(id) ON DELETE SET NULL,
  title             TEXT NOT NULL,
  note              TEXT,
  due_at            TIMESTAMPTZ NOT NULL,
  amount_threshold  NUMERIC(15, 2) NOT NULL DEFAULT 0,
  send_whatsapp     BOOLEAN NOT NULL DEFAULT FALSE,
  whatsapp_message  TEXT,
  status            TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'snoozed', 'completed', 'sent')),
  snoozed_until     TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_reminders_store_id    ON reminders(store_id);
CREATE INDEX idx_reminders_customer_id ON reminders(customer_id);
CREATE INDEX idx_reminders_due_at      ON reminders(due_at);
CREATE INDEX idx_reminders_status      ON reminders(status);
```

---

## Settings

```sql
CREATE TABLE settings (
  id          TEXT PRIMARY KEY,             -- UUID; always one row per store
  store_id    TEXT NOT NULL UNIQUE REFERENCES stores(id) ON DELETE CASCADE,
  store_name  TEXT NOT NULL,
  currency    TEXT NOT NULL DEFAULT 'YER',
  credit_limit_default NUMERIC(15, 2) NOT NULL DEFAULT 0,
  date_format TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Product Templates

```sql
CREATE TABLE product_templates (
  id          TEXT PRIMARY KEY,             -- UUID
  store_id    TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  category    TEXT NOT NULL,               -- "Groceries", "Beverages", etc.
  name        TEXT NOT NULL,               -- "Rice 5kg"
  unit_price  NUMERIC(15, 2),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

CREATE INDEX idx_product_templates_store_id ON product_templates(store_id);
CREATE INDEX idx_product_templates_category ON product_templates(category);
```

---

## Sync Log (PostgreSQL only)

```sql
CREATE TABLE sync_log (
  id            TEXT PRIMARY KEY,           -- UUID of the sync_queue entry
  store_id      TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  device_id     TEXT NOT NULL,
  entity_type   TEXT NOT NULL,
  entity_id     TEXT NOT NULL,
  operation     TEXT NOT NULL CHECK (operation IN ('create', 'update', 'delete')),
  payload       JSONB NOT NULL,
  version       INTEGER NOT NULL,
  client_time   TIMESTAMPTZ NOT NULL,
  server_time   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sync_log_store_device   ON sync_log(store_id, device_id);
CREATE INDEX idx_sync_log_server_time    ON sync_log(server_time);
CREATE INDEX idx_sync_log_entity        ON sync_log(entity_type, entity_id);
```

The `sync_log` table is the backbone of the pull mechanism. When a device pulls, the server queries:
```sql
SELECT * FROM sync_log
WHERE store_id = $1
  AND device_id != $2          -- exclude the requesting device's own changes
  AND server_time > $3         -- since the last pull
ORDER BY server_time ASC
LIMIT $4;
```

---

## Balance Calculation Queries

### Customer balance
```sql
SELECT
  COALESCE(SUM(CASE WHEN type = 'debt'    THEN amount ELSE 0 END), 0)
  - COALESCE(SUM(CASE WHEN type = 'payment' THEN amount ELSE 0 END), 0)
AS balance
FROM customer_transactions
WHERE customer_id = $1 AND deleted_at IS NULL;
```

### Supplier balance
```sql
SELECT
  COALESCE(SUM(CASE WHEN type = 'purchase' THEN amount ELSE 0 END), 0)
  - COALESCE(SUM(CASE WHEN type = 'payment' THEN amount ELSE 0 END), 0)
AS balance
FROM supplier_transactions
WHERE supplier_id = $1 AND deleted_at IS NULL;
```
