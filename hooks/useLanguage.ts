'use client';

import { useSettings } from '@/lib/settings-context';

/**
 * @deprecated Use `useSettings` from `@/lib/settings-context` directly.
 * This hook is a compatibility wrapper that delegates to SettingsContext.
 */
export function useLanguage() {
  const { lang, setLang, toggleLang, mounted } = useSettings();
  return { lang, setLang, toggleLang, mounted };
}
