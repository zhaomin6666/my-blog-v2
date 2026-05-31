export type WindowState = 'open' | 'minimized' | 'maximized' | 'closed';
export type Theme = 'light' | 'dark';
export type Lang = 'zh' | 'en';
export type StylePreset = 'macos' | 'vercel';
export type ActiveWindow = 'main' | 'console' | null;

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

export interface Project {
  id: string;
  title: string;
  titleZh?: string;
  description: string;
  descriptionZh?: string;
  tags: string[];
  link?: string;
}

export interface Blog {
  id: string;
  title: string;
  titleEn?: string;
  date: string;
  excerpt: string;
  excerptEn?: string;
  link?: string;
}

export interface SkillCategory {
  category: string;
  categoryZh?: string;
  items: string[];
}
