'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/admin/admin-auth';
import { siteConfigAdminService } from '@/lib/admin/site-config-admin-service';
import {
  AdminSiteConfigValidationError,
  readAdminSiteConfigInputFromFormData,
} from '@/lib/admin/site-config-admin-validation';
import type { AdminContentFormState } from '../profile-content-actions';

const initialErrorState: AdminContentFormState = {
  ok: false,
  message: '',
  fieldErrors: {},
};

function revalidateSiteConfigPaths(): void {
  revalidatePath('/admin/site');
  revalidatePath('/');
  revalidatePath('/blog');
  revalidatePath('/blog/search');
  revalidatePath('/blog/tags');
  revalidatePath('/blog/tags/[tagSlug]', 'page');
  revalidatePath('/blog/series');
  revalidatePath('/blog/series/[seriesSlug]', 'page');
  revalidatePath('/blog/[slug]', 'page');
  revalidatePath('/projects');
  revalidatePath('/projects/[slug]', 'page');
  revalidatePath('/agent-demo');
  revalidatePath('/sitemap.xml');
  revalidatePath('/robots.txt');
  revalidatePath('/rss.xml');
}

function toSafeActionState(error: unknown): AdminContentFormState {
  if (error instanceof AdminSiteConfigValidationError) {
    return {
      ok: false,
      message: error.message,
      fieldErrors: error.fieldErrors,
    };
  }

  return {
    ...initialErrorState,
    message: 'Unable to save site config. Check PostgreSQL configuration and migration status.',
  };
}

export async function saveSiteConfigAction(
  _previousState: AdminContentFormState,
  formData: FormData,
): Promise<AdminContentFormState> {
  await requireAdminSession();

  try {
    const input = readAdminSiteConfigInputFromFormData(formData);
    await siteConfigAdminService.saveSiteConfig(input);
    revalidateSiteConfigPaths();
    return { ok: true, message: 'Saved.', fieldErrors: {} };
  } catch (error) {
    return toSafeActionState(error);
  }
}
