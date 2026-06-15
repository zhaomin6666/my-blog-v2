# 实施计划 - Personal Dev OS

本文件是项目阶段计划的中文工作版，用于快速了解当前进度和后续方向。

## 当前状态

- Phase 1 到 Phase 9 已完成。
- Phase 8 已完成：内容与职业展示、真实博客系列、Projects / Profile / Contact 内容体系和内容工作流文档已收口。
- Phase 9 已完成：Blog Tag Pages、Article TOC、Previous / Next Navigation、Blog Search 和 Blog UX Final Polish 已完成最终验收。
- Phase 10 已进入进行中：AI Agent Demo Integration 已完成 Phase 10.1 架构与安全基础、Phase 10.2 只读知识工具与范围识别器、Phase 10.2.1 单元测试基础、Phase 10.3 只读 Agent API MVP、Phase 10.4 限流 / 超时 / 滥用防护、Phase 10.5 UI 与 trace 展示，下一步进入 Phase 10.6 生产部署与安全验证。
- 当前生产地址：`https://oli6666.top`。
- 当前发布方式：CentOS 9 自有云服务器 + Docker Compose + Next.js standalone + Docker Nginx + Let's Encrypt HTTPS。

## Phase 1：项目基础与 OS Shell - 已完成

- 初始化 Next.js / Tailwind / TypeScript。
- 创建基础目录结构。
- 实现 System Status Bar。
- 实现 Main App 窗口。
- 实现 Console App 底部窗口。
- 实现 Desktop 占位状态。
- 实现窗口状态管理。
- 迁移到 pnpm。
- 完成第一轮视觉校准：布局、对比度、响应式。

## Phase 2：全局设置 - 已完成

- 实现 theme：`light` / `dark`。
- 实现 language：`zh` / `en`。
- 实现 stylePreset：`macos` / `vercel`。
- 用户偏好保存到 localStorage。
- 抽取 translations。
- 抽取 style tokens。
- 建立统一 `SettingsContext` 和 `useSettings`。
- 优化所有 preset 下的亮色模式。
- 建立 type-safe translations 和 `TranslationKey`。

## Phase 3：Main App 内容 - 待最终确认

- Hero / Overview：Dashboard widget，包含 badge、标题、副标题、CTA。
- About：profile.json 风格信息面板。
- Skills：Skill Matrix / stack.config 风格技能模块。
- Projects：服务模块 / app cards，包含状态 badge 和技术栈。
- Blog / Engineering Logs：日志条目，包含 timestamp、level、tags。
- Contact：contact endpoint 面板。
- Main App 内部导航：app-tab 风格，支持平滑滚动。
- 双语数据结构：`LocalizedText`。
- 稳定 section id：overview、about、skills、projects、blog、contact。

## Phase 3.5：Developer OS 窗口行为校准 - 已完成

- Main App 首次加载默认最大化打开。
- Console App 首次加载默认关闭。
- Main App 的 Open Terminal 进入 Main + Console 双窗口工作状态。
- macOS Main App 背景可读性提升，同时保留玻璃 OS 概念。
- 顶部状态栏和 Desktop 入口可以打开、恢复并激活对应 App。
- active app 决定窗口层级。
- Console 最大化时切换 Portfolio，会将 Console 恢复到 dock 状态，让 Main App 可见。

## Phase 4：CLI 命令系统 - 已完成

- 命令 parser 支持 trim 和大小写不敏感。
- 支持 Up / Down 命令历史。
- 实现 `help`、`about`、`skills`、`projects`、`blog`、`contact`、`resume`、`clear`、`classic`、`whoami`、`sudo hire me`。
- 命令别名：`stack -> skills`、`logs -> blog`、`articles -> blog`、`mail -> contact`、`hire -> sudo hire me`。
- 未知命令本地化提示。
- 命令可联动 Main App 滚动或高亮。
- Console 最大化时保持纯终端，不联动 Main App。
- prompt：`visitor@dev-os:~ $`。
- 输入光标使用原生 caret。

