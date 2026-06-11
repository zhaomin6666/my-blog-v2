import type { LocalizedText } from './types';

export interface ProfileField {
  labelKey: 'about.role' | 'about.direction' | 'about.status';
  value: LocalizedText;
}

export interface ProfileLink {
  label: LocalizedText;
  href: string;
  description: LocalizedText;
}

export interface ProfileData {
  intro: LocalizedText;
  fields: ProfileField[];
  focus: LocalizedText[];
  background: LocalizedText[];
  building: ProfileLink[];
  workStyle: LocalizedText[];
  careerDirection: LocalizedText[];
}

export const profileData: ProfileData = {
  intro: {
    zh: '我是一名 Java 后端开发者，正在把企业业务系统开发经验、TypeScript 全栈能力和 AI Agent 学习结合起来，构建自己的项目、博客和作品集。',
    en: 'I am a Java backend developer transitioning into AI Agent and full-stack development, combining enterprise-system experience with TypeScript, Next.js, and AI-assisted product building.',
  },
  fields: [
    {
      labelKey: 'about.role',
      value: {
        zh: 'Java 后端开发者 / AI Agent 学习者',
        en: 'Java Backend Developer / AI Agent Learner',
      },
    },
    {
      labelKey: 'about.direction',
      value: {
        zh: 'AI Agent / TypeScript 全栈开发',
        en: 'AI Agent / TypeScript Full-stack',
      },
    },
    {
      labelKey: 'about.status',
      value: {
        zh: '正在建设作品集，关注 AI 应用与全栈机会',
        en: 'Building a portfolio, open to AI application and full-stack opportunities',
      },
    },
  ],
  focus: [
    { zh: 'AI Agent 应用开发', en: 'AI Agent application development' },
    { zh: 'TypeScript / Next.js 全栈开发', en: 'TypeScript / Next.js full-stack development' },
    { zh: 'LangChain.js / LangGraph.js', en: 'LangChain.js / LangGraph.js' },
    { zh: '企业知识库 / RAG', en: 'Enterprise knowledge base / RAG' },
    { zh: '工具调用 / Agent Workflow', en: 'Tool calling / Agent workflow' },
    { zh: 'AI 辅助开发流程', en: 'AI-assisted development workflow' },
  ],
  background: [
    {
      zh: '过去主要参与企业业务系统、招投标、采购、供应商管理、专家管理和采购计划管理等项目。',
      en: 'Worked on enterprise business systems, bidding and procurement scenarios, supplier management, expert management, and procurement planning.',
    },
    {
      zh: '熟悉 Java、Spring Boot、业务流程建模、接口对接、需求沟通、文档沉淀和阶段性交付。',
      en: 'Experienced with Java, Spring Boot, business workflow modeling, system integration, requirement communication, documentation, and staged delivery.',
    },
    {
      zh: '现在从真实业务系统经验出发，逐步补齐 AI Agent 与全栈产品开发能力。',
      en: 'Now using real business-system experience as the starting point for learning AI Agent and full-stack product development.',
    },
  ],
  building: [
    {
      label: { zh: 'Personal Developer OS', en: 'Personal Developer OS' },
      href: '/projects/personal-developer-os',
      description: {
        zh: '已上线的个人开发者操作系统风格网站，承载博客、作品集、求职入口和 AI Agent 学习记录。',
        en: 'A live browser-based developer OS site for blogs, portfolio work, career entry points, and AI Agent learning notes.',
      },
    },
    {
      label: { zh: 'AI Agent Demo', en: 'AI Agent Demo' },
      href: '/projects/ai-agent-demo',
      description: {
        zh: '面向企业知识库和业务流程理解的 AI Agent 学习项目，目前处于持续建设阶段。',
        en: 'An in-progress AI Agent learning project focused on enterprise knowledge bases and business workflow understanding.',
      },
    },
    {
      label: { zh: '工程日志', en: 'Engineering Logs' },
      href: '/blog',
      description: {
        zh: '用博客记录网站建设、工程实践和学习过程。',
        en: 'Blog notes for site building, engineering practice, and learning progress.',
      },
    },
    {
      label: { zh: 'Personal Developer OS 系列', en: 'Personal Developer OS Series' },
      href: '/blog/series/personal-developer-os',
      description: {
        zh: '从想法、设计、开发到部署的完整建设记录。',
        en: 'The complete build log from idea and design to development and deployment.',
      },
    },
  ],
  workStyle: [
    { zh: '小步拆分需求，按阶段验收', en: 'Break work into small steps and review by phase' },
    { zh: '从真实业务问题出发，保留文档和交付记录', en: 'Start from real business problems and keep delivery notes' },
    { zh: '把 AI 作为协作工具，用项目和博客沉淀学习过程', en: 'Use AI as a collaborator and record learning through projects and writing' },
  ],
  careerDirection: [
    { zh: 'AI Agent Developer', en: 'AI Agent Developer' },
    { zh: 'AI Application Engineer', en: 'AI Application Engineer' },
    { zh: 'Full-stack Developer with AI focus', en: 'Full-stack Developer with AI focus' },
    { zh: 'Java Backend Developer with AI Agent direction', en: 'Java Backend Developer with AI Agent direction' },
  ],
};
