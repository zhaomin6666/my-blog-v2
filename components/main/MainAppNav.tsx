'use client';

import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';

interface MainAppNavProps {
  activeSection?: string;
  onNavigate: (sectionId: string) => void;
}

const navItems = [
  { id: 'overview', labelKey: 'nav.overview' as const },
  { id: 'about', labelKey: 'nav.profile' as const },
  { id: 'skills', labelKey: 'nav.stack' as const },
  { id: 'projects', labelKey: 'nav.services' as const },
  { id: 'blog', labelKey: 'nav.logs' as const },
  { id: 'contact', labelKey: 'nav.contact' as const },
];

export function MainAppNav({ activeSection, onNavigate }: MainAppNavProps) {
  const { lang, stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  return (
    <div
      className={`sticky top-0 z-10 flex items-center gap-1 overflow-x-auto py-2 ${tokens.contentPadding}`}
      style={{ scrollbarWidth: 'none' }}
    >
      <div
        className={`flex items-center gap-1 ${isMacos ? 'bg-white/40 dark:bg-black/30 backdrop-blur-md rounded-full px-2 py-1 border border-white/30 dark:border-white/5' : 'border-b border-zinc-200 dark:border-zinc-800 pb-1'}`}
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`shrink-0 px-3 py-1.5 text-xs transition-all ${
                isMacos
                  ? `rounded-full font-medium ${
                      isActive
                        ? 'bg-white/70 dark:bg-white/15 text-zinc-900 dark:text-white shadow-sm'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                    }`
                  : `font-mono font-medium uppercase tracking-wider ${
                      isActive
                        ? 'text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100'
                        : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'
                    }`
              }`}
            >
              {t(item.labelKey, lang)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
