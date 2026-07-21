---
id: whatsapp
title: WhatsApp API
sidebar_label: WhatsApp API
sidebar_position: 6
---

# WhatsApp API

The WhatsApp API endpoints are proxied through the SuperFast backend, which communicates with your Evolution API instance. All WhatsApp endpoints require a valid JWT token.

## Get Connection Status

Check whether the WhatsApp session is connected.

```http
GET /api/v1/whatsapp/status
Authorization: Bearer <token>
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "status": "connected",
    "instance": "superfast-store1",
    "phone_number": "96771234567",
    "profile_name": "Ahmed's Supermarket",
    "connected_at": "2026-07-21T06:00:00Z"
  }
}
```

| Status Value | Meaning |
|---|---|
| `connected` | Ready to send/receive messages |
| `connecting` | Connection in progress |
| `disconnected` | Session ended; QR scan needed |
| `qr_required` | QR code has been generated; waiting for scan |

---

## Get QR Code

Returns a QR code image (base64 PNG) to link a WhatsApp account.

```http
GET /api/v1/whatsapp/qr
Authorization: Bearer <token>
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "expires_at": "2026-07-21T08:01:00Z"
  }
}
```

The `qr_code` is a base64-encoded PNG image ready to embed in an `<img>` tag.

:::note
The QR code expires after 60 seconds. If it expires before scanning, call this endpoint again to get a fresh code.
:::

---

## Send a Message

Send a WhatsApp message to a phone number.

```http
POST /api/v1/whatsapp/send
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body

```json
{
  "to": "967712345678",
  "message": "Dear Mohammed,\n\nYour current balance is 5,000 YER.\n\nThank you,\nAhmed's Supermarket"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `to` | string | Yes | Recipient phone number with country code (no `+`) |
| `message` | string | Yes | Message text (supports `\n` for newlines) |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "message_id": "whatsapp-msg-uuid-001",
    "to": "967712345678",
    "status": "sent",
    "sent_at": "2026-07-21T08:30:00Z"
  }
}
```

### Error Responses

```json
// 400 - Number not on WhatsApp
{
  "success": false,
  "error": {
    "code": "INVALID_WHATSAPP_NUMBER",
    "message": "The number 96700000000 is not registered on WhatsApp"
  }
}

// 503 - WhatsApp not connected
{
  "success": false,
  "error": {
    "code": "WHATSAPP_DISCONNECTED",
    "message": "WhatsApp is not connected. Scan the QR code first."
  }
}
```

---

## Logout WhatsApp Session

Disconnects the linked WhatsApp account.

```http
DELETE /api/v1/whatsapp/logout
Authorization: Bearer <token>
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "message": "WhatsApp session logged out successfully"
  }
}
```

---

## Get Chat List

Returns all active WhatsApp conversations.

```http
GET /api/v1/whatsapp/chats?type=all&limit=50&offset=0
Authorization: Bearer <token>
```

### Query Parameters

| Parameter | Values | Default | Description |
|---|---|---|---|
| `type` | `all`, `personal`, `groups` | `all` | Filter by chat type |
| `limit` | 1–100 | 50 | Number of chats to return |
| `offset` | 0+ | 0 | Pagination offset |

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "chats": [
      {
        "id": "967712345678@s.whatsapp.net",
        "name": "Mohammed Al-Rashid",
        "phone": "967712345678",
        "type": "personal",
        "last_message": "Your balance is 5,000 YER",
        "last_message_time": "2026-07-21T08:30:00Z",
        "unread_count": 0,
        "is_group": false
      },
      {
        "id": "120363012345678901@g.us",
        "name": "Supplier Group",
        "type": "group",
        "last_message": "Delivery tomorrow at 8am",
        "last_message_time": "2026-07-21T07:00:00Z",
        "unread_count": 3,
        "is_group": true,
        "participants_count": 12
      }
    ],
    "total": 2,
    "has_more": false
  }
}
```

---

## Get Contacts

Returns all WhatsApp contacts.

```http
GET /api/v1/whatsapp/contacts?search=mohammed&limit=50
Authorization: Bearer <token>
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "contacts": [
      {
        "id": "967712345678@s.whatsapp.net",
        "name": "Mohammed Al-Rashid",
        "phone": "967712345678",
        "push_name": "Mohammed"
      }
    ],
    "total": 1
  }
}
```

---

## Get Messages

Returns messages for a specific chat.

```http
GET /api/v1/whatsapp/messages?chat_id=967712345678@s.whatsapp.net&limit=50
Authorization: Bearer <token>
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "chat_id": "967712345678@s.whatsapp.net",
    "messages": [
      {
        "id": "msg-uuid-001",
        "from": "me",
        "to": "967712345678@s.whatsapp.net",
        "body": "Your balance is 5,000 YER",
        "timestamp": "2026-07-21T08:30:00Z",
        "type": "text",
        "status": "read"
      },
      {
        "id": "msg-uuid-002",
        "from": "967712345678@s.whatsapp.net",
        "to": "me",
        "body": "Thank you, I will pay tomorrow",
        "timestamp": "2026-07-21T08:32:00Z",
        "type": "text",
        "status": "received"
      }
    ],
    "total": 2,
    "has_more": false
  }
}
```
