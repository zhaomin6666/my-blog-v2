# Design Brief — Personal Dev OS

Single source of truth for the entire project. Both Codex and Claude Code must follow this document.

---

## 1. Project Name
**Personal Dev OS**

## 2. One-line Positioning
**EN:** A browser-based Personal Developer OS for a backend developer building AI-era products.

**ZH:** 一个运行在浏览器中的个人开发者操作系统，用于展示后端开发、AI 应用、技术博客、项目作品和独立产品入口。

## 3. Core Concept
The entire page is a lightweight desktop OS.

Currently the OS contains exactly two applications:
- **Main App**: Primary content window (Portfolio / Dashboard)
- **Console App**: Terminal / console dock panel

When both apps are closed, the **Desktop** placeholder is displayed.

## 4. Visual Direction
A fusion of two styles:
- **Style A — macOS Glass**: Modern windowed macOS aesthetic with glassmorphism, rounded corners, soft shadows, colored traffic lights, blurred backgrounds.
- **Style B — Vercel Minimal**: Ultra-clean minimalism with sharp edges, monochrome palette, grid dots background, monospace typography, no glass effects.

Both styles are toggled via:
```ts
stylePreset = "macos" | "vercel"
```

**Requirement**: Do not write two separate pages. Use the same component set. Switch visual质感 through style tokens / CSS variables / Tailwind class mapping.

## 5. Fixed Structure
These elements must always exist:
- **System Status Bar** — top system status bar
- **Main App** — primary content window
- **Console App** — bottom console window
- **Desktop** — placeholder desktop
- **App Menu** — application menu in status bar
- **Theme Toggle** — light / dark switch
- **Language Toggle** — zh / en switch
- **Style Preset Toggle** — macos / vercel switch

## 6. Main App Design Requirements
Main App is an application window, not a normal webpage area.

Must have:
- Title bar
- macOS-style window control buttons (close / minimize / maximize)
- Content scrolls inside the window
- Displays: Hero / About / Skills / Projects / Blog / Contact
- Uses bento grid, dashboard modules, section cards for a system-like layout
- Must NOT become a normal long-scrolling page template

## 7. Console App Design Requirements
Console App is a bottom dock panel window by default.

Must have:
- Fixed at browser bottom by default
- Height approximately 280px–340px
- Does NOT expand when output grows
- Internal output area scrolls
- Input bar fixed at console bottom
- Title bar with window control buttons
- Supports minimize / maximize / close
- When maximized, fills the page and enters pure terminal mode
- Can be reopened from the status bar after closing

## 8. Console Commands
Supported commands:
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

Behavior rules:
- Only when both Main App and Console App are open AND Console is NOT maximized do commands联动 scroll or highlight in Main App
- When Console is maximized, pure terminal mode — output stays inside terminal only
- When Main App is closed, Console can still work independently
- `clear` clears output
- Invalid command response: `Command not found. Type 'help' to see available commands.`

## 9. Desktop Placeholder Requirements
Shown when both Main App and Console App are closed.

First version can be simple, but must include:
- Developer OS style background
- System Status Bar still present
- "Open Main App" entry point
- "Open Console App" entry point
- No blank page allowed

## 10. Theme Requirements
Support:
- `light`
- `dark`

Requirements:
- Default to system theme preference
- Save user choice to localStorage
- Both dark and light must look premium
- Do not only optimize dark mode
- Light mode must also feel like a high-end tool, not a normal blog

## 11. Multilingual Requirements
Support:
- `zh`
- `en`

Requirements:
- All core copy centralized in translations config
- Instant language switching
- Save preference to localStorage
- Do not hardcode Chinese or English scattered in components

## 12. Content Modules

### Hero
**EN:** Backend Developer building AI-era products.

**ZH:** 面向 AI 时代构建产品的后端开发者

### About
**ZH:** 我是一名后端开发者，专注于构建稳定可靠的业务系统，并持续探索 AI 原生应用。我关注架构设计、工程实践、产品思维，以及如何借助 AI 工具更高效地完成独立交付。

**EN:** I am a backend developer focused on building reliable business systems and exploring AI-native applications. I care about clean architecture, practical engineering, product thinking, and using AI tools to ship faster as an independent builder.

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
- 从 Java 后端到 AI Agent 开发的学习路线
- LangChain 和 LangGraph 的关系与实践
- 如何设计一个程序员的个人网站
- RAG 应用从 0 到 1 实战记录

### Contact
- Email
- GitHub
- LinkedIn
- Resume Download

## 13. Prohibited
Do NOT:
- Make a generic portfolio template
- Overuse neon cyberpunk aesthetics
- Make a game UI
- Add excessive particle effects
- Add free-form window dragging (Phase 1 does not include this)
- Add a real blog system (Phase 1 does not include this)
- Add backend APIs (Phase 1 does not include this)
- Add a complex CMS (Phase 1 does not include this)
- Pile on too many animations at once
