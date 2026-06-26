# Database Content Source

This is a user-facing guide for database mode. If you only use file mode, you do not need PostgreSQL and can keep all content source variables set to `file`.

Database mode lets the public site read content from PostgreSQL through the same service layer used by file mode. Pages and client components do not query PostgreSQL directly.

## When To Use Database Mode

Use database mode when you want to manage content through the Admin CMS:

- Site identity and default SEO.
- Homepage Hero.
- Blog and Projects page config.
- Profile.
- Stack.
- Contact channels.
- Blog posts and series.
- Project case studies.

Use file mode when you prefer editing `content/**` files and deploying from Git.

## Environment Variables

```text
PERSONAL_SITE_DATABASE_URL=<postgres-connection-url>
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

Allowed content source values:

```text
file
database
```

Source precedence:

1. Domain-specific source: `BLOG_CONTENT_SOURCE`, `PROJECT_CONTENT_SOURCE`, or `PROFILE_CONTENT_SOURCE`.
2. Global source: `CONTENT_SOURCE`.
3. Default: `file`.

Switch one domain at a time:

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

Switch everything to database mode:

```text
CONTENT_SOURCE=database
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=database
PROFILE_CONTENT_SOURCE=database
```

When any active source is `database`, `PERSONAL_SITE_DATABASE_URL` must be configured.

## Current Database Coverage

Database mode currently covers these PostgreSQL tables:

- `site_configs`
- `homepage_sections`
- `page_configs`
- `profile_pages`
- `contact_channels`
- `system_stack_groups`
- `system_stack_items`
- `blog_posts`
- `blog_series`
- `projects`

## Admin Route To Table Map

```text
/admin/site      -> site_configs
/admin/hero      -> homepage_sections
/admin/pages     -> page_configs
/admin/profile   -> profile_pages
/admin/stack     -> system_stack_groups / system_stack_items
/admin/contact   -> contact_channels
/admin/blog      -> blog_posts / blog_series
/admin/projects  -> projects
```

## Public Service Boundaries

The public site still reads through services:

```text
SiteConfigService -> FileSiteConfigRepository | DatabaseSiteConfigRepository
HomepageService   -> FileHomepageRepository   | DatabaseHomepageRepository
PageConfigService -> FilePageConfigRepository | DatabasePageConfigRepository
BlogService       -> FileBlogRepository       | DatabaseBlogRepository
ProjectService    -> FileProjectRepository    | DatabaseProjectRepository
ProfileService    -> FileProfileRepository    | DatabaseProfileRepository
```

Public pages, sitemap, RSS, search, tags, series, projects, profile sections, and Agent Demo call the service layer. They do not call PostgreSQL directly.

## Migration

Migrations are not executed automatically. The app does not run them during `pnpm build` or on startup.

Run migration files manually and in numeric order:

```bash
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/001_create_cms_tables.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/002_add_translation_keys_to_contact_and_stack.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/003_reset_contact_channels_single_source.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/004_reset_system_stack_single_source.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/005_create_page_configs.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/006_create_site_configs.sql
```

Production rules:

- Back up PostgreSQL before running migrations.
- Run migrations against the dedicated project database.
- Append new migration files instead of editing old ones that may have run in production.
- Record migration execution in release notes or an operations log.
- Keep `.env.production`, database URLs, dump files, and credentials out of Git.

See [PostgreSQL Backup / Restore](POSTGRES_BACKUP_RESTORE.md) for backup details.

## Public Read Rules

Blog:

- Public reads use `blog_posts`.
- `published` posts are public.
- `draft` posts are Admin-only.
- Soft-deleted rows are excluded.
- Blog series data uses `blog_series` when present.
- RSS remains blog-only.

Projects:

- Public reads use `projects`.
- `published = true` projects are public.
- Homepage projects also require `featured = true`.
- Soft-deleted rows are excluded.
- `/projects/[slug]` supports database-created published projects.

Profile, Contact, and Stack:

- Profile uses `profile_pages`.
- Contact uses `contact_channels`.
- Stack uses `system_stack_groups` and `system_stack_items`.
- Contact and Stack are global datasets, not per-language row pairs.
- Empty database results render empty states where supported; they do not automatically fall back to files.

Site, Homepage, and Pages:

- Site identity and default SEO use `site_configs`.
- Homepage Hero uses the `hero` row in `homepage_sections`.
- Blog and Projects page copy uses `page_configs`.
- `NEXT_PUBLIC_SITE_URL` is still deployment configuration, not Admin-managed content.

## Empty Database Behavior

An empty database after migrations is valid.

- Blog and Projects can render empty states.
- RSS can render channel metadata without items.
- Sitemap excludes missing posts and projects.
- Profile-related sections use safe empty data in database mode where the UI supports it.

These cases are still errors and should not be hidden:

- Missing `PERSONAL_SITE_DATABASE_URL` when database mode is active.
- Connection failure.
- Missing tables.
- Invalid SQL.
- Schema mismatch.

## Admin Markdown Import / Export

Blog and Project Markdown transfer lives inside the matching Admin pages:

```text
/admin/blog
/admin/projects
```

Supported:

- Import `.md` files into PostgreSQL.
- Dry-run preview by default.
- `create_only`, `update_by_slug`, and `create_or_update` import modes.
- Single-row Markdown export.
- Bulk zip export for active database rows.

Limits:

- `.md` files only.
- 20 files per import request.
- 1MB per file.
- 100 active records per bulk export.

Not included:

- No automatic import from `content/**`.
- No automatic content source switching.
- No deletion or overwrite of local Markdown files.
- No Profile, Contact, or Stack Markdown import/export.

See [Admin Content Transfer](ADMIN_CONTENT_TRANSFER.md) for the detailed transfer workflow.

## Production Switch And Rollback

Recommended production switch order:

1. Keep public sources in file mode.
2. Configure PostgreSQL and Admin auth.
3. Run migrations manually.
4. Review Admin content.
5. Switch one domain source to `database`.
6. Rebuild or restart.
7. Verify public pages, sitemap, RSS, and Agent Demo sources.

Rollback to file mode:

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

Rollback does not delete database rows. The public site returns to reading `content/**` files.

For the longer production runbook, see [Production CMS Deployment](PRODUCTION_CMS_DEPLOYMENT.md).
