# PostgreSQL 备份与恢复

本文定义 Personal Developer OS CMS 的 PostgreSQL 手动备份与恢复流程。Phase 11.9 只文档化流程，不新增自动定时备份任务。

## 备份目标

备份应覆盖 CMS 内容表：

- `blog_posts`
- `projects`
- `profile_pages`
- `homepage_sections`
- `contact_channels`
- `system_stack_groups`
- `system_stack_items`
- 未来如新增 Admin 相关表，也应纳入备份

建议使用 `pg_dump` custom format，方便用 `pg_restore` 恢复。

## 备份频率建议

- 每次 migration 前。
- 每次把生产内容源切到 `database` 前。
- 大批量 Admin import 前。
- 生产恢复演练前。
- 未来 database mode 成为主内容源后，可增加每日 cron。

## 备份文件保存位置

推荐服务器目录：

```text
/opt/backups/personal-dev-os/postgres
```

创建目录并限制权限：

```bash
sudo mkdir -p /opt/backups/personal-dev-os/postgres
sudo chown -R "$USER":"$USER" /opt/backups/personal-dev-os/postgres
chmod 700 /opt/backups/personal-dev-os/postgres
```

不要把 dump 文件提交到 Git。

## 外部或宿主机 PostgreSQL 备份

```bash
export BACKUP_DIR=/opt/backups/personal-dev-os/postgres
export BACKUP_FILE="$BACKUP_DIR/personal-dev-os-$(date +%Y%m%d-%H%M%S).dump"

pg_dump "$PERSONAL_SITE_DATABASE_URL" -F c -f "$BACKUP_FILE"
ls -lh "$BACKUP_FILE"
test -s "$BACKUP_FILE"
chmod 600 "$BACKUP_FILE"
```

`test -s` 用于确认文件存在且非空。

## Docker PostgreSQL 备份示例

使用实际部署里的容器名、数据库用户和数据库名：

```bash
export POSTGRES_CONTAINER=<postgres_container>
export DB_USER=<db_user>
export DB_NAME=<db_name>
export BACKUP_DIR=/opt/backups/personal-dev-os/postgres
export BACKUP_NAME=personal-dev-os-$(date +%Y%m%d-%H%M%S).dump

docker exec "$POSTGRES_CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" -F c -f "/tmp/$BACKUP_NAME"
docker cp "$POSTGRES_CONTAINER:/tmp/$BACKUP_NAME" "$BACKUP_DIR/$BACKUP_NAME"
docker exec "$POSTGRES_CONTAINER" rm -f "/tmp/$BACKUP_NAME"
ls -lh "$BACKUP_DIR/$BACKUP_NAME"
test -s "$BACKUP_DIR/$BACKUP_NAME"
chmod 600 "$BACKUP_DIR/$BACKUP_NAME"
```

文档和脚本中不要假设固定容器名一定存在。

## 下载备份到本地

```bash
scp user@your-server:/opt/backups/personal-dev-os/postgres/personal-dev-os-YYYYMMDD-HHMMSS.dump .
```

本地备份也应放在仓库外。

## 保留最近 N 份备份

列出备份：

```bash
ls -lhtr /opt/backups/personal-dev-os/postgres/*.dump
```

查看超过最近 10 份的旧备份：

```bash
cd /opt/backups/personal-dev-os/postgres
ls -1t personal-dev-os-*.dump | tail -n +11
```

人工确认后删除旧备份：

```bash
rm /opt/backups/personal-dev-os/postgres/personal-dev-os-YYYYMMDD-HHMMSS.dump
```

未来 cron 示例，Phase 11.9 不实现：

```cron
15 3 * * * pg_dump "$PERSONAL_SITE_DATABASE_URL" -F c -f "/opt/backups/personal-dev-os/postgres/personal-dev-os-$(date +\%Y\%m\%d-\%H\%M\%S).dump"
```

## 恢复前注意事项

- 恢复前必须先备份当前目标数据库。
- 确认目标数据库名和连接串。
- 确认恢复是否会覆盖现有内容。
- 推荐先恢复到新的测试库验证。
- 不建议在未备份情况下直接覆盖生产库。

## 恢复到测试库

```bash
createdb personal_dev_os_restore_test
pg_restore -d personal_dev_os_restore_test /path/to/personal-dev-os-YYYYMMDD-HHMMSS.dump
```

把本地或 staging 指向测试库验证：

```text
PERSONAL_SITE_DATABASE_URL=postgres://...
CONTENT_SOURCE=database
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=database
PROFILE_CONTENT_SOURCE=database
```

然后运行：

```bash
pnpm test
pnpm build
```

## 恢复到生产库

生产恢复如果直接作用于 active database，可能覆盖当前内容，必须谨慎。

推荐流程：

1. 如果公开页面需要稳定，先回滚到 file mode。
2. 备份当前生产数据库。
3. 把 dump 恢复到新数据库并验证。
4. 将 `PERSONAL_SITE_DATABASE_URL` 指向已验证的新数据库。
5. 重新构建或重启应用。
6. 验证 Admin 和公开 URL。

如果必须恢复到现有生产库，先停止写入，做最新备份，再使用符合数据库权限模型的命令。除非确认需要，否则避免使用 `--clean`。

示例：

```bash
pg_restore -d "$PERSONAL_SITE_DATABASE_URL" /path/to/backup.dump
```

## 恢复后验证

检查 Admin：

- `/admin/blog`
- `/admin/projects`
- `/admin/hero`
- `/admin/profile`
- `/admin/contact`
- `/admin/stack`

检查公开输出：

- `/blog`
- `/projects`
- `/sitemap.xml`
- `/rss.xml`
- `/agent-demo`

## 失败回滚

如果恢复失败或恢复内容不正确：

1. 将公开内容源切回 `file`。
2. 重新构建或重启。
3. 将恢复前的最新备份恢复到新数据库，或把应用连接串切回旧数据库。
4. 重新检查 `/`、`/blog`、`/projects`、`/sitemap.xml`、`/rss.xml`、`/agent-demo`。

不要把未经验证的生产覆盖当作唯一内容副本。

