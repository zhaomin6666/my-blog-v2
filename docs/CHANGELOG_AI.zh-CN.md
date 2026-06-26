# AI 变更记录中文摘要

### 2026-06-26 - Codex
**摘要：** 补充 Phase 13.1 中 Step 1～5 的具体产品化归档内容。

**范围：**
- 将实施计划中 Phase 13.1 的简短概括，扩展为 Step 1～5 的归档说明。
- 补充公开仓库定位与 README 基线。
- 补充环境变量与密钥安全基线。
- 补充示例内容与私有内容边界清理基线。
- 补充 Admin、数据库与内容源文档基线。
- 补充运行时 placeholder、fallback 与验证基线。

**范围守卫：**
- 未修改 runtime code、`content/**`、database migrations、README 文件或 package 依赖。
- 未新增独立 Phase 13 文档。
- Step 1～5 仅按产品化归档说明记录，没有补写无法确认的具体代码实现细节。

**验证：**
- `pnpm lint`
- `pnpm build`
- `pnpm security:admin`
- 按要求扫描公开文档敏感词，未发现命中。

### 2026-06-26 - Codex
**摘要：** 将 Phase 12 之后的 Step 1～8 产品化优化统一归档为 Phase 13，并规划 Phase 14 / Phase 15。

**范围：**
- 将之前 Step 1～8 的开源产品化收口统一归档为 `Phase 13：开源产品化收口`。
- 将 Step 6A～6B-5 的内容源边界清理记录从 Phase 6 附近移入 Phase 13。
- 新增 Phase 13.1～13.5，覆盖开源仓库基础清理、内容源边界收紧、公开文档脱敏、README / docs 信息架构整理和 Phase 13 最终确认。
- 新增 `Phase 14：开源首次使用体验与发布工具`，作为下一阶段计划。
- 新增 `Phase 15：运维与可配置能力增强`，作为后续增强阶段。
- 更新中文实施计划顶部当前状态，明确 Phase 1～12 已完成、Phase 13 已完成、Phase 14 为下一阶段、Phase 15 为后续增强。

**范围守卫：**
- 未修改 runtime code、`content/**`、database migrations、package 依赖、README 文件。
- 按用户要求，未新增独立 Phase 13 产品化收口文档。

**验证：**
- `pnpm lint`
- `pnpm build`
- `pnpm security:admin`
- 按要求扫描公开文档敏感词，未发现命中。

### 2026-06-26 - Codex
**摘要：** Phase 12 已完成，归档生产环境从 file 内容源切换到 PostgreSQL database mode 的完整过程。

**范围：**
- 生产 PostgreSQL 连接已完成，复用已有 Docker PostgreSQL 服务，并使用本项目专用数据库角色。
- 已手动执行生产 CMS migrations，执行范围到 `004_reset_system_stack_single_source.sql`。
- 已验证生产 PostgreSQL 中存在 8 张核心 CMS 表：`blog_posts`、`blog_series`、`projects`、`profile_pages`、`contact_channels`、`homepage_sections`、`system_stack_groups`、`system_stack_items`。
- Admin 数据库 smoke test 已完成，受保护的 Admin 页面可访问数据库，并通过 Blog 草稿写入验证 PostgreSQL 写入链路。
- 通过 `/admin/blog` 导入 Blog Markdown，切换 `BLOG_CONTENT_SOURCE=database`，并验证 `/blog`、文章详情、RSS、sitemap 和首页 Blog 区域。
- 通过 `/admin/projects` 导入 Projects Markdown，切换 `PROJECT_CONTENT_SOURCE=database`，并验证 `/projects`、项目详情、首页 Featured Projects 和 sitemap。
- 通过 Admin 录入并验证 Hero、Profile、Contact、Stack，切换 `PROFILE_CONTENT_SOURCE=database`，并验证首页 database-backed 渲染和 Agent Demo sources。
- 最终完成 `CONTENT_SOURCE=database` 全局切换，生产内容默认从 PostgreSQL 读取。
- 确认领域级内容源变量仍优先于 `CONTENT_SOURCE`，未配置领域级变量时会 fallback 到全局内容源。

**运维记录：**
- 本地 DBeaver 管理生产数据库时，建议通过 SSH Tunnel 连接生产主机，再连接 loopback PostgreSQL 端口；不要开放公网 `5432`。
- Blog、首页、sitemap、RSS 在内容源切换后可能出现缓存刷新时间不一致。
- 后续建议新增 Maintenance / Revalidate 后台页，避免为了触发缓存刷新而编辑内容。
- 运维 SQL 需要尊重表级可见性规则：`homepage_sections` 使用 `visible`，`profile_pages` 使用 key / lang 记录，只有 Contact / Stack 相关表使用 `deleted_at`。

**范围守卫：**
- 未提交真实 env、密钥、数据库 URL、生产 IP、密码或备份 dump。
- 未修改公开 UI、Agent Demo 回答范围、Console / CLI、窗口系统或已跟踪 Docker / Nginx 配置。

**验证：**
- 已在生产操作中验证 PostgreSQL 连通、migration、Admin 写入、Blog 数据库内容源、Projects 数据库内容源、Profile / Homepage 数据库内容源、全局 database mode、公开路由、sitemap、RSS 和回滚准备。
- 本轮本地文档变更验证待执行：`pnpm lint`。

### 2026-06-26 - Codex
**摘要：** Step 8 已完成，整理开源文档信息架构，并按当前 AI Native Portfolio CMS 定位重写 README。

**范围：**
- 重写 `README.md`，作为 GitHub 项目首页，说明 file/database 双模式、Admin CMS 路由、部署入口和文档分组。
- 新增 `README.zh-CN.md`，结构与英文 README 对齐，并优先链接中文文档。
- 新增 `docs/GETTING_STARTED.md` 和 `docs/GETTING_STARTED.zh-CN.md`，作为用户首次运行和部署决策入口。
- 收敛 `docs/DEPLOYMENT.md` 和 `docs/DEPLOYMENT.zh-CN.md`，覆盖 file mode、database mode、`NEXT_PUBLIC_SITE_URL`、Admin auth、PostgreSQL、Docker、Nginx 和生产检查。
- 收敛 `docs/CONTENT_WORKFLOW.md` 和 `docs/CONTENT_WORKFLOW.zh-CN.md`，保持为用户侧内容维护指南。
- 收敛 `docs/DATABASE_CONTENT_SOURCE.md` 和 `docs/DATABASE_CONTENT_SOURCE.zh-CN.md`，明确当前 database mode 覆盖范围、Admin 路由和数据表对应关系。
- 新增 `docs/README.md`，并刷新 `docs/README.zh-CN.md`，按用户文档和开发记录分组。

**修正的过时部署说明：**
- 第一层部署文档已匹配当前 `docker-compose.yml`：service 为 `personal-dev-os`，外部网络为 `web-proxy`，Nginx upstream 为 `http://personal-dev-os:3000`。
- 从用户部署文档移除冗长生产归档和 Agent Demo 观测 SQL，改为链接到高级 runbook。

**文档分层：**
- 用户与部署文档：README、Getting Started、Deployment、Content Workflow、Database Content Source、docs index。
- 开发记录：Implementation Plan、AI Changelog、Admin CMS Design、Admin Content Transfer、Production CMS Deployment、Production CMS Switch Checklist、Agent Demo Architecture、Development Rules、Admin Security Audit、PostgreSQL Backup / Restore。

**范围守卫：**
- 未修改 runtime code、`content/**`、database migrations 或 package 依赖。

**验证：**
- 本轮最终检查待执行：`pnpm lint`、`pnpm build`、`pnpm security:admin` 和 docs 关键词扫描。

### 2026-06-25 - Codex
**摘要：** Phase 12 已开始，Phase 12.1 Production CMS Preflight 已完成，新增生产 CMS 切换执行清单。

