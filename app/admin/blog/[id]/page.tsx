import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { requireAdminSession } from '@/lib/admin/admin-auth';
import { blogAdminService } from '@/lib/admin/blog-admin-service';
import { AdminShell } from '../../AdminShell';
import { BlogPostForm } from '../BlogPostForm';
import { publishBlogPostAction, unpublishBlogPostAction } from '../actions';

interface EditAdminBlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAdminBlogPostPage({ params }: EditAdminBlogPostPageProps) {
  await requireAdminSession();
  const { id } = await params;
  const post = await blogAdminService.getAdminBlogPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <AdminShell
      title="Edit Blog Post"
      description={`Editing database post ${post.slug}. Unpublish returns it to draft and public database-mode pages will stop showing it.`}
      action={
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/blog"
            className="flex items-center gap-2 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <ArrowLeft size={15} />
            Back
          </Link>
          {post.status === 'published' ? (
            <form action={unpublishBlogPostAction}>
              <input type="hidden" name="id" value={post.id} />
              <button
                type="submit"
                className="flex items-center gap-2 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                <EyeOff size={15} />
                Unpublish
              </button>
            </form>
          ) : (
            <form action={publishBlogPostAction}>
              <input type="hidden" name="id" value={post.id} />
              <button
                type="submit"
                className="flex items-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                <Eye size={15} />
                Publish
              </button>
            </form>
          )}
        </div>
      }
    >
      <BlogPostForm post={post} />
    </AdminShell>
  );
}
