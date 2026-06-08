# 设计简报 - Personal Dev OS

本文件是项目设计方向的中文版本。所有后续开发都应优先保护这里定义的产品概念。

## 1. 项目名称

**Personal Dev OS**

## 2. 一句话定位

一个运行在浏览器中的个人开发者操作系统，用于展示后端开发、AI 应用、技术博客、项目作品和独立产品入口。

## 3. 核心概念

整个页面不是普通作品集网站，而是一个轻量级的浏览器桌面 OS。

当前 OS 只包含两个应用：

- **Main App**：主要内容窗口，用于展示 Portfolio / Dashboard 内容。
- **Console App**：底部终端 / 控制台面板。

当 Main App 和 Console App 都关闭时，显示 **Desktop** 占位桌面。

## 4. 视觉方向

项目融合两种视觉风格：

- **macOS Glass**：现代 macOS 风格窗口，强调玻璃质感、圆角、柔和阴影、彩色窗口控制按钮和模糊背景。
- **Vercel Minimal**：极简、锐利、单色、高对比，使用网格点背景和等宽字体，不使用玻璃效果。

两种风格通过同一套组件切换：

```ts
stylePreset = "macos" | "vercel"
```

要求：不能写两套页面。视觉差异应通过 style tokens、CSS 变量或 Tailwind class 映射实现。

## 5. 固定结构

以下元素必须始终存在：

- **System Status Bar**：顶部系统状态栏。
- **Main App**：主要内容窗口。
- **Console App**：底部控制台窗口。
- **Desktop**：桌面占位状态。
- **App Menu**：状态栏里的应用入口。
- **Theme Toggle**：light / dark 切换。
- **Language Toggle**：zh / en 切换。
- **Style Preset Toggle**：macos / vercel 切换。

## 6. Main App 设计要求

Main App 必须是一个应用窗口，而不是普通网页区域。

必须包含：

- 标题栏。
- macOS 风格窗口控制按钮：关闭、最小化、最大化。
- 内容在窗口内部滚动。
- 展示 Hero / About / Skills / Projects / Blog / Contact。
- 使用 bento grid、dashboard modules、section cards 等系统化布局。
- 不能变成普通长滚动作品集模板。

## 7. Console App 设计要求

Console App 默认是固定在浏览器底部的 dock 面板。

必须包含：

- 默认固定在页面底部。
- 高度约 280px 到 340px。
- 输出增长时窗口本身不变高。
- 输出区域内部滚动。
- 输入栏固定在控制台底部。
- 标题栏和窗口控制按钮。
- 支持最小化、最大化、关闭。
- 最大化后铺满页面并进入纯终端模式。
- 关闭后可以从状态栏重新打开。

## 8. Console 命令

支持命令：

- `help`
- `about`
- `skills`
- `projects`
- `blog`
- `contact`
- `resume`
- `clear`
- `classic`
- `whoami`
- `sudo hire me`

行为规则：

- 只有 Main App 和 Console App 同时打开，且 Console App 没有最大化时，命令才会联动 Main App 滚动或高亮。
- Console App 最大化时是纯终端模式，输出只留在终端内部。
- Main App 关闭时，Console App 仍然可以独立工作。
- `clear` 清空输出。
- 无效命令提示：`Command not found. Type 'help' to see available commands.`

## 9. Desktop 占位要求

当 Main App 和 Console App 都关闭时显示。

第一版可以简单，但必须包含：

- Developer OS 风格背景。
- System Status Bar 仍然存在。
- "Open Main App" 入口。
- "Open Console App" 入口。
- 不能出现空白页。

## 10. 主题要求

支持：

- `light`
- `dark`

要求：

- 默认跟随系统主题。
- 用户选择保存到 localStorage。
- 暗色和亮色都要有高级工具感。
- 不能只优化暗色模式。
- 亮色模式不能像普通博客，要像高质量工具界面。

## 11. 多语言要求

支持：

- `zh`
- `en`

要求：

- 核心文案集中在 translations 配置中。
- 切换语言即时生效。
- 用户选择保存到 localStorage。
- 不允许在组件里散落硬编码中文或英文。

## 12. 内容模块

### Hero

面向 AI 时代构建产品的后端开发者。

### About

我是一名后端开发者，专注于构建稳定可靠的业务系统，并持续探索 AI 原生应用。我关注架构设计、工程实践、产品思维，以及如何借助 AI 工具更高效地完成独立交付。

### Skills

- Backend: Java, Spring Boot, MyBatis, REST APIs
- Database: MySQL, PostgreSQL, Redis
- Frontend: React, Next.js, TypeScript, Tailwind CSS
- AI: LLM Apps, RAG, Agent Workflow, Prompt Engineering
- DevOps: Docker, Nginx, Linux, CI/CD
- Product: Requirement Analysis, System Design, Technical Writing

### Projects

- AI Agent Demo
- Bidding System Platform
- Personal Dev OS

### Blog

- 从 Java 后端到 AI Agent 开发的学习路线。
- LangChain 和 LangGraph 的关系与实践。
- 如何设计一个程序员的个人网站。
- RAG 应用从 0 到 1 实战记录。

### Contact

- Email
- GitHub
- LinkedIn
- Resume Download

## 13. 禁止事项

不要：

- 做成通用作品集模板。
- 过度使用霓虹赛博朋克视觉。
- 做成游戏 UI。
- 添加过多粒子效果。
- 添加自由拖拽窗口。Phase 1 不包含该能力。
- 添加真实博客系统。Phase 1 不包含该能力。
- 添加后端 API。Phase 1 不包含该能力。
- 添加复杂 CMS。Phase 1 不包含该能力。
- 一次堆太多动画。

