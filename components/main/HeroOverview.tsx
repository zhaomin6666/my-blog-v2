'use client';

import { Lang, StylePreset } from '@/lib/types';
import { t } from '@/lib/translations';

interface HeroOverviewProps {
  lang: Lang;
  stylePreset: StylePreset;
}

export function HeroOverview({ lang, stylePreset }: HeroOverviewProps) {
  const isMacos = stylePreset === 'macos';

  return (
    <div className={`p-8 md:p-12 ${isMacos ? 'bg-white/50 dark:bg-black/30 border border-white/40 dark:border-white/5 rounded-2xl shadow-sm' : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black rounded-md'}`}>
      <div className="space-y-4 max-w-2xl">
        <h1 className={`${isMacos ? 'text-3xl md:text-5xl font-bold' : 'text-2xl md:text-4xl font-mono font-bold tracking-tight'}`}>
          {t('section.hero', lang)}
        </h1>
        <p className={`${isMacos ? 'text-lg text-zinc-600 dark:text-zinc-400' : 'text-sm font-mono text-zinc-500 dark:text-zinc-400'}`}>
          {lang === 'zh'
            ? '后端开发者 / AI 应用探索者 / 独立产品构建者'
            : 'Backend Developer / AI Explorer / Indie Builder'}
        </p>
      </div>
    </div>
  );
}
