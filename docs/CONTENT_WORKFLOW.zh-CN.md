# 内容维护流程

这是一份面向用户的内容维护指南，用来说明内容放在哪里、公开路由怎么生成、发布前需要检查什么。

如果使用后台和 PostgreSQL 维护内容，请看 [数据库内容源说明](DATABASE_CONTENT_SOURCE.zh-CN.md)。

## 内容源矩阵

file mode：

```text
content/site      -> 站点身份与默认 SEO
content/homepage  -> 首页 Hero
content/pages     -> Blog / Projects 页面配置
content/profile   -> Profile / Stack / Contact
content/blog      -> 博客文章
content/projects  -> 项目案例
```

database mode：

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

## 通用规则

- 公开页面通过 Service 读取内容，不直接读取 Markdown 或 PostgreSQL。
- 公开 URL 来自 `slug` 字段，不来自文件名。
- 草稿或未发布内容不能进入公开页面、sitemap、RSS 和 metadata。
- `NEXT_PUBLIC_SITE_URL` 控制 canonical、sitemap、robots 和 RSS 的 URL。
- `lib/translations.ts` 只放 UI label、按钮、空状态、aria label、校验提示和命令提示。网站内容应放在内容源里。

## Site、Homepage 与 Page Config

file mode 文件：

```text
content/site/settings.en.md
content/site/settings.zh.md
content/homepage/hero.en.md
content/homepage/hero.zh.md
content/pages/blog.en.md
content/pages/blog.zh.md
content/pages/projects.en.md
content/pages/projects.zh.md
```

内容归属：

- `content/site`：站点身份与默认 SEO。
- `content/homepage`：首页 Hero 标题、副标题、badge 和辅助数据。
- `content/pages`：Blog 和 Projects 页面标题、副标题、footer 文案和默认 metadata。
- `NEXT_PUBLIC_SITE_URL`：只属于部署配置，不作为后台可编辑内容。

## 博客文章

博客文件放在：

```text
content/blog
```

Repository 会递归扫描 Markdown 文件，所以系列文章可以放在子目录里：

```text
content/blog/my-series/01-first-post.md
```

公开文章路由：

```text
/blog/[slug]
```

只要 `slug` 不变，移动文件位置不会改变公开路由。

最小示例：

```md
---
title: "构建一个 Intent Classifier"
slug: "building-intent-classifier"
summary: "记录 AI Agent 工作流中 Intent Classifier 的设计与实现。"
date: "2026-06-12"
updatedAt: "2026-06-12"
tags: ["AI Agent", "LangChain.js"]
status: "draft"
lang: "zh"
cover: ""
seoTitle: "构建一个 Intent Classifier"
seoDescription: "一篇关于 AI Agent 意图识别的实践记录。"
---

# 构建一个 Intent Classifier

这里写正文。
```

系列字段：

```yaml
series: "AI Agent Learning"
seriesSlug: "ai-agent-learning"
seriesOrder: 1
```

Blog frontmatter：

| 字段 | 作用 |
| --- | --- |
| `title` | 文章标题。 |
| `slug` | `/blog/[slug]` 的公开 URL 片段，必须唯一。 |
| `summary` | 列表卡片、metadata fallback 和预览文案。 |
| `date` | 首次发布日期，使用 `YYYY-MM-DD`。 |
| `updatedAt` | 最近一次有效内容更新日期，使用 `YYYY-MM-DD`。 |
| `tags` | 展示在卡片和文章页的标签。 |
| `series` | 可选，系列展示名称。 |
| `seriesSlug` | 可选，系列路由片段。 |
| `seriesOrder` | 可选，系列内排序数字。 |
| `status` | `published` 或 `draft`。 |
| `lang` | `zh` 或 `en`。 |
| `cover` | 预留图片字段，可以为空字符串。 |
| `seoTitle` | 可选 SEO 标题。 |
| `seoDescription` | 可选 SEO 描述。 |

已发布文章可能出现在 `/blog`、`/blog/[slug]`、系列页、首页 Blog、Console blog 命令、sitemap、RSS 和 SEO metadata 中。

## 项目案例

项目文件放在：

```text
content/projects
```

推荐路径：

```text
content/projects/my-new-project/index.md
```

公开项目路由：

```text
/projects/[slug]
```

最小示例：

```md
---
title: "My New Project"
slug: "my-new-project"
subtitle: "一句话说明项目。"
summary: "用于卡片和 metadata 的项目摘要。"
status: "building"
statusLabel: "Building"
type: "Learning Project"
role:
  - "Engineering"
timeline: "2026"
featured: false
order: 10
techStack:
  - "Next.js"
  - "TypeScript"
features:
  - "当前范围内的功能。"
highlights:
  - "工程亮点或设计取舍。"
links: []
relatedPosts: []
relatedSeriesSlug: ""
published: false
lang: "zh"
seoTitle: "My New Project"
seoDescription: "项目 SEO 描述。"
---

## 项目背景

这里写项目 case study。
```

Project frontmatter：

| 字段 | 作用 |
| --- | --- |
| `title` | 项目标题。 |
| `slug` | `/projects/[slug]` 的公开 URL 片段，必须唯一。 |
| `subtitle` | 一句辅助说明。 |
| `summary` | 项目卡片和 metadata fallback。 |
| `status` | 规范化状态，例如 `building`、`production`、`mvp`。 |
| `statusLabel` | 面向用户展示的状态文案。 |
| `type` | 项目类型。 |
| `role` | 角色列表。 |
| `timeline` | 时间线或阶段说明。 |
| `featured` | `true` 时进入首页 Projects。 |
| `order` | 排序，数字越小越靠前。 |
| `techStack` | 技术栈标签。 |
| `features` | 当前范围或可见功能。 |
| `highlights` | 工程亮点和设计取舍。 |
| `links` | 链接对象，包含 `label`、`href`、`type`。 |
| `relatedPosts` | 关联博客文章。 |
| `relatedSeriesSlug` | 关联到某个博客系列。 |
| `published` | `true` 表示公开。 |
| `lang` | `zh` 或 `en`。 |
| `seoTitle` | 可选 SEO 标题。 |
| `seoDescription` | 可选 SEO 描述。 |

已发布项目可能出现在 `/projects`、`/projects/[slug]`、首页 Projects、Console projects 输出、sitemap 和相关项目区域。

## Profile、Contact 与 Stack

file mode 文件：

```text
content/profile/profile.md
content/profile/contact-channels.md
content/profile/system-stack.md
```

维护建议：

- 公开 Profile 保持准确，并注意隐私边界。
- 只有确实要公开展示的联系渠道才设置 `visible: true`。
- 空的 contact `href` 不应该渲染成可点击链接。
- 技术栈分组要如实反映当前能力和学习状态。
- 不要发布私人联系方式、私人资料文件、密钥、真实客户名称或敏感项目细节。

## 验证

有实际内容修改后运行：

```bash
pnpm lint
pnpm build
```

建议检查：

```text
/
/blog
/blog/series
/projects
/sitemap.xml
/rss.xml
```

file-mode 内容在构建或服务运行时读取，生产更新需要重新构建。
