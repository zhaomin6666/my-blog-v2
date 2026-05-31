import { WindowManagerState } from './types';

export const DEFAULT_WINDOW_STATE: WindowManagerState = {
  main: 'open',
  console: 'open',
  active: 'main',
};

export const CONSOLE_HEIGHT = 300;

export const STORAGE_KEYS = {
  theme: 'devos-theme',
  lang: 'devos-lang',
  stylePreset: 'devos-style-preset',
} as const;
