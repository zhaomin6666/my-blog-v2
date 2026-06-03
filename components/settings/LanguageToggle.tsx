'use client';

import { Globe } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

export function LanguageToggle() {
  const { lang, toggleLang } = useSettings();

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 transition-colors text-sm"
      aria-label="Toggle language"
    >
      <Globe size={14} />
      <span className="uppercase text-xs font-medium">{lang}</span>
    </button>
  );
}
