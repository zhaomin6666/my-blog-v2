'use client';

import { Terminal, ArrowRight } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';

interface HeroOverviewProps {
  onOpenTerminal?: () => void;
  onNavigate?: (sectionId: string) => void;
}

export function HeroOverview({ onOpenTerminal, onNavigate }: HeroOverviewProps) {
  const { lang, stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  return (
    <div className={`p-6 md:p-10 ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow}`}>
      <div className="space-y-5 max-w-3xl">
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius}`}>
          <span className={`w-2 h-2 rounded-full bg-green-500 animate-pulse`} />
          <span className={`text-xs ${isMacos ? 'font-medium' : 'font-mono'} ${tokens.textMuted}`}>
            {t('hero.badge', lang)}
          </span>
        </div>

        {/* Title */}
        <h1 className={`${isMacos ? 'text-3xl md:text-4xl font-bold tracking-tight' : 'text-2xl md:text-3xl font-mono font-bold tracking-tight'} ${tokens.textPrimary}`}>
          {t('hero.title', lang)}
        </h1>

        {/* Subtitle */}
        <p className={`${isMacos ? 'text-base leading-relaxed' : 'text-sm font-mono leading-relaxed'} ${tokens.textSecondary} max-w-2xl`}>
          {t('hero.subtitle', lang)}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => onNavigate?.('projects')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm transition-all ${
              isMacos
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-medium hover:opacity-90'
                : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-mono font-medium uppercase tracking-wider hover:opacity-90'
            }`}
          >
            {t('hero.cta.projects', lang)}
            <ArrowRight size={14} />
          </button>
          {onOpenTerminal && (
            <button
              onClick={onOpenTerminal}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm transition-all ${
                isMacos
                  ? `${tokens.nestedCardBg} ${tokens.nestedCardBorder} rounded-full font-medium hover:bg-white/60 dark:hover:bg-black/40`
                  : `${tokens.nestedCardBg} ${tokens.nestedCardBorder} font-mono font-medium uppercase tracking-wider hover:border-zinc-400 dark:hover:border-zinc-600`
              } ${tokens.textPrimary}`}
            >
              <Terminal size={14} />
              {t('hero.cta.terminal', lang)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
