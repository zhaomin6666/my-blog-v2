import { projectService } from '@/lib/projects';
import { pageConfigService } from '@/lib/page-config';
import { buildMetadata } from '@/lib/seo';
import { ProjectsPageClient } from './ProjectsPageClient';

export async function generateMetadata() {
  const pageConfig = await pageConfigService.getPageConfig('projects');

  return buildMetadata({
    title: pageConfig.seoTitle || pageConfig.title,
    description: pageConfig.seoDescription || pageConfig.subtitle,
    path: '/projects',
  });
}

export default async function ProjectsPage() {
  const [projects, pageConfigZh, pageConfigEn] = await Promise.all([
    projectService.getPublishedProjects(),
    pageConfigService.getPageConfig('projects', 'zh'),
    pageConfigService.getPageConfig('projects', 'en'),
  ]);

  return (
    <ProjectsPageClient
      projects={projects}
      pageConfig={{ zh: pageConfigZh, en: pageConfigEn }}
    />
  );
}
