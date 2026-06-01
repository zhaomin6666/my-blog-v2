'use client';

import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';
import { projects } from '@/data/projects';
import { ProjectStatus } from '@/lib/types';

function getStatusColor(status: ProjectStatus, isMacos: boolean): string {
  switch (status) {
    case 'building':
      return isMacos
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
        : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400';
    case 'production':
      return isMacos
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
        : 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400';
    case 'mvp':
      return isMacos
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
        : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400';
    default:
      return '';
  }
}

export function ProjectsSection() {
  const { lang, stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  return (
    <div className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow}`}>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-1 h-5 rounded-full ${isMacos ? 'bg-indigo-500' : 'bg-zinc-900 dark:bg-zinc-100'}`} />
        <h2 className={`${isMacos ? 'text-lg font-semibold' : 'text-xs font-mono font-bold uppercase tracking-wider'} ${tokens.textPrimary}`}>
          {t('projects.title', lang)}
        </h2>
        <span className={`ml-auto text-[10px] px-2 py-0.5 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}>
          services/
        </span>
      </div>

      {/* Project cards like service modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`group ${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius} overflow-hidden transition-all hover:opacity-90`}
          >
            {/* Card header */}
            <div className={`px-4 py-3 ${isMacos ? 'bg-white/30 dark:bg-white/5' : 'bg-zinc-100/50 dark:bg-zinc-900/30'} flex items-center justify-between`}>
              <h3 className={`${isMacos ? 'text-sm font-semibold' : 'text-xs font-mono font-bold'} ${tokens.textPrimary}`}>
                {project.title[lang]}
              </h3>
              <span
                className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(project.status, isMacos)} ${isMacos ? '' : 'font-mono'}`}
              >
                {t(`projects.status.${project.status}` as const, lang)}
              </span>
            </div>

            {/* Card body */}
            <div className="px-4 py-3 space-y-3">
              <p className={`${isMacos ? 'text-xs leading-relaxed' : 'text-[11px] font-mono leading-relaxed'} ${tokens.textSecondary}`}>
                {project.description[lang]}
              </p>

              {/* Tech Stack */}
              <div>
                <div className={`text-[10px] mb-1.5 ${tokens.textMuted} ${isMacos ? 'uppercase tracking-wider' : 'font-mono uppercase'}`}>
                  {t('projects.techStack', lang)}
                </div>
                <div className="flex flex-wrap gap-1">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className={`px-1.5 py-0.5 text-[10px] ${tokens.projectTagBg} ${tokens.projectTagText} ${tokens.tagBorderRadius} ${isMacos ? '' : 'font-mono'}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