## Phase 5：视觉打磨 - 已完成

- 完成视觉一致性审计和定向修复。
- 优化 macOS / Vercel preset 的风格边界。
- 优化 light / dark 主题下的信息层级和可读性。
- 优化 360px / 390px / 430px / 768px 响应式表现。
- 添加克制的动效和交互反馈。
- 支持 `prefers-reduced-motion`。
- 未改变功能、CLI 或窗口行为。

## Phase 6：博客发布系统 + SEO + 部署准备 - 已完成

### Phase 6.1：CMS-ready 博客内容架构

- 基于 `content/blog/*.md` 的文件式 Markdown 博客。
- 建立 `BlogPost` / `BlogPostMeta` / `BlogPostFrontmatter` 类型。
- 建立 `BlogRepository` 接口。
- 实现服务端 `FileBlogRepository`。
- 建立 `BlogService`，统一服务页面、组件、CLI 和 SEO。
- 保留未来迁移 DB / CMS 的接口层。

### Phase 6.2：博客列表与文章阅读页

- `/blog` 列表页，保持 Engineering Logs 气质。
- `/blog/[slug]` 文章详情页，支持 Markdown 渲染。
- `BlogLayout` 提供 OS 风格顶部栏和设置切换。
- `BlogList` / `BlogCard` 展示日志卡片。
- `BlogArticle` 展示文章内容、元信息和阅读时间。
- 使用 `generateStaticParams` 和 `generateMetadata`。
- 草稿文章公开访问返回 404。
- 博客 UI 文案和 aria label 接入 `lib/translations.ts`。

### Phase 6.3：Console Blog 命令接入真实数据

- Console `blog` 命令消费服务端传入的 `BlogPostMeta[]`。
- `logs` / `articles` 使用同一份真实已发布文章输出。
- Console、首页 Main App Blog 区域、`/blog` 保持数据一致。
- 移除旧的 `data/blogs.ts` mock 数据。

### Phase 6.4：SEO / Sitemap / Robots / RSS

- SEO 配置集中在 `lib/seo.ts`。
- 站点 metadata、Open Graph、Twitter card 完成。
- `/blog` 和 `/blog/[slug]` metadata 接入真实文章数据。
- `sitemap.xml` 只包含 `/`、`/blog` 和已发布文章。
- `robots.txt` 指向 sitemap，并保留 `/admin`、`/api/preview`。
- `rss.xml` 只包含已发布文章。
- 生产部署必须设置 `NEXT_PUBLIC_SITE_URL`。

### Phase 6.5：部署准备

- 添加 `.env.example`。
- 添加 README。
- 添加 `docs/DEPLOYMENT.md`。
- 确认 sitemap / robots / RSS 使用统一 site URL。
- 确认 `pnpm lint` 和 `pnpm build` 通过。
- 确认草稿不会进入公开 SEO 输出。

## Phase 7：自托管生产部署 - 已完成

- 添加 Docker 部署配置。
- 建立 GitHub 远程仓库更新流程。
- 在 CentOS 9 云服务器配置 Docker runtime。
- 使用 Next.js standalone 输出运行生产服务。
- 使用 Docker Nginx 反向代理。
- 绑定域名 `oli6666.top`。
- 配置 Let's Encrypt HTTPS。
- `www.oli6666.top` 重定向到 `oli6666.top`。
- 验证生产路由、SEO 输出、HTTPS 重定向和移动端基础表现。
- 归档发布后运维流程。

## Phase 8：内容与职业展示 - 已完成

目标：

- 发布围绕 Personal Developer OS 构建过程的真实博客内容。
- 将站点作为个人品牌、求职展示和技术写作归档。
- 保持 Phase 8 内容优先；除非单独规划，不改博客系统、UI、Console / CLI、窗口系统或部署配置。

