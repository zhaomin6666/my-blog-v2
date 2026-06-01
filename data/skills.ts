import { SkillCategory } from '@/lib/types';

export const skills: SkillCategory[] = [
  {
    category: {
      zh: '后端',
      en: 'Backend',
    },
    items: ['Java', 'Spring Boot', 'MyBatis', 'REST APIs'],
  },
  {
    category: {
      zh: '数据库',
      en: 'Database',
    },
    items: ['MySQL', 'PostgreSQL', 'Redis'],
  },
  {
    category: {
      zh: '前端',
      en: 'Frontend',
    },
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    category: {
      zh: 'AI',
      en: 'AI',
    },
    items: ['LLM Apps', 'RAG', 'Agent Workflow', 'Prompt Engineering'],
  },
  {
    category: {
      zh: '运维',
      en: 'DevOps',
    },
    items: ['Docker', 'Nginx', 'Linux', 'CI/CD'],
  },
  {
    category: {
      zh: '产品',
      en: 'Product',
    },
    items: ['Requirement Analysis', 'System Design', 'Technical Writing'],
  },
];