**Phase 12.1 范围：**
- 新增 `docs/PRODUCTION_CMS_SWITCH_CHECKLIST.md`。
- 新增 `docs/PRODUCTION_CMS_SWITCH_CHECKLIST.zh-CN.md`。
- 文档化当前生产状态检查：file mode、公开路由、Docker、Nginx 和 HTTPS。
- 文档化生产环境变量要求：PostgreSQL、Admin auth，以及显式 file-mode 内容源。
- 文档化 PostgreSQL 准备、备份目录、migration 准备、Admin 功能准备、Nginx 上传限制、切换顺序、回滚策略和 Go / No-Go 判断。
- 更新生产 CMS 部署 runbook，补充 checklist 链接、Phase 12 切换顺序、先 file mode 部署再分领域切换，以及回滚说明。
- 更新 `.env.example`，让 `BLOG_CONTENT_SOURCE`、`PROJECT_CONTENT_SOURCE`、`PROFILE_CONTENT_SOURCE` 显式默认到 `file`。

**状态说明：**
- Phase 11.10 已完成，Phase 11 继续归档为 completed。
- Phase 12 已进入 in progress。
- 未执行生产内容源切换。
- 未执行生产 migration。
- 未导入真实生产内容。

**范围守卫：**
- 未修改公开页面 UI。
- 未修改 Agent Demo 回答范围。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改已跟踪 Docker / Nginx 部署配置。
- 未提交真实 env、密钥、数据库连接串或备份 dump 文件。

**验证：**
- `pnpm test`
- `pnpm lint`
- `pnpm build`

### 2026-06-25 - Codex
**摘要：** Phase 11.10 已完成，结束 Phase 11 Admin / CMS 最终验收，并将 Phase 11 归档为已完成。

**最终验收覆盖：**
- 回归 Admin Auth，确认未登录访问 `/admin`、Blog Admin、Projects Admin 和 Markdown export 路由会跳转到 `/admin/login`。
- 确认 Blog Admin、Projects Admin、Hero Admin、Profile Admin、Contact Admin 和 Stack Admin 均进入生产构建。
- 确认 Markdown Import / Export 仍只位于 Blog / Projects Admin，并受 Admin Auth 保护。
- 确认 Blog soft delete 仍基于 `deleted_at`，并从公开 Blog、sitemap、RSS、tags、series、search 和 Markdown export 范围中排除。
- 确认 file mode 在清空 `PERSONAL_SITE_DATABASE_URL` 后可构建。
- 确认 database mode 在本地 PostgreSQL 配置和 database 内容源开启后可构建。
- 确认 Agent Demo sources 仍限制在公开 Profile、Stack、published Projects、published Blog 和 Personal Developer OS 实施说明。
- 确认 sitemap / RSS / robots 运行时 smoke check 通过，并保持 public-only 边界。
- 确认 docs / env / deployment checklist 已覆盖 `.env.example`、数据库内容源文档、Admin 内容导入导出文档、生产 CMS 部署文档、PostgreSQL 备份恢复文档和部署文档。

**验证：**
- `pnpm test`
- `pnpm lint`
- `pnpm build`
- 清空数据库 URL 的 file-mode `pnpm build`
- database-mode `pnpm build`
- standalone 路由 smoke check：`/`、`/admin/login`、`/blog`、`/projects`、`/agent-demo`、`/sitemap.xml`、`/rss.xml`、`/robots.txt`
- 未登录 Admin redirect smoke check

**范围守卫：**
- 未新增功能。
- 未修改公开 UI、Agent Demo 回答范围、Console / CLI、窗口系统、内容迁移、Docker 或已跟踪 Nginx 配置。

### 2026-06-25 - Codex
**摘要：** Phase 11.9 已完成，补齐 CMS 备份、恢复、生产部署、Admin env 和导入导出限制加固。

**Phase 11.9 范围：**
- 新增 `docs/PRODUCTION_CMS_DEPLOYMENT.md` 和 `docs/PRODUCTION_CMS_DEPLOYMENT.zh-CN.md`。
- 新增 `docs/POSTGRES_BACKUP_RESTORE.md` 和 `docs/POSTGRES_BACKUP_RESTORE.zh-CN.md`。
- 文档化宿主机 / 外部 PostgreSQL 与 Docker PostgreSQL 的 `pg_dump` 备份。
- 文档化恢复到测试库，以及谨慎恢复到生产库的 `pg_restore` 流程。
- 文档化 migration 规范：数字顺序命名、只追加不改旧 migration、执行前备份、手动执行、不让 build 依赖数据库、不在应用启动时自动执行。
- 文档化 file mode -> database mode 生产切换、分领域逐步切换，以及 database mode -> file mode 回滚。
- 新增 Admin env 安全检查：`ADMIN_USERNAME`、`ADMIN_PASSWORD_HASH`、`ADMIN_SESSION_SECRET` 必填，session secret 至少 32 字符，拒绝占位值和常见默认密码 hash。
- 新增安全 database health-check helper，只返回状态，不暴露数据库 URL 或用户名。
- 集中 Admin Markdown 限制命名，并文档化只允许 `.md`、单次 20 个文件、单文件 1MB、不支持 zip / URL / 图片导入，以及批量导出 100 条限制。
- 批量 Markdown zip 导出在匹配 active rows 超过 100 条时明确失败，不再静默返回部分 zip。
- 文档化 Admin Markdown Import 出现 413 时的 Nginx `client_max_body_size 2m` 处理。
- `.env.example` 仅补充 Admin 占位值。

**范围守卫：**
- 未新增后台业务模块。
- 未新增自动备份任务、migration runner 或生产 `CONTENT_SOURCE` 自动切换。
- 未修改公开页面 UI。
- 未修改 Agent Demo 回答范围、Console / CLI、窗口系统、Docker 或已跟踪 Nginx 部署配置。
- 未提交真实 env、密钥、数据库连接串或备份 dump 文件。

**验证：**
- 新增 Admin env check、database health-check、导入文件数 / 文件大小限制、批量导出记录数限制的聚焦测试。
- `pnpm test`、`pnpm lint` 和 `pnpm build` 是本阶段最终验收命令。

### 2026-06-25 - Codex
**摘要：** 新增 Blog Admin soft delete，并优化 `/admin/blog` 行操作区。

**修复范围：**
- `/admin/blog` 数据库文章列表新增行级 Delete。
- Delete 使用 `blog_posts.deleted_at` 做 soft delete，不做 hard delete。
- 删除前使用浏览器二次确认，Server Action 内部再次校验 Admin session。
- 删除后的文章会从普通 Blog Admin 列表消失。
- 公开 database Blog 读取已经要求 `deleted_at is null`，因此已删除的 published 文章不会进入 `/blog`、RSS、sitemap、tags、series 或 search。
- 删除后 revalidate Admin Blog、公开 Blog、search、tags、series、sitemap、RSS 和对应文章 slug。
- `/admin/blog` 行操作区改为可换行按钮布局，Delete 使用危险操作样式，与 Edit / Export 区分。

**范围守卫：**
- 未修改、删除或迁移 `content/blog` 文件。
- 未新增 hard delete、回收站、恢复功能或批量删除。
- 未给 Projects Admin 新增删除能力。
- 未修改 import/export 核心 service 行为。
- 未修改公开 Blog UI、Agent Demo、Console / CLI、窗口系统、Docker 或 Nginx 部署配置。

**验证：**
- Blog Admin soft delete、SQL 形态、action 鉴权 / revalidate、公开 repository 排除 deleted rows 的定向 Vitest 已通过。
- `pnpm test`、`pnpm lint` 和 `pnpm build` 是本阶段最终验收命令。

### 2026-06-25 - Codex
**摘要：** Phase 11.8-fix 已完成，使用方案 B 移除 `/admin/content` 访问，并把 Markdown 导入导出移动到 Blog / Projects Admin。

**调整范围：**
- Blog Markdown 导入导出入口移动到 `/admin/blog`。
- Project Markdown 导入导出入口移动到 `/admin/projects`。
- 删除独立 `/admin/content` 页面和旧 `/admin/content/export/*` route handler。
- 新增 `/admin/blog/export*` 和 `/admin/projects/export*` 替代导出 route。
- 移除 Admin 导航和 Dashboard 中指向 `/admin/content` 的入口。
- 继续复用 `lib/admin/content-transfer` service，导入导出核心行为不变。
- 导入 UI 不再显示 Content Type 选择；Blog / Project 页面各自固定内容类型。

