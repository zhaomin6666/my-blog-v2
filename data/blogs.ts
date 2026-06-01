import { Blog } from '@/lib/types';

export const blogs: Blog[] = [
  {
    id: 'java-to-ai',
    title: {
      zh: '从 Java 后端到 AI Agent 开发的学习路线',
      en: 'Learning Path: From Java Backend to AI Agent Development',
    },
    date: '2024-12-15',
    summary: {
      zh: '记录从传统后端开发转向 AI 应用开发的完整学习路径，包括关键技术和实践建议。',
      en: 'Documenting the complete learning path from traditional backend dev to AI application development, including key technologies and practical advice.',
    },
    tags: ['AI', 'Java', 'Career'],
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
      en: 'Deep dive into architectural differences, use cases, and how to choose the right approach for your project.',
    },
    tags: ['LangChain', 'LangGraph', 'AI'],
  },
  {
    id: 'design-personal-site',
    title: {
      zh: '如何设计一个程序员的个人网站',
      en: 'How to Design a Developer Personal Website',
    },
    date: '2025-03-10',
    summary: {
      zh: '从概念到实现，构建一个独特的开发者 OS，而非普通模板站。',
      en: 'From concept to implementation, building a unique developer OS instead of a generic template site.',
    },
    tags: ['Design', 'Next.js', 'Portfolio'],
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
