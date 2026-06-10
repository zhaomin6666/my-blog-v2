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

export interface SkillCategory {
  category: LocalizedText;
  items: string[];
}
