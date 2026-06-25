# Production CMS Deployment

Phase 11.9 hardens the database-backed CMS path for production use. It does not
add new CMS business pages, does not change public UI, and does not
automatically switch any content source.

## Current CMS Capabilities

The Admin surface is author-only and writes to PostgreSQL:

- `/admin/blog`: Blog Posts, Markdown import/export, soft delete.
- `/admin/projects`: Projects, Markdown import/export.
- `/admin/hero`: homepage Hero.
- `/admin/profile`: profile/about content.
- `/admin/contact`: public contact channels.
- `/admin/stack`: stack groups and items.

Public pages still read through services. They consume database rows only when
the matching source is set to `database`.

## Pre-Production Checklist

- PostgreSQL is reachable from the server.
- `database/migrations/*.sql` have been applied in order.
- A fresh PostgreSQL backup exists before any migration or source switch.
- Admin credentials are configured with non-default values.
- Blog, Projects, Hero, Profile, Contact, and Stack content have been created or
  imported and reviewed in Admin.
- File mode build passes without a database connection.
- Database mode build passes in local or staging with a test database.
- `.env.production` is created on the server and is not committed.
- `NEXT_PUBLIC_SITE_URL` is the production origin during build and runtime.
- Nginx upload limits are aligned with Admin Markdown import limits if Nginx is
  in front of Next.js.

## Environment Variables

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.example
PERSONAL_SITE_DATABASE_URL=<postgres-connection-url>
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=
PROJECT_CONTENT_SOURCE=
PROFILE_CONTENT_SOURCE=
ADMIN_USERNAME=<admin_username>
ADMIN_PASSWORD_HASH=<sha256_password_hash>
ADMIN_SESSION_SECRET=<random_32_chars_or_longer>
```

Do not commit `.env.production`, real database URLs, password hashes, session
secrets, or backup dumps.

Generate a password hash:

```bash
node -e "const crypto=require('crypto'); console.log(crypto.createHash('sha256').update(process.argv[1]).digest('hex'))" '<your-admin-password>'
```

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

`ADMIN_SESSION_SECRET` must be at least 32 characters. Placeholder values and
hashes of known default passwords are rejected by the Admin env check.

## Migration Workflow

Migration files live in `database/migrations/` and must be run manually.

Rules:

- Name migrations with increasing numeric prefixes, for example
  `005_add_example.sql`.
- Append new migrations. Do not modify old migrations that may have run in
  production.
- Back up the current database before every migration.
- Record the migration filename, operator, timestamp, and result in the release
  notes or server operations log.
- Do not run migrations from `pnpm build`.
- Do not run migrations automatically during app startup.

Current migrations should be applied in order:

```bash
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/001_create_cms_tables.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/002_add_translation_keys_to_contact_and_stack.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/003_reset_contact_channels_single_source.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/004_reset_system_stack_single_source.sql
```

Future migration tracking may use a `schema_migrations` table, but Phase 11.9
does not add an automatic migration runner.

## File Mode To Database Mode

You can switch by domain instead of switching everything at once.

Baseline file mode:

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

Gradual database mode example:

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

Full database mode:

```text
CONTENT_SOURCE=database
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=database
PROFILE_CONTENT_SOURCE=database
```

Switch steps:

1. Back up PostgreSQL.
2. Confirm migrations have run.
3. Confirm Admin content in `/admin/blog`, `/admin/projects`, `/admin/hero`,
   `/admin/profile`, `/admin/contact`, and `/admin/stack`.
4. Run `pnpm test`, `pnpm lint`, and `pnpm build` in the intended mode.
5. Update `.env.production` on the server.
6. Rebuild or restart the app.
7. Check `/`, `/blog`, `/projects`, `/agent-demo`, `/sitemap.xml`, and
   `/rss.xml`.

Agent Demo sources should still come only from public Profile, Stack, published
Projects, published Blog, AI Agent learning journey, and Personal Developer OS
implementation notes. This phase does not expand the answer scope.

## Database Mode To File Mode Rollback

Use this when the database is unavailable, imported content is wrong, sitemap or
RSS output is incorrect, or public pages render unexpected database content.

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

Rollback notes:

- Rollback does not delete database rows.
- Public pages read `content/blog`, `content/projects`, and `content/profile`
  again.
- Admin can still access database content when PostgreSQL is reachable.
- Rebuild or restart after changing env values.
- Check `/`, `/blog`, `/projects`, `/sitemap.xml`, `/rss.xml`, and
  `/agent-demo`.

## Admin Markdown Import / Export Limits

Central limits:

```text
ADMIN_MARKDOWN_IMPORT_MAX_FILES=20
ADMIN_MARKDOWN_IMPORT_MAX_FILE_SIZE_BYTES=1048576
ADMIN_MARKDOWN_EXPORT_MAX_RECORDS=100
```

Runtime behavior:

- Import accepts `.md` files only.
- Import accepts at most 20 files per request.
- Each Markdown file must be 1MB or smaller.
- Zip import, remote URL import, image upload, and media library are not
  supported.
- Uploaded files are parsed in memory and are not kept on disk.
- Non-dry-run imports require explicit confirmation.
- Bulk zip export rejects requests over 100 active records.
- Soft-deleted rows are excluded from export.

## Nginx 413 Handling

If Admin Markdown import fails with `413 Request Entity Too Large`, align Nginx
with the app limit instead of allowing large uploads:

```nginx
client_max_body_size 2m;
```

Use a small value that covers the current 1MB file limit plus multipart overhead.
After changing Nginx:

```bash
docker exec nginx-proxy nginx -t
docker exec nginx-proxy nginx -s reload
```

This limit is for Admin Markdown upload only. It does not change Agent Demo API
body-size or rate-limit policy.

## Acceptance URLs

- `/admin`
- `/admin/blog`
- `/admin/projects`
- `/admin/hero`
- `/admin/profile`
- `/admin/contact`
- `/admin/stack`
- `/`
- `/blog`
- `/projects`
- `/agent-demo`
- `/sitemap.xml`
- `/rss.xml`

## Troubleshooting

- Admin login says credentials are not configured: set `ADMIN_USERNAME`,
  `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET`.
- Database mode says the database URL is missing: set
  `PERSONAL_SITE_DATABASE_URL` or roll the affected source back to `file`.
- Import returns file-count or file-size errors: split uploads and keep each
  `.md` file under 1MB.
- Export fails because too many records match: narrow `scope` or export records
  individually.
- Public pages still show file content: confirm the domain source is
  `database` and rebuild/restart.
- 413 from Nginx: set a small `client_max_body_size`, validate, and reload.

