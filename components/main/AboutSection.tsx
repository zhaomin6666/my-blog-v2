'use client';

import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';

export function AboutSection() {
  const { lang, stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  return (
    <div className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow}`}>
      <h2 className={`mb-4 ${isMacos ? 'text-xl font-semibold' : 'text-sm font-mono font-bold uppercase tracking-wider'} ${tokens.textPrimary}`}>
        {t('section.about', lang)}
      </h2>
      <p className={`${isMacos ? 'leading-relaxed' : 'text-sm font-mono'} ${tokens.textSecondary}`}>
        {t('about.description', lang)}
      </p>
    </div>
  );
}
