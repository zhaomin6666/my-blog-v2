# Deployment Guide

## Project

Personal Developer OS is a browser-based developer desktop experience built with Next.js, React, TypeScript, Tailwind CSS, and a Markdown-backed blog architecture.

The production deployment should preserve the Developer OS structure:

- System Status Bar
- Main App
- Console App
- Desktop fallback
- `macos` / `vercel` visual presets
- `light` / `dark` themes
- `zh` / `en` language switching

## Local Development

```bash
pnpm install
pnpm dev
```

Local URL:

```text
http://localhost:3000
```

## Local Checks

Run these before deployment:

```bash
pnpm lint
pnpm build
```

The project uses Next.js standalone output for Docker self-hosting:

```text
output: standalone
```

After `pnpm build`, the production server bundle is generated under `.next/standalone`. The Docker image runs that standalone Node server instead of serving a static export.

## Environment Variables

Required public production setting:

```text
NEXT_PUBLIC_SITE_URL=https://oli6666.top
```

Local fallback:

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_SITE_URL` is used by:

- canonical metadata
- Open Graph URLs
- `sitemap.xml`
- `robots.txt`
- `rss.xml`

Production deployments must set this to the real site origin. In Docker deployments, the value is needed twice:

- build time: Next.js inlines `NEXT_PUBLIC_*` values while running `pnpm build`, so sitemap, RSS, and metadata need the production URL during image build.
- runtime: the standalone server should still receive the same environment variable when the container starts.

Do not commit `.env.local` or any private deployment secrets.

For Docker Compose deployments, create `.env.production` on the server:

```text
NEXT_PUBLIC_SITE_URL=http://your-server-ip
```

After the domain is resolved and HTTPS is configured, change it to:

```text
NEXT_PUBLIC_SITE_URL=https://oli6666.top
```

Do not commit `.env.production`.

## Production Archive

Production URL:

```text
https://oli6666.top
```

Current production stack:

- Self-owned Korea cloud server
- CentOS 9
- Docker + Docker Compose
- Next.js standalone output
- Docker Nginx reverse proxy
- Let's Encrypt HTTPS
- Primary domain: `oli6666.top`
- `www.oli6666.top` redirects to `oli6666.top`

Server directory layout:

```text
/opt/apps/personal-dev-os
/opt/infra/nginx
/opt/infra/nginx/conf.d
/opt/infra/nginx/certbot/www
/etc/letsencrypt/live/oli6666.top
```

## CentOS 9 + Docker Deployment

This is the Phase 7 production path for the self-owned cloud server. The app container is attached to the external Docker network `web-proxy` and exposes port `3000` only inside that network. Docker Nginx proxies public traffic to the app service, usually with an upstream such as `http://personal-dev-os:3000`.

### 1. Check Docker

```bash
docker --version
docker compose version
```

If `docker compose` is not available on CentOS 9, install the Compose plugin:

```bash
sudo dnf install docker-compose-plugin
```

### 2. Prepare Directory

Recommended deployment directory:

```bash
sudo mkdir -p /opt/apps/personal-dev-os
sudo chown -R "$USER":"$USER" /opt/apps/personal-dev-os
cd /opt/apps/personal-dev-os
```

Clone the repository:

```bash
git clone <repo-url> .
```

Do not write real repository URLs, domains, IP addresses, or secrets into tracked files.

### 3. Create Production Env File

Before the domain is resolved:

```bash
cat > .env.production <<'EOF'
NEXT_PUBLIC_SITE_URL=http://your-server-ip
EOF
```

After DNS and HTTPS are ready:

```bash
cat > .env.production <<'EOF'
NEXT_PUBLIC_SITE_URL=https://oli6666.top
EOF
```

### 4. Build And Start

```bash
docker compose --env-file .env.production up -d --build
```

The Compose service is named `personal-dev-os`. It does not publish port `3000` directly to the public host. Instead, it exposes port `3000` to the external Docker network:

```text
web-proxy -> personal-dev-os:3000
```

The external Docker network must exist before startup:

```bash
docker network create web-proxy
```

If the network already exists, Docker will report that and you can continue.

