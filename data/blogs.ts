import { Blog } from '@/lib/types';

export const blogs: Blog[] = [
  {
    id: 'building-dev-os',
    slug: 'building-personal-developer-os',
    title: {
      zh: 'Building a Personal Developer OS',
      en: 'Building a Personal Developer OS',
    },
    date: '2026-06-01',
    summary: {
      zh: '记录 Personal Developer OS 的设计思路、架构拆分和阶段演进，以及为什么选择浏览器内的 OS 形态而非传统作品集。',
      en: 'Documenting the design rationale, architecture breakdown, and phase evolution of the Personal Developer OS.',
    },
    tags: ['Personal Site', 'Developer OS', 'Next.js'],
  },
  {
    id: 'ai-agent-log',
    slug: 'ai-agent-learning-log',
    title: {
      zh: 'AI Agent 开发学习记录',
      en: 'AI Agent Development Learning Log',
    },
    date: '2026-05-20',
    summary: {
      zh: '记录从传统后端开发转向 AI Agent 开发过程中的关键技术点、工具链和学习路径。',
      en: 'Key concepts, toolchains, and learning paths from traditional backend dev to AI Agent development.',
    },
    tags: ['AI', 'Agent', 'LangChain', 'LLM'],
  },
  {
    id: 'langchain-langgraph',
    title: {
      zh: 'LangChain 和 LangGraph 的关系与实践',
      en: 'LangChain and LangGraph: Relationship and Practice',
    },
    date: '2025-01-20',
    summary: {
      zh: '深入理解两者的架构差异、适用场景，以及如何在项目中选择合适的方案。',
      en: 'Deep dive into architectural differences, use cases, and how to choose the right approach.',
    },
    tags: ['LangChain', 'LangGraph', 'AI'],
  },
  {
    id: 'rag-practice',
    title: {
      zh: 'RAG 应用从 0 到 1 实战记录',
      en: 'RAG Application: From 0 to 1 Practice Notes',
    },
    date: '2025-04-05',
    summary: {
      zh: '完整记录 RAG 系统的搭建过程、技术选型和踩坑经验。',
      en: 'Complete notes on building a RAG system, technology choices, and lessons learned.',
    },
    tags: ['RAG', 'LLM', 'Vector DB'],
  },
];
