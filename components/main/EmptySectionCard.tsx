'use client';

import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { t, type TranslationKey } from '@/lib/translations';

interface EmptySectionCardProps {
  titleKey: TranslationKey;
  emptyKey: TranslationKey;
  tag: string;
  macosAccent: string;
}

export function EmptySectionCard({
  titleKey,
  emptyKey,
  tag,
  macosAccent,
}: EmptySectionCardProps) {
  const { lang, stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  return (
    <div className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow}`}>
      <div className="mb-5 flex items-center gap-2">
        <div className={`h-5 w-1 rounded-full ${isMacos ? macosAccent : 'bg-zinc-900 dark:bg-zinc-100'}`} />
        <h2 className={`${isMacos ? 'text-lg font-semibold' : 'text-xs font-mono font-bold uppercase tracking-wider'} ${tokens.textPrimary}`}>
          {t(titleKey, lang)}
        </h2>
        <span className={`ml-auto px-2 py-0.5 text-[10px] ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}>
          {tag}
        </span>
      </div>
      <div className={`p-5 ${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius}`}>
        <p className={`text-sm ${tokens.textSecondary}`}>{t(emptyKey, lang)}</p>
      </div>
    </div>
  );
}
