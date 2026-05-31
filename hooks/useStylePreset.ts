'use client';

import { useState, useEffect, useCallback } from 'react';
import { StylePreset } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';

export function useStylePreset() {
  const [stylePreset, setStylePresetState] = useState<StylePreset>('macos');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEYS.stylePreset) as StylePreset | null;
    if (saved && (saved === 'macos' || saved === 'vercel')) {
      setStylePresetState(saved);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEYS.stylePreset, stylePreset);
  }, [stylePreset, mounted]);

  const setStylePreset = useCallback((s: StylePreset) => {
    setStylePresetState(s);
  }, []);

  const toggleStylePreset = useCallback(() => {
    setStylePresetState(prev => prev === 'macos' ? 'vercel' : 'macos');
  }, []);

  return { stylePreset, setStylePreset, toggleStylePreset, mounted };
}
