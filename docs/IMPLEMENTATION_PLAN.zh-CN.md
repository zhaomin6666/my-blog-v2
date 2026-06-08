# 实施计划 - Personal Dev OS

本文件是项目阶段计划的中文工作版，用于快速了解当前进度和后续方向。

## 当前状态

- Phase 1 到 Phase 7 已完成。
- Phase 8 正在进行，重点是内容与职业展示，而不是改系统架构。
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

## Phase 8：内容与职业展示 - 进行中

目标：

- 发布围绕 Personal Developer OS 构建过程的真实博客内容。
- 将站点作为个人品牌、求职展示和技术写作归档。
- 保持 Phase 8 内容优先；除非单独规划，不改博客系统、UI、Console / CLI、窗口系统或部署配置。

已完成：

- 归档 v1.0.0 生产版本和版本里程碑。
- 建立 `从 Hexo 到 Personal Developer OS` 系列。
- 添加前三篇已发布中文文章。
- 对前三篇文章做去 AI 味润色，保留真实开发日志口吻。

## 后续原则

- 先做内容，再做系统扩展。
- 新功能必须保护 Developer OS 产品概念。
- 发布相关改动必须同步检查 `docs/DEPLOYMENT.zh-CN.md`。

