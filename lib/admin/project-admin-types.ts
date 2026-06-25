import type { ProjectStatus } from '@/lib/types';

export type AdminProjectLanguage = 'zh' | 'en';
export type AdminProjectStatus = ProjectStatus;

export interface AdminProject {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  summary: string;
  contentMarkdown: string;
  status: AdminProjectStatus;
  type: string;
  role: string[];
  timeline: string;
  published: boolean;
  featured: boolean;
  displayOrder: number;
  techStack: string[];
  features: string[];
  highlights: string[];
  links: Record<string, string>;
  relatedPosts: Array<{
    title: string;
    slug: string;
  }>;
  relatedSeriesSlug: string;
  lang: AdminProjectLanguage;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProjectInput {
  title: string;
  slug: string;
  subtitle: string;
  summary: string;
  contentMarkdown: string;
  status: AdminProjectStatus;
  type: string;
  role: string[];
  timeline: string;
  published: boolean;
  featured: boolean;
  displayOrder: number;
  techStack: string[];
  features: string[];
  highlights: string[];
  links: Record<string, string>;
  relatedPosts: Array<{
    title: string;
    slug: string;
  }>;
  relatedSeriesSlug: string;
  lang: AdminProjectLanguage;
  seoTitle: string;
  seoDescription: string;
}

export interface AdminProjectListParams {
  published?: boolean;
  featured?: boolean;
  lang?: AdminProjectLanguage;
  keyword?: string;
  limit?: number;
}
