'use client';

import { ProjectDetailPage, ProjectLayout } from '@/components/projects';
import type { BlogPostMeta, BlogSeries } from '@/lib/blog/blog-types';
import { useSettings } from '@/lib/settings-context';
import { t } from '@/lib/translations';
import type { Project } from '@/lib/projects';

interface ProjectDetailPageClientProps {
  project: Project;
  htmlContent: string;
  relatedSeries: BlogSeries | null;
  relatedSeriesPosts: BlogPostMeta[];
}

export function ProjectDetailPageClient({
  project,
  htmlContent,
  relatedSeries,
  relatedSeriesPosts,
}: ProjectDetailPageClientProps) {
  const { stylePreset, lang } = useSettings();

  return (
    <ProjectLayout backHref="/projects" backLabel={t('projects.backToProjects', lang)}>
      <ProjectDetailPage
        project={project}
        htmlContent={htmlContent}
        relatedSeries={relatedSeries}
        relatedSeriesPosts={relatedSeriesPosts}
        stylePreset={stylePreset}
        lang={lang}
      />
    </ProjectLayout>
  );
}
