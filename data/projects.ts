import { Project } from '@/lib/types';

const projectItems: Project[] = [
  {
    id: 'personal-dev-os',
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
    stack: ['TypeScript', 'Node.js', 'pnpm', 'LangChain.js', 'LangGraph.js', 'Zod'],
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
