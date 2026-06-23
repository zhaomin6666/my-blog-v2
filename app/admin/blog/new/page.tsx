import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireAdminSession } from '@/lib/admin/admin-auth';
import { AdminShell } from '../../AdminShell';
import { BlogPostForm } from '../BlogPostForm';

export default async function NewAdminBlogPostPage() {
  await requireAdminSession();

  return (
    <AdminShell
      title="New Blog Post"
      description="Create a database-backed draft or published post. This does not import or change content/blog Markdown files."
      action={
        <Link
          href="/admin/blog"
          className="flex items-center gap-2 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          <ArrowLeft size={15} />
          Back
        </Link>
      }
    >
      <BlogPostForm />
    </AdminShell>
  );
}
