import type { Metadata } from 'next';
import { projects } from '@/data/projects';
import { buildMetadata } from '@/lib/seo';
import { ProjectsPageClient } from './ProjectsPageClient';

export const metadata: Metadata = buildMetadata({
  title: 'Project Case Studies',
  description:
    'Project case studies for Personal Developer OS, AI Agent learning work, and enterprise-system experience.',
  path: '/projects',
});

export default function ProjectsPage() {
  return <ProjectsPageClient projects={projects} />;
}
