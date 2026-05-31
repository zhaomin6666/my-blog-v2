import { Project } from '@/lib/types';

export const projects: Project[] = [
  {
    id: 'ai-agent-demo',
    title: 'AI Agent Demo',
    titleZh: 'AI Agent 演示',
    description: 'A demonstration of AI agent workflows using LLM and tool calling.',
    descriptionZh: '使用 LLM 和工具调用的 AI Agent 工作流演示。',
    tags: ['Python', 'LangChain', 'OpenAI', 'FastAPI'],
  },
  {
    id: 'bidding-system',
    title: 'Bidding System Platform',
    titleZh: '招投标系统平台',
    description: 'Enterprise bidding and procurement management system.',
    descriptionZh: '企业招投标与采购管理系统。',
    tags: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
  },
  {
    id: 'personal-dev-os',
    title: 'Personal Dev OS',
    titleZh: '个人开发者 OS',
    description: 'A browser-based personal developer operating system.',
    descriptionZh: '运行在浏览器中的个人开发者操作系统。',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  },
];
