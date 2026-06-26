'use client';

import { ProjectLayout, ProjectListPage } from '@/components/projects';
import { useSettings } from '@/lib/settings-context';
import { t } from '@/lib/translations';
import type { PageConfig } from '@/lib/page-config/page-config-types';
import type { ProjectMeta } from '@/lib/projects';
import type { Lang } from '@/lib/types';

interface ProjectsPageClientProps {
  projects: ProjectMeta[];
  pageConfig: Record<Lang, PageConfig>;
}

export function ProjectsPageClient({ projects, pageConfig }: ProjectsPageClientProps) {
  const { stylePreset, lang } = useSettings();
  const currentPageConfig = pageConfig[lang];

  return (
    <ProjectLayout
      backHref="/"
      backLabel={t('projects.backHome', lang)}
      footerText={currentPageConfig.footer}
    >
      <ProjectListPage
        projects={projects}
        pageConfig={currentPageConfig}
        stylePreset={stylePreset}
        lang={lang}
      />
    </ProjectLayout>
  );
}
