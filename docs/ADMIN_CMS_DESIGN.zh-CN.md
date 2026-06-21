# 后台管理与 CMS 架构设计

Phase 11.2 用于设计 Personal Dev OS 后续的作者自用后台与内容系统。本阶段只做文档，不实现 `/admin` 页面，不新增数据库表或迁移脚本，不修改现有线上功能，不改 Console / CLI，不改窗口系统，不迁移内容，也不扩大 Agent Demo 的回答范围。

## 目标

当前内容源已经具备 CMS-ready 的分层：

```text
content/blog      -> FileBlogRepository    -> BlogService    -> 页面
content/projects  -> FileProjectRepository -> ProjectService -> 页面
content/profile   -> FileProfileRepository -> ProfileService -> 页面
```

目标是在不破坏页面调用方式的前提下，把生产内容源逐步切到 PostgreSQL：

```text
PostgreSQL -> DatabaseBlogRepository    -> BlogService    -> 页面
PostgreSQL -> DatabaseProjectRepository -> ProjectService -> 页面
PostgreSQL -> DatabaseProfileRepository -> ProfileService -> 页面
```

核心目标：

- 博客和项目内容不再长期依赖网站代码仓库。
- Blog、Projects、Profile、Homepage、Contact 等内容可以由作者后台管理。
- PostgreSQL 成为生产主内容源。
- FileRepository 保留为 fallback 和导入来源。
- 尽量保持现有 URL 不变。
- sitemap、RSS、Blog Search、Tags、Series、Projects、Profile、Agent Demo 继续通过现有 Service 使用公开内容。
- 后台只面向作者本人，不做公开用户系统。

## 为什么要从文件型内容源迁移

文件型 Markdown 很适合 v1.0 发布和可版本化内容，但当网站成为长期写作、求职展示和作品维护系统后，会出现几个问题：

- 每次内容更新都需要 Git 提交和生产构建，发布链路偏重。
- 博客草稿后续可能放在独立写作目录或内容仓库，而不是 Next.js 项目内。
- Profile、Contact、Homepage、Projects 的文案更新不应该依赖改代码。
- PostgreSQL 更适合管理草稿、发布状态、软删除、备份、导入导出和后续后台流程。
- 当前 Service / Repository 分层已经为平滑迁移预留了边界。

## 后台管理范围

第一版后台只管理作者自己的公开内容。

### Blog Posts

字段：

- `title`
- `slug`
- `summary`
- `date`
- `updatedAt`
- `tags`
- `series`
- `seriesSlug`
- `seriesOrder`
- `status`
- `lang`
- `cover`
- `seoTitle`
- `seoDescription`
- `content_markdown`
- `published` / `draft`
- `createdAt`
- `updatedAt`

### Blog Series

字段：

- `title`
- `slug`
- `summary`
- `description`
- `order`
- `lang`
- `published`
- `relatedProjectSlug`

### Projects

字段：

- `title`
- `slug`
- `subtitle`
- `summary`
- `status`
- `type`
- `role`
- `timeline`
- `featured`
- `order`
- `techStack`
- `features`
- `highlights`
- `links`
- `relatedPosts`
- `relatedSeriesSlug`
- `published`
- `lang`
- `seoTitle`
- `seoDescription`
- `content_markdown`

### Profile

管理内容：

- profile main content
- career direction
- focus
- public summary
- privacy note
- public resume note

### Contact Channels

字段：

- `label`
- `type`
- `href`
- `visible`
- `order`
- `description`

### System Stack

字段：

- group name
- items
- level / status
- order

### Homepage Content

管理内容：

- overview 文案
- hero title / subtitle
- services
- logs
- CTA
- featured projects order
- featured posts order

## 第一版暂时不做

第一版后台不做：

- 公开用户注册
- 多用户协作
- 复杂 RBAC
- 评论系统
- 点赞系统
- 在线图片上传，除非只是填写外部 URL
- 富文本编辑器，第一版使用 Markdown textarea 即可
- AI 自动写文章
- 定时发布
- 复杂审批流
- 完整版本 diff
- 第三方 CMS 接入
- 文件上传到服务器
- 内容商业化
- 修改 Agent Demo 的回答范围

## PostgreSQL 数据模型草案

数据模型尽量贴近当前 Markdown frontmatter，方便导入、fallback 和 Service 层兼容。

### MVP 必需表