**边界：**
- 未删除或迁移 `content/blog`、`content/projects`。
- 未自动切换 `CONTENT_SOURCE`。
- 未修改公开 Blog / Projects 内容源读取逻辑。
- 未修改 Agent Demo、Console / CLI、窗口系统、Docker 或 Nginx 部署配置。

**验证：**
- `pnpm test`
- `pnpm lint`
- `pnpm build`

### 2026-06-25 - Codex
**摘要：** Phase 11.8 已完成，新增后台 Markdown 导入导出能力。

**Phase 11.8 范围：**
- 新增受登录保护的 `/admin/content`。
- 支持上传 Markdown 导入 Blog Posts 到 PostgreSQL `blog_posts`。
- 支持上传 Markdown 导入 Projects 到 PostgreSQL `projects`。
- 默认导入模式为 `dry-run`，只解析、校验和预览，不写数据库。
- 支持正式导入模式：`create_only`、`update_by_slug`、`create_or_update`。
- 非 dry-run 导入必须在 Admin UI 显式确认。
- 新增上传限制：只允许 `.md`，单次最多 20 个文件，单文件最大 1MB。
- 新增 Blog frontmatter 校验、slug 检查和字段映射。
- 新增 Project frontmatter 校验、slug 检查和字段映射。
- 新增逐文件导入报告，包含 summary、warnings 和 errors。
- 新增 Blog / Projects 单篇 Markdown 导出。
- 新增 Blog / Projects active rows 批量 zip 导出。
- 新增 `lib/admin/content-transfer` 服务层和聚焦单元测试。
- 新增 `docs/ADMIN_CONTENT_TRANSFER.md` 和 `docs/ADMIN_CONTENT_TRANSFER.zh-CN.md`。

**范围边界：**
- 未新增本地迁移脚本。
- 未新增 `pnpm content:*` 命令。
- 未删除、迁移或覆盖 `content/blog` 和 `content/projects`。
- 未自动切换 `CONTENT_SOURCE`。
- 未新增 Profile / Contact / Stack 导入导出。
- 未修改 Agent Demo 回答范围。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改 Docker / Nginx 部署配置。

**验证：**
- 新增 frontmatter 校验、文件名安全、导入模式、dry-run 行为和 Markdown 导出测试。
- `pnpm vitest run lib/admin/content-transfer` 通过。
- `pnpm lint` 通过。
- `pnpm test` 和 `pnpm build` 是本阶段最终发布检查。

### 2026-06-24 - Codex
**摘要：** Phase 11.7 已完成，新增 PostgreSQL-backed Projects Admin MVP。

**Phase 11.7 范围：**
- 新增 `/admin/projects`、`/admin/projects/new`、`/admin/projects/[id]`。
- 新增 Project Admin service、repository、validation、Server Actions、列表页、新建页、编辑页和后台表单。
- Projects Admin 写入 PostgreSQL `projects`。
- 支持列表、搜索、published / featured / language 筛选、empty state、新建、编辑、保存、发布和下架。
- 支持字段：title、slug、subtitle、summary、status、type、timeline、language、published、featured、display order、Markdown content、role、tech stack、features、highlights、links、related posts、related series slug、SEO title、SEO description。
- JSON 字段使用普通 textarea 编辑并在写入前校验；Markdown content 使用普通 textarea。
- 新增 slug 格式校验和 active database project slug 唯一校验。
- database mode 下公开 Projects 继续通过 `ProjectService` / `DatabaseProjectRepository` 读取，`/projects`、`/projects/[slug]`、sitemap 和 Agent Demo project retrieval 都保持 published-only。
- database mode 下首页 Featured Projects 要求 `published=true`、`featured=true` 且 `deleted_at is null`。
- `/projects/[slug]` 允许动态参数，后台新发布的 database project 保存后可以访问详情页。
- file mode 保持不变，继续读取 `content/projects`。

**范围边界：**
- 未新增 Content Import / Export。
- 未迁移、删除、覆盖或导入 `content/projects`。
- 未修改 Agent Demo 回答范围。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改 Docker / Nginx 部署配置。

**验证：**
- 新增 Project Admin service、Project Admin validation 和 project database mapper 聚焦测试。
- `pnpm test`、`pnpm lint`、`pnpm build` 是本阶段发布检查。
### 2026-06-23 - Codex
**摘要：** Phase 11.6 已完成，新增 Homepage / Profile Admin MVP，支持 PostgreSQL 管理公开首页与个人资料相关内容。

**Phase 11.6 范围：**
- 新增 `/admin/homepage`、`/admin/profile`、`/admin/contact`、`/admin/stack`。
- 新增 `lib/admin` 下的 Profile Admin service、repository、validation 和测试。
- Homepage Admin 写入 `homepage_sections`。
- Profile Admin 写入 `profile_pages key='profile'`。
- Contact Admin 写入 `contact_channels`，支持 visible、display order、lang 和软删除。
- Stack Admin 写入 `system_stack_groups` 和 `system_stack_items`，支持 display order 和软删除。
- 新增轻量 `HomepageService`，database mode 下读取 visible homepage sections。
- database mode 下公开首页可以读取后台保存的 `hero` / `overview` 内容，并映射到 Main App Hero。
- database mode 下公开 Profile、Contact、Stack 继续通过 `ProfileService` 读取。
- file mode 保持不变，继续读取 `content/profile`。

**范围边界：**
- 未实现 Projects Admin。
- 未实现 Content Import / Export。
- 未迁移、删除、覆盖或导入 `content/profile`。
- 未修改 Agent Demo 回答范围。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改 Docker / Nginx 部署配置。

**验证：**
- 新增 Profile Admin validation、service、homepage database/file mode 等聚焦测试。
- `pnpm test` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。

### 2026-06-23 - Codex
**摘要：** Phase 11.5 已完成，新增 PostgreSQL `blog_posts` 的 Blog Admin MVP。

**Phase 11.4 / 11.5 范围：**
- 因当前工作区尚未包含 Phase 11.4 运行时代码，本次补齐最小 Admin Auth foundation。
- 新增 `/admin/login`、`/admin`、middleware 保护 `/admin/*`、签名 HttpOnly admin session cookie、环境变量管理员账号、基础登录限流和 Admin `noindex`。
- 新增 `/admin/blog`、`/admin/blog/new`、`/admin/blog/[id]`。
- 新增 `lib/admin` 下的 Blog Admin service、repository、validation，以及 `app/admin/blog` 下的 Server Actions。
- Blog Admin 写入 PostgreSQL `blog_posts`。
- 支持列表、empty state、搜索、status / language 筛选、新建、编辑、保存 draft、发布、下架和 Markdown textarea 编辑。
- 支持字段：title、slug、summary、status、lang、date、tags、series、series slug、series order、cover、SEO title、SEO description、Markdown content。
- 新增 slug 格式校验和 active posts 唯一校验。
- 保存、发布、下架会 revalidate Blog、Search、Tags、Series、sitemap、RSS，以及可确定的文章路径。

**数据源边界：**
- 公开 Blog 只有在 `BLOG_CONTENT_SOURCE=database` 或 `CONTENT_SOURCE=database` 时读取 database posts。
- 默认 file 内容源保持不变。
- 未迁移、删除、导入或覆盖 `content/blog` 文件。
- 未修改 Agent Demo 范围、Console / CLI、窗口系统、Docker 或 Nginx 配置。

**验证：**
- 新增 Blog Admin service、validation 和公开 DatabaseBlogRepository 可见性边界测试。
- `pnpm test`、`pnpm lint`、`pnpm build` 是本阶段发布检查。

### 2026-06-22 - Codex
**摘要：** Phase 11.3-fix 已完成，database 内容源可安全处理空表。

