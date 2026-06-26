import { requireAdminSession } from '@/lib/admin/admin-auth';
import {
  SiteConfigAdminDatabaseConfigError,
  siteConfigAdminService,
} from '@/lib/admin/site-config-admin-service';
import type { AdminSiteConfig } from '@/lib/admin/site-config-admin-types';
import { AdminShell } from '../AdminShell';
import { SiteConfigForm } from './SiteConfigForm';

export default async function AdminSiteConfigPage() {
  await requireAdminSession();
  let configs: AdminSiteConfig[] = [];
  let databaseError = '';

  try {
    configs = await siteConfigAdminService.getSiteConfigAdminPage();
  } catch (error) {
    databaseError =
      error instanceof SiteConfigAdminDatabaseConfigError
        ? 'PERSONAL_SITE_DATABASE_URL is not configured. Site Config Admin writes to PostgreSQL.'
        : 'Unable to load site config. Check PostgreSQL configuration and migration status.';
  }

  return (
    <AdminShell
      title="Site Config"
      description="Configure site name, default metadata, author, locale, and social metadata."
    >
      {databaseError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200">
          {databaseError}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-lg border border-zinc-200 bg-white p-5 text-sm leading-6 text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            Site URL is controlled by NEXT_PUBLIC_SITE_URL and is not edited here.
          </div>
          <section className="grid gap-5 xl:grid-cols-2">
            {configs.map((config) => (
              <SiteConfigForm key={`${config.key}-${config.lang}`} config={config} />
            ))}
          </section>
        </div>
      )}
    </AdminShell>
  );
}
