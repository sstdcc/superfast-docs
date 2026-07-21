---
id: whatsapp
title: WhatsApp
sidebar_label: WhatsApp
sidebar_position: 7
---

# WhatsApp Integration

SuperFast integrates with WhatsApp via the **Evolution API** — an open-source WhatsApp Web multi-device bridge. This allows you to send account statements, reminders, and custom messages to customers directly from the app.

## Prerequisites

- A running Evolution API instance (self-hosted or provided by your administrator)
- A WhatsApp account (personal or business) linked via QR scan
- SuperFast server connected (cloud sync must be set up)

---

## Connecting WhatsApp

### Step 1 — Configure Evolution API

1. Go to **Settings → WhatsApp**.
2. Enter:
   - **API URL** — e.g. `https://evolution.yourdomain.com`
   - **API Key** — the Evolution API global key
   - **Instance Name** — e.g. `superfast-store1` (unique per store)
3. Tap **Save**.

### Step 2 — Scan QR Code

1. Tap **Connect WhatsApp**.
2. A QR code appears on screen.
3. On your WhatsApp phone:
   - Open WhatsApp → tap **⋮ (three dots)** → **Linked Devices**
   - Tap **Link a Device**
   - Scan the QR code displayed in SuperFast
4. Wait for the status to change to **Connected** (usually within 5 seconds).

:::warning
The QR code expires after 60 seconds. If it expires, tap **Refresh QR** to generate a new one.
:::

### Connection Status Indicators

| Status | Meaning |
|---|---|
| Connected (green) | WhatsApp is active and ready |
| Connecting (yellow) | Attempting to connect |
| Disconnected (red) | Not connected; WhatsApp features unavailable |
| QR Required (blue) | Waiting for QR scan |

---

## Sending a Statement to a Customer

1. Open the customer profile.
2. Tap the **WhatsApp** icon (speech bubble with handset).
3. The app generates a statement message:
   ```
   *Account Statement — Ahmed's Supermarket*
   Customer: Mohammed Al-Rashid
   Date: 21/07/2026

   Transactions (Last 30 days):
     15/07  Groceries        +3,000 YER
     18/07  Cash Payment     -1,500 YER
     21/07  Household items  +2,000 YER

   *Current Balance: 3,500 YER*

   Thank you for shopping with us.
   ```
4. Edit the message if needed.
5. Tap **Send**.

---

## Chat List

The WhatsApp section includes a built-in chat list that shows all active WhatsApp conversations on the connected number. This is divided into three tabs:

### All Tab
All conversations, sorted by most recent message.

### Personal Tab (شخصي)
Conversations with individual contacts only (excludes groups).

### Groups Tab (مجموعات)
WhatsApp group chats only.

Each row in the chat list shows:
- Contact/group name
- Last message preview
- Timestamp of last message
- Unread message count badge

---

## Chat View

Tap any conversation in the chat list to open the full chat view:
- Message history (sent and received)
- Media messages show a thumbnail
- Send a new message from the text input at the bottom
- Messages you send appear with a ✓✓ read receipt indicator

---

## Sending a Custom Message

You can send a custom WhatsApp message to any contact:

1. Go to **WhatsApp → Chat List**.
2. Tap the **Compose** icon (pencil at top-right).
3. Search for a contact name or enter a number manually.
4. Type your message.
5. Tap **Send**.

---

## Contact List

The **Contacts** view shows all WhatsApp contacts synced from the linked phone. You can search by name or number. Tapping a contact opens the chat view.

---

## Logging Out

To unlink the WhatsApp account from SuperFast:

1. Go to **Settings → WhatsApp**.
2. Tap **Logout WhatsApp**.
3. Confirm.

This sends a logout request to Evolution API. The QR scan will be required next time.

:::note
Logging out from SuperFast also unlinks the device from WhatsApp Web on your phone. The phone's WhatsApp app itself is not affected.
:::

---

## Troubleshooting

### QR Code Won't Scan
- Ensure your phone camera has a clear view of the screen
- Try increasing screen brightness
- Tap "Refresh QR" to get a fresh code
- Check that your WhatsApp is updated to the latest version

### Messages Not Sending
- Check the WhatsApp connection status (should be green)
- Verify the customer's phone number includes the country code
- Ensure the Evolution API server is reachable from your SuperFast server

### Connection Drops Frequently
- WhatsApp Web sessions can drop if the linked phone loses internet
- Ensure the phone stays connected to mobile data or Wi-Fi
- Consider using a dedicated phone for the WhatsApp link

### "Number not on WhatsApp" Error
- The customer's phone number is not registered on WhatsApp
- Double-check the number format (country code required, no `+` symbol in the stored number)
