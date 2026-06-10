export type WindowState = 'open' | 'minimized' | 'maximized' | 'closed';
export type Theme = 'light' | 'dark';
export type Lang = 'zh' | 'en';
export type StylePreset = 'macos' | 'vercel';
export type ActiveWindow = 'main' | 'console' | null;
export type MainSectionId = 'overview' | 'about' | 'skills' | 'projects' | 'blog' | 'contact';

export interface WindowManagerState {
  main: WindowState;
  console: WindowState;
  active: ActiveWindow;
}

export interface ConsoleOutputLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
}

// Unified bilingual text structure
export interface LocalizedText {
  zh: string;
  en: string;
}

export type ProjectStatus = 'building' | 'production' | 'mvp';

export interface ProjectLink {
  label: LocalizedText;
  href: string;
  type: 'live' | 'github' | 'blog' | 'series';
}

export interface ProjectRelatedPost {
  title: LocalizedText;
  slug: string;
}

export interface Project {
  id: string;
  slug: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  status: ProjectStatus;
  statusLabel?: LocalizedText;
  type: LocalizedText;
  timeline?: LocalizedText;
  stack: string[];
  highlights: LocalizedText[];
  features?: LocalizedText[];
  role: LocalizedText[];
  overview?: LocalizedText[];
  problems?: LocalizedText[];
  solutions?: LocalizedText[];
  architecture?: LocalizedText[];
  developmentProcess?: LocalizedText[];
  aiCollaboration?: LocalizedText[];
  challenges?: LocalizedText[];
  learnings?: LocalizedText[];
  futurePlans?: LocalizedText[];
  links?: ProjectLink[];
  relatedPosts?: ProjectRelatedPost[];
  relatedSeriesSlug?: string;
  featured?: boolean;
  order: number;
}

export interface SkillCategory {
  category: LocalizedText;
  items: string[];
}
