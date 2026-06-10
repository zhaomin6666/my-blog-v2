'use client';

import { ProjectLayout, ProjectNotFound } from '@/components/projects';
import { useSettings } from '@/lib/settings-context';
import { t } from '@/lib/translations';

export function ProjectNotFoundClient() {
  const { stylePreset, lang } = useSettings();

  return (
    <ProjectLayout backHref="/projects" backLabel={t('projects.backToProjects', lang)}>
      <ProjectNotFound stylePreset={stylePreset} lang={lang} />
    </ProjectLayout>
  );
}
