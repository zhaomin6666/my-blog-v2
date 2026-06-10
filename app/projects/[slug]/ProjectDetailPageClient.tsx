'use client';

import { ProjectDetailPage, ProjectLayout } from '@/components/projects';
import { useSettings } from '@/lib/settings-context';
import { t } from '@/lib/translations';
import type { Project } from '@/lib/types';

interface ProjectDetailPageClientProps {
  project: Project;
}

export function ProjectDetailPageClient({ project }: ProjectDetailPageClientProps) {
  const { stylePreset, lang } = useSettings();

  return (
    <ProjectLayout backHref="/projects" backLabel={t('projects.backToProjects', lang)}>
      <ProjectDetailPage project={project} stylePreset={stylePreset} lang={lang} />
    </ProjectLayout>
  );
}