**修复范围：**
- 修复 database 模式缺少 Profile 内容时首页构建失败的问题。
- 仅为 database 模式新增集中定义的空 Profile、Contact Channels、System Stack 和 `PublicProfile`。
- 首页内容模块和公开 Projects 列表新增轻量 empty state。
- Blog、标签、系列、RSS、sitemap 和 Projects 空集合可安全处理。
- database 模式不会自动 fallback 到 file 内容。
- 配置、连接、表、SQL 和 schema 错误仍会明确抛出。
- file 模式保留严格校验，并继续完全不依赖 PostgreSQL。
- 新增空内容与异常边界的 Service / config 测试。

**验证：**
- `pnpm test`：16 个测试文件、65 个测试通过；1 个既有 live test 跳过。
- `pnpm lint` 通过。
- file 模式在数据库地址无效时 `pnpm build` 通过。
- 本地 PostgreSQL 18.1 database 空表 smoke build 通过。
- migration 执行成功，并确认 Blog、Projects、Profile 表均为空。

**范围约束：**
- 未新增 Admin UI 或 `/admin` 路由。
- 未迁移真实内容。
- 未修改部署、Nginx、Agent Demo 范围、Console / CLI 或窗口系统。

### 2026-06-21 - Codex
**摘要：** Phase 11.3 已完成，新增数据库内容源基础。

**Phase 11.3 范围：**
- 新增 PostgreSQL CMS schema migration：`database/migrations/001_create_cms_tables.sql`。
- 新增 Blog Posts、Blog Series、Projects、Profile Pages、Contact Channels、System Stack、Homepage Sections 等 MVP 表。
- 新增常用公开查询索引和 `updated_at` trigger。
- 新增 `lib/db` PostgreSQL 访问基础。
- 新增 Blog / Projects / Profile 的只读 DatabaseRepository。
- 新增数据库 row 到领域模型 mapper，并补充 mapper / 内容源选择测试。
- 新增 `lib/content` Repository factory 和内容源环境变量选择。
- `BlogService`、`ProjectService`、`ProfileService` 已通过 factory 获取 repository。
- `.env.example` 新增数据库内容源相关环境变量。
- 新增 `docs/DATABASE_CONTENT_SOURCE.md` 和 `docs/DATABASE_CONTENT_SOURCE.zh-CN.md`。
- 更新 Admin / CMS 设计文档和实施计划。

**范围约束：**
- 默认内容源仍为 `file`。
- 文件模式不依赖 PostgreSQL。
- 未新增 Admin UI、`/admin` 路由或登录页。
- 未迁移、移动、删除或覆盖真实内容。
- `content/blog`、`content/projects`、`content/profile` 保持不变。
- 未修改 Agent Demo 范围、Console / CLI、窗口系统、Docker 或 Nginx。

**验证：**
- `pnpm test` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。

### 2026-06-21 - Codex
**摘要：** Phase 11.2 已完成，新增后台管理与 CMS 架构设计文档。

**Phase 11.2 范围：**
- 新增 `docs/ADMIN_CMS_DESIGN.md` 和 `docs/ADMIN_CMS_DESIGN.zh-CN.md`。
- 明确内容将从文件型内容源逐步迁移到 PostgreSQL。
- 明确第一版后台管理范围：Blog Posts、Blog Series、Projects、Profile、Contact Channels、System Stack、Homepage Content。
- 设计 PostgreSQL 内容模型草案，并区分 MVP 必需表和后续增强表。
- 设计 Repository 从 FileRepository 到 DatabaseRepository 的迁移方式，同时保持 Service 边界稳定。
- 设计后台登录、安全、发布、导入导出、外部博客目录、备份、部署和回滚边界。
- 明确 Agent Demo 继续通过 BlogService / ProjectService / ProfileService 读取公开内容，不扩大回答范围。
- 更新 Phase 11 计划，将 Phase 11.3 到 Phase 11.10 拆分为后续 Admin / CMS 实施阶段。

**范围约束：**
- 未实现后台代码。
- 未新增数据库表或迁移脚本。
- 未迁移、移动或删除内容。
- 未修改 Blog / Projects / Profile 核心逻辑。
- 未修改 Agent Demo 逻辑、Console / CLI、窗口系统或已跟踪部署配置。

**验证：**
- `pnpm lint` 通过。
- `pnpm build` 在通过 `pnpm install` 同步已声明依赖后通过。

### 2026-06-15 - Codex
**摘要：** Phase 10.7 已完成，第一版公开 Agent Demo 完成最终验收与文档收口。

**Phase 10.7 范围：**
- 完成 `/agent-demo` 和 `POST /api/agent-demo` 的第一版最终验收。
- 新增 `docs/AGENT_DEMO_ARCHITECTURE.zh-CN.md`，作为中文架构说明。
- 更新英文架构文档，标记 Phase 10.6 / 10.7 完成，并补充最终验收标准。
- 更新 Agent Demo README，记录 Phase 10.6 / 10.7，并移除过期 deferred work。
- 更新中英文实施计划，将 Phase 10 标记为已完成。
- 更新 README 和中文 docs 入口，补充 Agent Demo 架构文档链接。
- 扩展中文部署手册，补充 Agent Demo 模型环境变量、生产日志级别、Nginx 限流、线上验证命令和安全日志检查。
- 复核第一版公开 Demo 仍保持只读边界，只回答公开 Profile、技术栈、已发布 Projects、已发布 Blog、AI Agent 学习路线和 Personal Developer OS 实现相关问题。

**验收结论：**
- `/agent-demo` 是公开交互 UI。
- `POST /api/agent-demo` 返回稳定的 scoped Agent Demo response 结构。
- 私密数据、密钥、服务器内部、危险操作和高风险建议会在模型生成前拒答。
- trace 和 public sources 是 API / UI 契约的一部分。
- sitemap 包含 `/agent-demo`，RSS 仍只包含博客文章。
- live model test 仍通过 `AGENT_DEMO_RUN_LIVE_TEST=true` 显式开启。

**范围约束：**
- 未修改 Agent Demo 运行时行为。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改 Docker / Nginx 已跟踪配置文件。

**验证：**
- `pnpm test` 通过。

### 2026-06-21 - Codex
**摘要：** Phase 11.1 已验收通过，完成文档验收归档并准备提交当前版本。

**验收范围：**
- 记录用户对 Phase 11.1 Agent Demo 观测与反馈功能的验收结论。
- 确认当前基线保留隐私安全的最小化事件、UUID `requestId`、PostgreSQL 反馈存储和按钮式反馈闭环。
- 范围边界不变：未扩大 Agent 回答范围，未新增写工具，未修改 Console / CLI，未修改窗口系统，未修改已跟踪 Docker / Nginx 配置。

**验证：**
- `pnpm test`、`pnpm lint`、`pnpm build` 作为本次验收提交的发布检查。
- `pnpm lint` 通过。
- `pnpm build` 通过。

### 2026-06-15 - Codex
**摘要：** Phase 10.6 已完成，补充 Agent Demo 生产部署与安全验证指南。

**Phase 10.6 范围：**
- 在 `docs/DEPLOYMENT.md` 中补充 Agent Demo 生产环境变量配置说明。
- 记录模型 API URL、API key、模型名、超时、应用层限流、日志级别和 live-test flag 的生产建议。
- 记录生产日志级别建议：默认 `info`，短时间排查用 `debug`，稳定后如日志过多可用 `silent`。
- 补充 Nginx `limit_req_zone` 和 `/api/agent-demo` `limit_req` 示例。
- 补充线上验证命令：安全公开问题和 secret 类问题拒答。
- 补充 `[agent-demo]` requestId 和安全摘要日志检查说明。
- 在架构文档中补充 Agent Demo 生产安全验证说明。
- 更新中英文实施计划，将 Phase 10.6 标记为已完成。

**范围约束：**
- 未修改运行时代码。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改 Docker / Nginx 已跟踪配置文件。

**验证：**
- `pnpm test` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。

### 2026-06-15 - Codex
**摘要：** 为 Agent Demo 新增安全诊断日志，用于排查上游模型超时。