已完成：

- 归档 v1.0.0 生产版本和版本里程碑。
- 建立并完成 `从 Hexo 到 Personal Developer OS` 七篇文章系列。
- 完成博客阅读体验、系列组织、阅读时间、项目关联等内容侧增强。
- 完成 Projects 作品集和两个项目详情页：
  - `Personal Developer OS`
  - `AI Agent Demo`
- 完成 Projects 文件型内容源：`content/projects` + `ProjectService`。
- 完成 Profile / Contact / System Stack 文件型内容源：`content/profile` + `ProfileService`。
- 完成 About / Profile / Contact 求职转化内容收口。
- 完成中英文内容发布流程文档：
  - `docs/CONTENT_WORKFLOW.md`
  - `docs/CONTENT_WORKFLOW.zh-CN.md`
- 完成 Phase 8 最终验收。

边界：

- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改部署配置。
- 未新增数据库、CMS、后台、评论、在线聊天或 Agent API。

## Phase 9：Blog System Enhancement - 已完成

目标：

- 强化 Blog 内容发现和阅读体验。
- 在不改变 Developer OS 主体结构的前提下，补齐博客系统的检索、组织、阅读导航和最终体验验收。
- 保持 Blog 增强轻量化，不接数据库、不接 CMS、不接第三方搜索服务。

已完成：

- Phase 9.1：Blog Tag Pages。
  - `/blog/tags`
  - `/blog/tags/[tagSlug]`
  - 标签来自 published posts。
  - draft tags 不进入公开页面。
  - sitemap 包含标签页，RSS 不包含标签页。
- Phase 9.2：Article TOC。
  - `/blog/[slug]` 自动提取 h2 / h3。
  - 支持中文 heading stable id。
  - 支持桌面端左侧 fixed floating sidebar。
  - 支持 active heading 高亮和点击跳转。
  - 移动端保留正文前 in-flow TOC，避免横向溢出。
- Phase 9.3：Previous / Next Navigation。
  - 系列文章按 `seriesOrder` 生成上下篇。
  - draft 不参与上下篇导航。
  - 文章详情页底部提供上一篇 / 下一篇阅读入口。
- Phase 9.4：Blog Search。
  - `/blog/search`
  - 搜索 published posts 的 title、summary、tags、series。
  - 空搜索展示最近文章，无结果展示 empty state。
  - 搜索结果复用 `BlogCard`。
  - sitemap 包含搜索页，RSS 不包含搜索页。
- Phase 9.5：Blog UX Final Polish。
  - 完成 `/blog`、Search、Tags、Series、Article TOC、Previous / Next、sitemap、RSS、robots 的最终验收。
  - 小修：文章详情页 inline TOC 保持显示到 fixed TOC 的 `xl` 断点，避免中等桌面宽度没有目录。
  - 更新英文和中文 changelog。
  - 将 Phase 9 标记为 completed，并新增 Phase 10 planned。

最终验收结论：

- `/blog` 正常。
- `/blog/search` 正常。
- `/blog/tags` 和 `/blog/tags/[tagSlug]` 正常。
- `/blog/series` 和 `/blog/series/personal-developer-os` 正常。
- `/blog/[slug]`、Article TOC、Previous / Next Navigation 正常。
- sitemap / RSS / robots 正常。
- light / dark、macos / vercel、zh / en、mobile 响应式链路正常。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改部署配置。

## Phase 10：AI Agent Demo Integration - 进行中

目标：把 `AI Agent Demo` 从项目介绍页升级成真实可交互的只读 Agent Demo。

边界：

- 只回答公开 Profile、公开技术栈、已发布 Projects、已发布 Blog、AI Agent 学习路线和 Personal Developer OS 实现相关问题。
- 不做通用聊天机器人。
- 不执行命令。
- 不写文件或数据库。
- 不访问私有数据。
- 不暴露密钥、服务器内部路径、证书、环境变量或数据库账号。
- 不编造经历、项目成果、用户量、收入或商业落地数据。

