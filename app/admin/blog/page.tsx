import Link from 'next/link';
import { Download, Plus, Search } from 'lucide-react';
import { requireAdminSession } from '@/lib/admin/admin-auth';
import { BlogAdminDatabaseConfigError, blogAdminService } from '@/lib/admin/blog-admin-service';
import type { AdminBlogLanguage, AdminBlogPost, AdminBlogStatus } from '@/lib/admin';
import { MarkdownImportForm } from '../MarkdownImportForm';
import { AdminShell } from '../AdminShell';
import { importBlogMarkdownAction } from './actions';

interface AdminBlogPageProps {
  searchParams: Promise<{
    status?: AdminBlogStatus;
    lang?: AdminBlogLanguage;
    q?: string;
  }>;
}

function statusBadge(status: AdminBlogStatus): string {
  return status === 'published'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-200'
    : 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300';
}

function exportButton(href: string, label: string) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
    >
      <Download size={14} />
      {label}
    </a>
  );
}

export default async function AdminBlogPage({ searchParams }: AdminBlogPageProps) {
  await requireAdminSession();
  const params = await searchParams;
  const status = params.status === 'draft' || params.status === 'published' ? params.status : undefined;
  const lang = params.lang === 'zh' || params.lang === 'en' ? params.lang : undefined;
  const keyword = params.q?.trim() || undefined;
  let posts: AdminBlogPost[] = [];
  let databaseError = '';

  try {
    posts = await blogAdminService.listAdminBlogPosts({ status, lang, keyword });
  } catch (error) {
    databaseError =
      error instanceof BlogAdminDatabaseConfigError
        ? 'PERSONAL_SITE_DATABASE_URL is not configured. Blog Admin writes to PostgreSQL and needs database access.'
        : 'Unable to load blog posts. Check PostgreSQL configuration and migration status.';
  }

  return (
    <AdminShell
      title="Blog Admin"
      description="Manage PostgreSQL blog_posts. Public /blog reads these posts only when BLOG_CONTENT_SOURCE=database or CONTENT_SOURCE=database; file mode remains unchanged."
      action={
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          <Plus size={15} />
          New Post
        </Link>
      }
    >
      <section className="mb-5 grid gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="font-semibold">Blog Markdown Import / Export</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Import Blog Markdown into PostgreSQL, dry-run changes first, and export active Blog
            rows. Existing content/blog files remain untouched.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {exportButton('/admin/blog/export?scope=all', 'Export all zip')}
          {exportButton('/admin/blog/export?scope=published', 'Published zip')}
          {exportButton('/admin/blog/export?scope=draft', 'Draft zip')}
        </div>
      </section>

      <div className="mb-5">
        <MarkdownImportForm
          title="Import Blog Markdown"
          description="Upload Blog .md files into PostgreSQL. Dry-run is the default and writes nothing."
          submitLabel="Run Blog Import"
          importAction={importBlogMarkdownAction}
        />
      </div>

      <form className="mb-5 grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-[1fr_160px_160px_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-2.5 text-zinc-400" size={15} />
          <input
            name="q"
            defaultValue={keyword || ''}
            placeholder="Search title, slug, summary"
            className="w-full rounded-md border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
          />
        </label>
        <select
          name="status"
          defaultValue={status || ''}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
        >
          <option value="">All status</option>
          <option value="draft">draft</option>
          <option value="published">published</option>
        </select>
        <select
          name="lang"
          defaultValue={lang || ''}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
        >
          <option value="">All languages</option>
          <option value="zh">zh</option>
          <option value="en">en</option>
        </select>
        <button
          type="submit"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Filter
        </button>
      </form>

      {databaseError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200">
          {databaseError}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="font-semibold">No database posts yet</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Create the first draft in PostgreSQL. Existing content/blog Markdown files are not migrated in this phase.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Lang</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Tags</th>
                  <th className="px-4 py-3">Series</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="max-w-[260px] px-4 py-3 font-medium">{post.title}</td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">{post.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-xs ${statusBadge(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{post.lang}</td>
                    <td className="px-4 py-3">{post.date || '-'}</td>
                    <td className="px-4 py-3">{post.updatedAt || '-'}</td>
                    <td className="max-w-[180px] px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {post.tags.join(', ') || '-'}
                    </td>
                    <td className="px-4 py-3">{post.series || '-'}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="mr-2 rounded-md border border-zinc-300 px-2.5 py-1.5 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                      >
                        Edit
                      </Link>
                      <a
                        href={`/admin/blog/export/${post.id}`}
                        className="rounded-md border border-zinc-300 px-2.5 py-1.5 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                      >
                        Export Markdown
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
