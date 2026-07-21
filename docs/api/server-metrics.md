---
id: server-metrics
title: Server Metrics API
sidebar_label: Server Metrics
sidebar_position: 7
---

# Server Metrics API

The server metrics endpoint returns real-time health and performance data about the SuperFast backend. It is used by the built-in Server Dashboard in Settings.

## Get Metrics

```http
GET /api/v1/server/metrics
Authorization: Bearer <token>
```

No query parameters.

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "version": "1.4.2",
    "uptime_seconds": 604800,
    "uptime_human": "7 days, 0 hours, 0 minutes",
    "goroutines": 24,
    "memory": {
      "heap_used_mb": 45.2,
      "heap_total_mb": 68.0,
      "heap_idle_mb": 22.8,
      "stack_in_use_mb": 2.1,
      "gc_count": 312,
      "last_gc_at": "2026-07-21T08:29:50Z"
    },
    "database": {
      "connected": true,
      "size_mb": 124.5,
      "active_connections": 5,
      "idle_connections": 10,
      "max_connections": 25,
      "tables_count": 14,
      "migration_version": 8
    },
    "redis": {
      "connected": true,
      "used_memory_mb": 12.3,
      "connected_clients": 3
    },
    "sync": {
      "total_push_operations": 84521,
      "total_pull_operations": 71234,
      "queue_depth": 0,
      "last_push_at": "2026-07-21T08:30:00Z",
      "last_pull_at": "2026-07-21T08:30:01Z"
    },
    "whatsapp": {
      "connected": true,
      "instance": "superfast-store1",
      "messages_sent_today": 47
    },
    "server": {
      "go_version": "go1.22.5",
      "os": "linux",
      "arch": "amd64",
      "cpu_cores": 2
    }
  }
}
```

---

## Response Fields Reference

### Top Level

| Field | Type | Description |
|---|---|---|
| `version` | string | SuperFast backend version (semantic versioning) |
| `uptime_seconds` | integer | Seconds since the server process started |
| `uptime_human` | string | Human-readable uptime string |
| `goroutines` | integer | Number of active Go goroutines |

### memory

| Field | Type | Description |
|---|---|---|
| `heap_used_mb` | float | Memory currently in use by Go heap |
| `heap_total_mb` | float | Total heap memory obtained from OS |
| `heap_idle_mb` | float | Heap memory returned to OS or idle |
| `stack_in_use_mb` | float | Memory used by goroutine stacks |
| `gc_count` | integer | Total number of GC cycles since start |
| `last_gc_at` | ISO 8601 | Timestamp of last garbage collection |

### database

| Field | Type | Description |
|---|---|---|
| `connected` | boolean | Whether PostgreSQL connection is healthy |
| `size_mb` | float | Total PostgreSQL database size on disk |
| `active_connections` | integer | Connections currently executing a query |
| `idle_connections` | integer | Open connections waiting for work |
| `max_connections` | integer | Max pool size configured |
| `tables_count` | integer | Number of tables in the database |
| `migration_version` | integer | Current database migration version |

### redis

| Field | Type | Description |
|---|---|---|
| `connected` | boolean | Whether Redis is reachable |
| `used_memory_mb` | float | Memory used by Redis |
| `connected_clients` | integer | Number of Redis client connections |

### sync

| Field | Type | Description |
|---|---|---|
| `total_push_operations` | integer | Total pushes ever received (all time) |
| `total_pull_operations` | integer | Total pulls ever served (all time) |
| `queue_depth` | integer | Items currently in the server sync queue |
| `last_push_at` | ISO 8601 | Timestamp of most recent push |
| `last_pull_at` | ISO 8601 | Timestamp of most recent pull |

### whatsapp

| Field | Type | Description |
|---|---|---|
| `connected` | boolean | WhatsApp session status |
| `instance` | string | Evolution API instance name |
| `messages_sent_today` | integer | Messages sent since midnight (server local time) |

### server

| Field | Type | Description |
|---|---|---|
| `go_version` | string | Go runtime version |
| `os` | string | Operating system (`linux`, `windows`, `darwin`) |
| `arch` | string | CPU architecture (`amd64`, `arm64`) |
| `cpu_cores` | integer | Number of logical CPU cores available |

---

## Health Check (No Auth)

A lightweight health check endpoint that does **not** require authentication. Useful for load balancer health probes.

```http
GET /api/v1/health
```

### Response (200 OK)

```json
{
  "status": "ok",
  "version": "1.4.2",
  "timestamp": "2026-07-21T08:30:00Z"
}
```

### Response (503 Service Unavailable)

If the database is unreachable:

```json
{
  "status": "degraded",
  "version": "1.4.2",
  "timestamp": "2026-07-21T08:30:00Z",
  "checks": {
    "database": "unreachable",
    "redis": "ok"
  }
}
```

---

## Monitoring Recommendations

| Metric | Warning Threshold | Critical Threshold |
|---|---|---|
| `heap_used_mb` | > 300 MB | > 500 MB |
| `goroutines` | > 100 | > 500 |
| `database.active_connections` | > 20 | > 24 (near max) |
| `sync.queue_depth` | > 1,000 | > 10,000 |
| `database.connected` | — | `false` |
| `redis.connected` | — | `false` |