### Phase 10.1：Agent Demo Architecture & Safety Foundation - 已完成

- 新增隔离目录 `features/agent-demo`。
- 新增 Agent Demo 请求、响应、trace、sources、usage、输入校验和 scope 相关类型。
- 新增基础配置：支持语言、最大输入长度、最大 sources 数量、trace steps、公开项目 slug 和 scope 分类。
- 新增输入校验工具：
  - `question` 必须是 string。
  - trim 后不能为空。
  - 最大长度限制为 800 字符。
  - 拒绝明显异常 payload。
  - `locale` 只允许 `zh` / `en`。
- 新增 trace 构建工具，统一定义：
  - `input_validation`
  - `rate_limit_check`
  - `scope_check`
  - `retrieve_context`
  - `generate_answer`
- 新增 safety policy 和 scope policy，记录允许范围、禁止范围和禁止工具。
- 新增 foundation-only service response，为后续 API route 接入预留服务契约。
- 新增 `docs/AGENT_DEMO_ARCHITECTURE.md`，记录第一版目标、公开范围、禁止范围、API 设计、安全边界、工具权限、限流策略、trace / sources 契约和后续阶段。
- 未接入真实模型。
- 未接入 Redis。
- 未新增 `/api/agent-demo` route。
- 未新增 `/agent-demo` UI。
- 未修改 Blog / Projects / Profile 核心逻辑。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改 Docker / Nginx / 部署配置。

### Phase 10.2：Read-only Knowledge Tools & Scope Classifier - 已完成

- 新增 `features/agent-demo/tools` 只读工具目录。
- 新增 Blog 只读知识工具：
  - `searchBlogPosts(query)`
  - `getBlogPostBySlug(slug)`
  - `getRecentBlogPosts(limit)`
- 新增 Project 只读知识工具：
  - `searchProjects(query)`
  - `getProjectBySlug(slug)`
  - `getPublishedProjectSummaries(limit)`
- 新增 Profile 只读知识工具：
  - `getPublicProfile(locale)`
  - `getSystemStack(locale)`
  - `getPublicContact(locale)`
- 新增规则型 `scopeClassifier`，支持 allowed / blocked categories。
- 新增 `publicKnowledgeRetriever`，根据 scope category 只调用公开 Blog / Projects / Profile 工具。
- retriever 返回受限 `contextText`、公开 `sources` 和 trace 更新。
- draft Blog / Project 内容仍通过 published-only service 方法排除。
- 未接入真实模型。
- 未新增 `/api/agent-demo` route。
- 未新增 `/agent-demo` UI。
- 未接入 Redis。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改 Docker / Nginx / 部署配置。

### Phase 10.2.1：Agent Demo Unit Test Foundation - 已完成

- 新增 Vitest，作为 Agent Demo 基础能力的轻量单元测试工具。
- 新增 pnpm scripts：
  - `test`
  - `test:watch`
- 新增 `vitest.config.ts`，复用现有 `@` 路径别名，并使用 Node test environment。
- 新增聚焦测试：
  - Agent Demo 输入校验。
  - 规则型 scope 分类。
  - 文本工具函数。
  - 公开知识检索的路由、blocked scope 行为、trace 状态和 source 去重。
- 本阶段只补测试基础，不推进 Phase 10.3 功能。
- 未接入真实模型。
- 未新增 `/api/agent-demo` route。
- 未新增 `/agent-demo` UI。
- 未接入 Redis。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改 Docker / Nginx / 部署配置。
- 验证：`pnpm test`、`pnpm lint`、`pnpm build` 均通过。

### Phase 10.3：Read-only Agent API MVP - 已完成

