'use client';

import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';
import { projects } from '@/data/projects';

export function ProjectsSection() {
  const { lang, stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  return (
    <div className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow}`}>
      <h2 className={`mb-4 ${isMacos ? 'text-xl font-semibold' : 'text-sm font-mono font-bold uppercase tracking-wider'} ${tokens.textPrimary}`}>
        {t('section.projects', lang)}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`p-4 ${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius}`}
          >
            <h3 className={`mb-2 ${isMacos ? 'font-semibold' : 'font-mono font-bold text-sm'} ${tokens.textPrimary}`}>
              {lang === 'zh' ? project.titleZh || project.title : project.title}
            </h3>
            <p className={`mb-3 ${isMacos ? 'text-sm' : 'text-xs font-mono'} ${tokens.textSecondary}`}>
              {lang === 'zh' ? project.descriptionZh || project.description : project.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 text-xs ${tokens.projectTagBg} ${tokens.projectTagText} ${tokens.tagBorderRadius}`}
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
