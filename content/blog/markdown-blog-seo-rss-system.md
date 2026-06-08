---
title: "Phase 6：从 Markdown 博客到 SEO、RSS 和部署准备"
slug: "markdown-blog-seo-rss-system"
summary: "记录 Personal Developer OS 的博客系统建设：从文件型 Markdown、CMS-ready 分层，到 /blog、Console、SEO、sitemap、robots、RSS 和部署准备。"
date: "2026-06-03"
updatedAt: "2026-06-03"
tags: ["Markdown", "SEO", "RSS"]
series: "从 Hexo 到 Personal Developer OS"
status: "published"
lang: "zh"
cover: ""
seoTitle: "Phase 6：从 Markdown 博客到 SEO、RSS 和部署准备"
seoDescription: "记录 Personal Developer OS 如何建立 Markdown 博客架构，并接入博客页面、首页、Console、SEO、sitemap、robots 和 RSS。"
---

# Phase 6：从 Markdown 博客到 SEO、RSS 和部署准备

做完 OS 外壳、CLI 和视觉打磨之后，网站终于有了一个稳定的容器。

但如果只有作品集模块，它还不够像我想要的个人系统。对我来说，博客仍然是个人网站里最重要的一部分。它不是单纯为了流量，而是记录学习过程、项目复盘和踩坑细节的地方。

Phase 6 的任务，就是把博客从一个首页里的展示模块，变成真正可以发布、阅读、被搜索引擎发现，也能被 RSS 订阅的内容系统。

## 为什么没有直接做在线 CMS

一开始我也想过要不要直接做后台。

比如登录管理、在线写文章、上传封面、保存草稿、发布审核。听起来很完整，也像一个“真正的博客系统”。

但冷静一点看，第一版没有必要。

这个网站是个人项目，内容发布频率不会高到必须在线编辑。直接做 CMS 会引入登录、权限、数据库、接口、安全和部署复杂度。为了三五篇文章先搭一套后台，投入和收益不太匹配。

所以我选择了更轻的方案：文件型 Markdown。

文章放在 `content/blog` 下面，用 frontmatter 描述 title、slug、summary、date、tags、series、status、lang、seoTitle、seoDescription。写作时还是 Markdown，发布时跟代码一起构建。这个方式不花哨，但足够稳定。

## 不是随便读文件

虽然底层是 Markdown 文件，我不想让页面和组件到处直接读 `content/blog/*.md`。

如果每个地方都自己读文件、自己解析 frontmatter，后面要换数据库或 CMS 就会很麻烦。首页、`/blog`、文章页、Console、sitemap、RSS 都会散着改。

所以 Phase 6 先做了一层 CMS-ready 的架构：

- `BlogRepository` 定义博客数据访问接口。
- `FileBlogRepository` 负责服务端读取 Markdown 文件和解析 frontmatter。
- `BlogService` 对页面、组件、Console 和 SEO 输出提供统一入口。

当前实现还是文件系统，但上层不关心这个细节。以后如果要换成数据库或在线 CMS，理论上只需要新增一个 repository 实现，再把 service 的依赖替换掉。

这也是后端开发习惯带来的影响。即使项目很小，我也希望边界先清楚一点。

## /blog 和文章详情页

有了数据层之后，开始做页面。

`/blog` 是文章列表页，视觉上延续 Engineering Logs 的感觉。它不是普通博客列表，而是更像系统日志：日期、标签、系列、语言和摘要都放在卡片里。这样它和 Personal Developer OS 的整体气质更一致。

`/blog/[slug]` 是文章详情页。Markdown 通过 `remark` 和 `remark-html` 渲染成 HTML，再用全局的文章排版样式展示。文章页也保留了 OS 风格的顶部栏，可以切换 theme、language 和 preset。

这里还做了 `generateStaticParams` 和 `generateMetadata`。已发布文章会在构建时生成静态路由，metadata 则根据文章的 `seoTitle`、`seoDescription`、summary 和 tags 生成。

