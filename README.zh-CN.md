# AI Native Portfolio CMS

[English README](README.md)

一个面向开发者作品集和技术博客的开源 starter，提供桌面风格 UI、Markdown 内容模式、可选 PostgreSQL 后台 CMS，以及 Agent Demo。

这个项目的核心是 Personal Developer OS，不是普通的 Hero + About + Projects 模板。公开页面保留浏览器桌面外壳，包括 System Status Bar、Main App、Console App、Desktop fallback、主题切换、语言切换，以及 `macos` / `vercel` 两套视觉 preset。

## 功能特性

- 桌面风格作品集 UI，包含 Main App、Console App 和 Desktop fallback。
- 技术博客与项目案例。
- 基于文件的内容模式，使用 Markdown 和本地内容文件维护。
- 可选的 PostgreSQL 后台 Admin CMS。
- Site、Page、Hero、Profile、Stack、Contact 配置。
- SEO metadata、sitemap、robots 和 RSS。
- Agent Demo 架构，用于受限范围内的公开 AI 助手体验。
- 适合 Docker 部署，使用 Next.js standalone 输出。

## 快速开始

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

打开：

```text
http://localhost:3000
```

第一次运行或部署时，建议先看 [快速上手](docs/GETTING_STARTED.zh-CN.md)。

## 内容模式

### File Mode

file mode 是默认模式，不需要 PostgreSQL。内容维护在：

```text
content/site
content/homepage
content/pages
content/profile
content/blog
content/projects
```

### Database Mode

database mode 使用 Admin CMS 和 PostgreSQL：

```text
/admin/site
/admin/hero
/admin/pages
/admin/profile
/admin/stack
/admin/contact
/admin/blog
/admin/projects
```

日常内容维护见 [内容维护流程](docs/CONTENT_WORKFLOW.zh-CN.md)，数据库模式见 [数据库内容源说明](docs/DATABASE_CONTENT_SOURCE.zh-CN.md)。

## 部署

如果只需要一个简单稳定的内容站点，优先从 file mode 部署。

如果需要 Admin CMS，需要启用 PostgreSQL，手动执行 migration，配置 Admin 登录变量，并在后台内容确认无误后再切换内容源。

`NEXT_PUBLIC_SITE_URL` 控制 canonical URL、Open Graph URL、`sitemap.xml`、`robots.txt` 和 `rss.xml`。生产构建前应设置为正式站点 origin。

推荐阅读顺序：

1. [快速上手](docs/GETTING_STARTED.zh-CN.md)
2. [部署指南](docs/DEPLOYMENT.zh-CN.md)
3. [数据库内容源说明](docs/DATABASE_CONTENT_SOURCE.zh-CN.md)
4. [发布检查清单](docs/RELEASE_CHECKLIST.zh-CN.md)

## 文档

### 用户与部署文档

- [快速上手](docs/GETTING_STARTED.zh-CN.md)
- [部署指南](docs/DEPLOYMENT.zh-CN.md)
- [内容维护流程](docs/CONTENT_WORKFLOW.zh-CN.md)
- [数据库内容源说明](docs/DATABASE_CONTENT_SOURCE.zh-CN.md)
- [发布检查清单](docs/RELEASE_CHECKLIST.zh-CN.md)

### 开发记录

- [实施计划](docs/IMPLEMENTATION_PLAN.zh-CN.md)
- [AI 变更记录](docs/CHANGELOG_AI.zh-CN.md)
- [Admin CMS 设计](docs/ADMIN_CMS_DESIGN.zh-CN.md)
- [Agent Demo 架构说明](docs/AGENT_DEMO_ARCHITECTURE.zh-CN.md)
- [开发规则](docs/DEVELOPMENT_RULES.zh-CN.md)

## 常用命令

```bash
pnpm dev
pnpm lint
pnpm build
pnpm security:admin
pnpm security:public
pnpm release:check
pnpm admin:secrets
```

## License

见 [LICENSE](LICENSE)。
