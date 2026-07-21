---
id: authentication
title: Authentication API
sidebar_label: Authentication
sidebar_position: 2
---

# Authentication API

SuperFast uses a two-layer authentication model:
1. **Store** — the top-level account representing a physical store
2. **Device** — an individual device that belongs to a store

All client operations are performed at the device level. Each device has its own JWT access token that it uses for all subsequent API requests.

---

## Register a New Store

Creates a new store account on the server and registers the first device.

```http
POST /api/v1/auth/store/register
Content-Type: application/json
```

### Request Body

```json
{
  "store_name": "Ahmed's Supermarket",
  "owner_name": "Ahmed Al-Moqri",
  "pin": "1234",
  "device_name": "Ahmed's Phone",
  "device_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `store_name` | string | Yes | Display name of the store |
| `owner_name` | string | Yes | Store owner's name |
| `pin` | string | Yes | 4-digit numeric PIN (sent as hash in production) |
| `device_name` | string | Yes | Human-readable name for this device |
| `device_id` | string | Yes | UUID generated on the device (must be stable) |

### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "store": {
      "id": "store-uuid-001",
      "name": "Ahmed's Supermarket",
      "owner_name": "Ahmed Al-Moqri",
      "created_at": "2026-07-21T08:00:00Z"
    },
    "device": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Ahmed's Phone",
      "store_id": "store-uuid-001"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "access_expires_in": 86400,
      "refresh_expires_in": 2592000
    }
  }
}
```

| Field | Description |
|---|---|
| `access_token` | JWT valid for 24 hours (86,400 seconds) |
| `refresh_token` | JWT valid for 30 days (2,592,000 seconds) |

---

## Device Login

Used when a second (or any subsequent) device connects to an existing store.

```http
POST /api/v1/auth/device/login
Content-Type: application/json
```

### Request Body

```json
{
  "store_id": "store-uuid-001",
  "pin": "1234",
  "device_name": "Counter Tablet",
  "device_id": "660e8400-e29b-41d4-a716-556655440111"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "store": {
      "id": "store-uuid-001",
      "name": "Ahmed's Supermarket",
      "owner_name": "Ahmed Al-Moqri"
    },
    "device": {
      "id": "660e8400-e29b-41d4-a716-556655440111",
      "name": "Counter Tablet",
      "store_id": "store-uuid-001"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "access_expires_in": 86400,
      "refresh_expires_in": 2592000
    }
  }
}
```

### Error Responses

```json
// 401 - Wrong PIN
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Incorrect PIN"
  }
}

// 404 - Store not found
{
  "success": false,
  "error": {
    "code": "STORE_NOT_FOUND",
    "message": "No store found with the given ID"
  }
}
```

---

## Refresh Access Token

The access token expires after 24 hours. Use the refresh token to get a new access token without requiring the PIN.

```http
POST /api/v1/auth/device/refresh
Content-Type: application/json
```

### Request Body

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "access_expires_in": 86400
  }
}
```

:::note
The refresh token itself is not rotated on each use. It expires 30 days after it was originally issued. After expiry, the device must login again with the PIN.
:::

---

## JWT Token Structure

The access token is a standard JWT. Decoding it reveals:

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "store_id": "store-uuid-001",
  "device_id": "550e8400-e29b-41d4-a716-446655440000",
  "device_name": "Ahmed's Phone",
  "iat": 1753084800,
  "exp": 1753171200,
  "type": "access"
}
```

---

## Token Storage

On **Android**, tokens are stored in the Android Keystore (encrypted storage).

On **Windows**, tokens are stored in the Windows Credential Manager.

Tokens are **never** stored in plain text or in localStorage.
