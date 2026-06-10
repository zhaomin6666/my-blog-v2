import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { renderMarkdownToHtml } from '@/lib/blog';
import { projectService } from '@/lib/projects';
import { buildMetadata } from '@/lib/seo';
import { ProjectDetailPageClient } from './ProjectDetailPageClient';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await projectService.getPublishedProjects();

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await projectService.getPublishedProjectBySlug(slug);

  if (!project) {
    return buildMetadata({
      title: 'Project Not Found',
      description: 'The requested project case study could not be found.',
      path: `/projects/${slug}`,
    });
  }

  return buildMetadata({
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.summary,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await projectService.getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const htmlContent = await renderMarkdownToHtml(project.content);

  return <ProjectDetailPageClient project={project} htmlContent={htmlContent} />;
}
