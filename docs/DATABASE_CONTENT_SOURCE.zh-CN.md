# 数据库内容源说明

Phase 11.3 增加 PostgreSQL 内容源基础能力，但默认内容源仍然是文件模式。

## 目标

公开站点继续通过 Service 读取内容：

```text
BlogService    -> BlogRepository    -> FileBlogRepository | DatabaseBlogRepository
ProjectService -> ProjectRepository -> FileProjectRepository | DatabaseProjectRepository
ProfileService -> ProfileRepository -> FileProfileRepository | DatabaseProfileRepository
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

迁移文件路径：

```text
database/migrations/001_create_cms_tables.sql
```

该 SQL 不会自动执行。开始测试数据库内容源时，手动在个人网站专用数据库中执行：

```bash
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/001_create_cms_tables.sql
```

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

## Blog Admin ??

Phase 11.5 ?? Blog Admin ?? PostgreSQL `blog_posts`?

?????

- `/admin/blog` ??? database ???
- ?? Blog ????? `BLOG_CONTENT_SOURCE=database` ? `CONTENT_SOURCE=database` ??? database posts?
- ????????? file ???????? database ??????? `/blog`????????
- ???????????????
- ???????? `content/blog` Markdown ???
- ????????????????

?????

- `draft` database posts ?? Admin ??????????? published-only ???
- `published` database posts ?? database mode ?? `DatabaseBlogRepository` ????????
- ???????? `draft`??? database-mode ??????????
- `deleted_at` ??????? Admin ??????????

???????????? `/blog`?Blog Search?Tags?Series?sitemap?RSS????????????? `revalidatePath()`????????? file ??????? database ??????????? database mode ???????????

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
- 不复用 `sub2api` 业务库。
- 不提交真实连接串。
- `.env.production` 不进入 Git。

## 备份建议

备份基线：

- 定期执行 `pg_dump`。
- 备份文件放在仓库外。
- 控制备份目录权限。
- 在非生产数据库中测试恢复。
- 在正式依赖数据库作为主内容源前，先文档化恢复命令。

## 后续导入脚本计划

`scripts/content-import/README.md` 目前只是占位说明。

后续阶段可以增加外部 Markdown 导入流程，但 Phase 11.3 不扫描外部目录、不写入
PostgreSQL、不覆盖 Markdown、不删除 `content/blog`，也不迁移真实内容。
