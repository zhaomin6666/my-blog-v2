import type { Metadata } from 'next';
import { DeveloperOS } from '@/components/os/DeveloperOS';
import { blogService } from '@/lib/blog/blog-service';
import { homepageService } from '@/lib/homepage';
import { projectService } from '@/lib/projects';
import { profileService } from '@/lib/profile';
import { buildMetadata } from '@/lib/seo';
import { siteConfigService } from '@/lib/site-config';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await siteConfigService.getSiteConfig();

  return buildMetadata({
    title: siteConfig.siteName,
    description: siteConfig.defaultDescription,
    path: '/',
  }, siteConfig);
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const blogPosts = await blogService.getPublishedPosts();
  const featuredProjects = await projectService.getFeaturedProjects();
  const publicProfile = await profileService.getPublicProfile();
  const homepageSections = await homepageService.getVisibleSections();

  return (
    <DeveloperOS
      blogPosts={blogPosts}
      homepageSections={homepageSections}
      projects={featuredProjects}
      profile={publicProfile}
    />
  );
}
