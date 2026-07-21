---
id: suppliers
title: Suppliers API
sidebar_label: Suppliers API
sidebar_position: 4
---

# Suppliers API

Like customers, suppliers are managed through the sync engine. All create/update/delete operations go through `POST /api/v1/sync/push`.

## Supplier Record Schema

```json
{
  "id": "supp-uuid-001",
  "store_id": "store-uuid-001",
  "name": "Al-Nour Wholesale",
  "phone": "967711223344",
  "contact_person": "Ibrahim Hassan",
  "address": "Sana'a, Al-Hasabah District",
  "notes": "Delivers every Tuesday",
  "created_at": "2026-07-01T08:00:00Z",
  "updated_at": "2026-07-01T08:00:00Z",
  "deleted_at": null
}
```

| Field | Type | Description |
|---|---|---|
| `id` | UUID string | Unique identifier (generated on device) |
| `store_id` | UUID string | Store this supplier belongs to |
| `name` | string | Supplier business or person name |
| `phone` | string | Contact number with country code |
| `contact_person` | string | Name of the representative |
| `address` | string | Physical address |
| `notes` | string | Internal notes |
| `created_at` | ISO 8601 | Creation timestamp |
| `updated_at` | ISO 8601 | Last modified timestamp |
| `deleted_at` | ISO 8601 or null | Soft delete timestamp |

---

## Creating a Supplier via Sync

```json
POST /api/v1/sync/push
Authorization: Bearer <token>
X-Device-ID: <device_uuid>

{
  "device_id": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "id": "sq-uuid-supp-001",
      "entity_type": "supplier",
      "entity_id": "supp-uuid-001",
      "operation": "create",
      "payload": {
        "id": "supp-uuid-001",
        "store_id": "store-uuid-001",
        "name": "Al-Nour Wholesale",
        "phone": "967711223344",
        "contact_person": "Ibrahim Hassan",
        "address": "Sana'a, Al-Hasabah District",
        "notes": "Delivers every Tuesday",
        "created_at": "2026-07-01T08:00:00Z",
        "updated_at": "2026-07-01T08:00:00Z",
        "deleted_at": null
      },
      "version": 1,
      "created_at": "2026-07-01T08:00:00Z"
    }
  ]
}
```

---

## Supplier Transaction Schema

Supplier transactions use `entity_type: "supplier_transaction"`:

```json
{
  "id": "stxn-uuid-001",
  "store_id": "store-uuid-001",
  "supplier_id": "supp-uuid-001",
  "type": "purchase",
  "amount": 50000.00,
  "description": "Weekly stock delivery",
  "invoice_number": "INV-2026-0721",
  "reference": "STXN-20260721-001",
  "date": "2026-07-21",
  "created_at": "2026-07-21T10:00:00Z",
  "updated_at": "2026-07-21T10:00:00Z",
  "deleted_at": null
}
```

| Field | Values |
|---|---|
| `type` | `"purchase"` (you bought from them) or `"payment"` (you paid them) |
| `amount` | Always positive |
| `invoice_number` | Supplier's invoice reference (optional) |

---

## Push Example — Recording a Purchase

```json
{
  "device_id": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "id": "sq-uuid-stxn-001",
      "entity_type": "supplier_transaction",
      "entity_id": "stxn-uuid-001",
      "operation": "create",
      "payload": {
        "id": "stxn-uuid-001",
        "store_id": "store-uuid-001",
        "supplier_id": "supp-uuid-001",
        "type": "purchase",
        "amount": 50000.00,
        "description": "Weekly stock delivery",
        "invoice_number": "INV-2026-0721",
        "reference": "STXN-20260721-001",
        "date": "2026-07-21",
        "created_at": "2026-07-21T10:00:00Z",
        "updated_at": "2026-07-21T10:00:00Z",
        "deleted_at": null
      },
      "version": 1,
      "created_at": "2026-07-21T10:00:00Z"
    }
  ]
}
```

---

## Balance Calculation

The server does not store a `current_balance` field for suppliers. Instead, balance is always computed:

```sql
SELECT
  COALESCE(SUM(CASE WHEN type = 'purchase' THEN amount ELSE 0 END), 0)
  - COALESCE(SUM(CASE WHEN type = 'payment' THEN amount ELSE 0 END), 0)
  AS current_balance
FROM supplier_transactions
WHERE supplier_id = $1 AND deleted_at IS NULL;
```

The client caches this computed balance in the local SQLite `suppliers` table's `current_balance` column and recalculates it after every pull.
