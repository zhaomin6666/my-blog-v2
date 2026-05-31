'use client';

import { Lang, StylePreset } from '@/lib/types';
import { t } from '@/lib/translations';
import { projects } from '@/data/projects';

interface ProjectsSectionProps {
  lang: Lang;
  stylePreset: StylePreset;
}

export function ProjectsSection({ lang, stylePreset }: ProjectsSectionProps) {
  const isMacos = stylePreset === 'macos';

  return (
    <div className={`p-6 ${isMacos ? 'bg-white/50 dark:bg-black/30 border border-white/40 dark:border-white/5 rounded-2xl shadow-sm' : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black rounded-md'}`}>
      <h2 className={`mb-4 ${isMacos ? 'text-xl font-semibold' : 'text-sm font-mono font-bold uppercase tracking-wider'}`}>
        {t('section.projects', lang)}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`p-4 ${isMacos ? 'bg-white/30 dark:bg-black/20 border border-white/30 dark:border-white/5 rounded-xl' : 'border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-900/20'}`}
          >
            <h3 className={`mb-2 ${isMacos ? 'font-semibold' : 'font-mono font-bold text-sm'}`}>
              {lang === 'zh' ? (project as unknown as { titleZh: string }).titleZh || project.title : project.title}
            </h3>
            <p className={`mb-3 ${isMacos ? 'text-sm text-zinc-600 dark:text-zinc-400' : 'text-xs font-mono text-zinc-500 dark:text-zinc-400'}`}>
              {lang === 'zh' ? (project as unknown as { descriptionZh: string }).descriptionZh || project.description : project.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 text-xs ${isMacos ? 'bg-blue-100/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full' : 'text-zinc-500 dark:text-zinc-500 font-mono'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
