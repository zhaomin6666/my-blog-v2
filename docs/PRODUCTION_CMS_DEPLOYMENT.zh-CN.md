# 生产 CMS 部署加固

Phase 11.9 用于加固 database-backed CMS 的生产部署流程。本阶段不新增 CMS 业务页面，
不修改公开页面 UI，也不会自动切换任何内容源。

Phase 12 使用本 runbook，并配合实际执行清单：

- `docs/PRODUCTION_CMS_SWITCH_CHECKLIST.md`
- `docs/PRODUCTION_CMS_SWITCH_CHECKLIST.zh-CN.md`

Phase 12.1 只做 preflight。它保持生产环境为 file mode，不执行生产 migration，
不导入真实生产内容，也不切换 `CONTENT_SOURCE`。

## 当前 CMS 能力概览

Admin 是作者自用后台，写入 PostgreSQL：

- `/admin/blog`：Blog Posts、Markdown 导入导出、soft delete。
- `/admin/projects`：Projects、Markdown 导入导出。
- `/admin/hero`：首页 Hero。
- `/admin/profile`：Profile / About 内容。
- `/admin/contact`：公开联系方式。
- `/admin/stack`：技术栈分组和条目。

公开页面继续通过 Service 层读取内容。只有对应内容源设置为 `database` 时，公开页面才消费数据库内容。

## 生产上线前检查清单

- PostgreSQL 能从服务器连接。
- `database/migrations/*.sql` 已按顺序执行。
- migration 或内容源切换前已有最新 PostgreSQL 备份。
- Admin 凭据已配置为非默认值。
- Blog、Projects、Hero、Profile、Contact、Stack 内容已在后台创建或导入，并人工检查。
- file mode 构建在无数据库连接时通过。
- database mode 在本地或 staging 测试库中构建通过。
- `.env.production` 只存在于服务器，不提交到 Git。
- `NEXT_PUBLIC_SITE_URL` 在构建期和运行期都是生产域名。
- 如果 Next.js 前面有 Nginx，Nginx 上传大小限制要与 Admin Markdown 导入限制匹配。

## Admin 安全检查清单

- [ ] 使用 `pnpm admin:secrets` 生成 `ADMIN_PASSWORD_HASH` 和 `ADMIN_SESSION_SECRET`。
- [ ] 不向仓库提交真实 `.env.production`、数据库连接串、password hash 或 session secret。
- [ ] 生产环境保持 `ADMIN_AUTH_DEBUG=false`。
- [ ] 部署前运行 `pnpm security:admin`。
- [ ] 确认 `/admin/logout` 后 session cookie 会被删除。
- [ ] 确认 Admin session cookie 的 `Path` 是 `/admin`。
- [ ] 确认 Next.js 应用端口不直接暴露公网，只通过 Nginx / HTTPS 访问。
- [ ] 如果使用 Cloudflare，确认源站 IP 不能被绕过直连。
- [ ] 保持 Nginx `client_max_body_size` 与 Admin Markdown import 限制一致。
- [ ] 保留 PostgreSQL 备份和 file mode rollback 路径。

