---
title: "为什么我把个人网站设计成 Developer OS"
slug: "designing-personal-developer-os"
summary: "记录我为什么没有继续做普通作品集页面，而是把个人网站设计成一个运行在浏览器里的 Personal Developer OS。"
date: "2026-05-21"
updatedAt: "2026-05-21"
tags: ["Developer OS", "Product Design", "Personal Site"]
series: "从 Hexo 到 Personal Developer OS"
seriesSlug: "personal-developer-os"
seriesOrder: 2
status: "published"
lang: "zh"
cover: ""
seoTitle: "为什么我把个人网站设计成 Developer OS"
seoDescription: "从普通作品集页面的局限出发，解释 Personal Developer OS 这个个人网站方案背后的设计决策。"
---

# 为什么我把个人网站设计成 Developer OS

在重新做个人网站之前，我想了挺久一个问题：它到底应该长什么样？

最直接的答案很简单。做一个常规作品集页面就行：顶部一句介绍，下面 About、Projects、Blog、Contact，最后放几个链接。结构清晰，成本低，也符合大多数人的浏览习惯。

但我总觉得差点意思。

如果网站只是把我的信息平铺出来，完成"展示资料"的任务当然没问题，但很难从中看出我对产品和工程的理解。对一个开发者来说，个人网站不一定只是简历的网页版。它也可以是一件小作品——访问者能从交互方式、信息组织和实现细节里看到一些你的判断力。

## 普通作品集的问题在哪

普通个人网站最大的问题不是不好用，是太容易做得千篇一律。

大多数页面都遵循同一种结构：Hero 做自我介绍，About 写经历，Projects 放卡片，Blog 挂文章入口，Contact 留邮箱和社交链接。这个结构本身没有错，但如果不做进一步设计，它很容易变成一张平铺的信息表。

我希望新网站能保留这些必要内容，同时让内容的组织方式本身也有点表达。不追求复杂交互，但希望它能自然体现几个东西：

- 我比较在意系统结构，而不只是页面好不好看。
- 我习惯把功能拆成模块，而不是把所有东西堆在一起。
- 网站是活的，能长期迭代，不是做完就扔在那。
- 博客、作品、终端入口和个人信息能放在同一个产品概念里。

把这些需求放在一起看，普通长页就有点不够用了。

## 从 CLI 首页到 Developer OS

一开始我想做的是一个 CLI 首页。

访问网站后用户看到一个终端，可以输入 `about`、`skills`、`projects`、`blog`、`contact` 进入不同区域。这个想法挺有开发者气质，也能让网站有一点辨识度。

但往下想就觉得纯 CLI 有点问题。它对不熟悉终端的访问者不太友好，也不太适合展示完整内容。项目卡片、技能矩阵、博客列表这些东西用命令输出当然可以做，但阅读体验不一定好。而且求职场景下，很多人可能并不想先学一套命令才能看你的简历。

所以后来我把这个想法改成了 Personal Developer OS。

终端不再只是唯一入口，而是变成了 Console App；主要内容放进 Main App。整个页面像一个跑在浏览器里的轻量桌面系统：有应用窗口，有状态栏，有桌面 fallback，也有可切换的视觉风格。这样既保留了 CLI 的开发者特征，又不会牺牲常规的浏览体验。

## 四个核心界面

Personal Developer OS 的界面各有分工，不是随便凑的。

**Main App** 是主要内容窗口。它负责展示 Hero / Overview、About、Skills、Projects、Blog、Contact。内容还是个人网站该有的那些信息，但我把它们设计成 OS module / dashboard panel 的样子，不是普通网页 section。浏览的时候感觉更像是在用一个小应用，而不是在滚一张长页面。

**Console App** 是终端入口。可以跑 `help`、`about`、`skills`、`projects`、`blog`、`contact` 这些命令，也支持 `logs`、`articles` 这样的别名查看文章。它不是要取代 Main App，只是提供另一种访问方式。对习惯终端的人来说会更自然。

**Desktop** 是 fallback。Main App 和 Console App 都关掉的时候，页面不能变空白，所以 Desktop 会出来，并提供重新打开应用的入口。这个状态看起来不起眼，但它保证了 OS 概念的完整性——应用可以关，桌面还在。

**System Status Bar** 是全局控制区。应用入口、主题切换、语言切换、视觉 preset 切换都放在这里。它让整个页面更像一个系统，不是一组散着的组件。

## macos 和 vercel 两种 preset

视觉上我留了两个方向：macos 和 vercel。

macos preset 偏玻璃质感的桌面窗口，有柔和阴影、圆角和窗口控制按钮，强调"浏览器里的轻量桌面 OS"。

vercel preset 偏极简工具界面，边界更清晰，颜色更克制，强调信息密度和工程感。同一套内容换上 vercel preset，看起来更像一个面向开发者的控制台产品。

这两种风格不是两套页面，是同一套组件通过 style tokens 切出来的。这个约束很重要——避免为了视觉差异复制组件，也让后续维护更清楚。

## 不是炫技

我不希望这个设计被理解成炫技。

如果只是为了酷，可以做更复杂的窗口拖拽、更花哨的动画，甚至做成游戏界面。但这些不是这个阶段要解决的问题。Personal Developer OS 的核心在于：它用一个统一的产品概念把个人信息、博客内容、项目展示和终端入口组织在一起。

对访问者来说，它仍然应该清楚、可读、能导航。对我自己来说，它是一个可以慢慢扩展的个人系统。后续不管是加博客文章，还是完善 CLI、SEO、部署，都可以沿着这个概念往前走。

下一篇会记录 Phase 1-3 的实现过程：先搭 OS Shell，再做全局设置系统，最后把 Main App 的内容模块填进去。真正开始写代码之后才更明显地感受到，一个清晰的产品概念确实让工程拆分轻松了不少。
