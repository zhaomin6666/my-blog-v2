'use client';

import { useSettings } from '@/lib/settings-context';

/**
 * @deprecated Use `useSettings` from `@/lib/settings-context` directly.
 * This hook is a compatibility wrapper that delegates to SettingsContext.
 */
export function useStylePreset() {
  const { stylePreset, setStylePreset, toggleStylePreset, mounted } = useSettings();
  return { stylePreset, setStylePreset, toggleStylePreset, mounted };
}
