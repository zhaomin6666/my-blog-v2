# Database Content Source

Phase 11.3 adds the foundation for optional PostgreSQL-backed content while
keeping file content as the default production-safe source.

## Goal

The public site still reads content through services:

```text
BlogService    -> BlogRepository    -> FileBlogRepository | DatabaseBlogRepository
ProjectService -> ProjectRepository -> FileProjectRepository | DatabaseProjectRepository
ProfileService -> ProfileRepository -> FileProfileRepository | DatabaseProfileRepository
```

Pages, sitemap, RSS, Blog Search, Tags, Series, Projects, Profile, and Agent
Demo continue to call the service layer. They do not query PostgreSQL directly.

## Environment Variables

```text
PERSONAL_SITE_DATABASE_URL=
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=
PROJECT_CONTENT_SOURCE=
PROFILE_CONTENT_SOURCE=
```

Source precedence:

1. Domain-specific source, such as `BLOG_CONTENT_SOURCE`.
2. Global `CONTENT_SOURCE`.
3. Default: `file`.

Allowed source values are `file` and `database`.

Examples:

```text
CONTENT_SOURCE=file
```

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

When a source is set to `database`, `PERSONAL_SITE_DATABASE_URL` must be
configured. File mode does not require a database connection and should continue
to build normally without PostgreSQL.

## Migration

Migration path:

```text
database/migrations/001_create_cms_tables.sql
```

The migration is not executed automatically. Run it manually against the
dedicated personal-site database when database-mode testing begins:

```bash
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/001_create_cms_tables.sql
```

## Tables

The MVP schema includes:

- `blog_posts`
- `blog_series`
- `projects`
- `profile_pages`
- `contact_channels`
- `system_stack_groups`
- `system_stack_items`
- `homepage_sections`

The migration also adds common indexes for public reads, including slug,
published/status, language, display order, soft delete, series, and blog tag GIN
indexes. All MVP tables with mutable public content have an `updated_at` trigger.

## Repository Switching

Repository selection lives in `lib/content/contentSource.ts` and the pure env
resolver lives in `lib/content/contentSourceConfig.ts`.

Factory methods:

- `getBlogRepository()`
- `getProjectRepository()`
- `getProfileRepository()`

The service singletons use those factories:

- `blogService`
- `projectService`
- `profileService`

Public route code remains unchanged at the service boundary.

## File Fallback

Default mode remains `file`.

File mode:

- Reads from `content/blog`, `content/projects`, and `content/profile`.
- Does not require `PERSONAL_SITE_DATABASE_URL`.
- Does not create a PostgreSQL Pool.
- Keeps current public URLs and rendering behavior.

## Blog Admin Writes

Phase 11.5 adds Blog Admin writes to PostgreSQL `blog_posts`.

Important boundaries:

- `/admin/blog` manages database content only.
- Public Blog pages read database posts only when `BLOG_CONTENT_SOURCE=database`
  or `CONTENT_SOURCE=database`.
- If public pages still run in file mode, newly created database posts will not
  appear on `/blog`; this is expected.
- The phase does not automatically switch production content source.
- The phase does not import old Markdown files from `content/blog`.
- The phase does not delete or overwrite file-based content.

Status behavior:

- `draft` database posts are visible in Admin, but excluded from public
  published-only queries.
- `published` database posts are included by `DatabaseBlogRepository` public
  reads when database mode is active.
- Unpublish changes the post back to `draft`, so public database-mode reads stop
  returning it.
- Soft-deleted rows remain excluded from both Admin list results and public
  reads.

Admin save, publish, and unpublish actions call `revalidatePath()` for `/blog`,
Blog Search, Tags, Series, sitemap, RSS, and the affected article path when the
slug is known. In file mode this does not make database posts public; it only
keeps the cache behavior ready for database mode.

## Database Mode Notes

Database repositories are read-only for Phase 11.3.

Current status:

- `DatabaseBlogRepository`: implemented for published/draft reads, tags, series,
  search-compatible metadata, RSS, sitemap, and article lookup.
- `DatabaseProjectRepository`: implemented for published/featured/order reads and
  project detail lookup.
- `DatabaseProfileRepository`: implemented for public profile, visible contact
  channels, and system stack reads.

Database mode excludes soft-deleted rows and keeps public reads published-only or
visible-only.

## Empty Database Behavior

An empty database after running the migration is a valid state, not a content
source failure.

- Blog posts, tags, and series return empty collections. Blog pages render their
  existing empty states; RSS contains channel metadata without article items;
  sitemap contains no post, tag, or series detail URLs.
- Projects return empty collections. Homepage and `/projects` render lightweight
  empty states; unknown project slugs continue to use `notFound()`.
- Profile, Contact Channels, and System Stack return a centralized safe empty
  `PublicProfile` object in database mode, allowing the homepage to render empty
  states without fabricated content.
- Database mode does not automatically fall back to Markdown files when queries
  succeed with no rows.

Only successful queries with no matching content use empty results. Missing
`PERSONAL_SITE_DATABASE_URL`, connection failures, missing tables, invalid SQL,
and schema mismatches still throw explicit errors. File mode keeps its existing
strict profile validation and does not require or initialize PostgreSQL.

The Phase 11.3-fix smoke test applies the migration to an empty local PostgreSQL
database and verifies both `CONTENT_SOURCE=database` and an invalid-database-URL
`CONTENT_SOURCE=file` production build.

## Production Recommendations

Use an isolated PostgreSQL setup for the personal site:

- Dedicated database.
- Dedicated database user.
- Least-privilege permissions.
- Do not reuse the `sub2api` business database.
- Do not commit real connection strings.
- Keep `.env.production` outside Git.

## Backups

Recommended backup baseline:

- Run scheduled `pg_dump`.
- Store backups outside the repository.
- Restrict backup directory permissions.
- Test restore on a non-production database.
- Document restore commands before relying on the database as the primary source.

## Future Import Script

`scripts/content-import/README.md` is a placeholder only.

Later phases may add an external Markdown import workflow, but Phase 11.3 does
not scan external directories, write content into PostgreSQL, overwrite
Markdown, delete `content/blog`, or migrate real content.
