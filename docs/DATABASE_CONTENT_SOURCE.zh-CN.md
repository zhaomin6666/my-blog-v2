# 数据库内容源说明

Phase 11.3 增加 PostgreSQL 内容源基础能力，但默认内容源仍然是文件模式。

## 目标

公开站点继续通过 Service 读取内容：

```text
SiteConfigService -> SiteConfigRepository -> FileSiteConfigRepository | DatabaseSiteConfigRepository
HomepageService   -> HomepageRepository   -> FileHomepageRepository   | DatabaseHomepageRepository
PageConfigService -> PageConfigRepository -> FilePageConfigRepository | DatabasePageConfigRepository
BlogService       -> BlogRepository       -> FileBlogRepository       | DatabaseBlogRepository
ProjectService    -> ProjectRepository    -> FileProjectRepository    | DatabaseProjectRepository
ProfileService    -> ProfileRepository    -> FileProfileRepository    | DatabaseProfileRepository
```

页面、sitemap、RSS、Blog Search、Tags、Series、Projects、Profile 和 Agent Demo
都继续使用 Service 层，不直接查询 PostgreSQL。

## 环境变量

```text
PERSONAL_SITE_DATABASE_URL=
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=
PROJECT_CONTENT_SOURCE=
PROFILE_CONTENT_SOURCE=
```

内容源优先级：

1. 模块级内容源，例如 `BLOG_CONTENT_SOURCE`。
2. 全局内容源 `CONTENT_SOURCE`。
3. 默认值：`file`。

允许值只有 `file` 和 `database`。

示例：

```text
CONTENT_SOURCE=file
```

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

当任意内容源设置为 `database` 时，必须配置
`PERSONAL_SITE_DATABASE_URL`。文件模式不需要数据库连接，也不应该因为未配置
PostgreSQL 而影响构建。

## Migration

迁移文件：

```text
database/migrations/001_create_cms_tables.sql
database/migrations/002_add_translation_keys_to_contact_and_stack.sql
database/migrations/003_reset_contact_channels_single_source.sql
database/migrations/004_reset_system_stack_single_source.sql
database/migrations/005_create_page_configs.sql
database/migrations/006_create_site_configs.sql
```

这些 SQL 不会自动执行。开始测试数据库内容源时，手动在个人网站专用数据库中按顺序执行：

```bash
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/001_create_cms_tables.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/002_add_translation_keys_to_contact_and_stack.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/003_reset_contact_channels_single_source.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/004_reset_system_stack_single_source.sql
database/migrations/005_create_page_configs.sql
database/migrations/006_create_site_configs.sql
```

生产规则：

- migration 文件必须使用递增数字前缀。
- 只追加新 migration，不修改已经在线上执行过的旧 migration。
- 执行 migration 前必须备份 PostgreSQL。
- 执行后记录到 release notes 或运维日志。
- `pnpm build` 不能依赖数据库连接。
- 应用启动时不能自动执行 migration。

生产 migration 流程详见 `docs/PRODUCTION_CMS_DEPLOYMENT.zh-CN.md`。

## 数据表

MVP schema 包含：

- `blog_posts`
- `blog_series`
- `projects`
- `profile_pages`
- `contact_channels`
- `system_stack_groups`
- `system_stack_items`
- `homepage_sections`
- `page_configs`
- `site_configs`

迁移文件包含常用公开查询索引：slug、published/status、lang、display order、
soft delete、series、blog tags GIN index。可变内容表都带有 `updated_at` 自动更新
trigger。

## Repository 切换

Repository 选择逻辑位于 `lib/content/contentSource.ts`，纯环境变量解析逻辑位于
`lib/content/contentSourceConfig.ts`。

工厂方法：

- `getBlogRepository()`
- `getProjectRepository()`
- `getProfileRepository()`

Service 单例使用这些工厂：

- `blogService`
- `projectService`
- `profileService`

公开路由不需要知道当前内容源。

## 文件模式 fallback

默认仍为 `file`。

文件模式：

