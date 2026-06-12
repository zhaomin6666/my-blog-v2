# AI 变更记录中文摘要

本文件是 `docs/CHANGELOG_AI.md` 的中文摘要版，用于快速了解项目历史和当前状态。完整逐条归档仍以 `docs/CHANGELOG_AI.md` 为准。


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

- Phase 1 到 Phase 7 已完成。
- Phase 8 正在进行。
- 当前生产站点：`https://oli6666.top`。
- 当前重点：真实博客内容、个人品牌展示、技术写作归档。
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
