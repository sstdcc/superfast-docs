---
id: cloud-sync
title: Cloud Sync Setup
sidebar_label: Cloud Sync Setup
sidebar_position: 2
---

# Cloud Sync Setup

Cloud sync connects your local device to the SuperFast backend server, enabling data sharing across multiple devices and automatic cloud backup.

## Prerequisites

Before setting up cloud sync you need:
1. A running SuperFast backend server (see [Docker Deployment](../deployment/docker))
2. The server's public URL (e.g. `https://api.yourdomain.com`)
3. A registered store on the server, or you can register a new one during the connection flow

---

## Connecting a Device

### Step 1 — Open Cloud Sync Settings

1. Open **Settings** → tap the **Cloud Sync** tab.

### Step 2 — Enter Server URL

Enter your server URL without a trailing slash:
```
https://api.yourdomain.com
```

:::tip
If you're testing locally, use your machine's local IP:
```
http://192.168.1.100:8080
```
:::

### Step 3 — Enter Device Name

Give this device a recognizable name, e.g.:
- "Ahmed's iPhone"
- "Store Counter Tablet"
- "Office Desktop"

Device names appear in the server dashboard and help you manage connected devices.

### Step 4 — Connect

Tap **Connect**. The app will:
1. Validate the server URL by calling `GET /api/v1/health`
2. Register this device by calling `POST /api/v1/auth/device/login`
3. Receive a JWT access token and refresh token
4. Trigger an initial pull to download all existing data

The entire process takes 2–10 seconds depending on data volume.

### Step 5 — Verify Connection

A green **Connected** badge and the server version number appear in the Cloud Sync tab. The **Last Sync** timestamp updates every 30 seconds.

---

## What Gets Synced

### Synced to Cloud

| Data Type | Sync Direction |
|---|---|
| Customers (name, phone, credit limit) | Bidirectional |
| Suppliers (all fields) | Bidirectional |
| Customer Transactions | Bidirectional |
| Supplier Transactions | Bidirectional |
| Reminders | Bidirectional |
| Store Name & Currency | Bidirectional |
| Product Templates | Bidirectional |

### NOT Synced (Stays Local)

| Data Type | Reason |
|---|---|
| Theme (dark/light) | Device preference |
| Language setting | Device preference |
| Biometric setting | Device security |
| PIN | Device security (stored hashed locally) |
| WhatsApp connection state | Per-device WhatsApp session |
| Device Name | Set during connect |

---

## Sync Frequency

| Scenario | Sync Trigger |
|---|---|
| App in foreground | Every 30 seconds |
| App comes to foreground | Immediately |
| Manual (tap Sync Now) | Immediately |
| New transaction created | Within 30 seconds |
| App in background (Android) | Every 15 minutes (if background refresh enabled) |

---

## Sync Token Management

SuperFast uses JWT tokens for sync authentication:
- **Access Token**: Valid for 24 hours
- **Refresh Token**: Valid for 30 days

The app automatically refreshes the access token before it expires. If the refresh token expires (device not used for 30+ days), the device must reconnect via Settings → Cloud Sync → Connect.

---

## Disconnecting a Device

To remove cloud sync from a device without deleting local data:

1. Go to **Settings → Cloud Sync**.
2. Tap **Disconnect**.
3. The device stops syncing; all local data remains intact.

To reconnect, repeat the [Connecting a Device](#connecting-a-device) steps.

---

## Multiple Stores

A single SuperFast server can host **multiple stores**. Each store is completely isolated — its data is never visible to other stores. Devices authenticate with store-specific credentials.

---

## Sync Error Handling

### Common Errors

| Error | Cause | Fix |
|---|---|---|
| `ERR_CONNECTION_REFUSED` | Server is down or URL is wrong | Check server is running, verify URL |
| `401 Unauthorized` | Token expired or device not registered | Reconnect via Settings → Cloud Sync |
| `409 Conflict` | Conflicting update (resolved automatically) | None needed; app handles it |
| `503 Service Unavailable` | Server overloaded | Wait and retry; auto-retries in 60s |

### Stuck Sync Queue

If the sync queue has many `error` items that aren't clearing:

1. Check the server logs for errors.
2. In **Settings → Server**, use **Clear Sync Queue** (danger zone) to flush stuck items.
3. Trigger a manual sync.

:::warning
Clearing the sync queue on the server removes pending items permanently. Any offline changes from other devices that haven't been pushed yet will be lost. Only do this if you understand the consequences.
:::
