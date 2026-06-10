import type { ProjectStatus } from '@/lib/types';

export type ProjectLanguage = 'zh' | 'en';
export type ProjectLinkType = 'live' | 'github' | 'blog' | 'series';

export interface ProjectLinkData {
  label: string;
  href: string;
  type: ProjectLinkType;
}

export interface ProjectRelatedPostData {
  title: string;
  slug: string;
}

export interface ProjectFrontmatter {
  title?: string;
  slug?: string;
  subtitle?: string;
  summary?: string;
  status?: string;
  statusLabel?: string;
  type?: string;
  role?: string[] | string;
  timeline?: string;
  featured?: boolean;
  order?: number | string;
  techStack?: string[] | string;
  features?: string[] | string;
  highlights?: string[] | string;
  links?: ProjectLinkData[];
  relatedPosts?: ProjectRelatedPostData[];
  relatedSeriesSlug?: string;
  published?: boolean;
  lang?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ProjectMeta {
  title: string;
  slug: string;
  subtitle: string;
  summary: string;
  status: ProjectStatus;
  statusLabel: string;
  type: string;
  role: string[];
  timeline: string | null;
  featured: boolean;
  order: number;
  techStack: string[];
  features: string[];
  highlights: string[];
  links: ProjectLinkData[];
  relatedPosts: ProjectRelatedPostData[];
  relatedSeriesSlug: string | null;
  published: boolean;
  lang: ProjectLanguage;
  seoTitle: string | null;
  seoDescription: string | null;
}

export interface Project extends ProjectMeta {
  content: string;
  rawContent: string;
}

export interface ProjectQueryOptions {
  includeDrafts?: boolean;
  featured?: boolean;
  lang?: ProjectLanguage;
}