#### `blog_posts`

```text
id uuid primary key
title text not null
slug text not null unique
summary text not null
content_markdown text not null
status text not null check (status in ('draft', 'published'))
lang text not null check (lang in ('zh', 'en'))
tags text[] not null default '{}'
series text
series_slug text
series_order integer
cover text
seo_title text
seo_description text
date timestamptz not null
published_at timestamptz
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
deleted_at timestamptz
```

建议索引：

- `slug` 唯一索引，软删除后可按需要调整为 partial unique index
- `status`
- `lang`
- `tags` GIN index
- `series_slug, series_order`
- `date desc`

#### `blog_series`

```text
id uuid primary key
title text not null
slug text not null unique
summary text
description text
lang text not null check (lang in ('zh', 'en'))
display_order integer not null default 0
published boolean not null default false
related_project_slug text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

#### `projects`

```text
id uuid primary key
title text not null
slug text not null unique
subtitle text
summary text not null
content_markdown text not null
status text not null
type text
role jsonb not null default '{}'::jsonb
timeline text
featured boolean not null default false
display_order integer not null default 0
tech_stack jsonb not null default '[]'::jsonb
features jsonb not null default '[]'::jsonb
highlights jsonb not null default '[]'::jsonb
links jsonb not null default '[]'::jsonb
related_posts jsonb not null default '[]'::jsonb
related_series_slug text
published boolean not null default false
lang text not null check (lang in ('zh', 'en'))
seo_title text
seo_description text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
deleted_at timestamptz
```

#### `profile_pages`

```text
id uuid primary key
key text not null
title text
summary text
content_markdown text
data jsonb not null default '{}'::jsonb
lang text not null check (lang in ('zh', 'en'))
updated_at timestamptz not null default now()
unique (key, lang)
```

#### `contact_channels`

```text
id uuid primary key
label text not null
type text not null
href text not null
description text
visible boolean not null default true
display_order integer not null default 0
lang text not null check (lang in ('zh', 'en'))
updated_at timestamptz not null default now()
```

#### `system_stack_groups`

```text
id uuid primary key
name text not null
description text
display_order integer not null default 0
lang text not null check (lang in ('zh', 'en'))
```

#### `system_stack_items`

```text
id uuid primary key
group_id uuid not null references system_stack_groups(id) on delete cascade
name text not null
description text
level text
status text
display_order integer not null default 0
```

#### `homepage_sections`

```text
id uuid primary key
key text not null
title text
subtitle text
content_markdown text
data jsonb not null default '{}'::jsonb
visible boolean not null default true
display_order integer not null default 0
lang text not null check (lang in ('zh', 'en'))
updated_at timestamptz not null default now()
unique (key, lang)
```

### 后续增强表

#### `admin_users`

```text
id uuid primary key
username text not null unique
password_hash text not null
display_name text
role text not null default 'owner'
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
last_login_at timestamptz
enabled boolean not null default true
```

第一版建议先用环境变量管理员账号。等需要多管理员、密码轮换 UI、操作日志或角色区分时，再迁移到 `admin_users`。

#### `content_revisions`

```text
id uuid primary key
content_type text not null
content_id uuid not null
snapshot jsonb not null
created_at timestamptz not null default now()
created_by text
```

用于后续回滚和 diff 工作流，第一版可不实现。

### Tags 方案比较

方案 A：`blog_posts.tags text[]`

- 简单。
- 与当前 frontmatter 兼容。
- 足够支持标签页、搜索、sitemap 和 Agent Demo 检索。
- 推荐第一版使用。

方案 B：`tags` 表 + `blog_post_tags` 关联表

- 更规范。
- 方便后续增加标签描述、别名和后台元数据。
- 表和 UI 复杂度更高。
- 适合作为后续增强。

### Series 方案比较

方案 A：在 `blog_posts` 中保留 `series`、`series_slug`、`series_order`

- 最接近当前 frontmatter。
- `/blog/series/[seriesSlug]` 排序简单。
- 推荐第一版使用。

方案 B：增加 `blog_post_series`

- 更规范。
- 适合一篇文章属于多个系列的情况。
- 当前站点暂不需要。

## Repository 迁移方案

页面和 Client Components 不直接查询数据库，公开应用继续通过 Service 层读取内容。

建议配置：

```text
BLOG_CONTENT_SOURCE=file | database
PROJECT_CONTENT_SOURCE=file | database
PROFILE_CONTENT_SOURCE=file | database
```

也可以提供全局 `CONTENT_SOURCE=file | database` 作为兜底，但按领域拆分更适合渐进迁移。

推荐工厂方式：

```text
createBlogRepository()
  -> BLOG_CONTENT_SOURCE=database 时使用 DatabaseBlogRepository
  -> 其他情况使用 FileBlogRepository
