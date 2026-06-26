# 内容发布流程

本文档用于固化 Personal Developer OS 当前的文件型内容维护方式。

当前 file mode 站点有六类内容源：

```text
content/site      -> SiteConfigService    -> Site Identity / 默认 SEO
content/homepage  -> HomepageService      -> Homepage Hero
content/pages     -> PageConfigService    -> Blog / Projects 页面配置
content/profile   -> ProfileService       -> Profile / Stack / Contact
content/blog      -> BlogService          -> Blog posts
content/projects  -> ProjectService       -> Project cases
```

database mode 使用对应的 Admin 和 PostgreSQL 内容源：

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
这份文档偏向日常操作：文件放在哪里、frontmatter 字段怎么填、公开 URL 怎么生成、发布前怎么验证。

## 1. 内容架构概览

内容数据与 UI 组件分离。

页面和客户端组件不直接读取 Markdown 文件。服务端通过 Repository 读取内容、规范化 frontmatter、过滤未发布内容，再通过 Service 把可序列化数据传给页面和组件。

关键原则：

- 当前内容文件就是存储层。
- 公开 URL 来自 `frontmatter.slug`，不是文件夹名或文件名。
- 公开页面、sitemap、RSS、SEO 输出和 Console 元数据只使用已发布内容。
- Repository 接口保持稳定，未来可以替换成 CMS 或数据库实现。
- 不要在 React 组件里重复维护 Blog、Project 或 Profile 数据。

### Site、Homepage 与 Page Config

以下文件负责站点级和页面级文案，不应该再放进 `lib/translations.ts`：

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

维护规则：

- Site Identity 和默认 SEO 在 file mode 下来自 `content/site`，在 database mode 下来自 `/admin/site`。
- `siteUrl` 是部署配置，仍由 `NEXT_PUBLIC_SITE_URL` 控制，不通过 Admin CMS 编辑。
- Homepage Hero 的标题、副标题和 badge 在 file mode 下来自 `content/homepage`，在 database mode 下来自 `/admin/hero`。
- Blog / Projects 的页面标题、副标题、footer 文案和默认 metadata 在 file mode 下来自 `content/pages`，在 database mode 下来自 `/admin/pages`。
- `lib/translations.ts` 只放 UI chrome：label、按钮、空状态、aria label、校验提示和命令提示，不再承载网站内容。

## 2. Blog 发布流程

博客文件位于：

```text
content/blog
```

Repository 会递归扫描 Markdown 文件，因此系列文章可以放在子目录里：

```text
content/blog/personal-developer-os/08-v1-review.md
content/blog/ai-agent-learning/01-intent-classifier.md
```

文章公开 URL 由 `slug` 决定：

```text
/blog/[slug]
```

只要 `slug` 不变，移动文件目录不会改变公开 URL。

### 新增单篇文章

1. 在 `content/blog` 下创建 Markdown 文件。
2. 填写 frontmatter。
3. 在结束的 `---` 下方写 Markdown 正文。
4. 草稿阶段使用 `status: "draft"`。
5. 准备公开时再改为 `status: "published"`。
6. 运行 `pnpm lint` 和 `pnpm build`。

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

### 新增系列文章

为了便于管理，可以用子目录组织系列文章，并增加 `series`、`seriesSlug`、`seriesOrder`。

示例路径：

```text
content/blog/ai-agent-learning/01-intent-classifier.md
```

frontmatter 示例：

```yaml
series: "AI Agent Learning"
seriesSlug: "ai-agent-learning"
seriesOrder: 1
```

规则：

- `series` 是展示名称。
- `seriesSlug` 决定系列页路由：`/blog/series/[seriesSlug]`。
- `seriesOrder` 决定系列内文章排序。
- 系列公开后尽量保持 `seriesSlug` 稳定。
- 不要复用已有文章的 `slug`。

### Blog frontmatter 字段

