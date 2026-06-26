# 数据库内容源说明

这是一份面向用户的 database mode 使用说明。如果你只使用 file mode，就不需要 PostgreSQL，内容源变量保持为 `file` 即可。

database mode 让公开站点通过同一套 Service 层从 PostgreSQL 读取内容。页面和客户端组件不会直接查询 PostgreSQL。

## 什么时候使用 Database Mode

当你希望通过 Admin CMS 管理内容时，使用 database mode：

- 站点身份与默认 SEO。
- 首页 Hero。
- Blog 和 Projects 页面配置。
- Profile。
- Stack。
- Contact channels。
- Blog posts 和 series。
- Project case studies。

如果你更习惯编辑 `content/**` 文件并通过 Git 发布，继续使用 file mode。

## 环境变量

```text
PERSONAL_SITE_DATABASE_URL=<postgres-connection-url>
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

允许的内容源值：

```text
file
database
```

内容源优先级：

1. 领域级内容源：`BLOG_CONTENT_SOURCE`、`PROJECT_CONTENT_SOURCE` 或 `PROFILE_CONTENT_SOURCE`。
2. 全局内容源：`CONTENT_SOURCE`。
3. 默认值：`file`。

按领域逐步切换：

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

全部切到 database mode：

```text
CONTENT_SOURCE=database
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=database
PROFILE_CONTENT_SOURCE=database
```

只要任意生效内容源是 `database`，就必须配置 `PERSONAL_SITE_DATABASE_URL`。

## 当前数据库覆盖范围

database mode 当前覆盖这些 PostgreSQL 表：

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

## Admin 路由与数据表对应关系

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

## 公开读取边界

公开站点继续通过 Service 读取：

```text
SiteConfigService -> FileSiteConfigRepository | DatabaseSiteConfigRepository
HomepageService   -> FileHomepageRepository   | DatabaseHomepageRepository
PageConfigService -> FilePageConfigRepository | DatabasePageConfigRepository
BlogService       -> FileBlogRepository       | DatabaseBlogRepository
ProjectService    -> FileProjectRepository    | DatabaseProjectRepository
ProfileService    -> FileProfileRepository    | DatabaseProfileRepository
```

公开页面、sitemap、RSS、search、tags、series、projects、profile 区域和 Agent Demo 都调用 Service 层，不直接访问 PostgreSQL。

## Migration

migration 不会自动执行。应用不会在 `pnpm build` 或启动时运行 SQL。

需要手动按数字顺序执行：

```bash
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/001_create_cms_tables.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/002_add_translation_keys_to_contact_and_stack.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/003_reset_contact_channels_single_source.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/004_reset_system_stack_single_source.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/005_create_page_configs.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/006_create_site_configs.sql
```

生产规则：

- 执行 migration 前先备份 PostgreSQL。
- 确认命令连接的是本项目专用数据库。
- 已经在线上执行过的旧 migration 不要修改，后续只追加新文件。
- 将 migration 执行情况记录到 release notes 或运维日志。
- `.env.production`、数据库连接串、dump 文件和凭据不要进入 Git。

备份细节见 [PostgreSQL 备份与恢复](POSTGRES_BACKUP_RESTORE.zh-CN.md)。

## 公开读取规则

Blog：

- 公开读取使用 `blog_posts`。
- `published` 文章公开。
- `draft` 只在 Admin 中可见。
- 软删除记录不进入公开读取。
- 有 series 数据时使用 `blog_series`。
- RSS 仍然只包含博客文章。

Projects：

- 公开读取使用 `projects`。
- `published = true` 的项目公开。
- 首页项目还需要 `featured = true`。
- 软删除记录不进入公开读取。
- `/projects/[slug]` 支持后台新建并发布的项目。

Profile、Contact 和 Stack：

- Profile 使用 `profile_pages`。
- Contact 使用 `contact_channels`。
- Stack 使用 `system_stack_groups` 和 `system_stack_items`。
- Contact 和 Stack 是全局数据，不再是按语言成对维护的行。
- database 查询为空时，在支持的 UI 中显示 empty state，不会自动 fallback 到文件。

Site、Homepage 和 Pages：

- 站点身份与默认 SEO 使用 `site_configs`。
- 首页 Hero 使用 `homepage_sections` 中的 `hero`。
- Blog 和 Projects 页面文案使用 `page_configs`。
- `NEXT_PUBLIC_SITE_URL` 仍是部署配置，不是 Admin 管理的内容。

## 空数据库行为

执行 migration 后数据库为空是正常状态。

- Blog 和 Projects 可以显示 empty state。
- RSS 可以只输出频道基础信息。
- sitemap 不生成不存在的文章和项目 URL。
- database mode 下 Profile 相关区域会在 UI 支持时使用安全空数据。

这些情况仍然是错误，不应该被吞掉：

- database mode 生效但缺少 `PERSONAL_SITE_DATABASE_URL`。
- 数据库连接失败。
- 表不存在。
- SQL 错误。
- schema 不匹配。

## Admin Markdown Import / Export

Blog 和 Project 的 Markdown 导入导出位于对应 Admin 页面：

```text
/admin/blog
/admin/projects
```

已支持：

- 将 `.md` 文件导入 PostgreSQL。
- 默认 dry-run 预览。
- `create_only`、`update_by_slug` 和 `create_or_update` 导入模式。
- 单条记录 Markdown 导出。
- active database rows 的批量 zip 导出。

限制：

- 只接受 `.md` 文件。
- 单次最多 20 个文件。
- 单文件最大 1MB。
- 批量导出最多 100 条 active records。

不包含：

- 不会自动从 `content/**` 导入。
- 不会自动切换内容源。
- 不会删除或覆盖本地 Markdown 文件。
- 不支持 Profile、Contact、Stack 的 Markdown 导入导出。

详细流程见 [Admin 内容导入导出](ADMIN_CONTENT_TRANSFER.zh-CN.md)。

## 生产切换与回滚

推荐生产切换顺序：

1. 公开内容源先保持 file mode。
2. 配置 PostgreSQL 和 Admin auth。
3. 手动执行 migration。
4. 检查 Admin 内容。
5. 将一个领域的内容源切到 `database`。
6. 重建或重启应用。
7. 验证公开页面、sitemap、RSS 和 Agent Demo sources。

回滚到 file mode：

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

回滚不会删除数据库记录。公开站点会重新读取 `content/**` 文件。

更完整的生产 runbook 见 [Production CMS 部署手册](PRODUCTION_CMS_DEPLOYMENT.zh-CN.md)。