- 继续读取 `content/blog`、`content/projects`、`content/profile`。
- 不需要 `PERSONAL_SITE_DATABASE_URL`。
- 不创建 PostgreSQL Pool。
- 保持现有公开 URL 和渲染行为。

## Blog Admin 写入说明

Phase 11.5 新增 Blog Admin 写入 PostgreSQL `blog_posts`。

重要边界：

- `/admin/blog` 只管理数据库内容。
- 公开 Blog 页面只有在 `BLOG_CONTENT_SOURCE=database` 或 `CONTENT_SOURCE=database` 时才读取数据库文章。
- 如果公开页面仍运行在 file 模式，新建的数据库文章不会出现在 `/blog`，这是预期行为。
- 本阶段不会自动切换生产内容源。
- 本阶段不会导入旧的 `content/blog` Markdown 文件。
- 本阶段不会删除或覆盖文件型内容。

状态行为：

- `draft` 数据库文章在 Admin 中可见，但不会进入公开 published-only 查询。
- `published` 数据库文章在 database mode 下会被 `DatabaseBlogRepository` 公开读取。
- 下架会把文章改回 `draft`，database-mode 公开读取会停止返回它。
- `deleted_at` 非空的软删除记录会同时从 Admin 列表和公开读取中排除。
- `/admin/blog` Delete 只会设置 `blog_posts.deleted_at = now()`，不会执行 `DELETE FROM blog_posts`，不会删除 Markdown 文件，本阶段也不做回收站、恢复或批量删除。

Admin 保存、发布、下架和 soft delete 操作会对 `/blog`、Blog Search、Tags、Series、sitemap、RSS，以及可确定的文章详情路径调用 `revalidatePath()`。在 file mode 下，这不会让数据库文章公开，只是为 database mode 保持缓存刷新链路就绪。

## DatabaseRepository 状态

Phase 11.3 的 DatabaseRepository 是只读实现。

当前状态：

- `DatabaseBlogRepository`：支持 published/draft 读取、tags、series、搜索元数据、RSS、sitemap 和文章详情。

- `DatabaseProjectRepository`：支持 published、featured、order 和项目详情读取。

- `DatabaseProfileRepository`：支持公开 Profile、visible Contact Channels 和 System Stack 读取。

数据库模式会排除 soft-deleted 内容，公开读取只返回 published 或 visible 内容。

## 数据库空表行为

执行 migration 后数据库暂时没有内容属于正常状态，不是内容源异常。

- Blog 文章、标签和系列返回空数组；公开页面显示现有 empty state；RSS 只保留频道基础信息；sitemap 不生成不存在的文章、标签或系列详情 URL。

- Projects 返回空数组；首页和 `/projects` 显示轻量 empty state；不存在的项目 slug 继续使用 `notFound()`。

- database 模式下 Profile、Contact Channels、System Stack 查询成功但无内容时，由 ProfileService 返回集中定义的安全空 `PublicProfile`，首页不会编造内容或崩溃。

- database 模式不会因为查询结果为空而自动 fallback 到 Markdown 文件。

只有“查询成功但没有匹配内容”会返回空结果。缺少 `PERSONAL_SITE_DATABASE_URL`、连接失败、表不存在、SQL 错误和 schema 不匹配仍会抛出明确错误。file 模式保留原有严格 Profile 校验，不需要也不会初始化 PostgreSQL。

Phase 11.3-fix smoke test 会在本地空 PostgreSQL 数据库执行 migration，并验证 `CONTENT_SOURCE=database` 构建，以及数据库地址无效时的 `CONTENT_SOURCE=file` 构建。

## 生产数据库建议

个人网站建议使用独立 PostgreSQL 资源：

- 独立 database。

- 独立 database user。

- 最小权限授权。

- 不复用 `another application` 业务库。

- 不提交真实连接串。

- `.env.production` 不进入 Git。

## 备份建议

备份基线：

- 定期执行 `pg_dump`。

- 备份文件放在仓库外。

- 控制备份目录权限。

- 在非生产数据库中测试恢复。

- 在正式依赖数据库作为主内容源前，先文档化恢复命令。

