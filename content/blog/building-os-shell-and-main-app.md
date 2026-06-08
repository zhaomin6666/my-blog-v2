---
title: "Phase 1-3：从 OS 外壳到 Main App 内容模块"
slug: "building-os-shell-and-main-app"
summary: "记录 Personal Developer OS 早期实现过程：从基础 OS 外壳、全局设置系统，到 Main App 的主要内容模块。"
date: "2026-05-24"
updatedAt: "2026-05-24"
tags: ["Developer OS", "Next.js", "Frontend"]
series: "从 Hexo 到 Personal Developer OS"
status: "published"
lang: "zh"
cover: ""
seoTitle: "Phase 1-3：从 OS 外壳到 Main App 内容模块"
seoDescription: "记录 Personal Developer OS 的 Phase 1-3：OS Shell、全局设置系统和 Main App 内容模块的实现过程。"
---

# Phase 1-3：从 OS 外壳到 Main App 内容模块

确定了 Personal Developer OS 的方向之后，接下来要面对的问题就是：怎么把这个概念拆成可以一步步做的阶段。

我没有一上来就做博客系统、SEO 或者部署。原因很简单——如果 OS 外壳和信息结构没站稳，后面加再多东西也会变得松散。第一阶段的目的是先让网站"像一个系统"，然后再往里面填内容。

所以 Phase 1 到 Phase 3 的重点其实不在功能多少，而是先把基础形态立起来。

## Phase 1：Developer OS 外壳

Phase 1 先把 OS Shell 搭出来。

这个阶段做的事情比较基础：把 System Status Bar、Main App Window、Console App Window 和 Desktop fallback 几个核心界面元素建起来。

**Status Bar** 在页面顶部，充当全局入口。它不像普通导航栏，更接近系统状态栏——可以切应用，也可以放主题、语言和视觉风格的控件。

**Main App Window** 是主要内容区域。它得看起来像一个应用窗口：有标题栏、窗口控制按钮、内部滚动区域。这样后续 About、Skills、Projects、Blog 都可以放在窗口里面，而不是直接摊在页面上。这一步的设计选择影响后面所有内容的组织方式。

**Console App Window** 是底部终端面板，看起来像一个 docked console。虽然这个阶段还没有完整的命令能力，但必须先确定它和 Main App 的关系——它是另一个独立的应用，不是 Main App 里嵌的一个小组件。这个区分后面会越来越重要。

**Desktop fallback** 处理两个应用都关掉的状态。既然 Main App 和 Console App 都可以关闭，页面就必须要有一个合理的空状态。Desktop 提供重新打开应用的入口，也让"这是一个 OS"的概念更完整。

Phase 1 还做了初步的窗口状态管理——打开、关闭、最小化、最大化和激活。逻辑本身不复杂，但它定了后面所有交互的基础行为。

## Phase 2：全局设置系统

Phase 2 重点是全局设置。

这个项目从一开始就需要支持三个维度：theme、language 和 stylePreset。

**theme** 负责 light / dark。个人网站不能只顾暗色模式，亮色模式也要像一个正经的工具界面，不能看着像普通博客模板。

**language** 负责 zh / en。网站既要面向中文技术沉淀，也可能被英文环境下的访问者看到，所以核心 UI 文案需要集中管理，能即时切换。

**stylePreset** 负责 macos / vercel。它不是主题，是视觉质感。macos 偏玻璃窗口和桌面感，vercel 偏极简、清晰和工程感。两者必须用同一套组件，通过样式 token 切换，不能写成两套页面。

这部分的实现看起来比较底层，但其实挺关键。状态管理散了，后面 UI、Console、Blog 页面都会跟着乱。Phase 2 引入了 SettingsContext，theme、language、stylePreset 统一从一个 context 里读取和更新，保存到 localStorage。用户刷新后偏好还在，也避免组件各自读写 localStorage 造成冲突。

先把全局状态收拢，后面的开发会轻松很多。

## Phase 3：Main App 内容模块

Phase 3 开始往 Main App 里填内容。

这里没有做成普通长页 section，而是继续用 OS module / dashboard panel 的思路。Main App 内部包含 Hero / Overview、About、Skills、Projects、Blog 和 Contact，但每一块都按应用里的信息模块来设计。

**Hero / Overview** 负责第一眼定位，让访问者知道这是一个面向 AI 时代产品构建的后端开发者个人系统。

**About** 用更结构化的方式介绍个人方向，不是写成大段自述。

**Skills** 用技能矩阵呈现后端、数据库、前端、AI、DevOps 和产品能力。

**Projects** 以服务模块的方式展示项目。

**Blog** 作为 Engineering Logs 入口。

**Contact** 是 endpoint 风格的联系面板。

这一步的目标不是把内容塞得很满，而是让信息架构清楚。访问者在 Main App 里应该能快速弄明白：这个人是谁，关注什么，会做什么，做过什么，写了什么，怎么联系。

这些内容都被放在一个窗口系统里。它们不是孤立的区块，而是 Personal Developer OS 的一部分。

## Phase 3.5：默认工作区和窗口行为修正

Phase 3 做完之后，还需要校准一下默认体验。

一开始如果 Main App 和 Console App 同时出现，页面会有点拥挤，访问者可能不太清楚应该先看哪里。后来把默认状态调整为：Main App 默认最大化，Console 默认关闭。

第一次访问时，用户先看到完整的主要内容。如果想用终端，可以通过 Open Terminal 打开 Console，进入 Main + Console 的双窗口工作状态。

另外，active app 决定窗口层级。用户打开或切换应用的时候，当前活跃窗口应该在前面。Console 最大化时进入纯终端模式；切回 Portfolio 时，Console 会回到底部 dock 状态，保证 Main App 可见。

这些细节看起来不大，但会直接影响网站"像一个系统"的感觉。窗口行为不稳定的话，OS 概念就只剩一个视觉壳子。

## 这一阶段的感受

Phase 1-3 做下来，我最大的感受是：AI 辅助开发并不意味着可以跳过设计和拆分。

代码生成速度变快之后，清晰的阶段划分和验收标准反而更重要了。不然很容易一次性生成一堆看起来完整的代码，但系统边界不清楚，后面改起来很痛苦。

早期阶段没有追求复杂功能，主要是在回答几个基础问题：

- 页面是不是始终保持了 Personal Developer OS 的概念？
- Main App、Console App、Desktop 和 Status Bar 的角色分清楚了吗？
- 全局设置是否有单一来源？
- 内容模块是不是服务于求职展示、项目展示和技术沉淀？

这几个问题想清楚了，后面再做 CLI、Markdown Blog、SEO、RSS 和部署，才不会变成零散功能的堆叠。

下一阶段会补上真正可用的 CLI。到那时候，Console App 就不只是一个视觉终端了，而是访问内容的另一条路径。
