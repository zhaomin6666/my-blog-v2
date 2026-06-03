'use client';

import { Monitor, Terminal } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import { t } from '@/lib/translations';

export function StylePresetToggle() {
  const { stylePreset, toggleStylePreset, lang } = useSettings();
  const isMacos = stylePreset === 'macos';

  return (
    <button
      onClick={toggleStylePreset}
      className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 transition-all duration-150 active:scale-95 text-sm"
      aria-label="Toggle style preset"
    >
      {isMacos ? (
        <>
          <Monitor size={14} />
          <span className="text-xs font-medium">{t('stylePreset.macos', lang)}</span>
        </>
      ) : (
        <>
          <Terminal size={14} />
          <span className="text-xs font-medium">{t('stylePreset.vercel', lang)}</span>
        </>
      )}
    </button>
  );
}