完整备份恢复手册见 `docs/POSTGRES_BACKUP_RESTORE.zh-CN.md`。

## 生产内容源切换与回滚

file mode 仍是安全默认值：

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

可以分领域逐步启用 database mode：

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

生产切换前必须确认 PostgreSQL 连通、migration 已执行、已有备份、后台内容已检查、
本地或 staging build 通过、`.env.production` 配置正确。切换后需要重新构建或重启，
并检查公开页面、sitemap、RSS 和 Agent Demo sources。

回滚到 file mode：

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

回滚不会删除数据库内容。公开页面会重新读取旧的 `content/blog`、`content/projects`、
`content/profile`。详细清单见 `docs/PRODUCTION_CMS_DEPLOYMENT.zh-CN.md`。

## 后续导入脚本计划

`scripts/content-import/README.md` 目前只是占位说明。

后续阶段可以增加外部 Markdown 导入流程，但 Phase 11.3 不扫描外部目录、不写入

PostgreSQL、不覆盖 Markdown、不删除 `content/blog`，也不迁移真实内容。

## Phase 11.6：Homepage / Profile Admin 写入说明

Phase 11.6 新增后台对 Profile / Homepage 相关 PostgreSQL 表的写入能力。

后台写入范围：

- `/admin/hero` 写入 `homepage_sections` 中的 Hero 内容。
- `/admin/profile` 写入 `profile_pages key='profile'`。
- `/admin/contact` 写入 `contact_channels`。
- `/admin/stack` 写入 `system_stack_groups` 和 `system_stack_items`。

公开读取行为：

- `profile_pages key='profile'` 通过 `ProfileService` 进入公开 Profile。
- `contact_channels` 进入公开 Contact；软删除行不进入公开页。
- `system_stack_groups` / `system_stack_items` 按 `display_order` 进入公开 Stack；软删除行不进入公开页。
- `homepage_sections.visible = true` 按 `display_order` 由 `HomepageService` 读取；当前公开首页只使用 `hero` section 覆盖 Main App Hero 的 title / subtitle。
- database 空表和部分数据缺失不会自动 fallback 到 file；查询成功但无内容时走 empty state 或现有默认文案。
- file mode 完全不读取这些后台数据库内容，继续使用 `content/profile`。

保存后会 revalidate `/`、`/agent-demo`、`/projects/ai-agent-demo` 和 `sitemap.xml`，方便 database mode 下公开内容刷新。

## Phase 11.8：Admin Markdown Import / Export

Phase 11.8 新增 database-backed Markdown 导入导出；Phase 11.8-fix 后，入口已移动到对应内容后台，独立 `/admin/content` 访问已移除。

- Blog Posts 可以在 `/admin/blog` 从 `.md` 文件导入 PostgreSQL `blog_posts`。
- Projects 可以在 `/admin/projects` 从 `.md` 文件导入 PostgreSQL `projects`。
- 导入支持 `dry-run`、`create_only`、`update_by_slug` 和 `create_or_update`。
- `dry-run` 是默认模式，不写数据库。
- 非 dry-run 导入必须在对应后台页面显式确认。
- Blog Posts 和 Projects 可以从 active database rows 导出为单篇 Markdown 或批量 zip。
- 已删除 Blog rows 会从普通 Admin 列表、公开 Blog、RSS、sitemap 和 Markdown 导出范围中排除，因为这些流程只读取 active rows。
- Blog 导出路由位于 `/admin/blog/export` 和 `/admin/blog/export/[id]`。
- Project 导出路由位于 `/admin/projects/export` 和 `/admin/projects/export/[id]`。

重要边界：

- 未新增本地 import/export 脚本。
- 未新增 `pnpm content:*` 命令。
- 不删除、迁移或覆盖 `content/blog` 和 `content/projects`。
- 不自动修改 `CONTENT_SOURCE`、`BLOG_CONTENT_SOURCE` 或 `PROJECT_CONTENT_SOURCE`。
- Profile、Contact、Stack 导入导出仍不在本阶段范围内。
