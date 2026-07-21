---
id: offline-mode
title: Offline Mode
sidebar_label: Offline Mode
sidebar_position: 3
---

# Offline Mode

SuperFast is **offline-first** by design. Every feature that involves reading or writing data works without an internet connection. Network access is only required for syncing with other devices and for WhatsApp messaging.

## What Works Offline

All core app functionality is fully available offline:

| Feature | Offline Available | Notes |
|---|---|---|
| View Dashboard | Yes | Data from local SQLite |
| Add / Edit / Delete Customers | Yes | Written to local DB + sync queue |
| Add / Edit / Delete Suppliers | Yes | Written to local DB + sync queue |
| Record Transactions (debts & payments) | Yes | Written to local DB + sync queue |
| View Transaction History | Yes | All local data |
| Print Statements | Yes | Local data only |
| Create / Edit / Delete Reminders | Yes | Written to local DB + sync queue |
| View Reports & Analytics | Yes | All computed from local data |
| Export Backup | Yes | Reads local SQLite |
| Import Backup | Yes | Writes to local SQLite |
| Product Template Autocomplete | Yes | Local templates |
| PIN / Biometric Login | Yes | Verified locally |

## What Requires Network Access

| Feature | Why Network is Needed |
|---|---|
| Cloud Sync (push/pull) | Communicates with backend server |
| WhatsApp message sending | Calls Evolution API on the server |
| WhatsApp QR code / connection | Calls Evolution API |
| Chat list & messages | Fetched from Evolution API |
| Server Metrics Dashboard | Calls `/api/v1/server/metrics` |
| Initial device registration | One-time call to the server |

---

## Offline Indicator

When the device has no network connection, a small **Offline** badge appears:
- In the header bar (top of screen)
- On the Cloud Sync settings tab

This badge disappears as soon as connectivity is restored.

---

## How Offline Writes Are Queued

When you create a transaction while offline:

```
1. User taps "Save"
2. App writes the transaction to local SQLite immediately
3. App inserts a row into sync_queue with status='pending'
4. UI updates instantly (no spinner, no waiting)
5. [Later, when online] Sync engine reads sync_queue
6. Items are pushed to the server
7. sync_queue rows are marked status='synced'
```

The user never waits for a network response. The experience is identical whether online or offline.

---

## Sync on Reconnect

When network connectivity is restored, the sync engine detects it within **5 seconds** and automatically triggers a push + pull cycle. You will see the **Last Sync** timestamp update in Settings → Cloud Sync.

On Android, network state changes are monitored via the system `NetworkCallback` API. On desktop (Windows/macOS/Linux), the app polls connectivity every 5 seconds.

---

## Conflict Handling After Offline Period

If two devices both made changes to the same record while offline:

1. Whichever device pushes first has its change stored on the server.
2. When the second device pushes, the server compares timestamps.
3. The later timestamp wins (Last-Write-Wins).
4. The first device gets the second device's version on its next pull.

For **transactions**, conflicts almost never occur because each transaction has a unique UUID generated on the device. Two devices creating transactions for the same customer don't conflict — both transactions are preserved.

---

## Long Offline Periods

If a device has been offline for a very long time (weeks or months):

1. The JWT access token may expire (24h) and the refresh token may also expire (30 days).
2. When the device comes back online, it will get an `401 Unauthorized` error.
3. The user must re-authenticate via **Settings → Cloud Sync → Connect**.
4. After re-authentication, the pending sync queue items are pushed.

:::tip
To avoid token expiry on long-offline devices, ensure the app is opened occasionally (even with Wi-Fi off) — the app will attempt to refresh the token whenever the device has network access.
:::

---

## Testing Offline Mode

To test offline behavior manually:
1. Enable **Airplane Mode** on your device.
2. Open SuperFast — notice the Offline badge in the header.
3. Add a customer and create a transaction.
4. Disable Airplane Mode.
5. Within 5 seconds, the sync should trigger automatically and the data should appear on another device.
