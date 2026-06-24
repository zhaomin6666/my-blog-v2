import { requireAdminSession } from '@/lib/admin/admin-auth';
import { ProfileAdminDatabaseConfigError, profileAdminService } from '@/lib/admin/profile-admin-service';
import type { AdminProfilePage } from '@/lib/admin';
import { AdminShell } from '../AdminShell';
import { ProfileAdminPanel } from './ProfileAdminPanel';

function createEmptyProfilePage(lang: 'zh' | 'en'): AdminProfilePage {
  return {
    id: '',
    key: 'profile',
    title: '',
    summary: '',
    contentMarkdown: '',
    data: {
      published: true,
      role: { zh: '', en: '' },
      status: { zh: '', en: '' },
      intro: { zh: '', en: '' },
      fields: [
        { labelKey: 'about.role', value: { zh: '', en: '' } },
        { labelKey: 'about.direction', value: { zh: '', en: '' } },
        { labelKey: 'about.status', value: { zh: '', en: '' } },
      ],
      focus: [],
      background: [],
      building: [],
      workStyle: [],
      privacyNote: {
        zh: '',
        en: '',
      },
    },
    lang,
    createdAt: '',
    updatedAt: '',
  };
}

export default async function AdminProfilePage() {
  await requireAdminSession();
  let zhPage = createEmptyProfilePage('zh');
  let enPage = createEmptyProfilePage('en');
  let databaseError = '';

  try {
    const [zhResult, enResult] = await Promise.all([
      profileAdminService.getProfilePage('profile', 'zh'),
      profileAdminService.getProfilePage('profile', 'en'),
    ]);

    zhPage = zhResult ?? zhPage;
    enPage = enResult ?? enPage;
  } catch (error) {
    databaseError =
      error instanceof ProfileAdminDatabaseConfigError
        ? 'PERSONAL_SITE_DATABASE_URL is not configured. Profile Admin writes to PostgreSQL.'
        : 'Unable to load profile page. Check PostgreSQL configuration and migration status.';
  }

  return (
    <AdminShell title="Profile Admin">
      {databaseError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200">
          {databaseError}
        </div>
      ) : (
        <ProfileAdminPanel zhPage={zhPage} enPage={enPage} />
      )}
    </AdminShell>
  );
}
