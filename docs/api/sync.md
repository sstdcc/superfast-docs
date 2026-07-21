---
id: sync
title: Sync API
sidebar_label: Sync API
sidebar_position: 5
---

# Sync API

The Sync API is the core of SuperFast's data exchange between devices and the server. Two endpoints handle all data synchronization: `push` (device to server) and `pull` (server to device).

## Push Changes

Sends local changes from a device to the server.

```http
POST /api/v1/sync/push
Authorization: Bearer <access_token>
X-Device-ID: <device_uuid>
Content-Type: application/json
```

### Request Body

```json
{
  "device_id": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "id": "sq-uuid-001",
      "entity_type": "customer",
      "entity_id": "cust-uuid-001",
      "operation": "create",
      "payload": { ... },
      "version": 1,
      "created_at": "2026-07-21T08:00:00Z"
    },
    {
      "id": "sq-uuid-002",
      "entity_type": "customer_transaction",
      "entity_id": "txn-uuid-001",
      "operation": "create",
      "payload": { ... },
      "version": 1,
      "created_at": "2026-07-21T08:05:00Z"
    }
  ]
}
```

### Push Item Fields

| Field | Type | Description |
|---|---|---|
| `id` | UUID string | Unique ID of this sync queue entry |
| `entity_type` | string | One of the supported entity types (see below) |
| `entity_id` | UUID string | ID of the record being modified |
| `operation` | string | `"create"`, `"update"`, or `"delete"` |
| `payload` | object | Full record snapshot (for create/update) or `{id, deleted_at}` (for delete) |
| `version` | integer | Monotonic version number for this entity |
| `created_at` | ISO 8601 | When this change was made on the device |

### Supported Entity Types

| Entity Type | Description |
|---|---|
| `customer` | Customer record |
| `supplier` | Supplier record |
| `customer_transaction` | Debt or payment for a customer |
| `supplier_transaction` | Purchase or payment for a supplier |
| `reminder` | Scheduled reminder |
| `settings` | Store-level settings |
| `product_template` | Product template for autocomplete |

### Push Response (200 OK)

```json
{
  "success": true,
  "data": {
    "received": 2,
    "accepted": 2,
    "rejected": 0,
    "conflicts": [],
    "server_time": "2026-07-21T08:05:30Z"
  }
}
```

| Field | Description |
|---|---|
| `received` | Total items received |
| `accepted` | Successfully stored |
| `rejected` | Validation failures |
| `conflicts` | Array of conflict details (if any) |
| `server_time` | Server timestamp (client should save this for the next pull) |

### Push Response with Conflicts (200 OK)

When a conflict is detected but automatically resolved:

```json
{
  "success": true,
  "data": {
    "received": 1,
    "accepted": 1,
    "rejected": 0,
    "conflicts": [
      {
        "entity_id": "cust-uuid-001",
        "entity_type": "customer",
        "winning_version": 5,
        "losing_version": 4,
        "resolution": "server_wins",
        "message": "A newer version exists on the server; your change was discarded"
      }
    ],
    "server_time": "2026-07-21T08:05:30Z"
  }
}
```

---

## Pull Changes

Fetches all changes made by other devices since a given timestamp.

```http
GET /api/v1/sync/pull?since=2026-07-21T00:00:00Z&device_id=550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <access_token>
X-Device-ID: <device_uuid>
```

### Query Parameters

| Parameter | Required | Description |
|---|---|---|
| `since` | Yes | ISO 8601 timestamp. Fetch changes after this time. Use `1970-01-01T00:00:00Z` for a full sync. |
| `device_id` | Yes | Your device ID — excludes your own changes from the result |
| `limit` | No | Max items per response (default: 500, max: 1000) |

### Pull Response (200 OK)

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "sync-log-uuid-001",
        "entity_type": "customer",
        "entity_id": "cust-uuid-002",
        "operation": "create",
        "payload": {
          "id": "cust-uuid-002",
          "store_id": "store-uuid-001",
          "name": "Fatima Hassan",
          "phone": "967788990011",
          "credit_limit": 0,
          "notes": "",
          "created_at": "2026-07-21T07:30:00Z",
          "updated_at": "2026-07-21T07:30:00Z",
          "deleted_at": null
        },
        "version": 1,
        "device_id": "660e8400-e29b-41d4-a716-556655440111",
        "server_time": "2026-07-21T07:30:05Z"
      },
      {
        "id": "sync-log-uuid-002",
        "entity_type": "customer_transaction",
        "entity_id": "txn-uuid-002",
        "operation": "create",
        "payload": {
          "id": "txn-uuid-002",
          "store_id": "store-uuid-001",
          "customer_id": "cust-uuid-002",
          "type": "debt",
          "amount": 3000.00,
          "description": "Rice and sugar",
          "reference": "TXN-20260721-001",
          "date": "2026-07-21",
          "created_at": "2026-07-21T07:35:00Z",
          "updated_at": "2026-07-21T07:35:00Z",
          "deleted_at": null
        },
        "version": 1,
        "device_id": "660e8400-e29b-41d4-a716-556655440111",
        "server_time": "2026-07-21T07:35:10Z"
      }
    ],
    "total": 2,
    "has_more": false,
    "server_time": "2026-07-21T08:05:30Z"
  }
}
```

| Field | Description |
|---|---|
| `items` | Array of change records from other devices |
| `total` | Total items returned in this response |
| `has_more` | `true` if there are more items beyond the `limit`; paginate with `offset` |
| `server_time` | Use this as the `since` value for your next pull |

### Empty Pull Response

When no changes from other devices exist since the given timestamp:

```json
{
  "success": true,
  "data": {
    "items": [],
    "total": 0,
    "has_more": false,
    "server_time": "2026-07-21T08:05:30Z"
  }
}
```

---

## Client Application of Pull Results

After receiving pull results, the client must apply them in the following order to avoid foreign key violations:

```
1. settings
2. product_template
3. customer
4. supplier
5. customer_transaction
6. supplier_transaction
7. reminder
```

After applying all changes, the client recalculates `current_balance` for all affected customers and suppliers.
