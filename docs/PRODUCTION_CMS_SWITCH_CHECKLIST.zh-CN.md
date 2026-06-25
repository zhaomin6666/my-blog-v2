# 生产 CMS 切换执行清单

Phase 12.1 是生产内容源从 file repositories 切换到 PostgreSQL-backed CMS repositories
之前的 preflight 检查。

Phase 12.1 不切换生产内容源。进入 Phase 12.2 之前，生产环境继续保持 file mode。

## 一、当前生产状态确认

- [ ] 当前线上仍为 file mode。
- [ ] 当前公开首页 `/` 正常。
- [ ] 当前 `/blog` 正常。
- [ ] 当前 `/projects` 正常。
- [ ] 当前 `/sitemap.xml` 正常。
- [ ] 当前 `/rss.xml` 正常。
- [ ] 当前 `/agent-demo` 正常。
- [ ] 当前 Docker 容器运行正常。
- [ ] 当前 Nginx 反向代理正常。
- [ ] 当前 HTTPS 证书正常。

## 二、生产环境变量准备

这些值只放在服务器环境中：

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

- [ ] Phase 12.1 不切换 database。
- [ ] `CONTENT_SOURCE` 仍保持 `file`。
- [ ] `BLOG_CONTENT_SOURCE` 仍保持 `file`。
- [ ] `PROJECT_CONTENT_SOURCE` 仍保持 `file`。
- [ ] `PROFILE_CONTENT_SOURCE` 仍保持 `file`。
- [ ] 数据库连接串可以先配置，但公开页面不消费 database。
- [ ] Admin env 必须完整且安全。
- [ ] `ADMIN_SESSION_SECRET` 至少 32 字符。
- [ ] 不提交 `.env.production`。
- [ ] 不提交真实密钥。
- [ ] 不在前端暴露 admin env。
- [ ] 已了解 `lib/admin/admin-env-check.ts`：它会拒绝缺失值、占位值、过短 session secret、非法 password hash 和常见默认密码 hash。

## 三、生产 PostgreSQL 准备

- [ ] PostgreSQL 服务可用。
- [ ] 数据库已创建。
- [ ] 数据库用户权限足够执行 migration。
- [ ] 数据库用户权限不要过大。
- [ ] 可以从服务器访问 PostgreSQL。
- [ ] 可以执行 `select 1`。
- [ ] 数据库时区和编码没有明显问题。
- [ ] 生产数据库连接串只放在服务器 `.env.production`。
- [ ] 不把连接串写入文档或 Git。
- [ ] 已了解 `lib/db/database-health-check.ts`：它只执行安全的 `select 1`，不暴露连接串或数据库用户名。

## 四、备份目录准备

服务器备份目录：

```text
/opt/backups/personal-dev-os/postgres
```

- [ ] 服务器存在备份目录。
- [ ] 目录权限合理。
- [ ] 当前用户可以写入。
- [ ] dump 文件不会提交到 Git。
- [ ] 已阅读 `docs/POSTGRES_BACKUP_RESTORE.zh-CN.md`。
- [ ] migration 前必须先备份。
- [ ] 内容源切换前必须先备份。

## 五、migration 准备

必须存在的 migration 文件：

```text
database/migrations/001_create_cms_tables.sql
```

- [ ] migration 文件存在。
- [ ] 如果生产库需要后续 reset migration，已确认执行顺序。
- [ ] migration 尚未在生产库重复执行，或者具备安全重复执行判断。
- [ ] 执行前知道目标数据库。
- [ ] 执行前已经备份。
- [ ] 执行后需要记录执行时间和结果。
- [ ] 不在应用启动时自动执行 migration。
- [ ] 不让 `pnpm build` 依赖数据库。

## 六、Admin 功能准备

- [ ] `/admin/login` 可访问。
- [ ] `/admin` 登录后可访问。
- [ ] `/admin/blog` 可访问。
- [ ] `/admin/projects` 可访问。
- [ ] `/admin/hero` 可访问。
- [ ] `/admin/profile` 可访问。
- [ ] `/admin/contact` 可访问。
- [ ] `/admin/stack` 可访问。
- [ ] 未登录无法访问后台页面。
- [ ] Admin Markdown import/export 文件大小限制明确。
- [ ] Blog soft delete 行为明确。
- [ ] Project `published` / `featured` 行为明确。

## 七、Nginx / 上传限制准备

当前 Admin Markdown 限制：

```text
ADMIN_MARKDOWN_IMPORT_MAX_FILES=20
ADMIN_MARKDOWN_IMPORT_MAX_FILE_SIZE_BYTES=1048576
ADMIN_MARKDOWN_EXPORT_MAX_RECORDS=100
```

- [ ] Admin Markdown import 单文件大小限制明确。
- [ ] 单次上传文件数限制明确。
- [ ] 已确认 Nginx `client_max_body_size` 是否需要配合。
- [ ] 如果出现 `413 Request Entity Too Large`，知道如何处理。
- [ ] 不把上传限制调得过大。
- [ ] 不影响 Agent Demo API 限流策略。

## 八、切换策略确认

Phase 12 后续按领域逐步切换：

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

- [ ] Phase 12.1 不切换任何生产内容源。
- [ ] 当前线上安全模式仍是 file mode。
- [ ] database mode 后续可以按领域逐步启用。

## 九、回滚策略确认

回滚环境变量：

```env
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

- [ ] 回滚不会删除数据库内容。
- [ ] 回滚后公开页面重新读取 `content/*`。
- [ ] 回滚后后台仍可访问数据库内容。
- [ ] 回滚后需要重启或重新部署。
- [ ] 回滚后检查 `/`、`/blog`、`/projects`、`/rss.xml`、`/sitemap.xml`、`/agent-demo`。

## 十、Go / No-Go 判断

进入 Phase 12.2 前必须满足：

- [ ] 生产 env 准备完成。
- [ ] PostgreSQL 服务准备完成。
- [ ] 备份目录准备完成。
- [ ] migration 执行方式确认。
- [ ] Admin 登录配置确认。
- [ ] 当前线上 file mode 正常。
- [ ] 回滚方案确认。
- [ ] 不存在未提交代码。
- [ ] `pnpm test` 通过。
- [ ] `pnpm lint` 通过。
- [ ] `pnpm build` 通过。

