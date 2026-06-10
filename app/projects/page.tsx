import type { Metadata } from 'next';
import { projectService } from '@/lib/projects';
import { buildMetadata } from '@/lib/seo';
import { ProjectsPageClient } from './ProjectsPageClient';

export const metadata: Metadata = buildMetadata({
  title: 'Project Case Studies',
  description:
    'Project case studies for Personal Developer OS, AI Agent learning work, and enterprise-system experience.',
  path: '/projects',
});

export default async function ProjectsPage() {
  const projects = await projectService.getPublishedProjects();

  return <ProjectsPageClient projects={projects} />;
}
