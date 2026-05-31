'use client';

import { Lang, StylePreset } from '@/lib/types';
import { t } from '@/lib/translations';
import { skills } from '@/data/skills';

interface SkillsSectionProps {
  lang: Lang;
  stylePreset: StylePreset;
}

export function SkillsSection({ lang, stylePreset }: SkillsSectionProps) {
  const isMacos = stylePreset === 'macos';

  return (
    <div className={`p-6 ${isMacos ? 'bg-white/50 dark:bg-black/30 border border-white/40 dark:border-white/5 rounded-2xl shadow-sm' : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black rounded-md'}`}>
      <h2 className={`mb-4 ${isMacos ? 'text-xl font-semibold' : 'text-sm font-mono font-bold uppercase tracking-wider'}`}>
        {t('section.skills', lang)}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div key={skill.category} className="space-y-2">
            <h3 className={`${isMacos ? 'text-sm font-medium text-zinc-700 dark:text-zinc-300' : 'text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase'}`}>
              {lang === 'zh' ? skill.categoryZh || skill.category : skill.category}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skill.items.map((item) => (
                <span
                  key={item}
                  className={`px-2 py-0.5 text-xs ${isMacos ? 'bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400' : 'bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-500 dark:text-zinc-500 font-mono'}`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
