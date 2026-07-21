---
id: architecture
title: Architecture
sidebar_label: Architecture
sidebar_position: 1
---

# Architecture

SuperFast is built as a **local-first, cloud-synced** system. This page describes the complete technical architecture, component responsibilities, and data flow.

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend UI | Next.js 14 (App Router) | React-based UI, static export |
| Desktop wrapper | Tauri (Rust) | Native desktop app shell |
| Mobile wrapper | Tauri Android | Android APK from same codebase |
| Styling | Tailwind CSS | Utility-first CSS |
| Charts | Recharts | Analytics visualization |
| Local database | SQLite (via Tauri plugin) | Offline-first data storage |
| Backend API | Go + Gin | REST API server |
| Cloud database | PostgreSQL 14+ | Authoritative server-side storage |
| Cache | Redis | Session cache, rate limiting |
| Object storage | MinIO (S3-compatible) | File and attachment storage |
| WhatsApp bridge | Evolution API | WhatsApp Web multi-device |
| Authentication | JWT (HS256) | Stateless device auth |
| Containerization | Docker + Compose | Deployment |
| Reverse proxy | Nginx | TLS termination, routing |

---

## Full System Diagram

```
╔══════════════════════════════════════════════════════════════════════╗
║                          CLIENT DEVICES                              ║
║                                                                      ║
║  ┌─────────────────────┐   ┌─────────────────────┐                  ║
║  │   Windows Desktop   │   │   Android Phone     │                  ║
║  │                     │   │                     │                  ║
║  │  ┌───────────────┐  │   │  ┌───────────────┐  │                  ║
║  │  │  Next.js UI   │  │   │  │  Next.js UI   │  │                  ║
║  │  │  (WebView2)   │  │   │  │  (WebView)    │  │                  ║
║  │  └───────┬───────┘  │   │  └───────┬───────┘  │                  ║
║  │          │ IPC      │   │          │ IPC      │                  ║
║  │  ┌───────▼───────┐  │   │  ┌───────▼───────┐  │                  ║
║  │  │  Tauri Core   │  │   │  │  Tauri Android│  │                  ║
║  │  │  (Rust)       │  │   │  │  (Rust)       │  │                  ║
║  │  └───────┬───────┘  │   │  └───────┬───────┘  │                  ║
║  │          │          │   │          │          │                  ║
║  │  ┌───────▼───────┐  │   │  ┌───────▼───────┐  │                  ║
║  │  │ SQLite (local)│  │   │  │ SQLite (local)│  │                  ║
║  │  │ + sync_queue  │  │   │  │ + sync_queue  │  │                  ║
║  │  └───────────────┘  │   │  └───────────────┘  │                  ║
║  └─────────────────────┘   └─────────────────────┘                  ║
║             │  HTTPS push/pull                    │                  ║
╚═════════════╪═════════════════════════════════════╪══════════════════╝
              │                                     │
╔═════════════╪═════════════════════════════════════╪══════════════════╗
║             │          SERVER LAYER               │                  ║
║             └─────────────┬───────────────────────┘                  ║
║                           │                                          ║
║              ┌────────────▼────────────┐                             ║
║              │      Nginx (TLS)        │                             ║
║              │  api.yourdomain.com     │                             ║
║              └────────────┬────────────┘                             ║
║                           │                                          ║
║              ┌────────────▼────────────┐                             ║
║              │  Go / Gin API Server    │                             ║
║              │  :8080                  │                             ║
║              │                         │                             ║
║              │  • Auth middleware      │                             ║
║              │  • Rate limiter         │                             ║
║              │  • Sync push/pull       │                             ║
║              │  • WhatsApp proxy       │                             ║
║              │  • Metrics endpoint     │                             ║
║              └──┬──────┬──────┬──────┬─┘                             ║
║                 │      │      │      │                               ║
║        ┌────────▼┐ ┌───▼──┐ ┌▼─────┐ ┌▼──────────┐                 ║
║        │PostgreSQL│ │Redis │ │MinIO │ │Evolution  │                 ║
║        │  :5432  │ │:6379 │ │:9000 │ │API :8081  │                 ║
║        └─────────┘ └──────┘ └──────┘ └───────────┘                 ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## Component Responsibilities

### Next.js Frontend

- Renders the entire UI as React components
- Communicates with Tauri backend via `invoke()` IPC calls
- Uses React Query for data fetching and caching
- Handles form state, validation, and user interactions
- Static export (`next export`) produces HTML/CSS/JS files that Tauri wraps

### Tauri Core (Rust)

- Wraps the Next.js static export in a native window (WebView2 on Windows, WebView on Android)
- Provides native file system access (for backup export/import)
- Manages the SQLite database via `tauri-plugin-sql`
- Handles system notifications (for reminder alerts)
- Provides biometric authentication via OS APIs
- Makes HTTP calls to the server (bypassing CORS restrictions)

### Go / Gin API Server

- Validates JWT tokens on every request
- Handles sync push: validates, stores changes in PostgreSQL, updates sync_log
- Handles sync pull: queries sync_log for changes since a timestamp, excludes the requesting device's own changes
- Proxies WhatsApp requests to Evolution API
- Exposes the server metrics endpoint
- Rate limits requests using Redis

### PostgreSQL

- Stores all store data (customers, suppliers, transactions, etc.)
- Contains `sync_log` — a complete audit log of every change pushed by any device
- Source of truth for conflict resolution

### Redis

- Caches JWT refresh token validity (fast revocation without DB query)
- Rate limit counters per device/IP
- Short-lived QR code state for WhatsApp linking

### MinIO

- Stores uploaded files (e.g. invoice attachments, profile photos)
- S3-compatible API for easy migration to AWS S3 or Cloudflare R2
- Signed URLs for time-limited direct access

### Evolution API

- Open-source WhatsApp Web multi-device implementation
- Manages the persistent WhatsApp Web session
- Provides HTTP API for SuperFast backend to send messages and fetch chats

---

## Data Flow: Customer Transaction Creation

```
1. User taps "Save" on Add Transaction form
           │
2. Next.js component calls Tauri.invoke("create_transaction", {...})
           │
3. Tauri Rust handler:
   a. Inserts transaction into SQLite customer_transactions table
   b. Inserts a row into SQLite sync_queue (status=pending)
   c. Returns success to the JS layer
           │
4. Next.js updates the UI (React Query cache invalidation)
           │
5. [Async, within 30s] Sync engine wakes up:
   a. Reads all pending rows from sync_queue
   b. Sends POST /api/v1/sync/push to the server
   c. Server writes to PostgreSQL and sync_log
   d. Server returns {accepted: 1, conflicts: []}
   e. Tauri marks sync_queue rows as synced
           │
6. [Other devices] On next pull cycle:
   a. GET /api/v1/sync/pull?since=<last_pull_ts>
   b. Receive the new transaction in the response
   c. Insert into local SQLite
   d. Recalculate customer balance
   e. React Query cache invalidated → UI updates
```
