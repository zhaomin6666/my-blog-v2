import { requireAdminSession } from '@/lib/admin/admin-auth';
import {
  PageConfigAdminDatabaseConfigError,
  pageConfigAdminService,
} from '@/lib/admin/page-config-admin-service';
import type { AdminPageConfig } from '@/lib/admin/page-config-admin-types';
import { AdminShell } from '../AdminShell';
import { PageConfigForm } from './PageConfigForm';

export default async function AdminPageConfigsPage() {
  await requireAdminSession();
  let configs: AdminPageConfig[] = [];
  let databaseError = '';

  try {
    configs = await pageConfigAdminService.getPageConfigAdminPage();
  } catch (error) {
    databaseError =
      error instanceof PageConfigAdminDatabaseConfigError
        ? 'PERSONAL_SITE_DATABASE_URL is not configured. Page Config Admin writes to PostgreSQL.'
        : 'Unable to load page configs. Check PostgreSQL configuration and migration status.';
  }

  return (
    <AdminShell
      title="Page Configs"
      description="Configure blog and project page titles, subtitles, footers, and SEO text."
    >
      {databaseError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200">
          {databaseError}
        </div>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2">
          {configs.map((config) => (
            <PageConfigForm key={`${config.key}-${config.lang}`} config={config} />
          ))}
        </section>
      )}
    </AdminShell>
  );
}
