---
id: customers
title: Customers API
sidebar_label: Customers API
sidebar_position: 3
---

# Customers API

Customers and their transactions are managed through the **sync engine** rather than direct CRUD REST endpoints. This is a deliberate architectural choice: it ensures offline writes are always captured and that all changes go through the same conflict-resolution pipeline regardless of whether they originate from a UI interaction or an API call.

## Sync-Based Approach

Instead of `POST /customers`, `PUT /customers/:id`, `DELETE /customers/:id`, you:

1. Add customer records to the **sync push payload**
2. Send them via `POST /api/v1/sync/push`

The server processes each item in the payload and stores it in PostgreSQL.

---

## Customer Record Schema

A customer record in the sync payload has the following structure:

```json
{
  "id": "cust-uuid-001",
  "store_id": "store-uuid-001",
  "name": "Mohammed Al-Rashid",
  "phone": "967712345678",
  "credit_limit": 10000,
  "notes": "Regular customer, pays on weekends",
  "created_at": "2026-07-21T08:00:00Z",
  "updated_at": "2026-07-21T08:00:00Z",
  "deleted_at": null
}
```

| Field | Type | Description |
|---|---|---|
| `id` | UUID string | Unique identifier (generated on device) |
| `store_id` | UUID string | Store this customer belongs to |
| `name` | string | Customer's full name |
| `phone` | string | Phone number with country code, no `+` |
| `credit_limit` | number | Max credit in store currency; 0 = unlimited |
| `notes` | string | Optional internal notes |
| `created_at` | ISO 8601 | When this customer was first created |
| `updated_at` | ISO 8601 | Last modification time |
| `deleted_at` | ISO 8601 or null | Set when customer is soft-deleted |

---

## Creating a Customer via Sync

```json
POST /api/v1/sync/push
Authorization: Bearer <token>
X-Device-ID: <device_uuid>

{
  "device_id": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "id": "sq-uuid-new-001",
      "entity_type": "customer",
      "entity_id": "cust-uuid-new",
      "operation": "create",
      "payload": {
        "id": "cust-uuid-new",
        "store_id": "store-uuid-001",
        "name": "Khalid Ahmed",
        "phone": "967733445566",
        "credit_limit": 5000,
        "notes": "",
        "created_at": "2026-07-21T09:00:00Z",
        "updated_at": "2026-07-21T09:00:00Z",
        "deleted_at": null
      },
      "version": 1,
      "created_at": "2026-07-21T09:00:00Z"
    }
  ]
}
```

---

## Updating a Customer via Sync

Same as create, but `operation: "update"` and `version` increments:

```json
{
  "id": "sq-uuid-upd-001",
  "entity_type": "customer",
  "entity_id": "cust-uuid-new",
  "operation": "update",
  "payload": {
    "id": "cust-uuid-new",
    "store_id": "store-uuid-001",
    "name": "Khalid Ahmed Saeed",
    "phone": "967733445566",
    "credit_limit": 7500,
    "notes": "Increased credit limit",
    "created_at": "2026-07-21T09:00:00Z",
    "updated_at": "2026-07-21T10:30:00Z",
    "deleted_at": null
  },
  "version": 2,
  "created_at": "2026-07-21T10:30:00Z"
}
```

---

## Soft Deleting a Customer via Sync

Customers are **soft-deleted** — the record is not removed from the database, but `deleted_at` is set. This preserves the transaction history for accounting purposes.

```json
{
  "id": "sq-uuid-del-001",
  "entity_type": "customer",
  "entity_id": "cust-uuid-new",
  "operation": "delete",
  "payload": {
    "id": "cust-uuid-new",
    "deleted_at": "2026-07-21T11:00:00Z"
  },
  "version": 3,
  "created_at": "2026-07-21T11:00:00Z"
}
```

---

## Customer Transactions Schema

Customer transactions follow the same sync pattern under `entity_type: "customer_transaction"`:

```json
{
  "id": "txn-uuid-001",
  "store_id": "store-uuid-001",
  "customer_id": "cust-uuid-001",
  "type": "debt",
  "amount": 5000.00,
  "description": "Groceries 21 July",
  "reference": "TXN-20260721-004",
  "date": "2026-07-21",
  "created_at": "2026-07-21T08:30:00Z",
  "updated_at": "2026-07-21T08:30:00Z",
  "deleted_at": null
}
```

| Field | Values |
|---|---|
| `type` | `"debt"` or `"payment"` |
| `amount` | Always positive; `type` determines direction |

---

## Reading Customers (via Pull)

Customers are returned when you call `GET /api/v1/sync/pull`. You cannot query individual customers via a direct API call — all reads go through the pull mechanism or the local SQLite database.

See [Sync API](./sync) for the full pull response format.
