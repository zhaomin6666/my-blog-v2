'use client';

import { useSettings } from '@/lib/settings-context';

/**
 * @deprecated Use `useSettings` from `@/lib/settings-context` directly.
 * This hook is a compatibility wrapper that delegates to SettingsContext.
 */
export function useTheme() {
  const { theme, setTheme, toggleTheme, mounted } = useSettings();
  return { theme, setTheme, toggleTheme, mounted };
}