**范围：**
- 新增 `features/agent-demo/agentDemoLogger.ts`，支持 `info`、`debug`、`silent` 日志级别。
- 在 Agent Demo route 层新增服务端请求生命周期日志。
- 在 service 层新增输入校验、限流检查、scope 分类、context 检索、模型失败和完成日志。
- 在 model client 层新增配置缺失、请求开始、上游状态失败、空响应、成功、超时和未知 fetch 错误日志。
- 在 route、service 和 model client 之间传递 `requestId`。
- 在 `.env.example` 新增 `AGENT_DEMO_LOG_LEVEL` 和 `AGENT_DEMO_RUN_LIVE_TEST`。
- live model test 改为通过 `AGENT_DEMO_RUN_LIVE_TEST=true` 显式开启，避免常规单元测试被外部模型延迟阻塞。
- 在 Agent Demo README 和架构文档中补充诊断日志说明。

**安全约束：**
- 日志不会输出 API key、完整 prompt、完整检索 context、完整模型回答、上游原始响应体、私有环境变量值或服务器路径。

**验证：**
- `pnpm test` 通过，live model test 默认跳过。
- `pnpm lint` 通过。
- `pnpm build` 通过。

### 2026-06-15 - Codex
**摘要：** Phase 10.5 已完成，新增公开 Agent Demo UI 和 trace 展示。

**Phase 10.5 范围：**
- 新增 `/agent-demo` 公开交互页面。
- 基于现有 Project layout 实现 OS 风格工具界面。
- 新增问题输入、字数计数、提交按钮和示例问题。
- 新增 loading、网络错误、模型错误和限流状态。
- 新增 answer、trace steps 和 public sources 展示。
- 新增 public read-only scope notice。
- 将 `/agent-demo` 加入 sitemap。
- 在 AI Agent Demo 项目 frontmatter 中增加 `/agent-demo` 入口。
- UI 只导入 client-safe 的 Agent Demo types / config，避免把 server-only 知识工具打进浏览器包。

**范围约束：**
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改 Docker / Nginx 部署文件。

**验证：**
- `pnpm test` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。
- 本轮隐藏 dev-server smoke check 在当前 shell session 未连接成功；build 验证已确认 `/agent-demo` 生成。

### 2026-06-15 - Codex
**摘要：** Phase 10.4 已完成，为 Agent Demo 新增限流、超时和滥用防护。

**Phase 10.4 范围：**
- 为 `POST /api/agent-demo` 新增进程内 fixed-window 限流。
- 新增基于常见代理请求头的客户端标识识别。
- 超过限流窗口时返回 `429`，并带上 `Retry-After`。
- 新增可选防护环境变量：`AGENT_DEMO_MODEL_TIMEOUT_MS`、`AGENT_DEMO_RATE_LIMIT_WINDOW_MS`、`AGENT_DEMO_RATE_LIMIT_MAX_REQUESTS`。
- 通过 `AbortController` 为模型请求增加超时控制。
- 新增安全的 `upstream_timeout` 处理。
- 新增 context 和输出长度截断，保留已有输入长度和 sources 数量限制。
- 扩展 `usage`，返回输出长度和限流元数据。
- 新增测试覆盖限流、service 短路、模型超时、输出截断和 context 截断。

**范围约束：**
- Redis 分布式限流仍保留为多实例生产环境后的后续选项。
- 未新增 `/agent-demo` UI。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改 Docker / Nginx 部署文件。

**验证：**
- Agent Demo 聚焦测试已通过：`pnpm vitest run features/agent-demo`。
- `pnpm test` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。

### 2026-06-15 - Codex
**摘要：** Phase 10.3 已完成，新增只读 Agent API MVP。

**Phase 10.3 范围：**
- 新增 `POST /api/agent-demo`。
- 新增 server-only OpenAI-compatible Chat Completions model adapter，使用原生 `fetch` 调用。
- 在 `.env.example` 新增服务端环境变量：`AGENT_DEMO_MODEL_API_URL`、`AGENT_DEMO_MODEL_API_KEY` 和 `AGENT_DEMO_MODEL`。
- 将 `agentDemoService` 升级为输入校验、scope 分类、公开检索和模型生成的共享 pipeline。
- blocked scope 会在检索和模型生成前安全拒答。
- 新增 no-context 和 model-error 的安全响应。
- 新增 service-level 单元测试，覆盖校验失败、blocked scope、生成成功和模型不可用。
- 更新 Agent Demo README、架构文档和中英文实施计划。

**范围约束：**
- 未新增 `/agent-demo` UI。
- 未接入 Redis。
- 未新增持久限流，Phase 10.4 继续负责限流与超时保护。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改 Docker / Nginx 部署文件。

**验证：**
- `pnpm test` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。

### 2026-06-15 - Codex
**摘要：** Phase 10.2.1 已完成，新增 AI Agent Demo 单元测试基础。

**Phase 10.2.1 范围：**
- 新增 Vitest 作为轻量单元测试工具。
- 在 `package.json` 新增 `test` 和 `test:watch` scripts。
- 新增 `vitest.config.ts`，复用现有 `@` 路径别名，并使用 Node test environment。
- 新增 Agent Demo 输入校验测试。
- 新增规则型 scope 分类测试。
- 新增文本工具函数测试。
- 新增公开知识检索测试，覆盖检索路由、blocked scope 行为、trace 状态和 source 去重。
- 更新中英文实施计划，将 Phase 10.2.1 标记为 completed，Phase 10.3 仍保持 planned。

**范围约束：**
- 未接入真实模型。
- 未新增 `/api/agent-demo` route。
- 未新增 `/agent-demo` UI。
- 未接入 Redis。
- 未修改 Blog / Projects / Profile 核心服务行为。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改 Docker / Nginx / 部署配置。

**验证：**
- `pnpm test` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。

### 2026-06-15 - Codex
**摘要：** Phase 10.2 已完成，新增 AI Agent Demo 只读知识工具和范围识别器。

**Phase 10.2 范围：**
- 新增 `features/agent-demo/tools`。
- 新增基于 `BlogService` published-only 方法的 Blog 只读工具：
  - `searchBlogPosts(query)`
  - `getBlogPostBySlug(slug)`
  - `getRecentBlogPosts(limit)`
- 新增基于 `ProjectService` published-only 方法的 Project 只读工具：
  - `searchProjects(query)`
  - `getProjectBySlug(slug)`
  - `getPublishedProjectSummaries(limit)`
- 新增基于 `ProfileService` public 方法的 Profile 只读工具：
  - `getPublicProfile(locale)`
  - `getSystemStack(locale)`
  - `getPublicContact(locale)`
- 新增规则型 `scopeClassifier`，支持 allowed / blocked categories。
- 新增 `publicKnowledgeRetriever`，根据允许范围调用公开工具，并返回受限 `contextText`、公开 `sources` 和 trace 更新。
- 扩展 Agent Demo 类型：`AgentKnowledgeItem` 和 `AgentKnowledgeRetrieverResult`。
- 更新 Agent Demo 架构文档和 README。
- 更新实施计划，将 Phase 10.2 标记为 completed，Phase 10.3 标记为 planned。

**范围约束：**
- 未接入真实模型。
- 未新增 `/api/agent-demo` route。
- 未新增 `/agent-demo` UI。
- 未接入 Redis。
- 未修改 Blog / Projects / Profile 核心服务行为。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改 Docker / Nginx / 部署配置。

**验证：**
- `pnpm lint` 通过。
- `pnpm build` 通过。
### 2026-06-15 - Codex
**摘要：** Phase 10.1 已完成，新增 AI Agent Demo 架构与安全基础。

