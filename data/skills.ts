import { SkillCategory } from '@/lib/types';

export const skills: SkillCategory[] = [
  {
    category: 'Backend',
    categoryZh: '后端',
    items: ['Java', 'Spring Boot', 'MyBatis', 'REST APIs'],
  },
  {
    category: 'Database',
    categoryZh: '数据库',
    items: ['MySQL', 'PostgreSQL', 'Redis'],
  },
  {
    category: 'Frontend',
    categoryZh: '前端',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    category: 'AI',
    categoryZh: 'AI',
    items: ['LLM Apps', 'RAG', 'Agent Workflow', 'Prompt Engineering'],
  },
  {
    category: 'DevOps',
    categoryZh: '运维',
    items: ['Docker', 'Nginx', 'Linux', 'CI/CD'],
  },
  {
    category: 'Product',
    categoryZh: '产品',
    items: ['Requirement Analysis', 'System Design', 'Technical Writing'],
  },
];
