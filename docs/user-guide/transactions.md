---
id: transactions
title: Transactions
sidebar_label: Transactions
sidebar_position: 4
---

# Transactions

Transactions are the fundamental records in SuperFast. Every debt and every payment is stored as a transaction. This page explains all transaction types and entry methods.

## Transaction Types

| Type | Who It Applies To | Effect on Balance |
|---|---|---|
| **Debt** (Customer) | Customers | Balance increases — customer owes more |
| **Payment** (Customer) | Customers | Balance decreases — customer paid back |
| **Purchase** (Supplier) | Suppliers | Balance increases — you owe more |
| **Payment** (Supplier) | Suppliers | Balance decreases — you paid the supplier |

---

## Quick Entry Modal

The **Quick Entry** modal is the fastest way to log a transaction without navigating to a specific customer or supplier profile.

### Opening Quick Entry
- Tap the **+** floating button on the Dashboard, or
- Tap **Record Transaction** in the quick links grid

### Using Quick Entry
1. **Select entity type**: Customer or Supplier
2. **Search for the entity**: Type a name or phone number
3. **Select transaction type**: Debt / Payment (customers) or Purchase / Payment (suppliers)
4. **Enter amount**
5. **Add description** (optional)
6. **Set date** (defaults to today)
7. Tap **Save**

The transaction is immediately written to the local SQLite database and added to the sync queue.

---

## Bulk Entry

Bulk entry allows you to record multiple transactions in a single session — useful at end of day when you have many customers who bought on credit.

1. Open Quick Entry.
2. Tap **Bulk Mode** toggle (top-right of the modal).
3. For each transaction:
   - Search customer → enter amount → tap **Add**
4. All entries appear in a staging list below.
5. When done, tap **Save All** to commit all transactions at once.

:::tip
Bulk entry is ideal for market day or end-of-shift reconciliation when you have 10–30 debts to enter quickly.
:::

---

## Invoice Modal

For more formal transaction entry with line items:

1. Open a customer or supplier profile.
2. Tap **Add Transaction → Invoice**.
3. Add line items:
   - **Item name** (with autocomplete from your product templates)
   - **Quantity**
   - **Unit price**
4. The total is calculated automatically.
5. Add an **invoice number** for reference.
6. Tap **Save** — creates a single transaction with the total amount and attaches the itemized list.

---

## Printing a Receipt

After recording any transaction:

1. Tap the transaction row in the profile's history list.
2. Tap **Print Receipt** (printer icon).
3. A receipt-sized print view opens:
   ```
   ╔══════════════════════════════╗
   ║      Ahmed's Supermarket     ║
   ╠══════════════════════════════╣
   ║ Date:  21/07/2026            ║
   ║ Ref:   TXN-20260721-004      ║
   ╠══════════════════════════════╣
   ║ Customer: Mohammed           ║
   ║ Type:  Debt                  ║
   ║ Amount: 5,000 YER            ║
   ║ Desc:  Groceries             ║
   ╠══════════════════════════════╣
   ║ Balance: 12,500 YER          ║
   ╚══════════════════════════════╝
   ```
4. Print or save to PDF.

---

## Transaction History

### On a Customer / Supplier Profile
The profile's **Transaction History** tab shows:
- All transactions in reverse chronological order
- Running balance after each transaction
- Filter by date range (tap the calendar icon)
- Filter by type (All / Debts only / Payments only)

### Global Transactions View
From the Dashboard → **Recent Transactions**, you see the last 20 transactions across all entities.

---

## Editing a Transaction

:::warning
Editing a transaction changes the historical record and re-calculates all subsequent balances. Use with care.
:::

1. Open the customer or supplier profile.
2. Tap the transaction row.
3. Tap **Edit** (pencil icon).
4. Modify the amount, description, or date.
5. Tap **Save**.

---

## Deleting a Transaction

:::danger
Deleting a transaction permanently removes it and recalculates the current balance. The deletion is synced to all devices.
:::

1. Open the transaction detail (tap the row).
2. Tap **Delete** (trash icon).
3. Confirm deletion.

---

## Transaction Reference Numbers

Every transaction is automatically assigned a unique reference number in the format:

```
TXN-YYYYMMDD-NNN
```

For example: `TXN-20260721-042` — the 42nd transaction created on 21 July 2026.

These reference numbers are included in printed receipts and WhatsApp statements for traceability.

---

## Offline Behavior

All transaction entry works fully offline. Transactions written while offline are:
1. Saved immediately to the local SQLite database
2. Added to the `sync_queue` table with status `pending`
3. Automatically pushed to the server the next time a connection is available

See [Offline Mode](../sync/offline-mode) for details.
