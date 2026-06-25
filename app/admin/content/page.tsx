import { Download, FileArchive, ShieldCheck } from 'lucide-react';
import { requireAdminSession } from '@/lib/admin/admin-auth';
import { BlogAdminDatabaseConfigError, blogAdminService } from '@/lib/admin/blog-admin-service';
import { ProjectAdminDatabaseConfigError, projectAdminService } from '@/lib/admin/project-admin-service';
import type { AdminBlogPost, AdminProject } from '@/lib/admin';
import { AdminShell } from '../AdminShell';
import { ContentImportForm } from './ContentImportForm';

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

function ExportList({
  title,
  type,
  rows,
}: {
  title: string;
  type: 'blog' | 'projects';
  rows: Array<AdminBlogPost | AdminProject>;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Showing up to 50 active rows. Single exports download .md; bulk export downloads zip.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {exportButton(`/admin/content/export/${type}?scope=all`, 'Export all zip')}
          {exportButton(`/admin/content/export/${type}?scope=published`, 'Published zip')}
        </div>
      </div>
      {rows.length === 0 ? (
        <div className="rounded-md border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          No active rows available for export.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <tr>
                <th className="px-3 py-3">Title</th>
                <th className="px-3 py-3">Slug</th>
                <th className="px-3 py-3">State</th>
                <th className="px-3 py-3">Lang</th>
                <th className="px-3 py-3">Export</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {rows.map((row) => {
                const state =
                  'published' in row
                    ? row.published
                      ? 'published'
                      : 'unpublished'
                    : row.status;
                return (
                  <tr key={row.id}>
                    <td className="max-w-[280px] px-3 py-3 font-medium">{row.title}</td>
                    <td className="px-3 py-3 font-mono text-xs text-zinc-500">{row.slug}</td>
                    <td className="px-3 py-3">{state}</td>
                    <td className="px-3 py-3">{row.lang}</td>
                    <td className="px-3 py-3">
                      {exportButton(`/admin/content/export/${type}/${row.id}`, '.md')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default async function AdminContentPage() {
  await requireAdminSession();

  let posts: AdminBlogPost[] = [];
  let projects: AdminProject[] = [];
  let databaseError = '';

  try {
    [posts, projects] = await Promise.all([
      blogAdminService.listAdminBlogPosts({ limit: 50 }),
      projectAdminService.listAdminProjects({ limit: 50 }),
    ]);
  } catch (error) {
    databaseError =
      error instanceof BlogAdminDatabaseConfigError ||
      error instanceof ProjectAdminDatabaseConfigError
        ? 'PERSONAL_SITE_DATABASE_URL is not configured. Content Import / Export writes to PostgreSQL and needs database access.'
        : 'Unable to load export rows. Check PostgreSQL configuration and migration status.';
  }

  return (
    <AdminShell
      title="Content Import / Export"
      description="Import and export Blog / Projects Markdown through the protected Admin surface. This page manages database content only and never modifies content/blog or content/projects."
    >
      <div className="grid gap-5">
        <section className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-3">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 text-emerald-600" size={18} />
            <div>
              <h2 className="font-semibold">Safety boundary</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Dry-run writes nothing. Non-dry-run imports require explicit confirmation and
                never delete rows.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <FileArchive className="mt-0.5 text-sky-600" size={18} />
            <div>
              <h2 className="font-semibold">Database only</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Imported rows affect public pages only when CONTENT_SOURCE or the matching source
                env is set to database.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Download className="mt-0.5 text-violet-600" size={18} />
            <div>
              <h2 className="font-semibold">No scripts</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                This phase adds no local migration scripts, no zip import, no image upload, and no
                deployment config changes.
              </p>
            </div>
          </div>
        </section>

        <ContentImportForm />

        <section className="grid gap-5">
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950">
                <Download size={17} />
              </div>
              <div>
                <h2 className="font-semibold">Markdown Export</h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Export active PostgreSQL Blog Posts and Projects as Markdown. Deleted rows are
                  excluded.
                </p>
              </div>
            </div>
          </div>

          {databaseError ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200">
              {databaseError}
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              <ExportList title="Blog Posts" type="blog" rows={posts} />
              <ExportList title="Projects" type="projects" rows={projects} />
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