| 字段 | 作用 |
| --- | --- |
| `title` | 文章标题。 |
| `slug` | `/blog/[slug]` 的公开 URL 片段，必须唯一。 |
| `summary` | 列表卡片、metadata fallback 和预览文案。 |
| `date` | 首次发布日期，使用 `YYYY-MM-DD`。 |
| `updatedAt` | 最近一次有效内容更新日期，使用 `YYYY-MM-DD`。 |
| `tags` | 展示在博客卡片和文章页的标签。 |
| `series` | 可选，系列展示名称。 |
| `seriesSlug` | 可选，系列页 URL 片段。 |
| `seriesOrder` | 可选，系列内排序数字。 |
| `status` | `published` 或 `draft`，草稿不会进入公开输出。 |
| `lang` | `zh` 或 `en`。 |
| `cover` | 预留封面字段，可以为空字符串。 |
| `seoTitle` | 可选 SEO 标题。 |
| `seoDescription` | 可选 SEO 描述。 |

阅读时长和字数会在构建时根据 Markdown 正文生成，不需要手动维护。

### Blog 公开输出

已发布文章可能出现在：

- `/blog`
- `/blog/[slug]`
- `/blog/series`
- `/blog/series/[seriesSlug]`
- 首页 Blog 区域
- Console 的 `blog`、`logs`、`articles` 输出
- `/sitemap.xml`
- `/rss.xml`
- SEO metadata

草稿不应出现在公开页面、sitemap、RSS 或 metadata 中。

## 3. Project 发布流程

项目文件位于：

```text
content/projects
```

新增项目推荐路径：

```text
content/projects/my-new-project/index.md
```

项目公开 URL 由 `slug` 决定：

```text
/projects/[slug]
```

### 新增项目

1. 在 `content/projects` 下创建项目目录。
2. 添加 `index.md`。
3. 填写 frontmatter。
4. 在 frontmatter 下方写项目 case study 正文。
5. 未准备公开前使用 `published: false`。
6. 只有希望出现在首页 Projects 区域的项目才设置 `featured: true`。
7. 运行 `pnpm lint` 和 `pnpm build`。

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
  - "Backend Development"
  - "AI-assisted Development"
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

### Project frontmatter 字段

| 字段 | 作用 |
| --- | --- |
| `title` | 项目标题。 |
| `slug` | `/projects/[slug]` 的公开 URL 片段，必须唯一。 |
| `subtitle` | 一句辅助说明。 |
| `summary` | 项目卡片和 metadata fallback。 |
| `status` | 内部规范化状态，例如 `building`、`production`、`mvp`。 |
| `statusLabel` | 面向用户展示的状态文案。 |
| `type` | 项目类型。 |
| `role` | 角色列表，可以是数组或逗号分隔字符串。 |
| `timeline` | 时间线或阶段说明。 |
| `featured` | `true` 会进入首页 Projects 区域。 |
| `order` | 排序，数字越小越靠前。 |
| `techStack` | 技术栈标签。 |
| `features` | 当前范围或可见功能。 |
| `highlights` | 工程亮点和设计取舍。 |
| `links` | 链接对象，包含 `label`、`href`、`type`。 |
| `relatedPosts` | 关联博客文章，包含 `title` 和 `slug`。 |
| `relatedSeriesSlug` | 关联到某个博客系列。 |
| `published` | `true` 表示公开。 |
| `lang` | `zh` 或 `en`。 |
| `seoTitle` | 可选 SEO 标题。 |
| `seoDescription` | 可选 SEO 描述。 |

### Project 公开输出

已发布项目可能出现在：

- `/projects`
- `/projects/[slug]`
- `featured: true` 时出现在首页 Projects 区域
- Console 的 `projects` 输出
- `/sitemap.xml`
- 博客系列页和文章页的相关项目区域

不要在 React 组件里硬编码项目数据。新增或修改项目时编辑 Markdown 内容。

## 4. Profile 维护流程

Profile 内容位于：

```text
content/profile/profile.md
content/profile/contact-channels.md
content/profile/system-stack.md
```

三份文件都通过 `ProfileService` 读取，并作为 `PublicProfile` 传给 Main App。

### profile.md

用于维护公开个人档案：

- backend engineering 背景
- AI Agent / 全栈方向
- 脱敏企业系统经验
- 当前关注方向
- 工作方式
- 正在建设的项目
- 公开协作方向
- 资料隐私说明

文件中已有不会渲染到前台的 HTML 注释，用来说明 frontmatter 和前台展示的映射关系。保留这些注释为编辑维护说明，不要改成可见页面文字。

不要添加：

- 手机号
- 微信号
- 地址
- 生日
- 身份证号
- 真实单位名称
- 真实客户名称
- 真实甲方名称
- 敏感项目细节
- 私人资料 PDF 链接