## 环境变量清单

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.example
PERSONAL_SITE_DATABASE_URL=<postgres-connection-url>
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
ADMIN_USERNAME=<admin_username>
ADMIN_PASSWORD_HASH=<sha256_password_hash>
ADMIN_SESSION_SECRET=<random_32_chars_or_longer>
```

不要提交 `.env.production`、真实数据库连接串、password hash、session secret 或备份 dump。

生成 password hash：

```bash
node -e "const crypto=require('crypto'); console.log(crypto.createHash('sha256').update(process.argv[1]).digest('hex'))" '<your-admin-password>'
```

生成 session secret：

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

`ADMIN_SESSION_SECRET` 至少 32 字符。Admin env check 会拒绝占位值和常见默认密码的 hash。

## PostgreSQL Migration 执行流程

Migration 文件位于 `database/migrations/`，必须手动执行。

规则：

- migration 文件使用递增数字前缀，例如 `005_add_example.sql`。
- 只追加新 migration，不修改可能已经在线上执行过的旧 migration。
- 每次执行 migration 前先备份当前数据库。
- 执行后记录 migration 文件名、操作者、时间和结果。
- `pnpm build` 不依赖数据库连接，也不执行 migration。
- 应用启动时不自动执行 migration。

当前 migration 按顺序执行：

```bash
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/001_create_cms_tables.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/002_add_translation_keys_to_contact_and_stack.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/003_reset_contact_channels_single_source.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/004_reset_system_stack_single_source.sql
```

未来可以增加 `schema_migrations` 表记录执行状态，但 Phase 11.9 不新增自动 migration runner。

## file mode -> database mode 切换步骤

可以按领域逐步切换，不必一次全切。

Phase 12 的策略是先部署带 Admin + database 基础能力的代码，但生产仍保持 file mode。
只有在备份、migration 和 Go / No-Go 检查完成后，才按领域逐步导入和切换。

file mode 基线：

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

分领域切换示例：

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

全量 database mode：

```text
CONTENT_SOURCE=database
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=database
PROFILE_CONTENT_SOURCE=database
```

上线步骤：

1. 备份 PostgreSQL。
2. 确认 migration 已执行。
3. 检查 `/admin/blog`、`/admin/projects`、`/admin/hero`、`/admin/profile`、
   `/admin/contact`、`/admin/stack` 内容。
4. 在目标模式下运行 `pnpm test`、`pnpm lint`、`pnpm build`。
5. 修改服务器 `.env.production`。
6. 重新构建或重启应用。
7. 检查 `/`、`/blog`、`/projects`、`/agent-demo`、`/sitemap.xml`、`/rss.xml`。

Agent Demo sources 仍只来自公开 Profile、Stack、published Projects、published Blog、
AI Agent 学习路径和 Personal Developer OS 实现笔记。本阶段不扩大回答范围。

## Phase 12 生产切换顺序

Phase 12.1 preflight 通过后，按以下顺序执行：

```text
1. 先部署带 Admin + database 基础能力的代码，但保持 file mode。
2. 执行生产 migration。
3. 验证 Admin 可以连接数据库。
4. 导入 Blog 内容。
5. 单独切换 BLOG_CONTENT_SOURCE=database。
6. 验证 Blog / RSS / sitemap / Agent Demo。
7. 导入 Projects 内容。
8. 单独切换 PROJECT_CONTENT_SOURCE=database。
9. 验证 Projects / 首页 Featured Projects / sitemap / Agent Demo。
10. 录入 Hero / Profile / Contact / Stack。
11. 单独切换 PROFILE_CONTENT_SOURCE=database。
12. 验证首页和 Agent Demo。
13. 最后再考虑 CONTENT_SOURCE=database 全局切换。
```

不要把全局 `CONTENT_SOURCE=database` 作为生产第一步。file mode 基线是回滚路径，
应在整个 Phase 12 中保持可用。

## database mode -> file mode 回滚步骤

适用场景：数据库连接异常、database 内容缺失、后台误操作、sitemap / RSS 异常、导入错误或生产页面展示异常。

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

回滚说明：

- 回滚不会删除数据库内容。
- 公开页面重新读取 `content/blog`、`content/projects`、`content/profile`。
- PostgreSQL 可用时，后台仍可访问数据库内容，但公开页面不消费。
- 修改 env 后需要重新构建或重启。
- 回滚后检查 `/`、`/blog`、`/projects`、`/sitemap.xml`、`/rss.xml`、`/agent-demo`。

## Admin Markdown Import / Export 生产限制

集中限制：

```text
ADMIN_MARKDOWN_IMPORT_MAX_FILES=20
ADMIN_MARKDOWN_IMPORT_MAX_FILE_SIZE_BYTES=1048576
ADMIN_MARKDOWN_EXPORT_MAX_RECORDS=100
```

运行行为：

- Import 只接受 `.md`。
- 单次最多 20 个文件。
- 单个 Markdown 文件最大 1MB。
- 不支持 zip 导入、远程 URL 导入、图片上传或媒体库。
- 上传文件只在内存中解析，不长期保存在服务器磁盘。
- 非 dry-run 导入必须显式确认。
- 批量 zip 导出超过 100 条 active records 时会拒绝。
- soft-deleted rows 不参与导出。

## Nginx 413 问题处理

如果 Admin Markdown 导入出现 `413 Request Entity Too Large`，让 Nginx 与应用限制保持一致，不要开放大文件上传：

```nginx
client_max_body_size 2m;
```

当前应用单文件限制为 1MB，`2m` 用于覆盖 multipart 开销。修改后执行：

```bash
docker exec nginx-proxy nginx -t
docker exec nginx-proxy nginx -s reload
```

这个配置只服务 Admin Markdown 上传，不修改 Agent Demo API 的 body size 或限流策略。

## 验收 URL 清单

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

## 常见问题

- Admin login 提示 credentials 未配置：检查 `ADMIN_USERNAME`、`ADMIN_PASSWORD_HASH`、`ADMIN_SESSION_SECRET`。
- database mode 提示 database URL 缺失：配置 `PERSONAL_SITE_DATABASE_URL`，或把对应内容源回滚到 `file`。
- Import 文件数或大小超限：拆分上传，并保持每个 `.md` 文件不超过 1MB。
- Export 提示记录数过多：缩小 `scope` 或改用单篇导出。
- 公开页面仍显示文件内容：确认对应领域内容源是 `database`，然后重新构建或重启。
- Nginx 返回 413：配置较小的 `client_max_body_size`，检查配置并 reload。
