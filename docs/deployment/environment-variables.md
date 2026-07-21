---
id: environment-variables
title: Environment Variables
sidebar_label: Environment Variables
sidebar_position: 2
---

# Environment Variables

All configuration of the SuperFast backend server is done via environment variables. This page documents every supported variable, its purpose, and an example value.

## Required Variables

These must be set for the server to start:

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://superfast:password@localhost:5432/superfast` |
| `REDIS_URL` | Redis connection string | `redis://:password@localhost:6379` |
| `JWT_SECRET` | Secret key for signing JWT tokens (min 32 chars) | `a8f3e7d2c1b4...` (random 64-char hex) |

---

## Database

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | — (required) | Full PostgreSQL connection string |
| `DATABASE_MAX_CONNECTIONS` | `25` | Maximum DB connection pool size |
| `DATABASE_MIN_CONNECTIONS` | `5` | Minimum connections kept alive |
| `DATABASE_CONNECTION_TIMEOUT` | `30` | Seconds to wait for a connection |
| `DATABASE_SSL_MODE` | `require` | PostgreSQL SSL mode (`disable`, `require`, `verify-full`) |

```bash
DATABASE_URL=postgresql://superfast:StrongPass123@db.yourdomain.com:5432/superfast?sslmode=require
DATABASE_MAX_CONNECTIONS=25
```

---

## Redis

| Variable | Default | Description |
|---|---|---|
| `REDIS_URL` | — (required) | Redis connection URI |
| `REDIS_POOL_SIZE` | `10` | Redis connection pool size |
| `REDIS_TIMEOUT` | `5` | Seconds before Redis command times out |

```bash
REDIS_URL=redis://:RedisPassword456@localhost:6379/0
```

---

## MinIO / Object Storage

| Variable | Default | Description |
|---|---|---|
| `MINIO_ENDPOINT` | — (required) | MinIO host and port, no protocol |
| `MINIO_ACCESS_KEY` | — (required) | MinIO root user / access key |
| `MINIO_SECRET_KEY` | — (required) | MinIO root password / secret key |
| `MINIO_BUCKET` | `superfast` | S3 bucket name for all uploads |
| `MINIO_USE_SSL` | `false` | Set `true` if MinIO has TLS enabled |
| `MINIO_REGION` | `us-east-1` | S3 region (used in signed URLs) |

```bash
MINIO_ENDPOINT=minio.yourdomain.com:9000
MINIO_ACCESS_KEY=superfastadmin
MINIO_SECRET_KEY=SuperSecretMinioKey789
MINIO_BUCKET=superfast
MINIO_USE_SSL=true
```

:::tip
If you use AWS S3 or Cloudflare R2 instead of MinIO, set `MINIO_ENDPOINT` to the appropriate S3-compatible endpoint and configure the region accordingly.
:::

---

## JWT Authentication

| Variable | Default | Description |
|---|---|---|
| `JWT_SECRET` | — (required) | HMAC-SHA256 signing secret (min 32 chars) |
| `JWT_ACCESS_EXPIRY` | `86400` | Access token TTL in seconds (default: 24h) |
| `JWT_REFRESH_EXPIRY` | `2592000` | Refresh token TTL in seconds (default: 30 days) |

```bash
JWT_SECRET=f9a2e8b1c4d7e3f6a9b2c5d8e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e5f8
JWT_ACCESS_EXPIRY=86400
JWT_REFRESH_EXPIRY=2592000
```

:::danger
Use a cryptographically random secret of at least 32 characters. Never share it or commit it to version control. Rotate it if it is ever exposed.

Generate a secure secret:
```bash
openssl rand -hex 32
```
:::

---

## Evolution API (WhatsApp)

| Variable | Default | Description |
|---|---|---|
| `EVOLUTION_API_URL` | — (required if WhatsApp used) | Base URL of the Evolution API instance |
| `EVOLUTION_API_KEY` | — (required if WhatsApp used) | Global authentication key for Evolution API |
| `EVOLUTION_INSTANCE_NAME` | `superfast` | Default WhatsApp instance name |
| `EVOLUTION_TIMEOUT` | `30` | Seconds before WhatsApp API calls time out |

```bash
EVOLUTION_API_URL=https://evolution.yourdomain.com
EVOLUTION_API_KEY=evo-api-key-secret-here
```

---

## Server

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | Port the Go HTTP server listens on |
| `GIN_MODE` | `debug` | Gin framework mode: `debug` or `release` |
| `CORS_ORIGINS` | `*` | Comma-separated allowed CORS origins |
| `LOG_LEVEL` | `info` | Log verbosity: `debug`, `info`, `warn`, `error` |
| `LOG_FORMAT` | `json` | Log output format: `json` or `text` |

```bash
PORT=8080
GIN_MODE=release
CORS_ORIGINS=https://app.yourdomain.com,https://docs.yourdomain.com
LOG_LEVEL=info
LOG_FORMAT=json
```

---

## Rate Limiting

| Variable | Default | Description |
|---|---|---|
| `RATE_LIMIT_AUTH` | `10` | Max auth requests per minute per IP |
| `RATE_LIMIT_SYNC` | `60` | Max sync requests per minute per device |
| `RATE_LIMIT_WHATSAPP` | `30` | Max WhatsApp requests per minute per device |

---

## Monitoring (Optional)

| Variable | Default | Description |
|---|---|---|
| `SENTRY_DSN` | `""` | Sentry.io DSN for error tracking (leave empty to disable) |
| `SENTRY_ENVIRONMENT` | `production` | Sentry environment tag |
| `SENTRY_TRACES_SAMPLE_RATE` | `0.1` | Sentry performance tracing sample rate (0–1) |

```bash
SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/789
SENTRY_ENVIRONMENT=production
```

---

## Webhook (Optional)

| Variable | Default | Description |
|---|---|---|
| `WEBHOOK_SECRET` | `""` | Secret for validating incoming webhooks (HMAC-SHA256) |
| `WEBHOOK_URL` | `""` | URL to receive outgoing webhooks on sync events |

---

## Complete Example .env

```bash
# Database
DATABASE_URL=postgresql://superfast:DbPassword123@postgres:5432/superfast
DATABASE_MAX_CONNECTIONS=25

# Redis
REDIS_URL=redis://:RedisPass456@redis:6379/0

# MinIO
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=MinioSecret789
MINIO_BUCKET=superfast
MINIO_USE_SSL=false

# JWT
JWT_SECRET=f9a2e8b1c4d7e3f6a9b2c5d8e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e5f8
JWT_ACCESS_EXPIRY=86400
JWT_REFRESH_EXPIRY=2592000

# Evolution API
EVOLUTION_API_URL=http://evolution-api:8080
EVOLUTION_API_KEY=evo-secret-key

# Server
PORT=8080
GIN_MODE=release
LOG_LEVEL=info
LOG_FORMAT=json
CORS_ORIGINS=https://app.yourdomain.com

# Monitoring (optional)
SENTRY_DSN=
```
