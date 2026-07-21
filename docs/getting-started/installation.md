---
id: installation
title: Installation
sidebar_label: Installation
sidebar_position: 3
---

# Installation

## Desktop (Windows)

### Step 1 — Download the Installer

Download the latest `SuperFast-Setup-x.x.x.exe` from the releases page on GitHub or from your organization's distribution channel.

### Step 2 — Run the Installer

1. Double-click `SuperFast-Setup-x.x.x.exe`.
2. If Windows SmartScreen appears, click **More info → Run anyway** (the app is signed; SmartScreen may trigger on first run before reputation builds).
3. Accept the license agreement and choose your installation folder (default: `C:\Program Files\SuperFast`).
4. Click **Install** and wait for the progress bar to complete.
5. Click **Finish** — SuperFast will launch automatically.

:::note
The installer also installs the **Microsoft WebView2 Runtime** if it is not already present on your system. This may add 1–2 minutes to the installation time on Windows 10.
:::

### Step 3 — First Launch

On first launch you will see the **Register Store** screen. See [First Launch Setup](#first-launch-setup) below.

---

## Android APK

### Step 1 — Enable Unknown Sources

Android blocks APK installs from outside the Play Store by default. To allow installation:

**Android 8+:**
1. Go to **Settings → Apps → Special app access → Install unknown apps**.
2. Select your browser (e.g. Chrome) or file manager.
3. Toggle **Allow from this source** on.

**Android 7:**
1. Go to **Settings → Security**.
2. Toggle **Unknown sources** on.

### Step 2 — Download the APK

Download `SuperFast-arm64-v8a-release.apk` from your distribution link. The download will appear in your browser's notification bar.

### Step 3 — Install

1. Open your Downloads folder and tap the APK file.
2. Tap **Install** when prompted.
3. Tap **Open** once installation completes.

:::warning
If you see "App not installed" the most common cause is insufficient storage space. Free at least 200 MB and try again.
:::

### Step 4 — Grant Permissions

On first launch, SuperFast will request:
- **Storage** (for backup export/import)
- **Notifications** (for reminder alerts)
- **Biometric** (optional, for fingerprint/face login)

---

## First Launch Setup

After installing on any platform, you will be prompted to either **register a new store** or **log in to an existing store**.

### Registering a New Store

1. Tap **Register New Store**.
2. Enter your **Store Name** (e.g. "Ahmed's Supermarket").
3. Enter your **Owner Name**.
4. Choose a **4-digit PIN** — this is used for local device login.
5. Tap **Create Store** — the app creates a local SQLite database and generates a unique Store ID.

:::tip
Write down your Store ID (shown on the success screen). You will need it to connect additional devices to the same store account.
:::

### Configuring the Server URL (for Cloud Sync)

Cloud sync is optional but strongly recommended. To enable it:

1. Open **Settings → Cloud Sync**.
2. Enter your server URL (e.g. `https://api.yourdomain.com`).
3. Enter a **Device Name** (e.g. "Ahmed's Phone").
4. Tap **Connect** — the app will register this device with the server.

See [Cloud Sync Setup](../sync/cloud-sync) for full instructions including self-hosting.

### Logging In to an Existing Store

If your store is already registered on the server:

1. Tap **Log In to Existing Store**.
2. Enter your **Store ID** and **PIN**.
3. Enter the **Server URL**.
4. Tap **Login** — the app will download the initial sync data from the server.

---

## Updating SuperFast

### Windows
The app checks for updates on startup. When an update is available, a banner appears in the top bar. Click **Update Now** to download and install — the app will restart automatically.

### Android
Updates are distributed as new APK files. Download the new APK and install it over the existing installation — your data is preserved.

---

## Uninstalling

### Windows
Go to **Settings → Apps → Installed Apps**, find SuperFast, and click **Uninstall**.

:::warning
Uninstalling on Windows removes the application files but **does not delete your local database**. The database is stored at `%APPDATA%\superfast\superfast.db`. Delete this file manually if you want to remove all data.
:::

### Android
Long-press the SuperFast icon → **App Info → Uninstall**. All local data is removed automatically.
