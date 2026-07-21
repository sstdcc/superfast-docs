---
id: dashboard
title: Dashboard
sidebar_label: Dashboard
sidebar_position: 1
---

# Dashboard

The Dashboard is the home screen of SuperFast. It gives you an at-a-glance view of your store's financial position, recent activity, and upcoming reminders.

## Stat Cards

At the top of the dashboard are four summary cards:

### Customers Card
Displays the **total number of customers** in your database. Tapping this card navigates to the full Customers list.

### Customer Debt Card
Shows the **aggregate outstanding balance owed to you by all customers**. This is the sum of all positive customer balances. If a customer's balance is negative (you over-collected), it is excluded from this total.

### Suppliers Card
Displays the **total number of suppliers** in your database. Tapping navigates to the Suppliers list.

### Supplier Debt Card
Shows **how much you owe to all suppliers in total**. This is the sum of all positive supplier balances (positive = you owe them).

---

## Net Position Card

Below the four stat cards is a larger **Net Position** card. It is calculated as:

```
Net Position = Customer Debt Total − Supplier Debt Total
```

| Value | Meaning |
|---|---|
| Positive (green) | Your customers owe you more than you owe suppliers — you are in a net receivable position |
| Negative (red) | You owe suppliers more than customers owe you — cash outflow needed |
| Zero (neutral) | Balanced position |

:::tip
A healthy store typically has a positive net position, meaning more money is owed to you than you owe out.
:::

---

## Recent Transactions

The middle section of the dashboard lists the **20 most recent transactions** across all customers and suppliers, sorted newest first.

Each row shows:
- **Entity name** (customer or supplier)
- **Transaction type** icon (debt/purchase = red arrow up, payment = green arrow down)
- **Amount**
- **Date**
- **Description** (if any)

Tapping a transaction row navigates to the relevant customer or supplier profile.

---

## Reminders Widget

Near the bottom of the dashboard is the **Upcoming Reminders** widget. It shows reminders that are:
- Due today, or
- Overdue (past due date)

Each reminder row shows the customer name, the reminder message, the scheduled time, and an overdue badge if applicable.

- Tap a reminder to open it and mark it complete or snooze it.
- The bottom navigation bar shows a **badge count** on the Reminders tab when there are pending reminders.

---

## Quick Links Grid

At the bottom of the dashboard is a grid of quick action buttons:

| Button | Action |
|---|---|
| Add Customer | Opens the new customer form |
| Add Supplier | Opens the new supplier form |
| Record Transaction | Opens the quick transaction modal |
| View Reports | Navigates to the Reports screen |
| WhatsApp | Opens the WhatsApp chat list |
| Settings | Opens Settings |

---

## Refreshing

The dashboard data is loaded from your **local SQLite database** — it is always instant, with no loading spinner. When a sync completes in the background, the figures update automatically without requiring a manual refresh.

To manually trigger a sync, pull down on the dashboard screen (pull-to-refresh gesture on mobile, or press **Ctrl+R** / **Cmd+R** on desktop).
