---
id: server-dashboard
title: Server Dashboard
sidebar_label: Server Dashboard
sidebar_position: 4
---

# Server Dashboard

The **Server Dashboard** is a built-in monitoring panel accessible directly from the SuperFast app via **Settings → Server** tab. It shows real-time metrics from the backend server without requiring access to any external monitoring tool.

## Accessing the Dashboard

1. Open **Settings** (gear icon in the bottom navigation).
2. Tap the **Server** tab.
3. The dashboard loads metrics from `GET /api/v1/server/metrics`.

The metrics are cached for 30 seconds to avoid overloading the server. Tap **Refresh** at any time to force a fresh fetch.

:::note
The Server tab is only visible if the device is connected to a server (Cloud Sync must be configured). If you see "No server connected", go to the Cloud Sync tab and connect first.
:::

---

## Metrics Explained

### Uptime

```
Uptime: 7 days, 3 hours, 42 minutes
```

How long the Go server process has been running continuously. A short uptime may indicate a recent crash or restart. Normal servers typically show days or weeks of uptime.

**What to watch for:** Uptime resetting unexpectedly (could indicate crashes, OOM kills, or external restarts).

---

### Goroutines

```
Goroutines: 24
```

The number of active Go goroutines (concurrent lightweight threads). Each active HTTP request, background job, and internal system task uses a goroutine.

| Range | Status |
|---|---|
| 10–50 | Normal (idle server) |
| 50–100 | Normal (moderate load) |
| 100–500 | Elevated (high traffic) |
| 500+ | Warning — possible goroutine leak |

---

### Memory

```
Heap Used:  45.2 MB
Heap Total: 68.0 MB
```

- **Heap Used**: Memory currently holding live Go objects (data, caches, request buffers)
- **Heap Total**: Total heap memory allocated from the OS (includes free space within the Go runtime's heap)

**Healthy pattern**: Heap used gradually increases during active use, then drops after garbage collection (GC). You'll see `GC Count` incrementing regularly.

| Heap Used | Status |
|---|---|
| < 100 MB | Normal for a small store |
| 100–300 MB | Normal for heavy use |
| > 300 MB | Monitor — possible memory pressure |
| > 500 MB | Warning — consider restarting or scaling |

---

### Database

```
Connected:          Yes
Size:               124.5 MB
Active Connections: 5 / 25
Tables Count:       14
Migration Version:  8
```

- **Connected**: Must always be `Yes`. If `No`, the server cannot process any requests.
- **Size**: Total size of the PostgreSQL database on disk. Grows as transactions accumulate. Under normal operation, a store with 1,000 customers and 50,000 transactions uses around 50–150 MB.
- **Active Connections**: Connections currently executing queries. Should stay well below `max_connections`.
- **Migration Version**: The current database schema version. Should match the server version's expected migration.

**Alert if:** `Active Connections` approaches `Max Connections` — this causes new requests to queue and eventually time out.

---

### Redis

```
Connected:         Yes
Memory Used:       12.3 MB
Connected Clients: 3
```

Redis is used for rate limiting and JWT caching. Low memory usage is expected.

**Alert if:** `Connected: No` — rate limiting and token refresh will fail.

---

### Sync Statistics

```
Total Push Operations: 84,521
Total Pull Operations: 71,234
Queue Depth:           0
Last Push:             2026-07-21T08:30:00Z
Last Pull:             2026-07-21T08:30:01Z
```

- **Total Push/Pull**: Cumulative counts since server started. These only reset on server restart.
- **Queue Depth**: Items currently in the server's sync queue waiting to be applied. Should be 0 or near 0.
- **Last Push/Pull**: When the most recent sync operation occurred. If these timestamps are very old, sync may have stopped.

**Alert if:** Queue Depth grows continuously without decreasing — this indicates sync processing is stuck.

---

### WhatsApp

```
Connected:              Yes
Instance:               superfast-store1
Messages Sent Today:    47
```

Shows whether the WhatsApp session is active and how many messages have been sent in the current calendar day (server local time).

---

## Refresh Rate

The dashboard does not auto-refresh. Tap **Refresh** manually when you want updated data. Avoid tapping Refresh more than once per 30 seconds (the response is cached server-side).

---

## Danger Zone

At the bottom of the Server Dashboard are actions that affect all devices:

:::danger
The Danger Zone actions are irreversible and affect all connected devices. Only use them if you understand the consequences.
:::

### Clear Sync Queue

**What it does**: Removes all pending items from the server's sync queue. This does **not** affect data that has already been applied to PostgreSQL — only items waiting to be processed.

**When to use**: If the sync queue is stuck (queue depth keeps growing, items never clear) and you've verified the stuck items are safe to discard (e.g. duplicates, already synced via another path).

**What happens to devices**: They will continue pushing normally. The next push from each device may re-send items that were in the cleared queue (devices re-push until they get confirmation).

### Logout Device

**What it does**: Immediately revokes the JWT tokens for a specific device. The device can no longer push or pull until it re-authenticates.

**When to use**:
- A device is lost or stolen
- A device is malfunctioning and sending corrupt sync data
- You want to prevent a specific device from syncing

**What happens to the device**: The next sync attempt fails with `401 Unauthorized`. The device shows a "Disconnected" status. The owner must open Settings → Cloud Sync and Connect again with the store PIN.

To use Logout Device:
1. Find the device in the Connected Devices list (by device name or last seen time).
2. Tap **Logout Device** next to it.
3. Confirm the action.