- 新增 `POST /api/agent-demo`。
- 新增 server-only model adapter，通过原生 `fetch` 调用 OpenAI-compatible Chat Completions API。
- 新增明确的服务端环境变量配置：
  - `AGENT_DEMO_MODEL_API_URL`
  - `AGENT_DEMO_MODEL_API_KEY`
  - `AGENT_DEMO_MODEL`
- 将 `agentDemoService` 升级为共享 API pipeline：
  - 输入校验
  - scope 分类
  - 公开知识检索
  - 模型回答生成
- blocked categories 会在检索和模型生成前安全拒答。
- no-context 和 model-error 会返回安全响应，不暴露 stack trace、原始上游错误、密钥或环境变量值。
- API response 保留 `answer`、`allowed`、`category`、`trace`、`sources`、`usage` 和可选 `error`。
- 新增 service-level 单元测试，覆盖校验失败、blocked scope、模型生成成功和模型不可用时的安全错误。
- `rate_limit_check` 仍作为 passed placeholder，持久限流留给 Phase 10.4。
- 未新增 `/agent-demo` UI。
- 未接入 Redis。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改 Docker / Nginx 部署文件。
- 验证：`pnpm test`、`pnpm lint`、`pnpm build` 均通过。

### Phase 10.4：Rate Limit, Timeout & Abuse Protection - 已完成

- 为 `POST /api/agent-demo` 新增进程内 fixed-window 限流。
- 新增客户端标识识别：优先读取 `x-forwarded-for`、`x-real-ip`、`cf-connecting-ip`，最后回退到 `local`。
- 限流触发时返回 `429`，并带上 `Retry-After`。
- 新增可配置防护环境变量：
  - `AGENT_DEMO_MODEL_TIMEOUT_MS`
  - `AGENT_DEMO_RATE_LIMIT_WINDOW_MS`
  - `AGENT_DEMO_RATE_LIMIT_MAX_REQUESTS`
- 通过 `AbortController` 为模型调用增加超时控制。
- 新增安全的 `upstream_timeout` 处理，不暴露上游原始错误。
- 在已有输入长度和 sources 数量限制基础上，新增 context 和输出长度限制。
- 扩展 `usage`，返回输出长度和限流剩余额度 / reset 时间。
- 新增单元测试覆盖限流、service 短路、模型超时、输出截断和 context 截断。
- Redis 分布式限流仍保留为多实例生产环境后的后续选项。
- 未新增 `/agent-demo` UI。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改 Docker / Nginx 部署文件。

### Phase 10.5：Agent Demo UI & Trace Display - 已完成

- 新增公开 `/agent-demo` 页面。
- 基于现有 Project layout 和 settings toggles 新增 OS 风格 Agent Demo 工具界面。
- 新增问题输入、提交按钮、字数计数、示例问题、loading、网络错误、模型错误和限流状态。
- 新增 answer 展示，并保留换行。
- 新增 trace 展示，覆盖 input validation、rate-limit check、scope check、retrieval 和 generation。
- 新增 public sources 展示，包括 source type、title、excerpt 和内部链接。
- 新增 scope notice，明确 Demo 只读取公开内容。
- 将 `/agent-demo` 加入 sitemap。
- 从 AI Agent Demo 项目 frontmatter 增加 `/agent-demo` 轻量入口。
- UI 只导入 client-safe 的 Agent Demo types / config，避免把 server-only 知识检索链打进客户端包。
- 未修改 Console / CLI。
- 未修改窗口系统。
- 未修改 Docker / Nginx 部署文件。

### Phase 10.6：Production Deployment & Safety Verification - planned

- 计划补充生产环境配置检查。
- 计划补充 Nginx 限流建议。
- 计划补充生产安全验证清单。

### Phase 10.7：Phase 10 Final Review - planned

- 计划对第一版公开 Agent Demo 做最终验收。

## 后续原则

- 新阶段开始前先明确范围和验收标准。
- 新功能必须保护 Developer OS 产品概念。
- 发布相关改动必须同步检查 `docs/DEPLOYMENT.zh-CN.md`。


