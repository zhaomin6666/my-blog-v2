---
title: "Phase 4：给个人网站加一个真正可用的 CLI"
slug: "building-cli-for-personal-developer-os"
summary: "记录 Console App 从一个视觉终端，逐步变成可以输入命令、联动 Main App、展示项目和博客入口的 CLI 系统。"
date: "2026-05-28"
updatedAt: "2026-05-28"
tags: ["CLI", "Console", "Developer OS"]
series: "从 Hexo 到 Personal Developer OS"
seriesSlug: "personal-developer-os"
seriesOrder: 4
status: "published"
lang: "zh"
cover: ""
seoTitle: "Phase 4：给个人网站加一个真正可用的 CLI"
seoDescription: "记录 Personal Developer OS 中 Console App 的 CLI 实现过程，包括命令系统、Main App 联动、命令历史和终端体验优化。"
---

# Phase 4：给个人网站加一个真正可用的 CLI

前三个阶段做完之后，Personal Developer OS 已经有了 Main App、Console App、状态栏和桌面占位。页面看起来像一个轻量桌面系统，但 Console 还只是一个视觉上的终端窗口。

这件事有点尴尬。既然页面里放了一个 Console App，它就不应该只是装饰。访问者看到终端，自然会期待它能输入点什么，哪怕只是 `help`、`about`、`projects` 这些最基础的命令。

所以 Phase 4 的目标很直接：让 Console 从“像终端”变成“真的能用”。

## 为什么个人网站里要做 CLI

做 CLI 不是因为所有个人网站都需要终端。大多数作品集页面不需要，也不应该加这个东西。

但 Personal Developer OS 本来就是用“浏览器里的开发者桌面”来组织内容。Main App 是可视化内容窗口，Console App 则适合做另一条访问路径。用户可以用鼠标看内容，也可以用命令查看内容。它不替代 Main App，只是让这个 OS 概念更完整。

对我自己来说，CLI 还有一个作用：它能让网站更像一个开发者产品，而不只是一个带窗口皮肤的页面。命令、输出、历史记录、别名、prompt 这些细节都不大，但组合起来之后，访问体验会变得更有辨识度。

## 一开始只是一个终端外壳

早期 Console App 只有标题栏、输出区域和输入栏的样子，还没有真正的命令执行。

这个阶段我没有急着做复杂功能，而是先确认几个边界：

- Console 是独立应用，不是 Main App 里的组件。
- Console 输出区域内部滚动，窗口本身不因为输出变多而撑高。
- Console 最大化后进入纯终端模式。
- Console 关闭后可以从状态栏重新打开。

这些看起来像 UI 行为，其实是 CLI 后续开发的基础。如果窗口关系没确定，命令系统越写越容易影响 Main App。

## Phase 4.1 / 4.2：先做可执行的命令骨架

第一步是让输入框真的能接收命令，并在回车后产生输出。

我先做了一个很朴素的 parser：输入内容 trim 一下，然后匹配已支持的命令。最开始支持的命令包括 `help`、`about`、`skills`、`projects`、`blog`、`contact`、`resume`、`clear`、`classic`、`whoami`、`sudo hire me`。

这些命令的输出也没有做得很复杂，保持纯文本。比如 `skills` 输出技能分类，`projects` 输出项目列表，`blog` 输出文章入口，`contact` 输出联系方式。这个阶段的重点不是输出有多花，而是命令系统能稳定地跑起来。

`clear` 是一个小但必要的命令。终端如果不能清屏，使用感会很奇怪。未知命令则返回统一提示：告诉用户输入 `help` 查看可用命令。

## Phase 4.3：让 CLI 联动 Main App

命令能输出之后，下一个问题是：Console 和 Main App 是否要互相感知？

我最后做了一个比较克制的联动规则：只有 Main App 和 Console App 同时打开，且 Console 没有最大化时，部分命令才会滚动或高亮 Main App 里的对应 section。

比如输入 `about`，Console 会输出关于我的文字，同时 Main App 会滚到 About 区域。输入 `projects`，Main App 会定位到项目模块。这样 CLI 不只是输出文本，还能成为导航工具。

但当 Console 最大化时，它会进入纯终端模式。这个时候命令只在终端内部输出，不再联动 Main App。原因很简单：最大化终端时，用户的注意力就在终端里，背后再滚动一个不可见窗口没有意义，还容易让行为变得难以理解。

这里的边界比功能本身更重要。

## Phase 4.4：把使用体验补齐

命令系统跑通后，还有一些细节要补。

首先是大小写兼容。用户输入 `HELP`、`Help`、`help` 都应该能执行，不应该因为大小写让终端显得脆弱。

然后是别名。`stack` 可以指向 `skills`，`logs` 和 `articles` 可以指向 `blog`，`mail` 可以指向 `contact`，`hire` 可以指向 `sudo hire me`。这些别名不是为了炫，而是让命令更像真实使用时会自然输入的东西。

命令历史也补上了。按 Up / Down 可以回看之前输入过的命令。这个体验很基础，但少了它，Console 会一直停留在“演示控件”的感觉。

输出自动滚动也很关键。终端窗口高度是固定的，输出增长时应该自动滚到底部。否则命令执行了，用户还要手动找最新输出，体验会断一下。

## prompt 和光标

最后又处理了一轮 prompt 和输入光标。

一开始输入行前面只是一个普通前缀，后来改成了更像终端的结构：

```text
visitor@dev-os:~ $
```

`visitor`、`dev-os`、`~` 这些部分用了不同的语义颜色，看起来更接近真实终端。移动端空间小，所以 prompt 会缩短成 `dev-os:~ $`，避免挤压输入内容。

光标没有用自定义 block cursor，而是回到原生 caret。自定义光标看起来更“终端”，但在输入框里容易带来奇怪的细节问题。这里我选择稳定和可用。

## 为什么不做 AI 命令解析

这个阶段其实很容易想多。

既然网站是面向 AI 时代的个人开发者，Console 里要不要直接接一个 AI？比如用户输入自然语言，AI 帮他总结我的技能、匹配项目、推荐文章。

我最后没有做。

原因不是不想，而是这个阶段不该做。Personal Developer OS 还在打基础，CLI 的任务是提供稳定、可控的内容入口。引入 AI 解析会带来新的状态、新的接口、新的错误处理，也可能让 Console 从一个清楚的小终端变成不可预测的聊天框。

而且个人网站的第一版不需要所有东西都智能。能稳定展示内容，能用命令导航，已经够了。

## 对网站气质的影响

Phase 4 做完后，Console App 终于不只是一个视觉符号。

访问者可以通过 Main App 浏览，也可以打开终端输入命令。两条路径都能到达 About、Skills、Projects、Blog、Contact。这个变化让 Personal Developer OS 的概念更扎实了一些。

我也更明显地感受到，AI 协作开发时，小步骤很重要。CLI 如果一次性做太大，很容易改到窗口系统、联动逻辑或者 Main App 结构。拆成命令骨架、文本输出、section 联动、历史记录、prompt 优化几个小阶段，就能每次只验证一块。

这也是这个项目里我一直想保留的节奏：不要为了显得完整而一次堆很多功能。先让一个小系统可用，再慢慢把细节补到舒服。

下一篇会写 Phase 5。那一阶段没有加新功能，但对整个网站能不能作为作品展示，其实很关键。
