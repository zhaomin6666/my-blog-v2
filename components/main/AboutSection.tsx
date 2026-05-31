'use client';

import { Lang, StylePreset } from '@/lib/types';
import { t } from '@/lib/translations';

interface AboutSectionProps {
  lang: Lang;
  stylePreset: StylePreset;
}

export function AboutSection({ lang, stylePreset }: AboutSectionProps) {
  const isMacos = stylePreset === 'macos';

  return (
    <div className={`p-6 ${isMacos ? 'bg-white/50 dark:bg-black/30 border border-white/40 dark:border-white/5 rounded-2xl shadow-sm' : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black rounded-md'}`}>
      <h2 className={`mb-4 ${isMacos ? 'text-xl font-semibold' : 'text-sm font-mono font-bold uppercase tracking-wider'}`}>
        {t('section.about', lang)}
      </h2>
      <p className={`${isMacos ? 'text-zinc-600 dark:text-zinc-400 leading-relaxed' : 'text-sm font-mono text-zinc-500 dark:text-zinc-400'}`}>
        {lang === 'zh'
          ? '我是一名后端开发者，专注于构建稳定可靠的业务系统，并持续探索 AI 原生应用。我关注架构设计、工程实践、产品思维，以及如何借助 AI 工具更高效地完成独立交付。'
          : 'I am a backend developer focused on building reliable business systems and exploring AI-native applications. I care about clean architecture, practical engineering, product thinking, and using AI tools to ship faster as an independent builder.'}
      </p>
    </div>
  );
}
