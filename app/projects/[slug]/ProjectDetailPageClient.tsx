'use client';

import { ProjectDetailPage, ProjectLayout } from '@/components/projects';
import { useSettings } from '@/lib/settings-context';
import { t } from '@/lib/translations';
import type { Project } from '@/lib/projects';

interface ProjectDetailPageClientProps {
  project: Project;
  htmlContent: string;
}

export function ProjectDetailPageClient({ project, htmlContent }: ProjectDetailPageClientProps) {
  const { stylePreset, lang } = useSettings();

  return (
    <ProjectLayout backHref="/projects" backLabel={t('projects.backToProjects', lang)}>
      <ProjectDetailPage
        project={project}
        htmlContent={htmlContent}
        stylePreset={stylePreset}
        lang={lang}
      />
    </ProjectLayout>
  );
}