**Phase 10.1 范围：**
- 新增隔离目录 `features/agent-demo`。
- 新增 request / response / trace / source / usage / validation / scope 类型。
- 新增 locales、输入长度、sources 数量、trace steps、公开项目 slug 和 scope categories 配置。
- 新增 `question` / `locale` 输入校验工具。
- 新增 trace 构建工具，覆盖 `input_validation`、`rate_limit_check`、`scope_check`、`retrieve_context`、`generate_answer`。
- 新增只读公开内容边界相关 safety policy。
- 新增 allowed / blocked categories 相关 scope policy。
- 新增 foundation-only service response，为后续 API route 接入预留契约。
- 新增 `docs/AGENT_DEMO_ARCHITECTURE.md`，记录第一版目标、公开范围、禁止范围、API 契约、安全边界、工具权限、限流策略、trace / sources 契约和后续阶段。
- 更新 `docs/IMPLEMENTATION_PLAN.md` 和 `docs/IMPLEMENTATION_PLAN.zh-CN.md`，将 Phase 10 标记为 in progress，Phase 10.1 标记为 completed，Phase 10.2 到 Phase 10.7 标记为 planned。

**范围约束：**
- 未接入真实模型。
- 未接入 Redis。
- 未新增 `/api/agent-demo` route。
- 未新增 `/agent-demo` UI。
- 未修改 Blog / Projects / Profile 核心逻辑。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改 Docker / Nginx / 部署配置。

**验证：**
- `pnpm lint` 通过。
- `pnpm build` 通过。
本文件是 `docs/CHANGELOG_AI.md` 的中文摘要版，用于快速了解项目历史和当前状态。完整逐条归档仍以 `docs/CHANGELOG_AI.md` 为准。

### 2026-06-13 - Codex
**摘要：** Phase 9.5 完成，完成 Phase 9 Blog UX Final Polish 最终验收与收口。

**Phase 9.5 验收范围：**
- 完整检查 Phase 9 的 Blog 发现与阅读体验：
  - `/blog`
  - `/blog/search`
  - `/blog/tags`
  - `/blog/tags/[tagSlug]`
  - `/blog/series`
  - `/blog/series/personal-developer-os`
  - `/blog/why-rebuild-my-personal-blog`
- 确认 Blog 列表、Tag Pages、Series Pages、Article TOC、Previous / Next Navigation 和 Blog Search 之间保持一致。
- 确认 sitemap / RSS / robots 正常：
  - `sitemap.xml` 包含 Blog、Search、Tags、Series、已发布文章、Projects 和已发布项目页。
  - `rss.xml` 仍然只包含已发布博客文章。
  - `robots.txt` 指向 sitemap。
- 确认 draft posts 不进入公开 Blog 页面、标签页、搜索、sitemap、RSS 或 static params。
- 确认 light / dark、macos / vercel、zh / en 和 mobile 响应式仍通过既有 settings 与 style tokens 支持。
- 更新 `docs/IMPLEMENTATION_PLAN.md`，将 Phase 9 和 Phase 9.5 标记为 completed。
- 新增下一阶段 planned：`Phase 10: AI Agent Demo Integration`，仅标记 planned，不展开实现细节。

**小修：**
- 将文章详情页 inline TOC 的隐藏断点从 `lg:hidden` 调整为 `xl:hidden`，让 in-flow TOC 保持显示直到 fixed floating TOC 出现。
- 避免 1024-1279px 中等桌面宽度下没有 Article TOC 的空档。

