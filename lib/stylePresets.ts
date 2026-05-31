import { StylePreset } from './types';

export interface StyleTokens {
  // Status Bar
  statusBarHeight: string;
  statusBarClass: string;
  statusBarFont: string;

  // Window
  windowBorderRadius: string;
  windowShadow: string;
  windowBorder: string;
  windowBg: string;
  windowBackdrop: string;

  // Title Bar
  titleBarHeight: string;
  titleBarClass: string;
  titleBarFont: string;

  // Window Controls
  controlSize: string;
  controlClose: string;
  controlMinimize: string;
  controlMaximize: string;
  controlHoverShow: boolean;

  // Desktop
  desktopBg: string;
  desktopIconPosition: 'top-right' | 'top-left';
  desktopIconSize: string;
  desktopIconLabel: string;

  // Console
  consoleFont: string;
  consolePrompt: string;
  consoleCursor: string;

  // Content (Main App sections)
  contentBg: string;
  contentPadding: string;

  // Card styles for sections
  cardBg: string;
  cardBorder: string;
  cardBorderRadius: string;
  cardShadow: string;

  // Nested card (items inside sections)
  nestedCardBg: string;
  nestedCardBorder: string;
  nestedCardBorderRadius: string;

  // Typography tokens
  headingFont: string;
  bodyFont: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // Accent / tags
  tagBg: string;
  tagText: string;
  tagBorder: string;
  tagBorderRadius: string;

  // Project tag accent
  projectTagBg: string;
  projectTagText: string;
}

const macosTokens: StyleTokens = {
  statusBarHeight: 'h-7',
  statusBarClass:
    'bg-white/60 dark:bg-black/40 backdrop-blur-xl border-b border-zinc-200/60 dark:border-white/10 text-zinc-800 dark:text-zinc-100 text-[13px] font-medium',
  statusBarFont: 'font-sans',

  windowBorderRadius: 'rounded-2xl',
  windowShadow:
    'shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]',
  windowBorder: 'border border-white/70 dark:border-white/10',
  windowBg: 'bg-white/80 dark:bg-[#1e1e1e]/80',
  windowBackdrop: 'backdrop-blur-2xl',

  titleBarHeight: 'h-11',
  titleBarClass:
    'border-b border-zinc-200/60 dark:border-zinc-800/50',
  titleBarFont: 'text-[13px] font-semibold',

  controlSize: 'w-3 h-3',
  controlClose: 'bg-[#ff5f56] border border-[#e0443e]',
  controlMinimize: 'bg-[#ffbd2e] border border-[#dea123]',
  controlMaximize: 'bg-[#27c93f] border border-[#1aab29]',
  controlHoverShow: true,

  desktopBg: 'bg-[#f0f4f8] dark:bg-[#0f141e]',
  desktopIconPosition: 'top-right',
  desktopIconSize: 'w-16 h-16 rounded-2xl',
  desktopIconLabel: 'text-[13px] font-medium',

  consoleFont: 'font-mono text-[13px]',
  consolePrompt: 'text-green-500 dark:text-green-400',
  consoleCursor: 'w-[8px] h-[15px] bg-zinc-500 dark:bg-zinc-400',

  contentBg: 'bg-transparent',
  contentPadding: 'p-4 md:p-8',

  cardBg: 'bg-white/50 dark:bg-black/30',
  cardBorder: 'border border-white/50 dark:border-white/5',
  cardBorderRadius: 'rounded-2xl',
  cardShadow: 'shadow-sm',

  nestedCardBg: 'bg-white/40 dark:bg-black/20',
  nestedCardBorder: 'border border-white/40 dark:border-white/5',
  nestedCardBorderRadius: 'rounded-xl',

  headingFont: 'font-sans',
  bodyFont: 'font-sans',
  textPrimary: 'text-zinc-900 dark:text-zinc-100',
  textSecondary: 'text-zinc-600 dark:text-zinc-400',
  textMuted: 'text-zinc-500 dark:text-zinc-500',

  tagBg: 'bg-zinc-100 dark:bg-zinc-800',
  tagText: 'text-zinc-600 dark:text-zinc-400',
  tagBorder: 'border-0',
  tagBorderRadius: 'rounded-full',

  projectTagBg: 'bg-blue-50/70 dark:bg-blue-900/20',
  projectTagText: 'text-blue-700 dark:text-blue-300',
};

const vercelTokens: StyleTokens = {
  statusBarHeight: 'h-8',
  statusBarClass:
    'bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-medium',
  statusBarFont: 'font-mono',

  windowBorderRadius: 'rounded-md',
  windowShadow: 'shadow-sm',
  windowBorder: 'border border-zinc-200 dark:border-zinc-800',
  windowBg: 'bg-white dark:bg-black',
  windowBackdrop: '',

  titleBarHeight: 'h-9',
  titleBarClass:
    'border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50',
  titleBarFont: 'text-[11px] font-mono tracking-wider font-semibold uppercase',

  controlSize: 'w-2.5 h-2.5',
  controlClose: 'bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400',
  controlMinimize: 'bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400',
  controlMaximize: 'bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400',
  controlHoverShow: false,

  desktopBg: 'bg-zinc-100 dark:bg-[#0A0A0A]',
  desktopIconPosition: 'top-left',
  desktopIconSize: 'w-12 h-12 rounded-md',
  desktopIconLabel: 'text-xs font-medium',

  consoleFont: 'font-mono text-[13px]',
  consolePrompt: 'text-zinc-500 dark:text-zinc-400',
  consoleCursor: 'w-2 h-3.5 bg-zinc-900 dark:bg-zinc-100',

  contentBg: 'bg-transparent',
  contentPadding: 'p-4 md:p-6',

  cardBg: 'bg-white dark:bg-black',
  cardBorder: 'border border-zinc-200 dark:border-zinc-800',
  cardBorderRadius: 'rounded-md',
  cardShadow: '',

  nestedCardBg: 'bg-zinc-50 dark:bg-zinc-900/20',
  nestedCardBorder: 'border border-zinc-200 dark:border-zinc-800',
  nestedCardBorderRadius: 'rounded',

  headingFont: 'font-mono',
  bodyFont: 'font-mono',
  textPrimary: 'text-zinc-900 dark:text-zinc-100',
  textSecondary: 'text-zinc-500 dark:text-zinc-400',
  textMuted: 'text-zinc-500 dark:text-zinc-500',

  tagBg: 'bg-zinc-50 dark:bg-zinc-900',
  tagText: 'text-zinc-500 dark:text-zinc-500',
  tagBorder: 'border border-zinc-200 dark:border-zinc-800',
  tagBorderRadius: 'rounded',

  projectTagBg: 'bg-transparent',
  projectTagText: 'text-zinc-500 dark:text-zinc-500',
};

export function getStyleTokens(preset: StylePreset): StyleTokens {
  return preset === 'macos' ? macosTokens : vercelTokens;
}
