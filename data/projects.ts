import { Project } from '@/lib/types';

const projectItems: Project[] = [
  {
    id: 'personal-dev-os',
    slug: 'personal-developer-os',
    title: {
      zh: 'Personal Developer OS',
      en: 'Personal Developer OS',
    },
    subtitle: {
      zh: '运行在浏览器里的个人开发者操作系统。',
      en: 'A browser-based Personal Developer OS.',
    },
    description: {
      zh: '基于 Next.js 构建的个人开发者网站，用 OS Shell 承载作品集、技术博客、项目展示、求职入口和 AI Agent 学习沉淀。',
      en: 'A Next.js personal site shaped as an OS shell for portfolio work, engineering logs, project notes, career entry points, and AI Agent learning.',
    },
    status: 'production',
    statusLabel: {
      zh: 'Production / v1.0 已上线',
      en: 'Production / v1.0 live',
    },
    type: {
      zh: '个人品牌 / 技术博客 / 作品集',
      en: 'Personal brand / Engineering blog / Portfolio',
    },
    timeline: {
      zh: '2026 · Phase 1-8 持续建设',
      en: '2026 · Phase 1-8 ongoing build',
    },
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Markdown', 'Docker', 'Nginx'],
    highlights: [
      {
        zh: '把个人网站设计成轻量 Developer OS，保留 Main App、Console App、Desktop 和 Status Bar。',
        en: 'Designed the personal site as a lightweight Developer OS with Main App, Console App, Desktop, and Status Bar.',
      },
      {
        zh: '使用 Markdown + BlogRepository / FileBlogRepository / BlogService 分层，保留未来接入 CMS 或数据库的空间。',
        en: 'Built a Markdown blog layer with BlogRepository, FileBlogRepository, and BlogService for future CMS or database migration.',
      },
      {
        zh: '支持文章系列、阅读时长、SEO metadata、sitemap、robots 和 RSS。',
        en: 'Supports article series, reading stats, SEO metadata, sitemap, robots, and RSS.',
      },
      {
        zh: '通过 Docker、Nginx 和 Let\'s Encrypt 完成自托管部署。',
        en: 'Self-hosted with Docker, Nginx, and Let\'s Encrypt HTTPS.',
      },
    ],
    features: [
      {
        zh: 'macos / vercel 双视觉 preset，light / dark 主题，zh / en 语言切换。',
        en: 'macos / vercel visual presets, light / dark themes, and zh / en language switching.',
      },
      {
        zh: 'CLI 命令可以在合适状态下联动 Main App 分区。',
        en: 'CLI commands can link to Main App sections when the window state allows it.',
      },
      {
        zh: '以阶段拆分和小步验收的方式完成 AI 协作开发。',
        en: 'Shipped through phased AI-assisted development with small reviewable milestones.',
      },
    ],
    role: [
      { zh: 'Product Design', en: 'Product Design' },
      { zh: 'Full-stack Development', en: 'Full-stack Development' },
      { zh: 'AI-assisted Development', en: 'AI-assisted Development' },
      { zh: 'Self-hosted Deployment', en: 'Self-hosted Deployment' },
    ],
    overview: [
      {
        zh: '这是一个基于 Next.js 的个人开发者操作系统风格网站，用于承载个人品牌、技术博客、项目展示、求职入口和 AI Agent 学习沉淀。',
        en: 'This is a Next.js-based personal developer OS site for personal branding, engineering writing, project showcases, career entry points, and AI Agent learning notes.',
      },
      {
        zh: '项目从一个普通博客升级为浏览器里的轻量 OS，用窗口、状态栏和终端来组织内容，而不是把作品集做成普通长页面。',
        en: 'It upgrades a normal blog into a lightweight OS in the browser, organizing content through windows, a status bar, and a terminal instead of a generic long portfolio page.',
      },
    ],
    problems: [
      {
        zh: '原来的 Hexo 静态博客更像内容容器，难以同时展示工程能力、产品想法、AI 辅助开发过程和求职作品集。',
        en: 'The previous Hexo static blog worked as a content container, but it did not show engineering ability, product thinking, AI-assisted workflow, and portfolio context together.',
      },
      {
        zh: '随着 Vibe Coding 和 AI 辅助开发逐渐成熟，我希望不只是套模板，而是自己设计并实现一个能反映个人工程判断的网站。',
        en: 'As vibe coding and AI-assisted development matured, I wanted to build a site that reflected my own engineering judgment instead of reusing a template.',
      },
    ],
    solutions: [
      {
        zh: '用 Main App、Console App、Desktop 和 System Status Bar 建立 Developer OS 模型，让首页成为一个可交互的工作台。',
        en: 'The site uses Main App, Console App, Desktop, and System Status Bar to form a Developer OS model and make the homepage feel like an interactive workspace.',
      },
      {
        zh: '博客系统采用 Markdown + frontmatter，并通过 BlogRepository、FileBlogRepository、BlogService 分层，保留未来迁移 CMS 或数据库的空间。',
        en: 'The blog uses Markdown and frontmatter behind BlogRepository, FileBlogRepository, and BlogService layers, leaving room for a future CMS or database migration.',
      },
      {
        zh: 'SEO、RSS、sitemap、Docker 自托管和 HTTPS 部署都作为正式工程能力的一部分纳入项目。',
        en: 'SEO, RSS, sitemap, Docker self-hosting, and HTTPS deployment are treated as first-class engineering parts of the project.',
      },
    ],
    architecture: [
      {
        zh: 'OS Shell 层负责窗口状态、状态栏、桌面占位和全局设置。',
        en: 'The OS shell layer owns window state, the status bar, the desktop fallback, and global settings.',
      },
      {
        zh: 'Main App 承载 Overview、About、Skills、Projects、Blog 和 Contact 等内容模块。',
        en: 'The Main App contains Overview, About, Skills, Projects, Blog, and Contact modules.',
      },
      {
        zh: 'Console App 提供本地 CLI 命令，并在合适窗口状态下联动 Main App 分区。',
        en: 'The Console App provides local CLI commands and can link to Main App sections when the window state allows it.',
      },
      {
        zh: 'BlogService 统一为页面、首页模块、Console 和 SEO 输出提供已发布文章数据。',
        en: 'BlogService provides published post data to pages, homepage modules, Console output, and SEO discovery outputs.',
      },
    ],
    developmentProcess: [
      {
        zh: '先完成 OS Shell、窗口状态和视觉 preset，再补齐主题、语言和内容模块。',
        en: 'The build started with the OS shell, window state, and visual presets, then added theme, language, and content modules.',
      },
      {
        zh: '随后实现 CLI、视觉 polish、Markdown 博客、SEO/RSS、Docker 部署和真实内容系列。',
        en: 'Later phases added CLI behavior, visual polish, Markdown blogging, SEO/RSS, Docker deployment, and real content series.',
      },
      {
        zh: '每个阶段都用小范围目标、lint/build 和文档归档来控制节奏。',
        en: 'Each phase was kept reviewable with focused scope, lint/build checks, and documentation updates.',
      },
    ],
    aiCollaboration: [
      {
        zh: 'AI 主要参与需求拆解、代码实现、文档归档和验收检查，但项目边界由我持续约束。',
        en: 'AI helped with requirement breakdown, implementation, documentation, and checks, while I kept the project boundaries explicit.',
      },
      {
        zh: '开发过程按 Phase 拆分，避免一次性大改，并明确不改 Console、窗口系统或部署配置等边界。',
        en: 'The work was split into phases to avoid broad rewrites, with clear boundaries around areas such as Console, window behavior, and deployment config.',
      },
      {
        zh: '每次功能完成后通过 lint、build、路由检查和 CHANGELOG 记录来完成闭环。',
        en: 'Each feature closed with lint, build, route checks, and CHANGELOG notes.',
      },
    ],
    challenges: [
      {
        zh: '需要在强产品概念和可读内容之间保持平衡，不能让网站退化成普通 Portfolio 模板。',
        en: 'The key challenge was balancing a strong product concept with readable content without turning the site back into a generic portfolio.',
      },
      {
        zh: '博客、首页、Console、SEO 输出都要共享数据来源，避免后续维护分裂。',
        en: 'Blog pages, homepage modules, Console output, and SEO outputs had to share data sources to avoid fragmented maintenance.',
      },
    ],
    learnings: [
      {
        zh: '个人网站也可以按产品和工程系统来做，而不只是堆页面。',
        en: 'A personal site can be treated as a product and engineering system instead of a pile of pages.',
      },
      {
        zh: 'AI 协作开发的关键不是让 AI 一次写完，而是拆阶段、设边界、逐步验收。',
        en: 'The useful pattern for AI-assisted development is not one-shot generation, but phased work, clear boundaries, and repeated validation.',
      },
    ],
    futurePlans: [
      {
        zh: '继续补充项目 Case Study、求职向内容和 AI Agent 学习记录。',
        en: 'Continue adding project case studies, career-facing content, and AI Agent learning notes.',
      },
      {
        zh: '后续探索更完整的 AI Agent Demo，但不在当前阶段接入在线聊天或真实 Agent API。',
        en: 'Explore a fuller AI Agent demo later, without adding online chat or a real Agent API in this phase.',
      },
    ],
    links: [
      {
        label: { zh: 'Live Demo', en: 'Live Demo' },
        href: 'https://oli6666.top',
        type: 'live',
      },
      {
        label: { zh: 'GitHub', en: 'GitHub' },
        href: 'https://github.com/zhaomin6666/my-blog-v2',
        type: 'github',
      },
      {
        label: { zh: '查看系列文章', en: 'View related series' },
        href: '/blog/series/personal-developer-os',
        type: 'series',
      },
    ],
    relatedSeriesSlug: 'personal-developer-os',
    relatedPosts: [
      {
        title: {
          zh: '为什么我要重新做一个个人博客网站',
          en: 'Why I rebuilt my personal blog',
        },
        slug: 'why-rebuild-my-personal-blog',
      },
      {
        title: {
          zh: '为什么我把个人网站设计成 Developer OS',
          en: 'Why I designed my site as a Developer OS',
        },
        slug: 'designing-personal-developer-os',
      },
      {
        title: {
          zh: 'Phase 4：给个人网站加一个真正可用的 CLI',
          en: 'Phase 4: adding a usable CLI to my personal site',
        },
        slug: 'building-cli-for-personal-developer-os',
      },
    ],
    featured: true,
    order: 1,
  },
  {
    id: 'ai-agent-demo',
    slug: 'ai-agent-demo',
    title: {
      zh: 'AI Agent Demo',
      en: 'AI Agent Demo',
    },
    subtitle: {
      zh: '企业知识库 Agent 学习项目。',
      en: 'A learning project for enterprise knowledge-base agents.',
    },
    description: {
      zh: '面向企业知识库和业务流程理解的 AI Agent 学习项目，目标是用 TypeScript、LangChain.js 和 LangGraph.js 实践 RAG、工具调用、状态图与企业系统集成思路。',
      en: 'An AI Agent learning project for enterprise knowledge bases and business-process understanding, using TypeScript, LangChain.js, and LangGraph.js to practice RAG, tool calling, state graphs, and integration patterns.',
    },
    status: 'building',
    statusLabel: {
      zh: 'In Progress / Learning Project',
      en: 'In Progress / Learning Project',
    },
    type: {
      zh: 'AI Agent / 学习项目 / 求职展示',
      en: 'AI Agent / Learning Project / Career showcase',
    },
    timeline: {
      zh: '2026 · 持续学习与实现中',
      en: '2026 · Ongoing learning and implementation',
    },
    stack: ['TypeScript', 'Node.js', 'pnpm', 'LangChain.js', 'LangGraph.js', 'Zod', 'OpenAI-compatible API'],
    highlights: [
      {
        zh: '从 Java 后端视角学习 TypeScript AI 应用开发，关注工程结构和可维护性。',
        en: 'Learning TypeScript AI application development from a Java backend perspective, with attention to structure and maintainability.',
      },
      {
        zh: '用结构化输出提升意图识别稳定性，而不是只做一次大模型调用。',
        en: 'Uses structured output to make intent classification steadier instead of relying on a single model call.',
      },
      {
        zh: '通过工具注册和执行器模拟 Agent 工具调用链路。',
        en: 'Simulates Agent tool calling through tool registration and an executor flow.',
      },
      {
        zh: '逐步引入 LangGraph，理解状态图、多步骤工作流和持久化思路。',
        en: 'Gradually introduces LangGraph to study state graphs, multi-step workflows, and persistence patterns.',
      },
    ],
    features: [
      {
        zh: '当前聚焦 Prompt Messages、Structured Output、Intent Classifier 和 Tool Calling。',
        en: 'Current focus: Prompt Messages, Structured Output, Intent Classifier, and Tool Calling.',
      },
      {
        zh: '后续计划继续沉淀 RAG、Agent State、Persistence、MCP / OAuth 和企业系统集成。',
        en: 'Planned direction: RAG, Agent State, Persistence, MCP / OAuth, and enterprise-system integration.',
      },
      {
        zh: '项目定位为持续建设的学习与展示项目，不包装成已上线成熟产品。',
        en: 'Positioned as an ongoing learning and showcase project, not as a mature production product.',
      },
    ],
    role: [
      { zh: 'AI Application Learning', en: 'AI Application Learning' },
      { zh: 'TypeScript Practice', en: 'TypeScript Practice' },
      { zh: 'Agent Workflow Design', en: 'Agent Workflow Design' },
    ],
    overview: [
      {
        zh: '这是一个面向企业知识库和业务流程理解的 AI Agent 学习项目，目标是用 TypeScript、LangChain.js 和 LangGraph.js 实践 RAG、工具调用、状态图、持久化和企业系统集成思路。',
        en: 'This is an AI Agent learning project for enterprise knowledge bases and business-process understanding, using TypeScript, LangChain.js, and LangGraph.js to practice RAG, tool calling, state graphs, persistence, and integration thinking.',
      },
      {
        zh: '项目定位是持续建设的学习与求职展示项目，不包装成已经完整上线的成熟产品。',
        en: 'It is positioned as an ongoing learning and career showcase project, not as a mature production product.',
      },
    ],
    problems: [
      {
        zh: '传统企业系统里有大量知识库、流程规则、角色权限和系统对接场景，单纯调用大模型接口很难可靠处理这些业务上下文。',
        en: 'Enterprise systems contain knowledge bases, process rules, role permissions, and integrations that cannot be handled reliably by simply calling a model API.',
      },
      {
        zh: '作为 Java 后端开发者，我需要把已有业务系统经验迁移到 TypeScript AI 应用和 Agent 工作流开发中。',
        en: 'As a Java backend developer, I need to transfer enterprise-system experience into TypeScript AI application and Agent workflow development.',
      },
    ],
    solutions: [
      {
        zh: '从 Prompt Messages、Structured Output 和 Intent Classifier 入手，先建立可测试的输入输出边界。',
        en: 'The project starts with Prompt Messages, Structured Output, and an Intent Classifier to create testable input/output boundaries.',
      },
      {
        zh: '通过工具注册、执行器和状态图逐步模拟 Agent 如何调用业务工具和推进多步骤流程。',
        en: 'Tool registration, executors, and state graphs are used to gradually simulate how an Agent calls business tools and advances multi-step workflows.',
      },
      {
        zh: '后续再引入 RAG、Agent State、Persistence、MCP / OAuth 和企业系统集成。',
        en: 'Future steps introduce RAG, Agent State, Persistence, MCP / OAuth, and enterprise-system integration.',
      },
    ],
    architecture: [
      {
        zh: '基础层使用 TypeScript、Node.js、pnpm 和 Zod 组织工程结构与类型约束。',
        en: 'The foundation uses TypeScript, Node.js, pnpm, and Zod for project structure and type constraints.',
      },
      {
        zh: '模型交互层面向 OpenAI-compatible API，可根据实际环境接入兼容模型服务。',
        en: 'The model interaction layer targets OpenAI-compatible APIs, allowing compatible model services to be used as the environment allows.',
      },
      {
        zh: 'Agent 层逐步覆盖意图识别、工具调用、状态图、多步骤流程和持久化思路。',
        en: 'The Agent layer gradually covers intent classification, tool calling, state graphs, multi-step workflows, and persistence concepts.',
      },
    ],
    developmentProcess: [
      {
        zh: '先补 TypeScript AI 工程基础，再按课程与实践主题沉淀每一节内容。',
        en: 'The project begins with TypeScript AI engineering fundamentals, then documents each lesson and practice topic.',
      },
      {
        zh: '每个能力点优先做小 demo 和可解释记录，再逐步组合成企业知识库 / 交付辅助 Agent Demo。',
        en: 'Each capability starts as a small demo and explainable note before being combined into an enterprise knowledge-base or delivery-assistant Agent demo.',
      },
    ],
    aiCollaboration: [
      {
        zh: 'AI 用于辅助理解 LangChain.js、LangGraph.js、结构化输出和 Agent 工作流概念。',
        en: 'AI is used to help understand LangChain.js, LangGraph.js, structured output, and Agent workflow concepts.',
      },
      {
        zh: '项目不会把 AI 辅助结果直接当成生产能力，而是通过代码、博客记录和阶段验收逐步确认理解。',
        en: 'AI-assisted outputs are not treated as production capability by default; they are checked through code, notes, and phase-level validation.',
      },
    ],
    challenges: [
      {
        zh: '需要避免把 Agent Demo 写成简单聊天壳，而是围绕企业业务上下文、工具链和状态管理逐步建设。',
        en: 'The challenge is avoiding a simple chat wrapper and instead building around enterprise context, tools, and state management.',
      },
      {
        zh: '学习项目要如实呈现阶段状态，不能编造成熟上线成果。',
        en: 'The project status must stay honest as a learning project without inventing production results.',
      },
    ],
    learnings: [
      {
        zh: '后端业务建模经验可以迁移到 Agent 工具设计、状态流转和系统集成边界中。',
        en: 'Backend modeling experience can transfer into Agent tool design, state transitions, and integration boundaries.',
      },
      {
        zh: '结构化输出和清晰的工具接口比单次 prompt 更适合承载企业场景。',
        en: 'Structured output and clear tool interfaces fit enterprise scenarios better than a single prompt call.',
      },
    ],
    futurePlans: [
      {
        zh: '继续补 RAG、Agent State、Persistence、LangGraph 多步骤工作流和持久化示例。',
        en: 'Continue with RAG, Agent State, Persistence, LangGraph multi-step workflows, and persistence examples.',
      },
      {
        zh: '后续探索 MCP、OAuth、向量数据库和企业系统集成，但当前阶段不接在线聊天或真实生产 API。',
        en: 'Later explore MCP, OAuth, vector databases, and enterprise-system integration, without adding online chat or real production APIs in this phase.',
      },
    ],
    links: [
      {
        label: { zh: '学习记录待补充', en: 'Learning notes coming soon' },
        href: '/blog',
        type: 'blog',
      },
    ],
    featured: true,
    order: 2,
  },
  {
    id: 'bidding-system',
    slug: 'bidding-system-platform',
    title: {
      zh: '招投标系统平台',
      en: 'Bidding System Platform',
    },
    subtitle: {
      zh: '企业招投标与采购业务系统。',
      en: 'Enterprise bidding and procurement platform.',
    },
    description: {
      zh: '围绕供应商管理、专家管理、采购计划和第三方对接的企业业务系统实践，重点在后端业务建模、权限与数据流转。',
      en: 'Enterprise system work around supplier management, expert management, procurement planning, and third-party integrations, focused on backend modeling, permissions, and business data flow.',
    },
    status: 'production',
    statusLabel: {
      zh: 'Production Experience',
      en: 'Production Experience',
    },
    type: {
      zh: '企业业务系统',
      en: 'Enterprise business system',
    },
    timeline: {
      zh: '企业项目经验',
      en: 'Enterprise project experience',
    },
    stack: ['Java', 'Spring Boot', 'Redis', 'Kingbase', 'Docker', 'Nginx'],
    highlights: [
      {
        zh: '参与企业级业务系统功能建设，覆盖多角色、多流程和外部系统对接。',
        en: 'Worked on enterprise business features across multiple roles, workflows, and external integrations.',
      },
      {
        zh: '沉淀 Java 后端工程经验，并反哺当前的 AI Agent 与全栈学习方向。',
        en: 'Built Java backend engineering experience that now informs AI Agent and full-stack learning.',
      },
    ],
    role: [
      { zh: 'Backend Development', en: 'Backend Development' },
      { zh: 'Business System Implementation', en: 'Business System Implementation' },
    ],
    featured: false,
    order: 3,
  },
];

export const projects = projectItems.sort((a, b) => a.order - b.order);

export function hasProjectCaseStudy(project: Project): boolean {
  return Boolean(project.overview?.length && project.problems?.length && project.solutions?.length);
}

export const projectCaseStudies = projects.filter(hasProjectCaseStudy);
