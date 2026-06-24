import { requireAdminSession } from '@/lib/admin/admin-auth';
import { ProfileAdminDatabaseConfigError, profileAdminService } from '@/lib/admin/profile-admin-service';
import type { AdminContactChannel } from '@/lib/admin';
import { AdminShell } from '../AdminShell';
import { ContactAdminPanel } from './ContactAdminPanel';

export default async function AdminContactPage() {
  await requireAdminSession();
  let channels: AdminContactChannel[] = [];
  let databaseError = '';

  try {
    channels = await profileAdminService.listContactChannels();
  } catch (error) {
    databaseError =
      error instanceof ProfileAdminDatabaseConfigError
        ? 'PERSONAL_SITE_DATABASE_URL is not configured. Contact Admin writes to PostgreSQL.'
        : 'Unable to load contact channels. Check PostgreSQL configuration and migration status.';
  }

  return (
    <AdminShell title="Contact Admin">
      {databaseError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200">
          {databaseError}
        </div>
      ) : (
        <ContactAdminPanel channels={channels} />
      )}
    </AdminShell>
  );
}
