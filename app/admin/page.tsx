import Link from 'next/link';
import { FileText } from 'lucide-react';
import { requireAdminSession } from '@/lib/admin/admin-auth';
import { AdminShell } from './AdminShell';

export default async function AdminDashboardPage() {
  await requireAdminSession();

  return (
    <AdminShell
      title="Admin Dashboard"
      description="Phase 11.5 focuses on Blog Admin MVP. It writes to PostgreSQL blog_posts and does not import or modify the file-based content/blog source."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Link
          href="/admin/blog"
          className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950">
            <FileText size={18} />
          </div>
          <h2 className="font-semibold">Blog Admin</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Create drafts, edit Markdown metadata, publish posts, and unpublish posts from PostgreSQL.
          </p>
        </Link>
      </section>
    </AdminShell>
  );
}
