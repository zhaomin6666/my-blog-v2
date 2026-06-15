# AI 变更记录中文摘要

### 2026-06-15 - Codex
**摘要：** Phase 10.3 已完成，新增只读 Agent API MVP。

**Phase 10.3 范围：**
- 新增 `POST /api/agent-demo`。
- 新增 server-only OpenAI Responses API model adapter，使用原生 `fetch` 调用。
- 在 `.env.example` 新增服务端环境变量：`OPENAI_API_KEY` 和 `AGENT_DEMO_MODEL`。
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
- 确认公开内容没有真实简历 PDF、手机号、微信、住址、真实单位、真实客户、真实甲方、部署密钥或编造指标。

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
- 未新增真实联系方式或真实简历 PDF。

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
- 明确当前 Docker Compose 使用 `web-proxy` 外部网络，Nginx 应代理到 `personal-dev-os:3000`。
- 补充每次发布、无缓存构建、日志、Nginx 重载、证书续期、线上验证和回滚流程。

## 当前状态

- Phase 1 到 Phase 9 已完成。
- Phase 8 已完成：内容与职业展示、项目案例、Profile / Contact、内容工作流文档已收口。
- Phase 9 已完成：Blog Tag Pages、Article TOC、Previous / Next Navigation、Blog Search 和 Blog UX Final Polish 已完成最终验收。
- Phase 10 已规划：AI Agent Demo Integration，仅标记 planned，尚未展开实现细节。
- 当前生产站点：`https://oli6666.top`。
- 当前重点：保持 Phase 9 博客增强稳定，后续单独规划 AI Agent Demo Integration。
- 当前发布方式：CentOS 9 自有云服务器 + Docker Compose + Next.js standalone + Docker Nginx + Let's Encrypt HTTPS。

## 2026-06-08 - Phase 8.2.1

Claude Code 完成前三篇真实博客文章的去 AI 味润色。

范围：

- 润色 `从 Hexo 到 Personal Developer OS` 系列前三篇文章。
- 减少模板化表达和过度总结。
- 保留真实 Java 后端开发者的开发日志口吻。
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

- 在自有韩国云服务器上完成生产发布。
- 使用 CentOS 9、Docker、Docker Compose、Next.js standalone。
- 添加 Docker Nginx 反向代理。
- 上线 `https://oli6666.top`。
- 配置 `www.oli6666.top` 跳转到 `oli6666.top`。
- 配置 Let's Encrypt HTTPS。
- 确认 sitemap、robots、RSS 在线可访问。
- 确认生产 SEO 输出使用 `https://oli6666.top`。
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


