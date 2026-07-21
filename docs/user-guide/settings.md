---
id: settings
title: Settings
sidebar_label: Settings
sidebar_position: 8
---

# Settings

Access Settings by tapping the gear icon in the bottom navigation. Settings are organized into several tabs.

---

## General Tab

### Store Information
| Setting | Description |
|---|---|
| Store Name | Appears on printed statements and WhatsApp messages |
| Owner Name | Store owner's name |
| Currency Symbol | Default: YER. Displayed on all monetary values |

### Credit Policy
| Setting | Description |
|---|---|
| Default Credit Limit | Applied to new customers if no custom limit is set (0 = unlimited) |
| Warn on Limit Exceed | Toggle warning when a transaction would exceed credit limit |

### Appearance
| Setting | Description |
|---|---|
| Theme | Light / Dark / System |
| Language | English / العربية (Arabic) |
| Date Format | DD/MM/YYYY, MM/DD/YYYY, or YYYY-MM-DD |

### Security
| Setting | Description |
|---|---|
| PIN | Change your 4-digit unlock PIN |
| Biometric Login | Enable fingerprint or face unlock (Android & Windows Hello) |
| Auto-Lock | Lock app after N minutes of inactivity (1, 5, 15, 30, Never) |

---

## Cloud Sync Tab

### Connection

| Setting | Description |
|---|---|
| Server URL | Your SuperFast API server URL, e.g. `https://api.yourdomain.com` |
| Device Name | Human-readable name for this device, e.g. "Ahmed's Phone" |
| Status | Connected / Disconnected / Error |

**Connect**: Tapping Connect registers this device with the server and initiates the initial sync.

**Disconnect**: Removes this device's association with the server. Local data is not deleted.

### Sync Status

Shows:
- Last successful push timestamp
- Last successful pull timestamp
- Pending items in sync queue (items waiting to be pushed)
- Last sync error (if any)

### Manual Sync

Tap **Sync Now** to immediately trigger a push + pull cycle without waiting for the automatic interval.

:::note
Automatic sync runs every 30 seconds when the app is in the foreground and a network connection is available.
:::

---

## WhatsApp Tab

| Setting | Description |
|---|---|
| API URL | Evolution API base URL |
| API Key | Global API key for Evolution API |
| Instance Name | WhatsApp instance identifier |
| Connection Status | Live status indicator |
| Connect / Logout | Button to scan QR or log out |

See the full [WhatsApp Guide](./whatsapp) for setup instructions.

---

## Backup Tab

### Export Backup

Exports the entire local database to a JSON file:

1. Tap **Export Backup**.
2. Choose a save location (Downloads folder by default).
3. A file named `superfast-backup-YYYYMMDD.json` is created.

The JSON file contains:
- All customers and their transaction history
- All suppliers and their transaction history
- All reminders
- Store settings

### Import Backup

Restores data from a previously exported JSON backup:

1. Tap **Import Backup**.
2. Select the `.json` backup file.
3. Choose import mode:
   - **Merge** — adds imported records without deleting existing ones
   - **Replace** — clears existing data and replaces with backup

:::danger
**Replace** mode permanently deletes all existing local data before importing. Make sure you have a current backup before using Replace mode.
:::

---

## Products Tab

The **Products** tab manages autocomplete templates used in the Invoice modal when adding transactions.

### Product Template Categories

Products are organized into categories (e.g. "Groceries", "Beverages", "Cleaning"). Within each category you can add product names and default prices.

### Adding a Product
1. Tap a category (or **+ New Category** to create one).
2. Tap **+ Add Product**.
3. Enter name and optional default unit price.
4. Tap **Save**.

When you type in the Invoice modal's item name field, the app searches these templates and shows autocomplete suggestions.

---

## Server Dashboard Tab

The **Server** tab shows live metrics from your SuperFast backend server.

| Metric | Description |
|---|---|
| Uptime | How long the server has been running |
| Goroutines | Active Go goroutines (threads) — normal range: 10–50 |
| Heap Used | Memory currently in use by Go processes |
| Heap Total | Total memory allocated |
| DB Connected | PostgreSQL connection status |
| DB Size | Size of the PostgreSQL database on disk |
| Active DB Connections | Current active database connections |
| Tables Count | Number of tables in the database |
| Server Version | SuperFast backend version number |

Tap **Refresh** to fetch the latest metrics.

### Danger Zone

:::danger
The following actions affect all devices and are irreversible.
:::

| Action | What It Does |
|---|---|
| Clear Sync Queue | Removes all pending sync items from the server queue. Use if the queue is stuck or corrupt. |
| Logout Device | Force-logs out a specific device by its Device ID. The device will need to re-authenticate. |

See [Server Dashboard](../deployment/server-dashboard) for a detailed explanation of each metric.
