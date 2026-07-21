---
id: suppliers
title: Suppliers
sidebar_label: Suppliers
sidebar_position: 3
---

# Suppliers

The Suppliers section tracks the businesses and individuals you buy stock from on credit. You record purchases (which increase your debt to the supplier) and payments (which reduce your debt).

## Supplier List

Navigate to **Suppliers** via the bottom navigation bar. The list shows:

- Supplier name and phone/contact
- Current balance (amount **you owe them**)
- Color-coded badge:
  - **Red** — you owe them money (positive balance)
  - **Green** — zero or negative balance (you over-paid)

Sorted by **balance descending** by default — who you owe the most appears at the top.

---

## Adding a Supplier

1. Tap **+** in the top-right corner of the Suppliers screen.
2. Fill in the form:

| Field | Required | Notes |
|---|---|---|
| Name | Yes | Business or person name |
| Phone | No | Contact number; also used for WhatsApp |
| Contact Person | No | Name of the rep you deal with |
| Address | No | Supplier address for statements |
| Notes | No | Free-text internal notes |

3. Tap **Save**.

---

## Supplier Profile

The supplier profile page mirrors the customer profile and contains:

### Balance Summary
- **Positive balance** = you owe the supplier this amount
- **Zero balance** = fully settled
- **Negative balance** = you over-paid (supplier owes you)

### Transaction History
Full chronological list of:
- **Purchases** (you bought stock → balance goes up)
- **Payments** (you paid the supplier → balance goes down)

### Action Buttons
| Button | Action |
|---|---|
| Add Transaction | Record a purchase or payment |
| Send WhatsApp Statement | Send statement via WhatsApp |
| Print Statement | Print/export as PDF |
| Edit Supplier | Modify supplier details |

---

## Recording a Purchase

A **purchase** records that you received goods from the supplier on credit.

1. Open the supplier profile.
2. Tap **Add Transaction → Purchase**.
3. Enter:
   - **Amount** — total invoice value
   - **Invoice Number** — optional reference
   - **Description** — e.g. "Weekly stock delivery"
   - **Date** — defaults to today
4. Tap **Save**.

Your balance owed to the supplier increases by the entered amount.

---

## Recording a Payment to Supplier

1. Open the supplier profile.
2. Tap **Add Transaction → Payment**.
3. Enter:
   - **Amount** — cash/transfer sent to supplier
   - **Reference** — optional bank transfer reference
   - **Date** — defaults to today
4. Tap **Save**.

Your balance owed decreases by the payment amount.

---

## Printing a Supplier Statement

The print layout for suppliers is identical to the customer statement but from the opposite perspective — it shows what you purchased and what you paid, ending with your outstanding balance.

1. Open the supplier profile.
2. Tap **Print Statement**.
3. Review and print/save as PDF.

---

## Sending a WhatsApp Statement to Supplier

Useful for confirming your current balance with the supplier:

1. Ensure WhatsApp is connected (see [WhatsApp Guide](./whatsapp)).
2. Open the supplier profile.
3. Tap the **WhatsApp** icon.
4. Review the generated message (shows your debt to them).
5. Tap **Send**.

---

## Balance Explanation for Suppliers

| Balance Sign | Meaning |
|---|---|
| Positive (+10,000) | You owe the supplier 10,000 |
| Zero (0.00) | You are fully settled with this supplier |
| Negative (-2,000) | Supplier owes you 2,000 (you over-paid) |

:::tip
If you over-pay a supplier, the negative balance can be applied as credit against your next purchase. Simply record the next purchase and let the balance reconcile naturally.
:::

---

## Supplier vs Customer: Key Difference

| Concept | Customer | Supplier |
|---|---|---|
| Who owes whom? | Customer owes you | You owe the supplier |
| Debt transaction | Customer buys on credit | You buy stock on credit |
| Payment direction | Customer pays you | You pay the supplier |
| Positive balance means | Customer owes you | You owe supplier |

---

## Deleting a Supplier

:::danger
Deleting a supplier removes all their transactions from your local database and syncs this deletion to all devices. This cannot be undone.
:::

1. Open the supplier profile.
2. Tap **⋮ → Delete Supplier**.
3. Confirm deletion.
