---
id: overview
title: API Overview
sidebar_label: Overview
sidebar_position: 1
---

# API Overview

The SuperFast backend exposes a RESTful HTTP API built with **Go** and the **Gin** framework. All client apps (desktop, Android, web) communicate with this API for sync, authentication, WhatsApp, and server metrics.

## Base URL

```
https://api.yourdomain.com/api/v1
```

All endpoints are prefixed with `/api/v1`.

---

## Authentication

All endpoints (except `/auth/*`) require a JWT Bearer token in the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

Additionally, all requests must include the device identifier:

```http
X-Device-ID: <device_uuid>
```

See the [Authentication API](./authentication) page for how to obtain tokens.

---

## Rate Limits

| Endpoint Group | Rate Limit |
|---|---|
| `/auth/*` | 10 requests/minute per IP |
| `/sync/*` | 60 requests/minute per device |
| `/whatsapp/*` | 30 requests/minute per device |
| `/server/*` | 10 requests/minute per device |

Rate limit headers are included in every response:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1753094400
```

When the limit is exceeded, the server returns `429 Too Many Requests`.

---

## Response Format

### Success

```json
{
  "success": true,
  "data": { ... },
  "message": "optional message"
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error description",
    "details": { ... }
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Unauthorized (missing or expired token) |
| 403 | Forbidden (valid token but insufficient permissions) |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate entity) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
| 503 | Service unavailable |

---

## All Endpoints

### Authentication

| Method | Path | Description |
|---|---|---|
| POST | `/auth/store/register` | Register a new store |
| POST | `/auth/device/login` | Login / register a device |
| POST | `/auth/device/refresh` | Refresh access token |

### Sync

| Method | Path | Description |
|---|---|---|
| POST | `/sync/push` | Push local changes to server |
| GET | `/sync/pull` | Pull changes from server |

### WhatsApp

| Method | Path | Description |
|---|---|---|
| GET | `/whatsapp/status` | Get connection status |
| GET | `/whatsapp/qr` | Get QR code for linking |
| POST | `/whatsapp/send` | Send a WhatsApp message |
| DELETE | `/whatsapp/logout` | Logout WhatsApp session |
| GET | `/whatsapp/chats` | List all chats |
| GET | `/whatsapp/contacts` | List all contacts |
| GET | `/whatsapp/messages` | Get messages for a chat |

### Server

| Method | Path | Description |
|---|---|---|
| GET | `/server/metrics` | Get server health metrics |
| GET | `/health` | Simple health check (no auth) |

---

## Pagination

List endpoints that return multiple items support pagination via query parameters:

```
GET /sync/pull?since=2026-07-01T00:00:00Z&limit=100&offset=0
```

| Parameter | Default | Max |
|---|---|---|
| `limit` | 100 | 500 |
| `offset` | 0 | — |

---

## Timestamps

All timestamps in the API use **ISO 8601 format in UTC**:

```
2026-07-21T08:30:00Z
```

The client is responsible for converting to/from local time for display.

---

## CORS

The API allows cross-origin requests from configured origins. The `CORS_ORIGINS` environment variable controls the allowed origins list. By default, all origins are allowed (`*`) in development mode.
