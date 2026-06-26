# PostgreSQL Backup And Restore

This document defines the manual PostgreSQL backup and restore workflow for the
Personal Developer OS CMS. Phase 11.9 documents the process but does not add
automatic scheduled backup jobs.

## Backup Goals

Backups must cover CMS content tables:

- `blog_posts`
- `projects`
- `profile_pages`
- `homepage_sections`
- `contact_channels`
- `system_stack_groups`
- `system_stack_items`
- future Admin-related tables, if added

Use `pg_dump` custom format so `pg_restore` can restore reliably.

## Frequency Recommendation

- Before every migration.
- Before switching any production content source to `database`.
- Before large Admin import operations.
- Before production restore tests.
- Future option: daily cron once database mode becomes the primary source.

## Backup Location

Recommended server directory:

```text
/srv/example-backups/postgres
```

Create it with restricted permissions:

```bash
sudo mkdir -p /srv/example-backups/postgres
sudo chown -R "$USER":"$USER" /srv/example-backups/postgres
chmod 700 /srv/example-backups/postgres
```

Do not commit dump files to Git.

## External Or Host PostgreSQL Backup

```bash
export BACKUP_DIR=/srv/example-backups/postgres
export BACKUP_FILE="$BACKUP_DIR/app-backup-$(date +%Y%m%d-%H%M%S).dump"

pg_dump "$PERSONAL_SITE_DATABASE_URL" -F c -f "$BACKUP_FILE"
ls -lh "$BACKUP_FILE"
test -s "$BACKUP_FILE"
chmod 600 "$BACKUP_FILE"
```

`test -s` confirms the file exists and is not empty.

## Docker PostgreSQL Backup

Use the real container, user, and database names from your deployment:

```bash
export POSTGRES_CONTAINER=<postgres_container>
export DB_USER=<db_user>
export DB_NAME=<db_name>
export BACKUP_DIR=/srv/example-backups/postgres
export BACKUP_NAME=app-backup-$(date +%Y%m%d-%H%M%S).dump

docker exec "$POSTGRES_CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" -F c -f "/tmp/$BACKUP_NAME"
docker cp "$POSTGRES_CONTAINER:/tmp/$BACKUP_NAME" "$BACKUP_DIR/$BACKUP_NAME"
docker exec "$POSTGRES_CONTAINER" rm -f "/tmp/$BACKUP_NAME"
ls -lh "$BACKUP_DIR/$BACKUP_NAME"
test -s "$BACKUP_DIR/$BACKUP_NAME"
chmod 600 "$BACKUP_DIR/$BACKUP_NAME"
```

Do not assume a fixed container name in reusable docs or scripts.

## Download Backup To Local

```bash
scp user@your-server:/srv/example-backups/postgres/app-backup-YYYYMMDD-HHMMSS.dump .
```

Store local copies outside the repository.

## Retention

List backups:

```bash
ls -lhtr /srv/example-backups/postgres/*.dump
```

Keep the newest 10 manually:

```bash
cd /srv/example-backups/postgres
ls -1t app-backup-*.dump | tail -n +11
```

After reviewing the list, delete old backups manually:

```bash
rm /srv/example-backups/postgres/app-backup-YYYYMMDD-HHMMSS.dump
```

Future cron example, not implemented in Phase 11.9:

```cron
15 3 * * * pg_dump "$PERSONAL_SITE_DATABASE_URL" -F c -f "/srv/example-backups/postgres/app-backup-$(date +\%Y\%m\%d-\%H\%M\%S).dump"
```

## Restore Safety Rules

- Always back up the current target database before restoring.
- Confirm the target database name and connection string.
- Confirm whether restore will overwrite existing content.
- Prefer restoring to a new test database first.
- Do not restore over production without a fresh verified backup.

## Restore To Test Database

```bash
createdb app_restore_test
pg_restore -d app_restore_test /path/to/app-backup-YYYYMMDD-HHMMSS.dump
```

Validate the restored database by pointing a local or staging env to it:

```text
PERSONAL_SITE_DATABASE_URL=postgres://...
CONTENT_SOURCE=database
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=database
PROFILE_CONTENT_SOURCE=database
```

Then run:

```bash
pnpm test
pnpm build
```

## Restore To Production

Production restore is destructive if run against the active database. Use only
after confirming the backup, target, and rollback plan.

Recommended cautious flow:

1. Put the site back to file mode if public pages must stay stable.
2. Back up the current production database.
3. Restore the dump into a new database and validate it.
4. Point `PERSONAL_SITE_DATABASE_URL` to the restored database.
5. Rebuild or restart the application.
6. Validate Admin and public URLs.

If you must restore into the existing production database, stop writes first,
take a fresh backup, then use the exact command appropriate for your database
ownership model. Avoid `--clean` unless you are certain it is intended.

Example:

```bash
pg_restore -d "$PERSONAL_SITE_DATABASE_URL" /path/to/backup.dump
```

## Post-Restore Validation

Check Admin:

- `/admin/blog`
- `/admin/projects`
- `/admin/hero`
- `/admin/profile`
- `/admin/contact`
- `/admin/stack`

Check public outputs:

- `/blog`
- `/projects`
- `/sitemap.xml`
- `/rss.xml`
- `/agent-demo`

## Failure Rollback

If restore fails or restored content is wrong:

1. Switch public content sources back to `file`.
2. Rebuild or restart.
3. Restore the fresh pre-restore backup to a new database, or point the app back
   to the previous database.
4. Recheck `/`, `/blog`, `/projects`, `/sitemap.xml`, `/rss.xml`, and
   `/agent-demo`.

Never rely on an unverified production overwrite as the only copy of content.

