'use client';

import { ProjectLayout, ProjectListPage } from '@/components/projects';
import { useSettings } from '@/lib/settings-context';
import { t } from '@/lib/translations';
import type { Project } from '@/lib/types';

interface ProjectsPageClientProps {
  projects: Project[];
}

export function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  const { stylePreset, lang } = useSettings();

  return (
    <ProjectLayout backHref="/" backLabel={t('projects.backHome', lang)}>
      <ProjectListPage projects={projects} stylePreset={stylePreset} lang={lang} />
    </ProjectLayout>
  );
}