**改动文件：**
- `components/blog/BlogArticle.tsx`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/CHANGELOG_AI.md`
- `docs/CHANGELOG_AI.zh-CN.md`

**范围约束：**
- 未新增 Blog 大功能。
- 未修改 Blog 内容源结构或已发布文章正文。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改 Projects / Profile 核心逻辑。
- 未修改部署、Docker、Nginx 或环境配置。
- 未新增数据库、CMS、第三方搜索、评论、阅读次数、点赞或统计分析。

**验证：**
- `pnpm lint` 通过。
- `pnpm build` 通过。
- 本地 standalone 路由检查通过：`/`、`/blog`、`/blog/search`、`/blog/tags`、`/blog/tags/developer-os`、`/blog/series`、`/blog/series/personal-developer-os`、`/blog/why-rebuild-my-personal-blog`、`/projects`、`/projects/personal-developer-os`、`/projects/ai-agent-demo`、`/sitemap.xml`、`/rss.xml`、`/robots.txt`。
- sitemap 包含 `/blog/search`、`/blog/tags`、`/blog/tags/developer-os`、`/blog/series`、`/blog/series/personal-developer-os`、`/projects/personal-developer-os` 和 `/projects/ai-agent-demo`。
- RSS 包含已发布博客文章，不包含 `/blog/search`、`/blog/tags`、`/blog/series` 或 `/projects`。

### 2026-06-13 - Codex
**摘要：** Phase 9.4 完成，新增轻量博客搜索页 `/blog/search`。

**Phase 9.4 范围：**
- 新增公开路由 `/blog/search`，并配置 SEO metadata。
- 搜索数据通过 `BlogService.getPublishedPosts()` 获取，只包含 published posts。
- 新增轻量 Client 搜索页，浏览器端只维护输入关键词状态，并过滤服务端传入的文章元数据。
- 搜索范围包括 `title`、`summary`、`tags` 和 `series`。
- 本阶段没有把文章正文内容发送到前端，避免增加搜索页体积。
- 搜索大小写不敏感，会 trim 前后空格，并支持多个连续空格分隔的多关键词。
- 空关键词展示最近文章；无结果时展示轻量 empty state。
- 搜索结果复用 `BlogCard`，保持现有 Blog 列表样式，并可点击进入 `/blog/[slug]`。
- `/blog` 页面在 tags / series 入口旁新增搜索入口。
- 补充搜索标题、占位提示、搜索说明、结果、空状态、换词提示、最近文章等 zh / en 翻译 key。
- `sitemap.xml` 包含 `/blog/search`。
- RSS 保持不变，仍然只包含博客文章。

**范围约束：**
- 未接数据库、CMS、第三方搜索服务或服务端全文索引。
- 未修改 Blog 内容源结构和已发布文章正文。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改部署配置。
- 未修改 Projects / Profile 核心逻辑。
- 未引入大型依赖。

**验证：**
- `pnpm lint` 通过，零警告零错误。
- `pnpm build` 通过，静态生成 `/blog/search`、`/blog/[slug]`、`/blog`、`/blog/series`、`/blog/tags`、`/projects`、`/sitemap.xml` 和 `/rss.xml`。
- 本地生产服务路由检查通过：`/`、`/blog`、`/blog/search`、`/blog/why-rebuild-my-personal-blog`、`/blog/series`、`/blog/series/personal-developer-os`、`/blog/tags`、`/projects`、`/sitemap.xml`、`/rss.xml`。
- sitemap 包含 `/blog/search`；RSS 不包含 `/blog/search`。

### 2026-06-13 - Codex
**摘要：** Phase 9.3 完成，为博客文章详情页新增上一篇 / 下一篇导航。

**Phase 9.3 范围：**
- 新增 `BlogAdjacentPosts` 类型和 `BlogService.getAdjacentPosts(slug)`，统一计算公开文章的上下篇。
- 系列文章优先通过已发布的 `getPostsBySeries(seriesSlug)` 结果计算上下篇，保持 `seriesOrder` 阅读顺序。
- 如果系列文章缺少 `seriesOrder`，沿用现有系列排序的 date 升序兜底。
- 普通非系列文章按全站 published posts 的日期顺序兜底。
- draft 文章不参与上下篇导航。
- 新增 `components/blog/BlogAdjacentNav.tsx`，并在 `/blog/[slug]` 正文结束后、相关项目入口前展示。
- 系列第一篇只显示下一篇，中间篇显示上一篇和下一篇，最后一篇只显示上一篇。
- 桌面端使用左右两栏，移动端上下堆叠，不影响左侧 fixed floating TOC。
- 补充上一篇、下一篇、继续阅读本系列、返回博客、暂无上下篇等 zh / en 翻译 key。

**范围约束：**
- sitemap / RSS 未修改。
- 文章 URL 和 metadata 未修改。
- Blog series pages 和 tag pages 未修改。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改部署配置。
- 未修改 Projects / Profile 核心逻辑。
- 未引入大型依赖。

**验证：**
- `pnpm lint` 通过，零警告零错误。
- `pnpm build` 通过，静态生成 `/blog/[slug]`、`/blog`、`/blog/series`、`/blog/tags`、`/projects`、`/sitemap.xml` 和 `/rss.xml`。
- 本地生产服务路由检查通过：`/`、`/blog`、`/blog/why-rebuild-my-personal-blog`、`/blog/series`、`/blog/series/personal-developer-os`、`/blog/tags`、`/projects`、`/sitemap.xml`、`/rss.xml`。

### 2026-06-12 - Codex
**摘要：** Phase 9.2-fix-2 完成，将桌面端文章 TOC 调整为 fixed floating sidebar。

**Phase 9.2-fix-2 范围：**
- 将 `/blog/[slug]` 桌面端文章 TOC 从 sticky 左侧栏改为真正的 `position: fixed` 悬浮侧栏。
- TOC 固定在左侧可视区域，并设置顶部与底部偏移，文章滚动时目录始终可见。
- 从 `ArticleToc` 内部移除 sticky 定位，让组件只负责目录渲染、内部滚动和 active heading 状态。
- 为文章正文区域增加桌面端左侧预留空间，避免 fixed TOC 遮挡阅读列。
- 移动端继续使用正文前的 in-flow TOC，小于宽屏断点时隐藏 fixed 侧栏，避免横向溢出。
- 保留 active heading 高亮、当前项加粗、h2 / h3 缩进和 TOC 点击跳转。
- 样式继续复用现有 style tokens，适配 light / dark 与 macos / vercel preset。

**范围约束：**
- 未重写 TOC 生成逻辑。
- 未修改 BlogService / BlogRepository / content/blog 结构。
- 未修改博客文章正文。
- sitemap / RSS 未修改。
- 未修改 Console / CLI、窗口系统或部署配置。
- 未修改 Projects / Profile 核心逻辑。
- 未引入大型依赖。

### 2026-06-12 - Codex
**摘要：** Phase 9.2-fix 完成，优化文章目录布局与当前阅读状态。

**Phase 9.2-fix 范围：**
- 桌面端 `/blog/[slug]` 文章 TOC 从正文前的块调整为左侧边栏。
- 文章详情页使用更宽的布局；博客列表、系列页、标签页、项目页保持原布局。
- 新增 `components/blog/ArticleToc.tsx`，只负责 sticky TOC 和 active heading 状态。
- 桌面端 TOC 使用 sticky 定位、视口高度限制和内部滚动。
- 移动端保留正文前的轻量 TOC，不强行显示左侧栏，避免横向溢出。
- active heading 通过 `IntersectionObserver` 结合轻量 scroll fallback 识别。
- 当前 TOC 项会高亮并加粗，h2 / h3 缩进层级保留。
- TOC 点击跳转继续复用 Phase 9.2 生成的稳定 heading id。
- TOC 样式复用现有 style tokens，适配 light / dark 与 macos / vercel preset。

**范围约束：**
- 未重写 TOC 生成逻辑。
- 未修改 BlogService / BlogRepository / content/blog 结构。
- 未修改博客文章正文。
- sitemap / RSS 未修改。
- 未修改 Console / CLI、窗口系统或部署配置。
- 未修改 Projects / Profile 核心逻辑。
- 未引入大型依赖。

### 2026-06-12 - Claude Code
**摘要：** Phase 9.1 完成。新增博客标签页，读者可按主题浏览已发布文章。

**Phase 9.1 范围：**
- 新增 `BlogTag` 类型（name、slug、count、latestUpdatedAt）。
- 新增 `tagToSlug()` 工具函数，稳定生成 URL 友好标签 slug（如 "Next.js" → "next-js"）。
- `BlogRepository` 新增 `getAllTagsDetailed()` 接口方法。
- `FileBlogRepository` 实现 `getAllTagsDetailed()`，按文章数量降序、名称升序排列。
- `BlogService` 新增 `getAllTagsDetailed()`、`getTagBySlug()`、`getPostsByTagSlug()` 方法。
- 新增 `/blog/tags` 标签总览页，展示所有标签名称、文章数量、最近更新时间。
- 新增 `/blog/tags/[tagSlug]` 标签详情页，展示该标签下所有已发布文章。
- 标签 slug 不存在时返回 `notFound()`。
- `/blog` 页面新增"查看标签"入口（在"查看系列"旁边）。
- `BlogCard` 和 `BlogArticle` 中标签可点击进入标签详情页。
- 新增 12 个标签相关中英文翻译 key。
- `sitemap.xml` 包含 `/blog/tags` 及所有标签详情页。
- RSS 保持只包含博客文章，不包含标签页。
- draft 文章不进入标签页。

**未修改范围：**
- 未修改 Console / CLI 命令系统。
- 未修改窗口系统。
- 未修改部署配置。
- 未修改已发布文章正文。
- 未修改 Projects / Profile 核心逻辑。
- 未引入大型依赖。

**验证：**
- `pnpm lint` 通过，零警告零错误。
- `pnpm build` 通过，生成 18 个标签详情页。

## 2026-06-12 - Phase 8.6 最终验收与收口

Codex 完成 Phase 8 的最终验收，并将 Phase 8 标记为 completed。

验收内容：

- 确认 Blog 内容建设完成，`从 Hexo 到 Personal Developer OS` 系列包含 7 篇已发布文章。
- 确认 `/blog`、`/blog/series`、`/blog/series/personal-developer-os` 和文章详情页正常。
- 确认 Projects 作品集展示完成，`Personal Developer OS` 和 `AI Agent Demo` 项目页正常。
- 确认 `AI Agent Demo` 仍然定位为 In Progress / Learning Project，没有夸大为成熟生产产品。
- 确认 Profile / Contact / System Stack 通过 `ProfileService` 读取，且 Career Snapshot 已合并进 Profile。
- 确认中英文 Content Workflow 文档正常，并已在 README / docs 入口中链接。
- 确认 sitemap、RSS、robots 输出正常；RSS 只包含博客文章，不包含项目页。
- 确认公开内容没有私人资料 PDF、手机号、微信、住址、真实单位、真实客户、真实甲方、部署密钥或编造指标。

范围约束：

- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改部署配置。
- 未修改 Blog / Projects / Profile 核心逻辑。
- 未新增 CMS、数据库、后台、搜索、评论、在线聊天或 Agent API。

验证：

- `pnpm lint` 通过。
- `pnpm build` 通过。
- 本地 standalone 路由检查通过：`/`、`/blog`、`/blog/series`、`/blog/series/personal-developer-os`、`/blog/why-rebuild-my-personal-blog`、`/projects`、`/projects/personal-developer-os`、`/projects/ai-agent-demo`、`/sitemap.xml`、`/rss.xml`、`/robots.txt`。
## 2026-06-12 - Phase 8.5 内容发布流程文档

Codex 补充了中英文内容发布流程文档，用于长期维护 Blog、Projects、Profile 三类文件型内容源。

新增：

- `docs/CONTENT_WORKFLOW.md`
- `docs/CONTENT_WORKFLOW.zh-CN.md`

覆盖内容：

- Blog 文章和系列文章发布流程。
- Project case study 新增与维护流程。
- Profile、Contact Channels、System Stack 维护流程。
- Blog / Project / Profile frontmatter 字段说明。
- `published`、`draft`、`featured`、`order`、`seriesSlug`、`seriesOrder` 对公开展示的影响。
- 本地验证、提交流程、生产部署、sitemap / RSS 检查流程。
- 隐私规则和未来 CMS / DB Repository 替换方向。

范围约束：

- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改部署配置。
- 未修改 Blog / Projects / Profile 核心逻辑。
- 未新增真实联系方式或私人资料 PDF。

验证：

- `pnpm lint` 通过。
- `pnpm build` 通过。
## 2026-06-08 - 中文文档补充

Codex 为 docs 添加中文工作文档。

新增：

- `docs/README.zh-CN.md`
- `docs/DESIGN_BRIEF.zh-CN.md`
- `docs/IMPLEMENTATION_PLAN.zh-CN.md`
- `docs/DEVELOPMENT_RULES.zh-CN.md`
- `docs/DEPLOYMENT.zh-CN.md`
- `docs/CHANGELOG_AI.zh-CN.md`

重点：

- 部署手册改写为中文发布操作手册。
- 明确 `NEXT_PUBLIC_SITE_URL` 同时影响构建期和运行期。
- 记录了当时发布路径中的 Docker Compose 拓扑；后续部署文档已按当前仓库中的 Compose service 和代理网络名称修正。
- 补充每次发布、无缓存构建、日志、Nginx 重载、证书续期、线上验证和回滚流程。

## 当前状态

- Phase 1 到 Phase 10 已完成。
- Phase 8 已完成：内容与职业展示、项目案例、Profile / Contact、内容工作流文档已收口。
- Phase 9 已完成：Blog Tag Pages、Article TOC、Previous / Next Navigation、Blog Search 和 Blog UX Final Polish 已完成最终验收。
- Phase 10 已完成：AI Agent Demo Integration 第一版公开 Demo 已完成最终验收与文档收口。
- 当前生产站点：`https://example.com`。
- 当前重点：保持公开 Agent Demo 的只读安全边界，后续按需规划 Redis 分布式限流、评测集或独立 agent-api。
- 当前发布方式：Linux server Linux production server + Docker Compose + Next.js standalone + Docker Nginx + Let's Encrypt HTTPS。