### contact-channels.md

用于维护公开联系入口和 CTA。

规则：

- `visible: true` 表示该渠道可公开展示。
- `visible: false` 表示隐藏。
- `href` 为空时不应渲染成可点击链接。
- `disabled: true` 可以展示可用性或状态说明，但不跳转。
- Contact 保持克制，不要变成营销式链接墙。
- 除非隐私策略改变，不要公开私人邮箱、手机、微信、住址或私人资料 PDF 链接。

### system-stack.md

用于维护技术栈分组。

当前分组包括：

- Backend
- Frontend / Full-stack
- AI Agent
- DevOps / Deployment
- Learning / Exploring

学习阶段内容应放在 `Learning / Exploring`，不要把探索中的方向写成熟练生产经验。

## 5. 本地验证

有实际内容修改后运行：

```bash
pnpm lint
pnpm build
```

建议检查路由：

```text
/
/blog
/blog/series
/blog/series/personal-developer-os
/projects
/projects/personal-developer-os
/projects/ai-agent-demo
/sitemap.xml
/rss.xml
```

因为当前使用文件型内容源，生产输出变化需要重新构建。

`pnpm build` 后如需本地模拟生产服务，使用 standalone 输出：

```bash
PORT=3100 node .next/standalone/server.js
```

然后访问：

```text
http://localhost:3100
```

Windows PowerShell：

```powershell
$env:PORT="3100"; node .next/standalone/server.js
```

## 6. 提交流程

提交前：

```bash
git status
pnpm lint
pnpm build
```

只提交本次相关文件：

```bash
git add docs/CONTENT_WORKFLOW.md docs/CONTENT_WORKFLOW.zh-CN.md
git commit -m "docs: add content workflow"
git push
```

不要提交本地环境变量、生成日志、证书、私钥、服务器 IP 或私人私人资料文件。

## 7. 部署流程

生产更新路径：

```bash
cd /srv/example-app
git pull
docker compose --env-file .env.production up -d --build
```

注意：

- `NEXT_PUBLIC_SITE_URL` 必须同时在构建期和运行期可用。
- 修改 `NEXT_PUBLIC_SITE_URL`、SEO、sitemap、RSS 或域名配置后必须重新构建。
- 内容更新也需要重新构建，因为当前内容来自文件。
- 如果 Docker 缓存导致旧 metadata、sitemap 或 RSS 残留，使用无缓存构建：

```bash
docker compose --env-file .env.production build --no-cache
docker compose --env-file .env.production up -d
```

线上检查：

```text
https://example.com
https://example.com/blog
https://example.com/projects
https://example.com/sitemap.xml
https://example.com/rss.xml
```

确认 sitemap 和 RSS 使用 `https://example.com`，并且没有暴露草稿内容。

## 8. 隐私规则

不要提交或公开：

- `.env.production`
- `.env.local`
- 证书文件
- 私钥
- 服务器 IP
- 部署密钥
- 私人资料 PDF
- 手机号
- 微信号
- 地址
- 身份证号
- 生日
- 真实单位名称
- 真实客户名称
- 真实甲方名称
- 敏感项目细节
- 编造的用户量、收入、访问量或生产落地结果

允许使用脱敏表达，例如：

- 企业流程系统
- 电子招采平台
- 业务对象管理
- 评审资源管理
- 计划流程管理
- 企业系统对接
- 公共资源交易服务平台
- 企业数字化服务团队
- 某大型企业客户

## 9. 未来 CMS / 后台 / 数据库迁移

当前实现：

```text
FileBlogRepository
FileProjectRepository
FileProfileRepository
```

未来可以替换为：

```text
CmsBlogRepository
CmsProjectRepository
CmsProfileRepository

DatabaseBlogRepository
DatabaseProjectRepository
DatabaseProfileRepository
```

页面层继续使用：

```text
BlogService
ProjectService
ProfileService
```

迁移规则：

- 不要让页面直接查询数据库。
- 不要让客户端组件直接依赖 CMS SDK。
- 保持 Repository 接口稳定。
- 保持公开 `slug` 稳定。
- 保持 `published`、`draft`、`featured`、`order`、`seriesSlug`、`seriesOrder` 等字段语义稳定。
- sitemap 和 RSS 继续只包含已发布内容。

