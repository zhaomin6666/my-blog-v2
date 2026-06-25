# Admin 内容导入导出

Phase 11.8 新增受登录保护的后台 Markdown 导入 / 导出能力，用于把 Blog Posts 和
Projects 在 PostgreSQL 与 Markdown 文件之间转换。

## 能力范围

已支持：

- `/admin/content`
- 上传 `.md` 文件导入 Blog Posts 到 PostgreSQL `blog_posts`
- 上传 `.md` 文件导入 Projects 到 PostgreSQL `projects`
- dry-run 预览，不写数据库
- `create_only`、`update_by_slug`、`create_or_update` 三种正式导入模式
- slug 冲突检查
- frontmatter 校验
- 每个文件的导入结果报告
- 单篇 Markdown 导出
- active Blog Posts / Projects 批量 zip 导出

本阶段暂不支持：

- Profile / Contact / Stack 导入导出
- 本地迁移脚本
- zip 导入
- 文件夹上传
- 远程 URL 导入
- 图片下载或图片上传
- 媒体库
- 删除数据库记录
- 删除 `content/blog` 或 `content/projects`
- 自动切换 `CONTENT_SOURCE`

## 为什么走后台页面，而不是本地脚本

导入导出属于高风险内容操作。通过后台页面完成，可以在写入前看到 dry-run 报告、
显式确认 PostgreSQL 写入，并在同一个页面看到每个文件的处理结果。

Phase 11.8 不新增 `scripts/content/*.ts` 迁移脚本，也不新增 `pnpm content:*`
命令。

## 导入模式

- `dry-run`：只解析、校验、检查 slug 状态，不写数据库。
- `create_only`：只创建 active slug 不存在的内容；已存在则跳过。
- `update_by_slug`：只更新 active slug 已存在的内容；不存在则跳过。
- `create_or_update`：slug 存在则更新，不存在则创建。

非 dry-run 导入必须在 `/admin/content` 勾选确认框。每个文件独立处理，一个文件失败
不会影响其它有效文件继续处理。

## 上传限制

- 只接受 `.md` 文件。
- 单次最多 20 个文件。
- 单个文件最大 1MB。
- 上传文件只在内存中解析，不长期保存到磁盘。
- 文件名只用于报告展示；可信 slug 以 frontmatter 为准。

## Blog Frontmatter

Blog 导入字段映射：

- `title -> title`
- `slug -> slug`
- `summary -> summary`
- Markdown 正文 -> `content_markdown`
- `status -> status`，支持 `draft`、`published`、`archived`
- `lang -> lang`，支持 `zh`、`en`
- `date -> date`
- `tags -> tags`
- `series -> series`
- `seriesSlug -> series_slug`
- `seriesOrder -> series_order`
- `cover -> cover`
- `seoTitle -> seo_title`
- `seoDescription -> seo_description`

缺少 `status` 时默认 `draft` 并给出 warning。缺少或错误的 `lang` 默认 `zh` 并给出
warning。`tags` 推荐数组；逗号分隔字符串会兼容拆分并给出 warning。

`status=published` 时，`published_at` 优先使用 `date`，没有 date 时使用 `now()`。
draft 和 archived 不设置 `published_at`。

## Project Frontmatter

Project 导入字段映射：

- `title -> title`
- `slug -> slug`
- `subtitle -> subtitle`
- `summary -> summary`
- Markdown 正文 -> `content_markdown`
- `status -> status`
- `type -> type`
- `role -> role`
- `timeline -> timeline`
- `featured -> featured`
- `order -> display_order`
- `techStack -> tech_stack`
- `features -> features`
- `highlights -> highlights`
- `links -> links`
- `relatedPosts -> related_posts`
- `relatedSeriesSlug -> related_series_slug`
- `published -> published`
- `lang -> lang`
- `seoTitle -> seo_title`
- `seoDescription -> seo_description`

数组和对象字段会在写入前校验。缺少 `published` 默认 `false` 并给出 warning；
缺少 `featured` 默认 `false`。

## 导出

单篇导出路由：

- `/admin/content/export/blog/[id]`
- `/admin/content/export/projects/[id]`

批量 zip 导出路由：

- `/admin/content/export/blog`
- `/admin/content/export/projects`

批量导出支持 `scope=all`、`scope=published`、`scope=draft`。软删除记录不会导出。
单次批量导出最多 100 条记录。

## 安全边界

- 所有 `/admin/content*` 路由都受 Admin Auth 保护。
- Export route 下载前会重新校验 admin session。
- SQL 使用参数化查询。
- Markdown 只当作文本解析，不执行其中任何代码。
- 不访问 Markdown 中引用的外部 URL。
- 不下载图片，不上传图片。
- Admin 报告不暴露数据库连接串、环境变量或 stack trace。
- Import 不删除数据库记录，也不自动恢复软删除记录。
- Import 不修改 `CONTENT_SOURCE`、`BLOG_CONTENT_SOURCE` 或
  `PROJECT_CONTENT_SOURCE`。

## 常见问题

**导入后会立刻出现在公开页面吗？**

只有当 frontmatter 允许公开，并且对应内容源已经配置为 `database` 时，公开页面才会读取
这些数据库内容。

**会替换 `content/blog` 或 `content/projects` 吗？**

不会。文件型内容继续留在仓库中，file mode 仍然读取这些 Markdown 文件。

**可以导入 zip 吗？**

不可以。Phase 11.8 支持一次上传多个 `.md` 文件，但不支持 zip 导入。

**可以当作备份吗？**

后台可以导出 Markdown 或 zip。自动化 `pg_dump`、生产备份和回滚加固放到 Phase 11.9。
