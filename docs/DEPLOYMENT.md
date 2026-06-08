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
NEXT_PUBLIC_SITE_URL=https://your-domain.example
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

Production deployments must set this to the real site origin. Do not commit `.env.local` or any private deployment secrets.

For Docker Compose deployments, create `.env.production` on the server:

```text
NEXT_PUBLIC_SITE_URL=http://your-server-ip
```

After the domain is resolved and HTTPS is configured, change it to:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Do not commit `.env.production`.

## CentOS 9 + Docker Deployment

This is the Phase 7.1.1 target path for a self-owned cloud server. The app container only binds to localhost, and the host Nginx will later proxy public traffic to `127.0.0.1:3000`.

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
sudo mkdir -p /var/www/personal-dev-os
sudo chown -R "$USER":"$USER" /var/www/personal-dev-os
cd /var/www/personal-dev-os
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
NEXT_PUBLIC_SITE_URL=https://your-domain.com
EOF
```

### 4. Build And Start

```bash
docker compose up -d --build
```

The Compose service is named `personal-dev-os` and maps the container to localhost only:

```text
127.0.0.1:3000:3000
```

`NEXT_PUBLIC_SITE_URL` is loaded into the container from `.env.production`.

### 5. View Logs

```bash
docker compose logs -f
```

### 6. Local Server Checks

Run these on the server:

```bash
curl http://127.0.0.1:3000
curl http://127.0.0.1:3000/blog
curl http://127.0.0.1:3000/sitemap.xml
curl http://127.0.0.1:3000/rss.xml
```

### 7. Nginx Reverse Proxy

Nginx should proxy the public domain to:

```text
http://127.0.0.1:3000
```

Full Nginx and HTTPS configuration is deferred to Phase 7.2, after domain DNS is ready. Do not expose the Next.js container directly to the public internet.

### 8. Rollback

Check out the previous tag or commit, then rebuild the container:

```bash
git checkout <previous-tag-or-commit>
docker compose up -d --build
```

## Pre-Deployment Checklist

- Set the production `NEXT_PUBLIC_SITE_URL`.
- Run `pnpm lint`.
- Run `pnpm build`.
- Run `docker build -t personal-dev-os:test .` when Docker is available locally or on the server.
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

## Recommended Platforms

Use a platform that supports the Next.js App Router and Node server runtime. For the self-hosted path, use Docker Compose plus host-level Nginx reverse proxy. Vercel remains a natural managed option, but the current Docker target uses standalone output, not static export.

Do not add platform-specific account IDs, private project names, access tokens, or deployment secrets to the repository.
