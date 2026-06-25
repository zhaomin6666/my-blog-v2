import Link from 'next/link';
import { Download, Plus, Search } from 'lucide-react';
import { requireAdminSession } from '@/lib/admin/admin-auth';
import { ProjectAdminDatabaseConfigError, projectAdminService } from '@/lib/admin/project-admin-service';
import type { AdminProject, AdminProjectLanguage } from '@/lib/admin';
import { MarkdownImportForm } from '../MarkdownImportForm';
import { AdminShell } from '../AdminShell';
import { importProjectMarkdownAction } from './actions';

interface AdminProjectsPageProps {
  searchParams: Promise<{
    published?: string;
    featured?: string;
    lang?: AdminProjectLanguage;
    q?: string;
  }>;
}

function booleanParam(value: string | undefined): boolean | undefined {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

function stateBadge(active: boolean): string {
  return active
    ? `rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-200`
    : `rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300`;
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

export default async function AdminProjectsPage({ searchParams }: AdminProjectsPageProps) {
  await requireAdminSession();
  const params = await searchParams;
  const published = booleanParam(params.published);
  const featured = booleanParam(params.featured);
  const lang = params.lang === 'zh' || params.lang === 'en' ? params.lang : undefined;
  const keyword = params.q?.trim() || undefined;
  let projects: AdminProject[] = [];
  let databaseError = '';

  try {
    projects = await projectAdminService.listAdminProjects({
      published,
      featured,
      lang,
      keyword,
    });
  } catch (error) {
    databaseError =
      error instanceof ProjectAdminDatabaseConfigError
        ? 'PERSONAL_SITE_DATABASE_URL is not configured. Projects Admin writes to PostgreSQL and needs database access.'
        : 'Unable to load projects. Check PostgreSQL configuration and migration status.';
  }

  return (
    <AdminShell
      title="Projects Admin"
      description="Manage PostgreSQL projects. Public Projects read these records only when PROJECT_CONTENT_SOURCE=database or CONTENT_SOURCE=database; content/projects remains untouched."
      action={
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          <Plus size={15} />
          New Project
        </Link>
      }
    >
      <section className="mb-5 grid gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="font-semibold">Project Markdown Import / Export</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Import Project Markdown into PostgreSQL, dry-run changes first, and export active
            Project rows. Existing content/projects files remain untouched.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {exportButton('/admin/projects/export?scope=all', 'Export all zip')}
          {exportButton('/admin/projects/export?scope=published', 'Published zip')}
          {exportButton('/admin/projects/export?scope=draft', 'Draft zip')}
        </div>
      </section>

      <div className="mb-5">
        <MarkdownImportForm
          title="Import Project Markdown"
          description="Upload Project .md files into PostgreSQL. Dry-run is the default and writes nothing."
          submitLabel="Run Project Import"
          importAction={importProjectMarkdownAction}
        />
      </div>

      <form className="mb-5 grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-[1fr_150px_150px_150px_auto]">
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
          name="published"
          defaultValue={published === undefined ? '' : String(published)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
        >
          <option value="">All publish</option>
          <option value="true">published</option>
          <option value="false">unpublished</option>
        </select>
        <select
          name="featured"
          defaultValue={featured === undefined ? '' : String(featured)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-100"
        >
          <option value="">All featured</option>
          <option value="true">featured</option>
          <option value="false">not featured</option>
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
      ) : projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="font-semibold">No database projects yet</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Create a PostgreSQL project draft. Existing content/projects Markdown files are not migrated in this phase.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Published</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Lang</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="max-w-[280px] px-4 py-3 font-medium">
                      <div>{project.title}</div>
                      <div className="mt-1 text-xs text-zinc-500">{project.status}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">{project.slug}</td>
                    <td className="px-4 py-3">
                      <span className={stateBadge(project.published)}>
                        {project.published ? 'published' : 'draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={stateBadge(project.featured)}>
                        {project.featured ? 'featured' : 'normal'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{project.displayOrder}</td>
                    <td className="px-4 py-3">{project.lang}</td>
                    <td className="px-4 py-3">{project.updatedAt || '-'}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="mr-2 rounded-md border border-zinc-300 px-2.5 py-1.5 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                      >
                        Edit
                      </Link>
                      <a
                        href={`/admin/projects/export/${project.id}`}
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
