'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lang } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>('zh');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEYS.lang) as Lang | null;
    if (saved && (saved === 'zh' || saved === 'en')) {
      setLangState(saved);
    } else {
      const browserLang = navigator.language.toLowerCase();
      setLangState(browserLang.startsWith('zh') ? 'zh' : 'en');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEYS.lang, lang);
  }, [lang, mounted]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState(prev => prev === 'zh' ? 'en' : 'zh');
  }, []);

  return { lang, setLang, toggleLang, mounted };
}
