# 快速上手

这是克隆项目后建议先读的入口文档，用来判断项目是什么、应该选择哪种内容模式，以及后续部署细节该去哪里看。

## 这个项目是什么

AI Native Portfolio CMS 是一个基于 Next.js 的开发者作品集、技术博客、Admin CMS 和 Agent Demo starter。公开页面运行在 Personal Developer OS 风格的桌面外壳里。

公开 UI 保留这些结构：

- System Status Bar
- Main App
- Console App
- Desktop fallback
- `macos` / `vercel` 视觉 preset
- `light` / `dark` 主题
- `zh` / `en` 语言切换

## 选择内容模式

### File Mode

如果你想最快跑起来，选 file mode。

- 默认模式。
- 不需要数据库。
- 内容维护在 `content/**`。
- 适合静态内容站点或 Git-based publishing。

### Database Mode

如果你需要后台 CMS 编辑，选 database mode。

- 需要 PostgreSQL。
- 需要手动执行 migration。
- 需要配置 Admin 登录环境变量。
- 只有切换对应内容源变量后，公开页面才会读取后台数据库内容。

## 本地开发

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

打开：

```text
http://localhost:3000
```

## 最小环境变量

file mode：

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

database mode 还需要：

```text
PERSONAL_SITE_DATABASE_URL=<postgres-connection-url>
ADMIN_USERNAME=<admin_username>
ADMIN_PASSWORD_HASH=<sha256_password_hash>
ADMIN_SESSION_SECRET=<random_32_chars_or_longer>
```

Admin 密钥可以用下面的命令生成：

```bash
pnpm admin:secrets
```

## File Mode 内容地图

```text
content/site      -> 站点身份与默认 SEO
content/homepage  -> 首页 Hero
content/pages     -> Blog / Projects 页面配置
content/profile   -> Profile、Contact、Stack
content/blog      -> 博客文章
content/projects  -> 项目案例
```

## Database Mode 后台地图

```text
/admin/site      -> site_configs
/admin/hero      -> homepage_sections
/admin/pages     -> page_configs
/admin/profile   -> profile_pages
/admin/stack     -> system_stack_groups / system_stack_items
/admin/contact   -> contact_channels
/admin/blog      -> blog_posts / blog_series
/admin/projects  -> projects
```

## 生产部署

普通部署先看 [部署指南](DEPLOYMENT.zh-CN.md)。

如果要启用 PostgreSQL 内容源，在切换任何公开内容源为 `database` 之前，先阅读 [数据库内容源说明](DATABASE_CONTENT_SOURCE.zh-CN.md)。

更细的生产 CMS 操作见 [Production CMS 部署手册](PRODUCTION_CMS_DEPLOYMENT.zh-CN.md)。

## 下一步阅读

- [内容维护流程](CONTENT_WORKFLOW.zh-CN.md)：维护 file mode 内容。
- [数据库内容源说明](DATABASE_CONTENT_SOURCE.zh-CN.md)：启用数据库内容源。
- [部署指南](DEPLOYMENT.zh-CN.md)：构建和部署项目。
- [Agent Demo 架构说明](AGENT_DEMO_ARCHITECTURE.zh-CN.md)：了解公开 AI Demo 的边界。
