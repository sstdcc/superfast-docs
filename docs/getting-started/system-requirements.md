---
id: system-requirements
title: System Requirements
sidebar_label: System Requirements
sidebar_position: 2
---

# System Requirements

## Client Devices

### Windows Desktop

| Requirement | Minimum | Recommended |
|---|---|---|
| OS Version | Windows 10 (build 1903+) | Windows 11 |
| RAM | 4 GB | 8 GB |
| Storage | 200 MB free | 1 GB free |
| Processor | x64 dual-core 1.5 GHz | x64 quad-core 2.5 GHz |
| Network | Optional (offline-capable) | Broadband for sync |

:::note
SuperFast uses the WebView2 runtime bundled with Windows 11. On Windows 10 the installer will automatically download and install the Microsoft WebView2 Runtime if it is not already present.
:::

### Android

| Requirement | Minimum | Recommended |
|---|---|---|
| Android Version | Android 7.0 (API 24) | Android 11+ |
| RAM | 2 GB | 4 GB |
| Storage | 150 MB free | 500 MB free |
| Architecture | arm64-v8a | arm64-v8a |
| Network | Optional (offline-capable) | Wi-Fi or 4G for sync |

:::warning
The APK is compiled for **arm64-v8a** only. Older 32-bit devices (armeabi-v7a) are not supported.
:::

### macOS / Linux Desktop

| Requirement | Minimum |
|---|---|
| macOS | 10.15 (Catalina) or newer |
| Linux | Ubuntu 20.04 / Debian 11 or any distro with GTK 3+ |
| RAM | 4 GB |
| Storage | 200 MB free |

---

## Network Requirements (Cloud Sync)

Cloud sync and WhatsApp features require a network connection to your SuperFast server. The app is fully functional offline; network is only needed to sync.

| Feature | Bandwidth Required |
|---|---|
| Initial sync (first device setup) | ~1–5 MB (depends on data volume) |
| Incremental sync (ongoing) | < 50 KB per sync cycle |
| WhatsApp statement send | ~5–20 KB per message |
| Server metrics dashboard | < 5 KB per refresh |

**Firewall / Proxy:** The app communicates over HTTPS (port 443) to your configured server URL. No other ports need to be open on the client.

---

## Server Requirements (Self-Hosted)

If you are deploying the SuperFast backend yourself, the server must meet these requirements:

### Minimum Server Spec

| Resource | Minimum | Recommended |
|---|---|---|
| CPU | 1 vCPU | 2 vCPU |
| RAM | 2 GB | 4 GB |
| Storage | 20 GB SSD | 40 GB SSD |
| OS | Ubuntu 20.04 LTS | Ubuntu 22.04 LTS |
| Network | 10 Mbps | 100 Mbps |

### Required Services

| Service | Version | Purpose |
|---|---|---|
| PostgreSQL | 14+ | Primary cloud database |
| Redis | 6+ | Caching, session management |
| MinIO | Latest | File/attachment object storage |
| Evolution API | Latest | WhatsApp messaging bridge |
| Docker & Compose | 24+ / 2+ | Container orchestration |

### Port Requirements (Server)

| Port | Service | Notes |
|---|---|---|
| 80 / 443 | Nginx (reverse proxy) | Public-facing; SSL required |
| 8080 | SuperFast API | Internal (proxied by Nginx) |
| 5432 | PostgreSQL | Internal only |
| 6379 | Redis | Internal only |
| 9000 | MinIO API | Internal (or public for direct uploads) |
| 9001 | MinIO Console | Internal (admin UI) |
| 8081 | Evolution API | Internal (proxied by Nginx) |

:::tip
Use Docker Compose networking to keep all backend services on an internal bridge network. Only Nginx (80/443) should be exposed to the internet.
:::

---

## Development Machine Requirements

If you are building the app from source:

| Tool | Version |
|---|---|
| Node.js | 20+ (LTS) |
| Go | 1.22+ |
| Rust + Cargo | 1.77+ |
| Android Studio | 2023+ (for APK builds) |
| Android NDK | r27+ |
| Docker Desktop | Latest |

See [Local Setup](../developer/local-setup) for detailed instructions.
