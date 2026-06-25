import Link from 'next/link';
import { Contact, FileText, Layers3, LayoutDashboard, PanelsTopLeft, UserRound } from 'lucide-react';
import { requireAdminSession } from '@/lib/admin/admin-auth';
import { AdminShell } from './AdminShell';

export default async function AdminDashboardPage() {
  await requireAdminSession();

  return (
    <AdminShell
      title="Admin Dashboard"
      description="Admin writes to PostgreSQL while file content sources remain available. Public pages read database content only when the matching content source is set to database."
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
        <Link
          href="/admin/hero"
          className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950">
            <LayoutDashboard size={18} />
          </div>
          <h2 className="font-semibold">Hero Admin</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Edit the homepage Hero only. Logs stay in Blog Admin, while Profile, Stack, and Contact stay in their own admin pages.
          </p>
        </Link>
        <Link
          href="/admin/projects"
          className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950">
            <PanelsTopLeft size={18} />
          </div>
          <h2 className="font-semibold">Projects Admin</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Create, edit, publish, feature, and order database-backed project case studies.
          </p>
        </Link>
        <Link
          href="/admin/profile"
          className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950">
            <UserRound size={18} />
          </div>
          <h2 className="font-semibold">Profile Admin</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Edit profile_pages key=profile without migrating or deleting content/profile files.
          </p>
        </Link>
        <Link
          href="/admin/contact"
          className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950">
            <Contact size={18} />
          </div>
          <h2 className="font-semibold">Contact Admin</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Add, edit, hide, reorder, and soft-delete public contact channels.
          </p>
        </Link>
        <Link
          href="/admin/stack"
          className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950">
            <Layers3 size={18} />
          </div>
          <h2 className="font-semibold">System Stack Admin</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Manage stack groups and stack items with explicit display ordering.
          </p>
        </Link>
      </section>
    </AdminShell>
  );
}