## 首页和 Console 要用同一份数据

博客系统接入后，还有一个容易忽略的问题：不同入口不能显示不同文章。

首页 Main App 里的 Blog section 一开始用的是 mock 数据。Console 的 `blog` 命令也曾经有自己的旧数据。如果不处理，访问者可能在 `/blog` 看到两篇文章，在首页看到四篇 mock，在 Console 里又看到另一套输出。这种不一致很伤。

所以 Phase 6 把首页 Blog section 和 Console `blog` 命令都接到了 `BlogService`。

现在数据流是统一的：服务端读取已发布文章元数据，再传给客户端组件。Console 命令只消费传入的 `BlogPostMeta[]`，不直接读文件。`logs` 和 `articles` 别名也指向同一份真实数据。

这个改完后，博客入口终于收在一起了。

## draft 边界

博客系统最需要小心的是草稿。

Markdown 文件里有 `status: "published"` 和 `status: "draft"`。列表页、文章页、首页、Console、sitemap、RSS 都应该只暴露 published 内容。

这里曾经专门处理过直链问题：如果某篇文章是 draft，即使用户知道 slug，也不能通过 `/blog/[slug]` 访问到。metadata 也不能泄漏草稿信息。

最后通过 published-only 的查询方法收住边界。公开页面使用 `getPublishedPosts()` 和 `getPublishedPostBySlug()`，草稿默认不进入 public 输出。

对个人博客来说，这个细节很实际。草稿可能只是半成品，不应该因为文件在仓库里就被构建成公开内容。

## 文案和 SEO

博客页面补齐后，又处理了一轮 zh / en 文案。

页面上的标题、空状态、按钮、aria label 都尽量收回 `lib/translations.ts`。这和前面 Main App 的规则一致：用户可见文案不要散落在组件里。

SEO 部分则集中到 `lib/seo.ts`。站点标题、描述、作者、生产域名、canonical、Open Graph、Twitter card 都从这里组织。

随后补了：

- `sitemap.xml`：包含首页、`/blog` 和已发布文章。
- `robots.txt`：允许公开页面，指向 sitemap，并预留 `/admin`、`/api/preview`。
- `rss.xml`：输出已发布文章，使用绝对 URL。

这些东西平时不显眼，但部署后很重要。个人网站如果想长期作为技术写作归档，至少要让搜索引擎和 RSS 阅读器能正常发现内容。

## 部署准备

Phase 6 最后补了几份发布前资料。

`.env.example` 里给出 `NEXT_PUBLIC_SITE_URL=http://localhost:3000`。README 说明项目定位、技术栈、常用命令和博客架构。`docs/DEPLOYMENT.md` 记录生产部署前检查项。

`NEXT_PUBLIC_SITE_URL` 是这里的关键变量。它会影响 canonical、Open Graph、sitemap、robots 和 RSS。生产部署必须设成真实域名，否则构建出来的公开链接会不对。

后面 Phase 7 部署时，确实也踩到了这个变量的坑。现在回头看，Phase 6 把它先集中到 SEO 配置里是对的，不然后面排查会更麻烦。

## 未来怎么升级

这一版没有在线 CMS，但并不代表以后不能升级。

如果后面真的需要在线发布，可以新增 `DbBlogRepository` 或 `CmsBlogRepository`，让它实现同一套接口。页面、Console、sitemap、RSS 不应该跟着大改。

这就是 Phase 6 我最在意的地方：第一版保持简单，但不要把未来堵死。

从 Hexo 到 Personal Developer OS，博客这部分其实是一个小迁移。以前是主题框架帮我处理内容，现在是我自己定义数据层、页面、SEO 和发布边界。工作变多了，但掌控感也更强。

下一篇会进入真正的生产部署：Docker、Nginx、HTTPS，以及那些只有上线时才会冒出来的问题。

