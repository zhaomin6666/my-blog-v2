import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projectCaseStudies } from '@/data/projects';
import { buildMetadata } from '@/lib/seo';
import { ProjectDetailPageClient } from './ProjectDetailPageClient';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return projectCaseStudies.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectCaseStudies.find((item) => item.slug === slug);

  if (!project) {
    return buildMetadata({
      title: 'Project Not Found',
      description: 'The requested project case study could not be found.',
      path: `/projects/${slug}`,
    });
  }

  return buildMetadata({
    title: project.title.en,
    description: project.description.en,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projectCaseStudies.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailPageClient project={project} />;
}
