import { requireAdminSession } from '@/lib/admin/admin-auth';
import { ProfileAdminDatabaseConfigError, profileAdminService } from '@/lib/admin/profile-admin-service';
import type { AdminStackGroup } from '@/lib/admin';
import { AdminShell } from '../AdminShell';
import { StackAdminPanel } from './StackAdminPanel';

export default async function AdminStackPage() {
  await requireAdminSession();
  let groups: AdminStackGroup[] = [];
  let databaseError = '';

  try {
    groups = await profileAdminService.listStackGroupsWithItems();
  } catch (error) {
    databaseError =
      error instanceof ProfileAdminDatabaseConfigError
        ? 'PERSONAL_SITE_DATABASE_URL is not configured. Stack Admin writes to PostgreSQL.'
        : 'Unable to load system stack. Check PostgreSQL configuration and migration status.';
  }

  return (
    <AdminShell title="Stack Admin">
      {databaseError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200">
          {databaseError}
        </div>
      ) : (
        <StackAdminPanel groups={groups} />
      )}
    </AdminShell>
  );
}