`NEXT_PUBLIC_SITE_URL` is passed to Docker build args and is also loaded into the running container from `.env.production`.

If `.env.production` changes, rebuild and restart so the build-time metadata is regenerated:

```bash
docker compose --env-file .env.production up -d --build
```

If Docker cache keeps old sitemap, RSS, or metadata output, rebuild without cache:

```bash
docker compose --env-file .env.production build --no-cache
docker compose --env-file .env.production up -d
```

### 5. View Logs

Application logs:

```bash
cd /opt/apps/personal-dev-os
docker compose logs -f
```

Nginx logs:

```bash
cd /opt/infra/nginx
docker compose logs -f
```

### 6. Update Deployment

```bash
cd /opt/apps/personal-dev-os
git pull
docker compose --env-file .env.production up -d --build
```

### 7. Reload Nginx

Validate Nginx config before reload:

```bash
docker exec nginx-proxy nginx -t
docker exec nginx-proxy nginx -s reload
```

### 8. Certificate Renewal

Manual renewal:

```bash
docker run --rm \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -v /opt/infra/nginx/certbot/www:/var/www/certbot \
  certbot/certbot renew --webroot -w /var/www/certbot

docker exec nginx-proxy nginx -s reload
```

This can be added to a cron job later for scheduled renewal.

### 9. Local Server Checks

Run these on the server from the app directory to check the app container itself:

```bash
docker compose exec personal-dev-os wget -qO- http://127.0.0.1:3000
docker compose exec personal-dev-os wget -qO- http://127.0.0.1:3000/blog
docker compose exec personal-dev-os wget -qO- http://127.0.0.1:3000/sitemap.xml
docker compose exec personal-dev-os wget -qO- http://127.0.0.1:3000/rss.xml
```

You can also check from the shared proxy network:

```bash
docker run --rm --network web-proxy curlimages/curl http://personal-dev-os:3000
```

### 10. Nginx Reverse Proxy

Docker Nginx should be on the same `web-proxy` network and proxy the public domain to:

```text
http://personal-dev-os:3000
```

Do not expose the Next.js container directly to the public internet.

### 11. Rollback

Check out the previous tag or commit, then rebuild the container:

```bash
cd /opt/apps/personal-dev-os
git log --oneline
git checkout <previous-tag-or-commit>
docker compose --env-file .env.production up -d --build
```

Future releases should use Git tags for clearer rollback targets.

## Pre-Deployment Checklist

- Set the production `NEXT_PUBLIC_SITE_URL`.
- Run `pnpm lint`.
- Run `pnpm build`.
- Run `docker compose --env-file .env.production build` when Docker is available locally or on the server.
- Confirm `/` renders the Personal Developer OS shell.
- Confirm `/blog` renders published posts.
- Confirm a published article route renders, for example `/blog/building-personal-developer-os`.
- Confirm draft article routes return 404.
- Confirm `/sitemap.xml` is available and does not include drafts.
- Confirm `/robots.txt` points to the production sitemap URL.
- Confirm `/rss.xml` is available, uses absolute post URLs, and does not include drafts.
- Confirm mobile layout still shows app entry points and does not overflow.
- Confirm `light` / `dark` and `macos` / `vercel` still work.
- Confirm Console commands still work, especially `blog`, `logs`, and `articles`.

## Online Validation Checklist

- `https://oli6666.top`
- `https://oli6666.top/blog`
- `https://oli6666.top/sitemap.xml`
- `https://oli6666.top/robots.txt`
- `https://oli6666.top/rss.xml`
- HTTP redirects to HTTPS.
- `www.oli6666.top` redirects to `oli6666.top`.
- Sitemap and RSS use `https://oli6666.top`.
- Draft posts are not public.
- Console `blog` command works.
- Mobile baseline check passes.

## Recommended Platforms

Use a platform that supports the Next.js App Router and Node server runtime. For the self-hosted path, use Docker Compose plus host-level Nginx reverse proxy. Vercel remains a natural managed option, but the current Docker target uses standalone output, not static export.

Do not add platform-specific account IDs, private project names, access tokens, or deployment secrets to the repository.
