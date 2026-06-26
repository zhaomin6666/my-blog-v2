'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/admin/admin-auth';
import { pageConfigAdminService } from '@/lib/admin/page-config-admin-service';
import {
  AdminPageConfigValidationError,
  readAdminPageConfigInputFromFormData,
} from '@/lib/admin/page-config-admin-validation';
import type { AdminContentFormState } from '../profile-content-actions';

const initialErrorState: AdminContentFormState = {
  ok: false,
  message: '',
  fieldErrors: {},
};

function revalidatePageConfigPaths(): void {
  revalidatePath('/admin/pages');
  revalidatePath('/projects');
  revalidatePath('/blog');
}

function toSafeActionState(error: unknown): AdminContentFormState {
  if (error instanceof AdminPageConfigValidationError) {
    return {
      ok: false,
      message: error.message,
      fieldErrors: error.fieldErrors,
    };
  }

  return {
    ...initialErrorState,
    message: 'Unable to save page config. Check PostgreSQL configuration and migration status.',
  };
}

export async function savePageConfigAction(
  _previousState: AdminContentFormState,
  formData: FormData,
): Promise<AdminContentFormState> {
  await requireAdminSession();

  try {
    const input = readAdminPageConfigInputFromFormData(formData);
    await pageConfigAdminService.savePageConfig(input);
    revalidatePageConfigPaths();
    return { ok: true, message: 'Saved.', fieldErrors: {} };
  } catch (error) {
    return toSafeActionState(error);
  }
}
