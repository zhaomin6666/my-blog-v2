'use client';

import Link from 'next/link';
import { getStyleTokens } from '@/lib/stylePresets';
import type { Lang, StylePreset } from '@/lib/types';
import { t } from '@/lib/translations';

interface ProjectNotFoundProps {
  stylePreset: StylePreset;
  lang: Lang;
}

export function ProjectNotFound({ stylePreset, lang }: ProjectNotFoundProps) {
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  return (
    <section className={`${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow} p-6 text-center`}>
      <div className={`text-[11px] uppercase ${tokens.textMuted} ${isMacos ? 'tracking-wider' : 'font-mono'}`}>
        404
      </div>
      <h1 className={`mt-2 ${isMacos ? 'text-2xl font-semibold' : 'font-mono text-xl font-bold uppercase'} ${tokens.textPrimary}`}>
        {t('projects.notFoundTitle', lang)}
      </h1>
      <p className={`mx-auto mt-3 max-w-md ${isMacos ? 'text-sm leading-relaxed' : 'font-mono text-xs leading-relaxed'} ${tokens.textSecondary}`}>
        {t('projects.notFoundDescription', lang)}
      </p>
      <Link
        href="/projects"
        className={`mt-5 inline-flex min-h-9 items-center px-3 py-1.5 text-xs transition-all active:scale-95 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius} hover:text-zinc-900 dark:hover:text-white ${isMacos ? '' : 'font-mono'}`}
      >
        {t('projects.returnToProjects', lang)}
      </Link>
    </section>
  );
}
