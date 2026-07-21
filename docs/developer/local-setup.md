---
id: local-setup
title: Local Development Setup
sidebar_label: Local Setup
sidebar_position: 2
---

# Local Development Setup

This guide walks you through setting up a complete local development environment for SuperFast, including the frontend, Tauri desktop app, and Go backend server.

## Prerequisites

Install the following tools before starting:

| Tool | Version | Install |
|---|---|---|
| Node.js | 20+ (LTS) | [nodejs.org](https://nodejs.org) |
| Go | 1.22+ | [go.dev](https://go.dev/dl/) |
| Rust + Cargo | 1.77+ | [rustup.rs](https://rustup.rs) |
| Docker Desktop | Latest | [docker.com](https://www.docker.com/products/docker-desktop/) |
| Git | 2.40+ | [git-scm.com](https://git-scm.com) |

### Windows-Specific
- Install **WebView2 Runtime** (usually pre-installed on Windows 11)
- Install **Visual Studio Build Tools 2022** with "Desktop development with C++" workload (required for Tauri)

### macOS-Specific
```bash
xcode-select --install
```

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/your-org/superfast.git
cd superfast
```

The repository structure:
```
superfast/
├── src/              # Next.js frontend (App Router)
├── src-tauri/        # Tauri Rust backend
├── server/           # Go API server
├── docs/             # This documentation site
├── docker-compose.yml
└── .env.example
```

---

## Step 2 — Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your local settings. The defaults work for local Docker development:

```bash
# .env
DATABASE_URL=postgresql://superfast:superfast@localhost:5432/superfast
REDIS_URL=redis://localhost:6379
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=superfast
JWT_SECRET=your-super-secret-jwt-key-change-in-production
EVOLUTION_API_URL=http://localhost:8081
EVOLUTION_API_KEY=your-evolution-api-key
PORT=8080
```

---

## Step 3 — Start Infrastructure Services

Start PostgreSQL, Redis, MinIO, and Evolution API using Docker Compose:

```bash
docker compose up -d postgres redis minio evolution-api
```

Wait for all services to be healthy:
```bash
docker compose ps
# All should show "healthy" or "running"
```

### Initialize the Database

```bash
cd server
go run . migrate
```

This runs all database migrations and creates the schema.

---

## Step 4 — Start the Go Backend

```bash
cd server
go run .
```

The server starts on port 8080. Verify it's working:

```bash
curl http://localhost:8080/api/v1/health
# {"status":"ok","version":"dev"}
```

:::tip
For hot reload during development, install `air`:
```bash
go install github.com/air-verse/air@latest
cd server
air
```
:::

---

## Step 5 — Install Frontend Dependencies

```bash
# In the repo root
npm install
```

---

## Step 6 — Run the Next.js Dev Server (Browser)

To develop in a browser without Tauri:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

:::note
In browser mode, Tauri IPC calls (`invoke()`) fall back to HTTP calls against `localhost:8080`. The SQLite database is replaced with IndexedDB for browser-based development. This means some features (like backup export/import) won't work in browser mode.
:::

---

## Step 7 — Run the Tauri Desktop App

To develop with the actual Tauri window and SQLite database:

```bash
npm run tauri dev
```

This opens a native desktop window. Changes to the Next.js code hot-reload inside the window.

First run will compile Rust dependencies which takes 3–5 minutes. Subsequent runs are much faster.

---

## Step 8 — Run Tests

### Frontend Tests
```bash
npm test
```

### Backend Tests
```bash
cd server
go test ./...
```

### Integration Tests
```bash
cd server
go test ./... -tags=integration
```

Integration tests require the Docker services to be running.

---

## Common Development Tasks

### Add a database migration

```bash
cd server
# Create a new migration file
touch migrations/009_add_new_table.sql
# Edit the file, then run:
go run . migrate
```

### Reset the local database

```bash
docker compose down postgres
docker volume rm superfast_postgres_data
docker compose up -d postgres
cd server && go run . migrate
```

### Access MinIO console

Open `http://localhost:9001` in your browser.
- Username: `minioadmin`
- Password: `minioadmin`

### Access Evolution API docs

Open `http://localhost:8081/docs` for the Swagger UI.

---

## Troubleshooting

### "Error: WebView2 not found" (Windows)

Download and install the WebView2 Evergreen Runtime from Microsoft:
```
https://developer.microsoft.com/en-us/microsoft-edge/webview2/
```

### Go backend fails to connect to PostgreSQL

Ensure Docker is running and PostgreSQL is healthy:
```bash
docker compose ps postgres
docker compose logs postgres
```

### Rust compilation fails

Ensure you have the correct toolchain:
```bash
rustup update stable
rustup target add x86_64-pc-windows-msvc  # Windows
rustup target add x86_64-apple-darwin      # macOS Intel
rustup target add aarch64-apple-darwin     # macOS Apple Silicon
```

### Port conflicts

If port 8080 is already in use:
```bash
# Edit .env
PORT=8090
```
And restart the backend.
