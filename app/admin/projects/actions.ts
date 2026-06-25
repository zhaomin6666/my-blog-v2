'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdminSession } from '@/lib/admin/admin-auth';
import { projectAdminService } from '@/lib/admin/project-admin-service';
import {
  AdminProjectValidationError,
  readAdminProjectInputFromFormData,
} from '@/lib/admin/project-admin-validation';

export interface AdminProjectFormState {
  ok: boolean;
  message: string;
  fieldErrors: Record<string, string>;
}

const initialErrorState: AdminProjectFormState = {
  ok: false,
  message: '',
  fieldErrors: {},
};

function revalidateProjectPaths(slug?: string): void {
  revalidatePath('/');
  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  revalidatePath('/sitemap.xml');
  revalidatePath('/agent-demo');

  if (slug) {
    revalidatePath(`/projects/${slug}`);
  }
}

function toSafeActionState(error: unknown): AdminProjectFormState {
  if (error instanceof AdminProjectValidationError) {
    return {
      ok: false,
      message: error.message,
      fieldErrors: error.fieldErrors,
    };
  }

  return {
    ...initialErrorState,
    message: 'Unable to save the project. Check the database configuration and try again.',
  };
}

export async function createProjectAction(
  _previousState: AdminProjectFormState,
  formData: FormData,
): Promise<AdminProjectFormState> {
  await requireAdminSession();
  let projectId = '';
  let projectSlug = '';

  try {
    const input = readAdminProjectInputFromFormData(formData);
    const project = await projectAdminService.createProject(input);
    projectId = project.id;
    projectSlug = project.slug;
  } catch (error) {
    return toSafeActionState(error);
  }

  revalidateProjectPaths(projectSlug);
  redirect(`/admin/projects/${projectId}`);
}

export async function updateProjectAction(
  id: string,
  _previousState: AdminProjectFormState,
  formData: FormData,
): Promise<AdminProjectFormState> {
  await requireAdminSession();

  try {
    const input = readAdminProjectInputFromFormData(formData);
    const project = await projectAdminService.updateProject(id, input);
    revalidateProjectPaths(project.slug);
    return {
      ok: true,
      message: 'Saved.',
      fieldErrors: {},
    };
  } catch (error) {
    return toSafeActionState(error);
  }
}

export async function publishProjectAction(formData: FormData): Promise<void> {
  await requireAdminSession();

  const id = String(formData.get('id') || '');
  const project = await projectAdminService.publishProject(id);
  revalidateProjectPaths(project.slug);
  redirect(`/admin/projects/${project.id}`);
}

export async function unpublishProjectAction(formData: FormData): Promise<void> {
  await requireAdminSession();

  const id = String(formData.get('id') || '');
  const project = await projectAdminService.unpublishProject(id);
  revalidateProjectPaths(project.slug);
  redirect(`/admin/projects/${project.id}`);
}
