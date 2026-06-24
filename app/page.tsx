import type { Metadata } from 'next';
import { DeveloperOS } from '@/components/os/DeveloperOS';
import { blogService } from '@/lib/blog/blog-service';
import { homepageService } from '@/lib/homepage';
import { projectService } from '@/lib/projects';
import { profileService } from '@/lib/profile';
import { buildMetadata, seoConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: seoConfig.siteName,
  description: seoConfig.defaultDescription,
  path: '/',
});

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
