# Admin Content Transfer

Phase 11.8 adds protected Admin Markdown import / export for database-backed
Blog Posts and Projects. Phase 11.8-fix moved those tools into the matching
content admin pages and removed the standalone `/admin/content` page.

## Scope

Supported:

- Blog Markdown import / export in `/admin/blog`
- Project Markdown import / export in `/admin/projects`
- Blog Posts import from `.md` files into PostgreSQL `blog_posts`
- Projects import from `.md` files into PostgreSQL `projects`
- dry-run preview before writes
- `create_only`, `update_by_slug`, and `create_or_update` import modes
- slug conflict checks
- frontmatter validation
- per-file import reports
- single-row Markdown export
- bulk zip export for active Blog Posts or Projects

Not supported in this phase:

- Profile / Contact / Stack import or export
- local migration scripts
- zip import
- folder upload
- remote URL import
- image download or image upload
- media library
- deleting rows
- deleting `content/blog` or `content/projects`
- automatic `CONTENT_SOURCE` switching

## Why Admin UI Instead Of Scripts

This feature is intentionally operated through the authenticated Admin surface
instead of local scripts. The Admin UI gives the author a dry-run report, an
explicit write confirmation, and a visible per-file result before database
content changes.

No `scripts/content/*.ts` migration scripts or `pnpm content:*` commands are
added in Phase 11.8.

## Import Modes

- `dry-run`: parse, validate, and compare slug state without writing.
- `create_only`: create rows whose active slug does not exist; skip existing
  active slugs.
- `update_by_slug`: update rows whose active slug exists; skip missing slugs.
- `create_or_update`: create missing active slugs and update existing active
  slugs.

Non-dry-run imports require an explicit confirmation checkbox in the matching
Admin page. Each file is handled independently, so one invalid file does not stop
other valid files from being processed.

## Upload Limits

Central constants:

```text
ADMIN_MARKDOWN_IMPORT_MAX_FILES=20
ADMIN_MARKDOWN_IMPORT_MAX_FILE_SIZE_BYTES=1048576
ADMIN_MARKDOWN_EXPORT_MAX_RECORDS=100
```

- Only `.md` files are accepted.
- Up to 20 files per import request.
- Each file must be 1MB or smaller.
- Zip import, remote URL import, and image upload are not supported.
- Uploaded files are parsed in memory and are not stored on disk.
- Filename is used only for reports; `slug` comes from frontmatter.

## Blog Frontmatter

Blog import maps Markdown frontmatter to `blog_posts`:

- `title -> title`
- `slug -> slug`
- `summary -> summary`
- Markdown body -> `content_markdown`
- `status -> status` (`draft`, `published`, `archived`)
- `lang -> lang` (`zh`, `en`)
- `date -> date`
- `tags -> tags`
- `series -> series`
- `seriesSlug -> series_slug`
- `seriesOrder -> series_order`
- `cover -> cover`
- `seoTitle -> seo_title`
- `seoDescription -> seo_description`

Missing `status` defaults to `draft` with a warning. Missing or invalid `lang`
defaults to `zh` with a warning. `tags` can be an array; comma-separated strings
are accepted with a warning.

Published imports set `published_at` from `date` when possible, or `now()` when
no date is available. Draft and archived imports do not set `published_at`.

## Project Frontmatter

Project import maps Markdown frontmatter to `projects`:

- `title -> title`
- `slug -> slug`
- `subtitle -> subtitle`
- `summary -> summary`
- Markdown body -> `content_markdown`
- `status -> status`
- `type -> type`
- `role -> role`
- `timeline -> timeline`
- `featured -> featured`
- `order -> display_order`
- `techStack -> tech_stack`
- `features -> features`
- `highlights -> highlights`
- `links -> links`
- `relatedPosts -> related_posts`
- `relatedSeriesSlug -> related_series_slug`
- `published -> published`
- `lang -> lang`
- `seoTitle -> seo_title`
- `seoDescription -> seo_description`

Array/object fields are validated before any write. Missing `published` defaults
to `false` with a warning; missing `featured` defaults to `false`.

## Export

Single-row export routes:

- `/admin/blog/export/[id]`
- `/admin/projects/export/[id]`

Bulk zip export routes:

- `/admin/blog/export`
- `/admin/projects/export`

Bulk export supports `scope=all`, `scope=published`, and `scope=draft`.
Soft-deleted rows are excluded. Bulk export is limited to 100 rows per request.
If more than 100 active rows match the requested scope, export fails with a
clear limit error instead of silently returning a partial zip.

Large export responses can still consume memory and bandwidth. For production
backups, prefer PostgreSQL `pg_dump`; Markdown export is for content transfer
and review, not the primary database backup strategy.

## Deployment Limits

If Admin Markdown import fails behind Nginx with `413 Request Entity Too Large`,
configure a small upload limit aligned with the app limit, for example:

```nginx
client_max_body_size 2m;
```

Then validate and reload Nginx:

```bash
docker exec nginx-proxy nginx -t
docker exec nginx-proxy nginx -s reload
```

Do not raise this to a very large value. The current application limit is 1MB
per Markdown file and 20 files per request. This does not change Agent Demo API
body-size or rate-limit behavior.

## Security Boundaries

- All Blog and Project Admin import / export routes are protected by Admin Auth.
- Export routes verify the Admin session before returning downloads.
- SQL queries are parameterized.
- Markdown is parsed as text; no code is executed.
- External URLs in Markdown are not fetched.
- Images are not downloaded or uploaded.
- Database connection strings, environment values, and stack traces are not shown
  in Admin reports.
- Import never deletes database rows and never restores soft-deleted rows.
- Import never changes `CONTENT_SOURCE`, `BLOG_CONTENT_SOURCE`, or
  `PROJECT_CONTENT_SOURCE`.

## Common Questions

**Does importing publish public pages immediately?**

Only if the imported content is public according to its frontmatter and the
matching content source is already configured as `database`.

**Does this replace `content/blog` or `content/projects`?**

No. File content remains in the repository and file mode continues to read it.

**Can I import a zip file?**

No. Phase 11.8 supports multiple `.md` uploads, not zip import.

**Can I export backups?**

You can export Markdown or zip files from Admin, but production database backups
should use `pg_dump`. See `docs/POSTGRES_BACKUP_RESTORE.md`.
