---
id: docker
title: Docker Compose Deployment
sidebar_label: Docker Compose
sidebar_position: 1
---

# Docker Compose Deployment

The recommended way to deploy SuperFast's backend is with Docker Compose. This guide sets up a production stack including the API server, PostgreSQL, Redis, MinIO, Evolution API, and the documentation site.

## Prerequisites

- Ubuntu 22.04 LTS (or any Linux with Docker support)
- Docker Engine 24+ and Docker Compose Plugin 2+
- A domain name pointing to your server's IP
- Ports 80 and 443 open in your firewall

Install Docker:
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```

---

## Directory Structure

```bash
mkdir -p /opt/superfast/{data/postgres,data/redis,data/minio}
cd /opt/superfast
```

---

## docker-compose.yml

```yaml
version: "3.8"

networks:
  superfast-net:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
  minio_data:
  evolution_data:

services:

  # ─── PostgreSQL ────────────────────────────────────────────────
  postgres:
    image: postgres:16-alpine
    container_name: superfast-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: superfast
      POSTGRES_USER: superfast
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - superfast-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U superfast"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ─── Redis ─────────────────────────────────────────────────────
  redis:
    image: redis:7-alpine
    container_name: superfast-redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD} --save 60 1
    volumes:
      - redis_data:/data
    networks:
      - superfast-net
    healthcheck:
      test: ["CMD", "redis-cli", "--no-auth-warning", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ─── MinIO ─────────────────────────────────────────────────────
  minio:
    image: minio/minio:latest
    container_name: superfast-minio
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}
    volumes:
      - minio_data:/data
    networks:
      - superfast-net
    healthcheck:
      test: ["CMD", "mc", "ready", "local"]
      interval: 30s
      timeout: 10s
      retries: 5

  # ─── Evolution API (WhatsApp) ──────────────────────────────────
  evolution-api:
    image: atendai/evolution-api:latest
    container_name: superfast-evolution
    restart: unless-stopped
    environment:
      SERVER_URL: https://evolution.${DOMAIN}
      AUTHENTICATION_API_KEY: ${EVOLUTION_API_KEY}
      DATABASE_PROVIDER: postgresql
      DATABASE_CONNECTION_URI: postgresql://superfast:${POSTGRES_PASSWORD}@postgres:5432/superfast
      REDIS_URI: redis://:${REDIS_PASSWORD}@redis:6379
      INSTANCES_EXPIRATION_TIME: 0
      DEL_INSTANCE: false
    volumes:
      - evolution_data:/evolution/instances
    networks:
      - superfast-net
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  # ─── SuperFast API Server ──────────────────────────────────────
  superfast-api:
    image: ghcr.io/sstd/superfast-api:latest
    container_name: superfast-api
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://superfast:${POSTGRES_PASSWORD}@postgres:5432/superfast
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      MINIO_ENDPOINT: minio:9000
      MINIO_ACCESS_KEY: ${MINIO_ACCESS_KEY}
      MINIO_SECRET_KEY: ${MINIO_SECRET_KEY}
      MINIO_BUCKET: superfast
      MINIO_USE_SSL: "false"
      JWT_SECRET: ${JWT_SECRET}
      EVOLUTION_API_URL: http://evolution-api:8080
      EVOLUTION_API_KEY: ${EVOLUTION_API_KEY}
      PORT: "8080"
      GIN_MODE: release
    networks:
      - superfast-net
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # ─── SuperFast Docs ────────────────────────────────────────────
  superfast-docs:
    image: ghcr.io/sstd/superfast-docs:latest
    container_name: superfast-docs
    restart: unless-stopped
    networks:
      - superfast-net

  # ─── Nginx Reverse Proxy ───────────────────────────────────────
  nginx:
    image: nginx:alpine
    container_name: superfast-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    networks:
      - superfast-net
    depends_on:
      - superfast-api
      - superfast-docs
```

---

## Environment File (.env)

Create `/opt/superfast/.env`:

```bash
# Domain
DOMAIN=yourdomain.com

# PostgreSQL
POSTGRES_PASSWORD=change-me-strong-password

# Redis
REDIS_PASSWORD=change-me-redis-password

# MinIO
MINIO_ACCESS_KEY=change-me-minio-user
MINIO_SECRET_KEY=change-me-minio-password-16chars+

# JWT
JWT_SECRET=change-me-256-bit-random-secret-key

# Evolution API
EVOLUTION_API_KEY=change-me-evolution-key
```

:::danger
Never commit the `.env` file to version control. Add it to `.gitignore`.
:::

---

## Starting the Stack

```bash
cd /opt/superfast

# Pull all images
docker compose pull

# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f superfast-api
```

---

## Running Database Migrations

After the first start, run migrations:

```bash
docker compose exec superfast-api ./superfast migrate
```

---

## Updating the Stack

```bash
docker compose pull
docker compose up -d
docker compose exec superfast-api ./superfast migrate  # run if new migrations exist
```