```

迁移步骤：

1. 保持现有 Repository interface 尽量稳定。
2. 在相同 interface 后增加 DatabaseRepository。
3. 只有公开产品已经需要时才小范围扩展接口。
4. FileRepository 保留为 fallback 和 import source。
5. 增加导入工具读取 Markdown frontmatter 并写入数据库。
6. 通过环境变量逐个内容域切换。
7. 页面、sitemap、RSS、search、tags、series、Agent Demo 继续调用 Service。

## 后台路由设计

完整路由设计：

```text
/admin/login
/admin
/admin/blog
/admin/blog/new
/admin/blog/[id]
/admin/series
/admin/projects
/admin/projects/new
/admin/projects/[id]
/admin/profile
/admin/contact
/admin/stack
/admin/homepage
/admin/settings
/admin/import-export
```

第一版 MVP 路由：

```text
/admin/login
/admin
/admin/blog
/admin/blog/new
/admin/blog/[id]
/admin/profile
/admin/homepage
```

Projects Admin 可以放在 Blog、Profile、Homepage 稳定后再做。

## 后台认证设计

### 方案 A：环境变量管理员账号

环境变量：

```text
ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=
ADMIN_SESSION_SECRET=
```

流程：

1. `/admin/login` 接收用户名和密码。
2. 密码与 `ADMIN_PASSWORD_HASH` 比对。
3. 登录成功后写入签名 HttpOnly Cookie。
4. middleware 保护 `/admin/*`，但放行 `/admin/login`。
5. 登录失败返回统一错误，不暴露具体原因。
6. 增加基础登录限流，防止暴力尝试。

Cookie 设置：

- `httpOnly: true`
- 生产环境 `secure: true`
- `sameSite: 'lax'`
- 合理 `maxAge`，例如 8 小时

第一版推荐这个方案，因为后台只面向作者本人。

### 方案 B：`admin_users` 表

当需要多管理员、启停账号、密码轮换 UI 或操作日志时再使用。长期弹性更好，但第一版实现和运维复杂度更高。

## 内容发布流程

### Blog

1. 新建 draft。
2. 编辑 frontmatter 等价字段。
3. 编辑 Markdown 正文。
4. 保存 draft。
5. 预览渲染结果。
6. 发布。
7. published 后进入 `/blog`、`/blog/[slug]`、tags、series、sitemap、RSS、search 和 Agent Demo 公开检索。

### Projects

1. 新建 project。
2. 编辑 Markdown 和结构化字段。
3. 设置 `featured`、`published` 和展示顺序。
4. 发布后进入 `/projects`、`/projects/[slug]`、首页 featured projects、sitemap 和 Agent Demo 公开检索。

### Profile / Homepage

1. 编辑内容。
2. 保存。
3. 前台读取最新 visible 内容或刷新缓存。
4. 迁移数据库后，纯内容发布不需要 rebuild。

## 动态渲染与缓存策略

方案 A：SSR 动态读取数据库

- 优点：内容更新后立即生效。
- 缺点：每次请求可能查数据库，需要缓存。

方案 B：ISR / revalidate

- 优点：公开页面性能更好。
- 缺点：发布流程需要处理缓存刷新。

方案 C：后台发布后触发 cache invalidation

- 优点：兼顾性能和可控刷新。
- 缺点：需要接入 `revalidatePath` 或 `revalidateTag`。

第一版建议：

- 公开页面继续通过 Service 从数据库读取，并加合理缓存。
- 发布后触发 `revalidatePath` 或 `revalidateTag`。
- 如果第一版实现成本过高，可以先使用 dynamic rendering，后续再优化缓存。

迁移数据库后，内容发布不再需要 Docker rebuild。只有代码更新才需要重新部署。sitemap 和 RSS 应通过 Service 从数据库读取 published 内容生成。

## 外部博客目录导入方案

后续博客写作可以在 Next.js 项目外的目录或内容仓库中完成，后台支持从外部目录导入 Markdown，再保存到 PostgreSQL。

建议设计：

```text
ExternalBlogImporter
```

输入：

- directory path
- import mode:
  - `create_only`
  - `update_by_slug`
  - `create_or_update`
- status:
  - `keep`
  - `force_draft`
  - `force_published`

输出：

- imported count
- skipped count
- errors

规则：

- 导入前校验 frontmatter。
- 检测 slug 冲突。
- 允许作者选择覆盖或创建新 draft。
- 不要求导入后的文章继续保存在网站项目仓库。
- 支持将数据库文章导出为 Markdown，用于备份和二次整理。

本阶段只做设计，不实现 importer。

## Search / Tags / Series / Sitemap / RSS 适配

公开发现入口继续通过 Service 读取内容：

- `/blog` 和 `/blog/[slug]`：`BlogService`
- `/blog/tags`：published-only tags 方法
- `/blog/series`：published-only series 方法
- `/blog/search`：`BlogService` 返回的 published metadata
- `sitemap.xml`：published Blog / Project service 方法
- `rss.xml`：只包含 published Blog posts

DatabaseRepository 必须保持 published-only 过滤，draft 不进入公开页面、sitemap、RSS、search、tags、series 或 Agent Demo。

## Agent Demo 适配设计

Agent Demo 不直接查询 PostgreSQL，继续通过：

- `BlogService` 获取 published Blog 内容。
- `ProjectService` 获取 published Projects。
- `ProfileService` 获取 visible 的公开 Profile、Contact 和 System Stack。

规则：

- draft 内容不进入 Agent Demo。
- hidden Profile / Contact 不进入 Agent Demo。
- source excerpt 保持长度限制。
- 不扩大 Agent Demo 回答范围。
- 继续保持只读、公开内容边界。

## 安全边界

后台安全要求：

- `/admin/*` 必须登录。
- 管理员密码不能明文存储。
- `ADMIN_SESSION_SECRET` 不能提交。
- `.env.production` 不能提交。
- 后台不允许上传可执行文件。
- 后台不允许执行命令。
- 后台不允许访问任意服务器路径。
- Markdown 渲染需要处理 XSS。
- 保存前校验 slug。
- 用户可见字段必须有长度限制。
- 删除默认软删除。
- 生产数据库要备份。
- 后台页面不对搜索引擎开放。
- Admin routes 使用 `noindex` metadata 或 robots 保护。

## 部署与备份

服务器上已经存在 PostgreSQL，但个人网站不建议直接复用其他应用的业务库。

推荐生产方案：

- 为个人网站创建独立 PostgreSQL database。
- 创建独立 PostgreSQL user，只授予必要权限。
- 使用独立环境变量名，避免和其他应用冲突：

```text
PERSONAL_SITE_DATABASE_URL=
ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=
ADMIN_SESSION_SECRET=
CONTENT_SOURCE=database
```

如果当前部署环境完全独立，也可以使用 `DATABASE_URL`；但如果服务器已有 sub2api 等其他应用，推荐使用 `PERSONAL_SITE_DATABASE_URL`。

备份规则：

- 定期执行 `pg_dump`。
- 备份文件不提交 Git。
- 控制备份目录权限。
- 文档化恢复命令。
- 在非生产数据库先测试恢复流程。

## 后续实施阶段

### Phase 11.3：Database Schema & Repository Refactor Plan

- 设计并实现数据库 schema。
- 增加 DatabaseRepository。
- 保留 FileRepository fallback。
- 不做后台 UI。

### Phase 11.4：Admin Auth Foundation

- `/admin/login`
- session cookie
- middleware
- admin layout

### Phase 11.5：Blog Admin MVP

- Blog list
- create / edit draft
- publish / unpublish
- Markdown editor
- slug validation

### Phase 11.6：Homepage / Profile Admin

- Profile editor
- Contact editor
- System Stack editor
- Homepage sections editor

### Phase 11.7：Projects Admin

- Project list
- create / edit project
- featured / order / published controls

### Phase 11.8：Content Import / Export

- external blog directory import
- Markdown export
- JSON backup

### Phase 11.9：Backup & Deployment Hardening

- `pg_dump`
- rollback doc
- production checklist

### Phase 11.10：Phase 11 Final Review

- 完整 Admin / CMS 验收。
- 确认公开路由、sitemap、RSS、search、Agent Demo 和部署安全边界。