## 2026-06-08 - Phase 8.2.1

Claude Code 完成前三篇真实博客文章的去 AI 味润色。

范围：

- 润色 `从 Hexo 到 Personal Developer OS` 系列前三篇文章。
- 减少模板化表达和过度总结。
- 保留真实工程开发者的开发日志口吻。
- 不改博客系统代码、Main App、Console / CLI、窗口系统、UI 或部署配置。

验证：

- `pnpm lint` 通过。
- `pnpm build` 通过。

## 2026-06-08 - Phase 8.2

Codex 建立第一组真实博客内容。

范围：

- 建立系列：`从 Hexo 到 Personal Developer OS`。
- 添加三篇已发布中文文章：
  - `why-rebuild-my-personal-blog`
  - `designing-personal-developer-os`
  - `building-os-shell-and-main-app`
- 替换早期示例文章。
- 保持 Markdown 博客架构、Main App、Console / CLI、窗口系统、UI、sitemap/RSS 和部署配置不变。

验证：

- `pnpm lint` 通过。
- `pnpm build` 通过。

## 2026-06-08 - Phase 7

Codex 完成生产部署和发布后运维归档。

范围：

- 在Linux production server上完成生产发布。
- 使用 Linux server、Docker、Docker Compose、Next.js standalone。
- 添加 Docker Nginx 反向代理。
- 上线 `https://example.com`。
- 配置 `www.example.com` 跳转到 `example.com`。
- 配置 Let's Encrypt HTTPS。
- 确认 sitemap、robots、RSS 在线可访问。
- 确认生产 SEO 输出使用 `https://example.com`。
- 将目录布局、更新流程、日志检查、Nginx 重载、证书续期、回滚和线上验证清单归档到部署文档。

注意：

- 不提交 `.env.production`、证书、私钥、服务器 IP 或部署密钥。
- 生产更新使用 `git pull` + `docker compose --env-file .env.production up -d --build`。

## 2026-06-08 - Phase 7.2

Codex 修复 Docker 构建中的生产 URL 注入问题。

关键点：

- 在 Docker build 阶段传入 `NEXT_PUBLIC_SITE_URL`。
- 运行时继续保留 `NEXT_PUBLIC_SITE_URL`。
- 确保 sitemap、RSS、robots 和 metadata 在重新构建后使用生产域名。

重要提醒：

- 修改 `NEXT_PUBLIC_SITE_URL` 后必须重新构建镜像。
- 如果缓存导致旧输出残留，使用：

```bash
docker compose --env-file .env.production build --no-cache
docker compose --env-file .env.production up -d
```

## 2026-06-08 - Phase 7.1

Codex 添加 Docker 自托管准备。

范围：

- 添加多阶段 `Dockerfile`。
- 添加 `.dockerignore`。
- 添加 `.npmrc`。
- 添加 `docker-compose.yml`。
- 配置 Next.js standalone 输出。
- 让 standalone tracing 包含 `content/blog`，确保 Markdown 博客在容器内可读。
- 添加 `public/.gitkeep`。
- 更新 `.gitignore`，避免提交 `.env.production`。
- 更新部署文档。

验证：

- `pnpm lint` 通过。
- `pnpm build` 通过。
- 当前 Windows 工作区没有 Docker 命令，因此 Docker build 需在服务器验证。

## 2026-06-04 - Phase 6

Codex 完成博客发布系统、SEO、RSS、sitemap 和部署准备。

范围：

- 建立 `content/blog/*.md` 文件式博客。
- 建立 `BlogRepository`、`FileBlogRepository`、`BlogService`。
- 添加 `/blog` 和 `/blog/[slug]` 页面。
- Main App Blog 区域和 Console `blog` 命令接入真实已发布文章。
- 添加 metadata、sitemap、robots、RSS。
- 添加 `.env.example`、README 和部署文档。
- 确认草稿不会出现在公开页面、Console、sitemap、RSS 或 metadata。

验证：

- `pnpm lint` 通过。
- `pnpm build` 通过。

## 2026-06-03 - Phase 5

Claude Code 完成视觉打磨。

范围：

- 视觉一致性审计。
- macOS / Vercel preset 风格边界优化。
- light / dark 主题可读性优化。
- 移动端响应式优化。
- 添加克制动效和 reduced motion 支持。

原则：

- 不改变功能。
- 不改变 CLI。
- 不改变窗口行为。
- 不弱化 Developer OS 概念。

## 2026-05-31 - Phase 1 到 Phase 4

项目早期基础完成。

主要内容：

- 建立 Personal Developer OS shell。
- 实现 System Status Bar、Main App、Console App、Desktop fallback。
- 建立窗口状态管理。
- 迁移到 pnpm。
- 建立 SettingsContext、主题、语言、stylePreset。
- 将 UI 文案集中到 translations。
- 实现 Main App 内容模块。
- 实现 Console 命令系统和命令联动。

## 后续记录规则

之后的重大变更应继续写入 `docs/CHANGELOG_AI.md`，并可在本中文摘要中补充高层说明。

每条记录建议包含：

- 日期。
- 工具。
- 摘要。
- 改动文件。
- 设计影响。
- 验证结果。
- 后续注意事项。

### 2026-06-17 - Codex
**摘要：** Phase 11.1 已完成，为 Agent Demo 增加隐私安全的最小化观测事件和反馈闭环。

**Phase 11.1 范围：**
- 新增 `features/agent-demo/observability`，封装 Agent Demo 最小化观测逻辑。
- `POST /api/agent-demo` 所有响应新增随机 UUID `requestId`。
- 使用 SHA-256 + 服务端 salt 生成 `question_hash` 和 `ip_hash`。
- 为 completed、blocked、rate-limited 和 error 响应记录最小事件。
- 新增 `POST /api/agent-demo/feedback`，只接受 `helpful` / `not_helpful`。
- `/agent-demo` 回答后新增 Helpful / Not helpful 反馈按钮。
- `.env.example` 新增 `AGENT_DEMO_OBSERVABILITY_ENABLED`、`AGENT_DEMO_HASH_SALT` 和 `AGENT_DEMO_DATABASE_URL`。
- 架构和部署文档补充 PostgreSQL 建表 SQL、隐私边界、关闭 observability 方法和最小统计查询示例。
- 实施计划新增 Phase 11，标记 Phase 11.1 完成，Phase 11.2 到 11.5 计划中。

**隐私边界：**
- 不保存完整 question。
- 不保存完整 answer。
- 不保存明文 IP。
- 不保存原始 headers、prompt、检索 context 或完整 trace detail。
- 观测写入失败只记录安全 server log，不影响 Agent 正常回答。

**范围约束：**
- 未扩大 Agent 回答范围。
- 未新增 Agent 写工具。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改已跟踪 Docker / Nginx 配置文件。

**验证：**
- `pnpm test` 通过。
