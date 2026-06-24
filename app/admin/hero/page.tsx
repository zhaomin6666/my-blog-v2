import { requireAdminSession } from '@/lib/admin/admin-auth';
import { ProfileAdminDatabaseConfigError, profileAdminService } from '@/lib/admin/profile-admin-service';
import type { AdminHomepageSection } from '@/lib/admin';
import { AdminShell } from '../AdminShell';
import { HeroAdminPanel } from './HeroAdminPanel';

function createEmptyHeroSection(lang: 'zh' | 'en'): AdminHomepageSection {
  return {
    id: '',
    key: 'hero',
    title: '',
    subtitle: '',
    contentMarkdown: '',
    data: {},
    visible: true,
    displayOrder: 0,
    lang,
    createdAt: '',
    updatedAt: '',
  };
}

export default async function AdminHeroPage() {
  await requireAdminSession();
  let sections: AdminHomepageSection[] = [];
  let databaseError = '';

  try {
    sections = await profileAdminService.listHomepageSections();
  } catch (error) {
    databaseError =
      error instanceof ProfileAdminDatabaseConfigError
        ? 'PERSONAL_SITE_DATABASE_URL is not configured. Hero Admin writes to PostgreSQL.'
        : 'Unable to load hero content. Check PostgreSQL configuration and migration status.';
  }

  const zhSection = sections.find((section) => section.lang === 'zh') ?? createEmptyHeroSection('zh');
  const enSection = sections.find((section) => section.lang === 'en') ?? createEmptyHeroSection('en');

  return (
    <AdminShell title="Hero Admin">
      {databaseError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200">
          {databaseError}
        </div>
      ) : (
        <HeroAdminPanel zhSection={zhSection} enSection={enSection} />
      )}
    </AdminShell>
  );
}
