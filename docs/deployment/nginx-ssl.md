---
id: nginx-ssl
title: Nginx & SSL Setup
sidebar_label: Nginx & SSL
sidebar_position: 3
---

# Nginx & SSL Setup

This guide configures Nginx as a reverse proxy for the SuperFast API and documentation site, with free SSL certificates via Let's Encrypt (Certbot).

## Overview

```
Internet
    │
    ▼ :443 (HTTPS)
  Nginx
    ├── api.yourdomain.com  →  superfast-api:8080
    ├── docs.yourdomain.com →  superfast-docs:80
    └── evolution.yourdomain.com → evolution-api:8080
```

---

## Install Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

---

## Install Certbot (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
```

---

## Initial HTTP Config (Before SSL)

Create the config files without SSL first, then Certbot will modify them.

### API Server Config

Create `/etc/nginx/conf.d/superfast-api.conf`:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}
```

### Docs Site Config

Create `/etc/nginx/conf.d/superfast-docs.conf`:

```nginx
server {
    listen 80;
    server_name docs.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Evolution API Config

Create `/etc/nginx/conf.d/superfast-evolution.conf`:

```nginx
server {
    listen 80;
    server_name evolution.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 3600s;  # WebSocket long connection
    }
}
```

Test and reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## Obtain SSL Certificates

```bash
sudo certbot --nginx \
  -d api.yourdomain.com \
  -d docs.yourdomain.com \
  -d evolution.yourdomain.com \
  --agree-tos \
  --non-interactive \
  --email admin@yourdomain.com
```

Certbot automatically modifies the Nginx configs to add SSL.

---

## Final Nginx Configs (After SSL)

After Certbot runs, the configs look like this:

### api.yourdomain.com (full config)

```nginx
# HTTP → HTTPS redirect
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;

    # Request size limit (for sync push payloads)
    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
        proxy_buffering off;
    }
}
```

### docs.yourdomain.com (full config)

```nginx
server {
    listen 80;
    server_name docs.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name docs.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/docs.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/docs.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=63072000" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

---

## Auto-Renewal

Certbot installs a systemd timer for auto-renewal. Verify it's active:

```bash
sudo systemctl status certbot.timer
```

Test the renewal process:
```bash
sudo certbot renew --dry-run
```

Certificates renew automatically every 60 days.

---

## Firewall Configuration

Allow only HTTP, HTTPS, and SSH:

```bash
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

Do **not** expose ports 8080 (API), 5432 (PostgreSQL), 6379 (Redis), 9000 (MinIO), or 8081 (Evolution) directly to the internet.

---

## Verify SSL

Check your SSL certificate grade:
```bash
curl -I https://api.yourdomain.com/api/v1/health
```

Or use [SSL Labs](https://www.ssllabs.com/ssltest/) to verify an A+ rating.
