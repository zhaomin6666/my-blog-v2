# Deployment

This is the user-facing deployment guide for AI Native Portfolio CMS. It covers the current deployment path and links to longer production CMS runbooks only when needed.

## Deployment Modes

### File Mode

File mode is the simplest production path.

- No PostgreSQL required.
- Content comes from `content/site`, `content/homepage`, `content/pages`, `content/profile`, `content/blog`, and `content/projects`.
- Keep all content source variables set to `file`.
- Rebuild the app after content, SEO, RSS, sitemap, or domain changes.

### Database Mode

Database mode enables the Admin CMS with PostgreSQL.

- Requires `PERSONAL_SITE_DATABASE_URL`.
- Requires manual migration execution.
- Requires Admin auth variables.
- Public pages read database content only after the relevant content source variables are set to `database`.

Read [Database Content Source](DATABASE_CONTENT_SOURCE.md) before switching a production site to database mode. For a longer production runbook, use [Production CMS Deployment](PRODUCTION_CMS_DEPLOYMENT.md).

## Local Development

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Local URL:

```text
http://localhost:3000
```

Run local checks before deployment:

```bash
pnpm lint
pnpm build
pnpm security:admin
```

## Environment Variables

### Site URL

```text
NEXT_PUBLIC_SITE_URL=https://example.com
```

For local development:

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_SITE_URL` controls:

- canonical metadata
- Open Graph URLs
- `sitemap.xml`
- `robots.txt`
- `rss.xml`

Next.js inlines `NEXT_PUBLIC_*` values during `pnpm build`, so Docker deployments need this value both at build time and runtime. After changing it, rebuild the image.

### File Mode Content Sources

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

### Database Mode Content Sources

Enable database mode globally:

```text
CONTENT_SOURCE=database
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=database
PROFILE_CONTENT_SOURCE=database
```

Or switch one domain at a time:

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

### PostgreSQL

```text
PERSONAL_SITE_DATABASE_URL=<postgres-connection-url>
```

Do not set this for simple file-mode deployments unless another feature needs PostgreSQL.

### Admin Auth

```text
ADMIN_USERNAME=<admin_username>
ADMIN_PASSWORD_HASH=<sha256_password_hash>
ADMIN_SESSION_SECRET=<random_32_chars_or_longer>
ADMIN_AUTH_DEBUG=false
```

Generate safe local values with:

```bash
pnpm admin:secrets
```

Production notes:

- Never commit real Admin credentials, password hashes, session secrets, database URLs, or `.env.production`.
- Keep `ADMIN_AUTH_DEBUG=false` in production.
- Run `pnpm security:admin` after Admin-related changes.

### Agent Demo

If `/agent-demo` is enabled, configure the model provider variables in the server environment:

```text
AGENT_DEMO_MODEL_API_URL=
AGENT_DEMO_MODEL_API_KEY=
AGENT_DEMO_MODEL=
AGENT_DEMO_MODEL_TIMEOUT_MS=30000
AGENT_DEMO_RATE_LIMIT_WINDOW_MS=60000
AGENT_DEMO_RATE_LIMIT_MAX_REQUESTS=10
AGENT_DEMO_LOG_LEVEL=info
AGENT_DEMO_RUN_LIVE_TEST=false
AGENT_DEMO_OBSERVABILITY_ENABLED=true
AGENT_DEMO_HASH_SALT=<random-server-side-salt>
AGENT_DEMO_DATABASE_URL=<postgres-connection-url>
```

Keep API keys and salts out of tracked files. If observability is not needed, set `AGENT_DEMO_OBSERVABILITY_ENABLED=false` or omit `AGENT_DEMO_DATABASE_URL`.

## Database Migrations

The app does not run migrations automatically at build time or startup.

For database mode, run SQL files manually and in numeric order:

```bash
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/001_create_cms_tables.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/002_add_translation_keys_to_contact_and_stack.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/003_reset_contact_channels_single_source.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/004_reset_system_stack_single_source.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/005_create_page_configs.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/006_create_site_configs.sql
```

Before production migrations:

- Back up PostgreSQL.
- Run migrations against the intended database only.
- Record which migration files were executed.
- Rebuild or restart only after the database and Admin content have been checked.

See [PostgreSQL Backup / Restore](POSTGRES_BACKUP_RESTORE.md) for backup details.

## Docker Deployment

The repository includes a Dockerfile for Next.js standalone output and a Compose file.

The current Compose service is:

```text
personal-dev-os
```

The current external Docker network is:

```text
web-proxy
```

Create a production environment file on the server:

```bash
cp .env.example .env.production
```

Edit `.env.production` and set at least:

```text
NEXT_PUBLIC_SITE_URL=https://example.com
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

Create the external proxy network if it does not exist:

```bash
docker network create web-proxy
```

Build and start:

```bash
docker compose --env-file .env.production up -d --build
```

After changing `NEXT_PUBLIC_SITE_URL`, SEO settings, sitemap, RSS, or domain settings, rebuild:

```bash
docker compose --env-file .env.production up -d --build
```

If Docker cache keeps old metadata:

```bash
docker compose --env-file .env.production build --no-cache
docker compose --env-file .env.production up -d
```

View logs:

```bash
docker compose logs -f personal-dev-os
```

## Nginx Reverse Proxy

Put Nginx on the same Docker network as the app and proxy public traffic to:

```text
http://personal-dev-os:3000
```

Generic Nginx location:

```nginx
location / {
    proxy_pass http://personal-dev-os:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

If Admin Markdown import returns `413 Request Entity Too Large`, set a small upload limit aligned with the app limits:

```nginx
client_max_body_size 2m;
```

For public Agent Demo protection, add a route-level Nginx rate limit for `/api/agent-demo` in addition to the app-level limiter.

Always validate and reload Nginx after config changes:

```bash
nginx -t
nginx -s reload
```

Use the equivalent `docker exec <nginx-container> ...` commands if Nginx runs in a container.

## Production Checklist

- `NEXT_PUBLIC_SITE_URL` is set to the production origin.
- `.env.production` is not tracked by Git.
- File mode variables are explicit if no CMS is enabled.
- Database migrations have been run manually if database mode is enabled.
- PostgreSQL backup exists before production database changes.
- Admin auth variables are configured if `/admin` is enabled.
- `pnpm lint` passes.
- `pnpm build` passes.
- `pnpm security:admin` passes.
- Docker image rebuilds successfully.
- `/` renders the Developer OS shell.
- `/blog`, `/projects`, `/sitemap.xml`, `/robots.txt`, and `/rss.xml` work.
- Draft posts are excluded from public pages, sitemap, and RSS.
- `/admin/login` is protected by safe credentials.
- `/agent-demo` works only if model variables are configured.

## Online Validation

Check:

```text
https://example.com
https://example.com/blog
https://example.com/projects
https://example.com/sitemap.xml
https://example.com/robots.txt
https://example.com/rss.xml
```

If database mode is enabled, also check:

```text
https://example.com/admin/login
https://example.com/admin/site
https://example.com/admin/hero
https://example.com/admin/pages
https://example.com/admin/profile
https://example.com/admin/stack
https://example.com/admin/contact
https://example.com/admin/blog
https://example.com/admin/projects
```

## Rollback

For code rollback:

```bash
git log --oneline
git checkout <previous-tag-or-commit>
docker compose --env-file .env.production up -d --build
```

For content-source rollback, switch back to file mode and rebuild or restart:

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

Database rows are not deleted by a content-source rollback.
