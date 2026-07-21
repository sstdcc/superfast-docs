---
id: customers
title: Customers
sidebar_label: Customers
sidebar_position: 2
---

# Customers

The Customers section is where you manage everyone who buys from your store on credit. You can add customers, view their balance, record debts and payments, and communicate via WhatsApp.

## Customer List

Navigate to **Customers** via the bottom navigation bar. The list shows:

- Customer name and phone number
- Current balance (amount they owe you)
- Color-coded balance badge:
  - **Red** — they owe you money (positive balance)
  - **Green** — zero or negative balance (rare; means you over-collected)
- A search bar at the top to filter by name or phone

The list is sorted by **balance descending** by default (highest debt first), making it easy to see who owes the most.

---

## Adding a Customer

1. Tap the **+** button in the top-right corner of the Customers screen.
2. Fill in the form:

| Field | Required | Notes |
|---|---|---|
| Name | Yes | Full name or business name |
| Phone | No | Include country code for WhatsApp (e.g. +967...) |
| Credit Limit | No | Maximum debt allowed; 0 = unlimited |
| Notes | No | Free-text notes visible on profile |

3. Tap **Save**.

:::tip
The phone number must include the country code (without the `+`) to work with WhatsApp. For Yemen: `967712345678`.
:::

---

## Customer Profile

Tapping a customer name opens their **Profile Page**, which contains:

### Balance Summary
A large number showing the current balance:
- **Positive** = they owe you this amount
- **Negative** = you owe them this amount (very unusual; can happen if excess payment was recorded)
- **Zero** = settled

### Transaction History
A chronological list of all debts and payments for this customer. Each entry shows:
- Date
- Type (Debt / Payment)
- Amount (debts in red, payments in green)
- Description
- Running balance after this transaction

### Action Buttons
- **Add Transaction** — record a new debt or payment
- **Send WhatsApp Statement** — generate and send a statement via WhatsApp
- **Print Statement** — open a printable PDF/HTML statement
- **Edit Customer** — modify name, phone, credit limit

---

## Recording a Debt

A **debt** records that the customer took goods or services on credit.

1. Open the customer profile.
2. Tap **Add Transaction → Debt**.
3. Enter:
   - **Amount** — the value of goods/services
   - **Description** — optional; e.g. "Groceries", "Household items"
   - **Date** — defaults to today
4. Tap **Save**.

The customer's balance increases by the entered amount.

---

## Recording a Payment

A **payment** records that the customer paid back part or all of their debt.

1. Open the customer profile.
2. Tap **Add Transaction → Payment**.
3. Enter:
   - **Amount** — the payment amount
   - **Description** — optional; e.g. "Cash payment"
   - **Date** — defaults to today
4. Tap **Save**.

The customer's balance decreases by the payment amount.

---

## Printing a Statement

1. Open the customer profile.
2. Tap **Print Statement**.
3. A formatted statement opens in a print preview:
   - Store name and logo
   - Customer name and contact
   - Statement date range
   - Transaction table (date, description, debit, credit, balance)
   - Total balance
4. Use your system's print dialog to print or save as PDF.

---

## Sending a WhatsApp Statement

1. Ensure WhatsApp is connected (see [WhatsApp Guide](./whatsapp)).
2. Open the customer profile.
3. Tap the **WhatsApp** icon.
4. Review the auto-generated statement text.
5. Optionally edit the message.
6. Tap **Send**.

The customer receives the statement on their WhatsApp number.

---

## Balance Explanation

| Balance Sign | Meaning | Example |
|---|---|---|
| Positive (+5,000) | Customer owes you 5,000 | They bought 10,000 worth, paid 5,000 |
| Zero (0.00) | Fully settled | All debts have been paid |
| Negative (-500) | You over-collected 500 | They paid more than they owed |

:::note
A negative customer balance is unusual. It typically means a payment was entered incorrectly. Review the transaction history and add a correcting entry if needed.
:::

---

## Credit Limit Enforcement

If a customer has a credit limit set and you try to add a debt that would exceed it, the app displays a **warning**. You can choose to:
- Cancel the transaction
- Override the limit (requires confirmation)

The credit limit is a soft guardrail — it does not block the transaction, only warns.

---

## Searching Customers

Use the search bar at the top of the Customers list. The search is **instant and local** — no server request is made. It filters by:
- Name (partial match)
- Phone number (partial match)

---

## Deleting a Customer

:::danger
Deleting a customer permanently removes them and all their transaction history from your local database. This action syncs to the server and all other devices.
:::

1. Open the customer profile.
2. Tap the **three-dot menu (⋮)** in the top-right.
3. Tap **Delete Customer**.
4. Confirm the deletion.
