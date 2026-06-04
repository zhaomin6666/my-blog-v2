import { DeveloperOS } from '@/components/os/DeveloperOS';
import { blogService } from '@/lib/blog/blog-service';

export default async function Home() {
  const blogPosts = await blogService.getPublishedPosts();

  return <DeveloperOS blogPosts={blogPosts} />;
}
