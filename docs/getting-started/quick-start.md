---
id: quick-start
title: Quick Start
sidebar_label: Quick Start
sidebar_position: 4
---

# Quick Start

Get SuperFast running in under 5 minutes with this step-by-step guide.

## Step 1 — Register Your Store

After [installing](./installation) and launching SuperFast for the first time:

1. Tap **Register New Store** on the welcome screen.
2. Fill in your **Store Name** and **Owner Name**.
3. Choose a **4-digit PIN** (you use this to unlock the app).
4. Tap **Create Store**.

You will land on the **Dashboard** — it will be empty for now.

---

## Step 2 — Connect to the Server (Optional but Recommended)

To enable cloud sync and WhatsApp features:

1. Open **Settings** (gear icon, bottom-right).
2. Go to the **Cloud Sync** tab.
3. Enter your server URL, e.g.:
   ```
   https://api.yourdomain.com
   ```
4. Enter a device name (e.g. "My Phone").
5. Tap **Connect**.

A green **Connected** badge will appear when the handshake succeeds.

:::tip
If you don't have a server yet, you can skip this step. All core features work fully offline. Set up the server later by following the [Deployment Guide](../deployment/docker).
:::

---

## Step 3 — Add Your First Customer

1. Tap **Customers** in the bottom navigation bar.
2. Tap the **+** button (top-right corner).
3. Fill in:
   - **Name** — e.g. "Mohammed Al-Rashid"
   - **Phone** — e.g. "+967 712 345678" (used for WhatsApp)
   - **Credit Limit** — maximum debt allowed (leave 0 for unlimited)
4. Tap **Save**.

The customer now appears in your customer list with a balance of **0.00**.

---

## Step 4 — Record Your First Debt

Your customer bought groceries worth 5,000 YER on credit:

1. Tap the customer's name to open their profile.
2. Tap **Add Transaction** (the **+** button on the profile page).
3. Select **Debt** as the transaction type.
4. Enter:
   - **Amount**: `5000`
   - **Description**: `Groceries 21 July` (optional)
   - **Date**: today (pre-filled)
5. Tap **Save**.

The customer's balance now shows **5,000.00** — meaning they owe you 5,000 YER.

---

## Step 5 — Send a WhatsApp Statement

Send the customer a statement of their account over WhatsApp:

### First — Connect WhatsApp

1. Go to **Settings → WhatsApp**.
2. Enter your Evolution API URL and API Key (or ask your administrator).
3. Tap **Connect** → a QR code appears.
4. Open WhatsApp on your phone → **Linked Devices → Link a Device** → scan the QR.
5. The status changes to **Connected**.

### Send the Statement

1. Open the customer's profile.
2. Tap the **WhatsApp** icon (speech bubble with phone icon) at the top.
3. Review the auto-generated statement message.
4. Tap **Send**.

The customer receives a WhatsApp message like:

```
Account Statement — Ahmed's Supermarket
Customer: Mohammed Al-Rashid
Date: 21/07/2026

Transactions:
  21/07/2026  Groceries 21 July  +5,000 YER

Total Balance: 5,000 YER

Thank you for shopping with us.
```

---

## Step 6 — View Your Dashboard

Tap **Dashboard** in the bottom navigation. You will see:

- **Customers** card: 1 customer
- **Customer Debt** card: 5,000 YER
- **Suppliers** card: 0 suppliers
- **Supplier Debt** card: 0 YER
- **Net Position** card: -5,000 YER (you are owed 5,000)
- **Recent Transactions** list: the debt entry you just created

---

## What's Next?

You've completed the basics. Here's what to explore next:

| Topic | Link |
|---|---|
| Add suppliers and track purchases | [Suppliers Guide](../user-guide/suppliers) |
| Set up automated reminders | [Reminders Guide](../user-guide/reminders) |
| View cash flow and analytics | [Reports Guide](../user-guide/reports) |
| Connect a second device | [Multi-Device Sync](../sync/multi-device) |
| Deploy the server yourself | [Docker Deployment](../deployment/docker) |
