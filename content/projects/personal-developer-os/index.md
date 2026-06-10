---
title: "Personal Developer OS"
slug: "personal-developer-os"
subtitle: "一个运行在浏览器里的个人开发者操作系统风格网站。"
summary: "基于 Next.js 构建的个人开发者网站，用 OS Shell 承载作品集、技术博客、项目展示、求职入口和 AI Agent 学习沉淀。"
status: "production"
statusLabel: "Production / v1.0 已上线"
type: "个人品牌 / 技术博客 / 作品集"
role:
  - "Product Design"
  - "Full-stack Development"
  - "AI-assisted Development"
  - "Self-hosted Deployment"
timeline: "2026 · Phase 1-8 持续建设"
featured: true
order: 1
techStack:
  - "Next.js"
  - "React"
  - "TypeScript"
  - "Tailwind CSS"
  - "Markdown"
  - "Docker"
  - "Nginx"
features:
  - "Developer OS 风格首页，包含 Main App、Console App、Desktop 和 Status Bar。"
  - "macos / vercel 双视觉 preset，light / dark 主题，zh / en 语言切换。"
  - "CLI 命令系统、Markdown Blog、Blog Series、阅读时长、SEO、sitemap、robots 和 RSS。"
highlights:
  - "把个人网站设计成轻量 Developer OS，而不是普通作品集模板。"
  - "博客系统采用 Markdown + BlogRepository / FileBlogRepository / BlogService 分层。"
  - "支持文章系列、递归内容目录、slug 与文件路径解耦、阅读统计和公开内容发现。"
  - "通过 Docker、Nginx 和 Let's Encrypt 完成自托管 HTTPS 部署。"
links:
  - label: "Live Demo"
    href: "https://oli6666.top"
    type: "live"
  - label: "GitHub"
    href: "https://github.com/zhaomin6666/my-blog-v2"
    type: "github"
  - label: "查看系列文章"
    href: "/blog/series/personal-developer-os"
    type: "series"
relatedPosts:
  - title: "为什么我要重新做一个个人博客网站"
    slug: "why-rebuild-my-personal-blog"
  - title: "为什么我把个人网站设计成 Developer OS"
    slug: "designing-personal-developer-os"
  - title: "Phase 4：给个人网站加一个真正可用的 CLI"
    slug: "building-cli-for-personal-developer-os"
relatedSeriesSlug: "personal-developer-os"
published: true
lang: "zh"
seoTitle: "Personal Developer OS 项目案例"
seoDescription: "一个基于 Next.js 的个人开发者操作系统风格网站，包含 Developer OS 首页、Markdown 博客、SEO、RSS 和 Docker/Nginx/HTTPS 自托管部署。"
---

## 项目背景

我原来有一个基于 Hexo 的静态博客。它可以发布文章，但整体更像一个内容容器，很难同时展示工程能力、产品想法、AI 辅助开发过程和求职作品集。

随着 Vibe Coding 和 AI 辅助开发逐渐成熟，我希望不再只是套用博客模板，而是自己设计并实现一个更能体现个人工程判断的网站。于是这个项目从“重新做博客”变成了“做一个运行在浏览器里的轻量 Developer OS”。

## 要解决的问题

这个项目主要解决三个问题。

第一，普通博客和作品集页面的信息组织太线性，很难承载我想展示的多个面向：后端能力、AI Agent 学习、项目作品、技术写作和求职入口。

第二，我希望网站本身就是一个工程作品，而不是只展示别的项目。它需要有清晰的组件结构、状态管理、内容系统、SEO 输出和可部署能力。

第三，我希望通过真实开发过程验证 AI 协作开发的边界：哪些事情适合交给 AI 辅助，哪些事情必须由我自己做设计判断、验收和取舍。

## 设计思路

首页被设计成一个轻量浏览器桌面 OS，而不是普通长页面。

核心结构包括：

- Main App：主要内容窗口，承载 Overview、About、Skills、Projects、Blog 和 Contact。
- Console App：底部终端窗口，提供本地 CLI 命令。
- Desktop：当 Main App 和 Console App 都关闭时显示的桌面占位状态。
- System Status Bar：提供应用入口、主题切换、语言切换和视觉 preset 切换。

视觉上保留两种 preset：`macos` 偏玻璃拟态窗口质感，`vercel` 偏极简工程工具风格。主题支持 `light` / `dark`，语言支持 `zh` / `en`。

## 核心功能

- Developer OS 风格首页。
- Main App / Console App / Desktop / System Status Bar。
- macos / vercel 两种视觉 preset。
- light / dark 主题切换。
- zh / en 语言切换。
- CLI 命令系统。
- Markdown Blog。
- Blog Series 页面。
- 阅读时长和字数统计。
- SEO metadata。
- sitemap.xml / robots.txt / RSS。
- Docker + Nginx + HTTPS 自托管部署。

## 工程亮点

博客系统采用文件型 Markdown 内容源，并通过 `BlogRepository`、`FileBlogRepository`、`BlogService` 分层。页面、首页模块、Console 和 SEO 输出不直接读取 Markdown 文件，而是通过服务层获取已发布内容。

内容目录支持递归扫描，文章 URL 来自 frontmatter.slug，而不是文件路径。这样移动文件夹不会破坏公开链接，也为未来接 CMS 或数据库预留了空间。

部署上使用 Next.js standalone output、Docker、Docker Compose、Docker Nginx 反向代理和 Let's Encrypt HTTPS。站点已经以 `https://oli6666.top` 作为线上地址运行。

## AI 协作开发

AI 主要参与需求拆解、代码实现、文档归档和验收检查，但项目边界由我持续约束。

开发过程按 Phase 拆分：先完成 OS Shell 和窗口系统，再补主题、语言、CLI、视觉 polish、博客系统、SEO/RSS、部署和真实内容。每个阶段都尽量保持小范围目标，通过 `pnpm lint`、`pnpm build`、路由检查和 CHANGELOG 记录完成闭环。

这个项目没有把 AI 辅助开发包装成“自动完成一切”。更准确地说，它是一次人负责判断、AI 辅助执行、再由人验收的协作实践。

## 当前状态

项目当前为 Production / v1.0 已上线，线上地址是：

[https://oli6666.top](https://oli6666.top)

关联博客系列：

[从 Hexo 到 Personal Developer OS](/blog/series/personal-developer-os)

## 后续计划

后续会继续补充项目 Case Study、求职向内容和 AI Agent 学习记录。AI Agent 在线演示和更完整的企业知识库 Agent Demo 会放到后续阶段推进，不在当前阶段接入真实在线聊天或生产 API。
