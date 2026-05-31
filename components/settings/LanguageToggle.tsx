'use client';

import { Globe } from 'lucide-react';
import { Lang } from '@/lib/types';

interface LanguageToggleProps {
  lang: Lang;
  toggleLang: () => void;
}

export function LanguageToggle({ lang, toggleLang }: LanguageToggleProps) {
  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm"
      aria-label="Toggle language"
    >
      <Globe size={14} />
      <span className="uppercase text-xs font-medium">{lang}</span>
    </button>
  );
}
