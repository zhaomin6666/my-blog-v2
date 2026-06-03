---
title: "Building a Personal Developer OS"
slug: "building-personal-developer-os"
summary: "记录 Personal Developer OS 的设计思路、架构拆分和阶段演进，以及为什么选择浏览器内的 OS 形态而非传统作品集。"
date: "2026-06-01"
updatedAt: "2026-06-03"
tags: ["Personal Site", "Developer OS", "Next.js"]
series: "Personal Developer OS"
status: "published"
lang: "zh"
cover: ""
seoTitle: "Building a Personal Developer OS"
seoDescription: "本文记录一个 Personal Developer OS 风格个人网站的设计和实现过程，探讨浏览器内 OS 形态的设计理念。"
---

# 为什么要做一个 Developer OS

传统的个人作品集网站往往是一条长页滚动：Hero、About、Skills、Projects、Blog、Contact。这种模式虽然信息完整，但缺乏个性，也很难体现后端开发者对系统设计的理解。

我想做一个更像"操作系统"的东西：有状态栏、有应用窗口、有终端控制台、有桌面。整个网站运行在浏览器里，但交互体验更接近桌面 OS。

## 核心设计决策

**两个应用窗口：**
- Main App — 主内容窗口，展示 Portfolio / Dashboard
- Console App — 底部终端面板，支持 CLI 命令

当两个应用都关闭时，Desktop 占位界面接管，提供重新打开应用的入口。

**视觉预设切换：**
- macOS Glass — 玻璃质感、圆角、阴影
- Vercel Minimal — 极简扁平、单色、网格背景

两种风格使用同一套组件，通过 style tokens 切换，不复制组件。

## 架构拆分

项目按阶段推进，每一阶段只聚焦一个目标：

1. OS 外壳 — 窗口系统、状态栏、桌面
2. 全局设置 — 主题、语言、预设
3. 主体内容 — Dashboard 风格的内容模块
4. CLI 系统 — 终端命令与主窗口联动
5. 视觉细化 — 响应式、动画、细节打磨
6. 博客与部署 — CMS-ready 博客架构、SEO、上线

## 当前状态

截至 Phase 5，Personal Developer OS 已经具备完整的窗口行为、双语支持、两种视觉预设、CLI 命令系统和响应式布局。

Phase 6 将引入基于 Markdown 的博客内容架构，并为未来的在线 CMS / 数据库升级预留接口。
