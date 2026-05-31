import { Blog } from '@/lib/types';

export const blogs: Blog[] = [
  {
    id: 'java-to-ai',
    title: '从 Java 后端到 AI Agent 开发的学习路线',
    titleEn: 'Learning Path: From Java Backend to AI Agent Development',
    date: '2024-12-15',
    excerpt: '记录从传统后端开发转向 AI 应用开发的完整学习路径。',
    excerptEn: 'Documenting the complete learning path from traditional backend dev to AI application development.',
  },
  {
    id: 'langchain-langgraph',
    title: 'LangChain 和 LangGraph 的关系与实践',
    titleEn: 'LangChain and LangGraph: Relationship and Practice',
    date: '2025-01-20',
    excerpt: '深入理解两者的架构差异和适用场景。',
    excerptEn: 'Deep dive into architectural differences and use cases.',
  },
  {
    id: 'design-personal-site',
    title: '如何设计一个程序员的个人网站',
    titleEn: 'How to Design a Developer Personal Website',
    date: '2025-03-10',
    excerpt: '从概念到实现，构建一个独特的开发者 OS。',
    excerptEn: 'From concept to implementation, building a unique developer OS.',
  },
  {
    id: 'rag-practice',
    title: 'RAG 应用从 0 到 1 实战记录',
    titleEn: 'RAG Application: From 0 to 1 Practice Notes',
    date: '2025-04-05',
    excerpt: '完整记录 RAG 系统的搭建过程和踩坑经验。',
    excerptEn: 'Complete notes on building a RAG system and lessons learned.',
  },
];
