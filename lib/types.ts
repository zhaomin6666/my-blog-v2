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

export interface Project {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  status: ProjectStatus;
  stack: string[];
  link?: string;
}

export interface Blog {
  id: string;
  title: LocalizedText;
  date: string;
  summary: LocalizedText;
  tags: string[];
  link?: string;
  /** Slug for linking to /blog/[slug]. Must match a content/blog/*.md file. */
  slug?: string;
}

export interface SkillCategory {
  category: LocalizedText;
  items: string[];
}
