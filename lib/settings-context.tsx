'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Theme, Lang, StylePreset } from './types';
import { STORAGE_KEYS } from './constants';

interface SettingsState {
  theme: Theme;
  lang: Lang;
  stylePreset: StylePreset;
  mounted: boolean;
}

interface SettingsContextValue extends SettingsState {
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  setStylePreset: (s: StylePreset) => void;
  toggleStylePreset: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getSystemLang(): Lang {
  if (typeof window === 'undefined') return 'zh';
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SettingsState>({
    theme: 'dark',
    lang: 'zh',
    stylePreset: 'macos',
    mounted: false,
  });

  // Initialize from localStorage / system defaults on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) as Theme | null;
    const savedLang = localStorage.getItem(STORAGE_KEYS.lang) as Lang | null;
    const savedStyle = localStorage.getItem(STORAGE_KEYS.stylePreset) as StylePreset | null;

    setState({
      theme: savedTheme ?? getSystemTheme(),
      lang: savedLang ?? getSystemLang(),
      stylePreset: savedStyle ?? 'macos',
      mounted: true,
    });
  }, []);

  // Sync theme to DOM and localStorage
  useEffect(() => {
    if (!state.mounted) return;
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.theme, state.theme);
  }, [state.theme, state.mounted]);

  // Sync lang to localStorage
  useEffect(() => {
    if (!state.mounted) return;
    localStorage.setItem(STORAGE_KEYS.lang, state.lang);
  }, [state.lang, state.mounted]);

  // Sync stylePreset to localStorage
  useEffect(() => {
    if (!state.mounted) return;
    localStorage.setItem(STORAGE_KEYS.stylePreset, state.stylePreset);
  }, [state.stylePreset, state.mounted]);

  const setTheme = useCallback((t: Theme) => {
    setState(prev => ({ ...prev, theme: t }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  }, []);

  const setLang = useCallback((l: Lang) => {
    setState(prev => ({ ...prev, lang: l }));
  }, []);

  const toggleLang = useCallback(() => {
    setState(prev => ({ ...prev, lang: prev.lang === 'zh' ? 'en' : 'zh' }));
  }, []);

  const setStylePreset = useCallback((s: StylePreset) => {
    setState(prev => ({ ...prev, stylePreset: s }));
  }, []);

  const toggleStylePreset = useCallback(() => {
    setState(prev => ({ ...prev, stylePreset: prev.stylePreset === 'macos' ? 'vercel' : 'macos' }));
  }, []);

  const value: SettingsContextValue = {
    ...state,
    setTheme,
    toggleTheme,
    setLang,
    toggleLang,
    setStylePreset,
    toggleStylePreset,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
}
