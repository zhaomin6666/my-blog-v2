import { Project } from '@/lib/types';

export const projects: Project[] = [
  {
    id: 'ai-agent-demo',
    title: {
      zh: 'AI Agent 演示',
      en: 'AI Agent Demo',
    },
    description: {
      zh: '探索 LLM Agent、工具调用、RAG 和工作流编排的演示项目。',
      en: 'A demo project exploring LLM agents, tool calling, RAG, and workflow orchestration.',
    },
    status: 'building',
    stack: ['Next.js', 'TypeScript', 'LangChain', 'LangGraph'],
  },
  {
    id: 'bidding-system',
    title: {
      zh: '招投标系统平台',
      en: 'Bidding System Platform',
    },
    description: {
      zh: '企业招投标与采购平台，涵盖供应商管理、专家管理、采购计划与第三方对接。',
      en: 'Enterprise bidding and procurement platform with supplier management, expert management, procurement planning, and third-party integrations.',
    },
    status: 'production',
    stack: ['Java', 'Spring Boot', 'Redis', 'Kingbase', 'Docker', 'Nginx'],
  },
  {
    id: 'personal-dev-os',
    title: {
      zh: 'Personal Dev OS',
      en: 'Personal Dev OS',
    },
    description: {
      zh: '个人网站，集作品集、博客、CLI 界面与未来独立产品入口于一体。',
      en: 'A personal website that combines portfolio, blog, CLI interface, and future independent product entrance.',
    },
    status: 'mvp',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
  },
];
