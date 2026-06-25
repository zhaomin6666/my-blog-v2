# Production CMS Switch Checklist

Phase 12.1 is a preflight checklist for switching production content from file
repositories to PostgreSQL-backed CMS repositories later.

Do not switch production content sources in Phase 12.1. Keep production in file
mode until the Go / No-Go checks are complete and Phase 12.2 starts.

## 1. Current Production Status

- [ ] Production still runs in file mode.
- [ ] Public homepage `/` works.
- [ ] `/blog` works.
- [ ] `/projects` works.
- [ ] `/sitemap.xml` works.
- [ ] `/rss.xml` works.
- [ ] `/agent-demo` works.
- [ ] Docker containers are running normally.
- [ ] Nginx reverse proxy is healthy.
- [ ] HTTPS certificate is valid.

## 2. Production Environment Variables

Prepare these values on the server only:

```env
PERSONAL_SITE_DATABASE_URL=
ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=
ADMIN_SESSION_SECRET=
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

- [ ] `CONTENT_SOURCE` remains `file`.
- [ ] `BLOG_CONTENT_SOURCE` remains `file`.
- [ ] `PROJECT_CONTENT_SOURCE` remains `file`.
- [ ] `PROFILE_CONTENT_SOURCE` remains `file`.
- [ ] Database URL may be configured, but public pages do not consume database content yet.
- [ ] Admin env values are complete and secure.
- [ ] `ADMIN_SESSION_SECRET` is at least 32 characters.
- [ ] `.env.production` is not committed.
- [ ] Real secrets are not committed.
- [ ] Admin env values are not exposed to the frontend.
- [ ] Admin env check behavior is understood: `lib/admin/admin-env-check.ts` rejects missing values, placeholders, short session secrets, invalid password hashes, and known default password hashes.

## 3. Production PostgreSQL Readiness

- [ ] PostgreSQL service is available.
- [ ] Production database has been created.
- [ ] Database user can execute required migrations.
- [ ] Database user permissions are not broader than necessary.
- [ ] Server can reach PostgreSQL.
- [ ] `select 1` succeeds against the target database.
- [ ] Database timezone and encoding have no obvious issue.
- [ ] Production database connection string exists only in server `.env.production`.
- [ ] Connection string is not written into docs or Git.
- [ ] Database health-check behavior is understood: `lib/db/database-health-check.ts` runs a safe `select 1` and does not expose connection strings or usernames.

## 4. Backup Directory

Expected server directory:

```text
/opt/backups/personal-dev-os/postgres
```

- [ ] Backup directory exists.
- [ ] Directory permissions are reasonable.
- [ ] Current deployment user can write to the directory.
- [ ] Dump files will not be committed to Git.
- [ ] `docs/POSTGRES_BACKUP_RESTORE.md` has been read.
- [ ] A backup is required before migration.
- [ ] A backup is required before any content-source switch.

## 5. Migration Preparation

Required migration:

```text
database/migrations/001_create_cms_tables.sql
```

- [ ] Required migration file exists.
- [ ] Later reset migrations are understood and ordered if this database needs them.
- [ ] Migration has not been executed twice in production, or a safe repeat-execution check exists.
- [ ] Target database is known before running migration.
- [ ] Backup has been created before running migration.
- [ ] Migration execution time and result will be recorded.
- [ ] Migrations are not run automatically on app startup.
- [ ] `pnpm build` does not depend on PostgreSQL or run migrations.

## 6. Admin Feature Readiness

- [ ] `/admin/login` is reachable.
- [ ] `/admin` is reachable after login.
- [ ] `/admin/blog` is reachable.
- [ ] `/admin/projects` is reachable.
- [ ] `/admin/hero` is reachable.
- [ ] `/admin/profile` is reachable.
- [ ] `/admin/contact` is reachable.
- [ ] `/admin/stack` is reachable.
- [ ] Unauthenticated users cannot access Admin pages.
- [ ] Admin Markdown import/export file-size limits are understood.
- [ ] Blog soft delete behavior is understood.
- [ ] Project `published` / `featured` behavior is understood.

## 7. Nginx / Upload Limits

Current Admin Markdown limits:

```text
ADMIN_MARKDOWN_IMPORT_MAX_FILES=20
ADMIN_MARKDOWN_IMPORT_MAX_FILE_SIZE_BYTES=1048576
ADMIN_MARKDOWN_EXPORT_MAX_RECORDS=100
```

- [ ] Admin Markdown import single-file limit is understood.
- [ ] Per-request file-count limit is understood.
- [ ] Nginx `client_max_body_size` has been checked.
- [ ] If `413 Request Entity Too Large` appears, the Nginx handling path is known.
- [ ] Upload limits are not increased excessively.
- [ ] Agent Demo API rate-limit strategy is not changed.

## 8. Switch Strategy

Phase 12 should switch by domain, not all at once:

```text
1. Deploy code with Admin + database foundation, but keep file mode.
2. Run production migration.
3. Verify Admin can connect to PostgreSQL.
4. Import Blog content.
5. Switch only BLOG_CONTENT_SOURCE=database.
6. Verify Blog / RSS / sitemap / Agent Demo.
7. Import Projects content.
8. Switch only PROJECT_CONTENT_SOURCE=database.
9. Verify Projects / homepage Featured Projects / sitemap / Agent Demo.
10. Enter Hero / Profile / Contact / Stack content.
11. Switch only PROFILE_CONTENT_SOURCE=database.
12. Verify homepage and Agent Demo.
13. Consider CONTENT_SOURCE=database only after domain-level switches are stable.
```

- [ ] Phase 12.1 does not switch any production source.
- [ ] Current production safe mode remains file mode.
- [ ] Database mode can be enabled per domain later.

## 9. Rollback Strategy

Rollback env:

```env
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

- [ ] Rollback does not delete database content.
- [ ] Public pages read `content/*` again after rollback.
- [ ] Admin can still access database content when PostgreSQL is reachable.
- [ ] Rollback requires restart or redeploy.
- [ ] After rollback, check `/`, `/blog`, `/projects`, `/rss.xml`, `/sitemap.xml`, and `/agent-demo`.

## 10. Go / No-Go For Phase 12.2

Do not enter Phase 12.2 until all items below pass:

- [ ] Production env is ready.
- [ ] PostgreSQL service is ready.
- [ ] Backup directory is ready.
- [ ] Migration execution method is confirmed.
- [ ] Admin login configuration is confirmed.
- [ ] Current production file mode is healthy.
- [ ] Rollback plan is confirmed.
- [ ] No uncommitted code remains.
- [ ] `pnpm test` passes.
- [ ] `pnpm lint` passes.
- [ ] `pnpm build` passes.

