'use client';

import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';

export function HeroOverview() {
  const { lang, stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  return (
    <div className={`p-8 md:p-12 ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow}`}>
      <div className="space-y-4 max-w-2xl">
        <h1 className={`${isMacos ? 'text-3xl md:text-5xl font-bold' : 'text-2xl md:text-4xl font-mono font-bold tracking-tight'} ${tokens.textPrimary}`}>
          {t('section.hero', lang)}
        </h1>
        <p className={`${isMacos ? 'text-lg' : 'text-sm font-mono'} ${tokens.textSecondary}`}>
          {t('hero.subtitle', lang)}
        </p>
      </div>
    </div>
  );
}
