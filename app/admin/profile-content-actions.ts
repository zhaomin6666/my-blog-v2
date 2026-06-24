'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/admin/admin-auth';
import { profileAdminService } from '@/lib/admin/profile-admin-service';
import {
  AdminContentValidationError,
  readContactChannelInputFromFormData,
  readHomepageSectionInputFromFormData,
  readProfilePageInputFromFormData,
  readStackGroupInputFromFormData,
  readStackItemInputFromFormData,
} from '@/lib/admin/profile-admin-validation';
import type { AdminContentLanguage } from '@/lib/admin';

export interface AdminContentFormState {
  ok: boolean;
  message: string;
  fieldErrors: Record<string, string>;
}

function revalidatePublicProfilePaths(): void {
  revalidatePath('/');
  revalidatePath('/agent-demo');
  revalidatePath('/projects/ai-agent-demo');
  revalidatePath('/sitemap.xml');
}

function toSafeActionState(error: unknown): AdminContentFormState {
  if (error instanceof AdminContentValidationError) {
    return {
      ok: false,
      message: error.message,
      fieldErrors: error.fieldErrors,
    };
  }

  return {
    ok: false,
    message: 'Unable to save. Check PostgreSQL configuration and migration status.',
    fieldErrors: {},
  };
}

export async function saveHomepageSectionAction(
  _previousState: AdminContentFormState,
  formData: FormData,
): Promise<AdminContentFormState> {
  await requireAdminSession();

  try {
    const input = readHomepageSectionInputFromFormData(formData);
    await profileAdminService.upsertHomepageSection(input);
    revalidatePublicProfilePaths();
    revalidatePath('/admin/hero');
    return { ok: true, message: 'Saved.', fieldErrors: {} };
  } catch (error) {
    return toSafeActionState(error);
  }
}

export async function ensureHomepageHeroSectionAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const lang = formData.get('lang') === 'en' ? 'en' : 'zh';
  await profileAdminService.ensureHomepageHeroSection(lang as AdminContentLanguage);
  revalidatePublicProfilePaths();
  revalidatePath('/admin/hero');
}

export async function saveProfilePageAction(
  _previousState: AdminContentFormState,
  formData: FormData,
): Promise<AdminContentFormState> {
  await requireAdminSession();

  try {
    const input = readProfilePageInputFromFormData(formData);
    await profileAdminService.upsertProfilePage(input);
    revalidatePublicProfilePaths();
    revalidatePath('/admin/profile');
    return { ok: true, message: 'Saved.', fieldErrors: {} };
  } catch (error) {
    return toSafeActionState(error);
  }
}

export async function saveContactChannelAction(
  _previousState: AdminContentFormState,
  formData: FormData,
): Promise<AdminContentFormState> {
  await requireAdminSession();

  try {
    const id = String(formData.get('id') || '').trim();
    const input = readContactChannelInputFromFormData(formData);
    if (id) {
      await profileAdminService.updateContactChannel(id, input);
    } else {
      await profileAdminService.createContactChannel(input);
    }
    revalidatePublicProfilePaths();
    revalidatePath('/admin/contact');
    return { ok: true, message: 'Saved.', fieldErrors: {} };
  } catch (error) {
    return toSafeActionState(error);
  }
}

export async function deleteContactChannelAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = String(formData.get('id') || '').trim();
  await profileAdminService.softDeleteContactChannel(id);
  revalidatePublicProfilePaths();
  revalidatePath('/admin/contact');
}

export async function reorderContactChannelsAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const rawIds = String(formData.get('ids') || '').trim();
  const ids = rawIds.split(',').map((id) => id.trim()).filter(Boolean);
  await profileAdminService.reorderContactChannels(ids);
  revalidatePublicProfilePaths();
  revalidatePath('/admin/contact');
}

export async function saveStackGroupAction(
  _previousState: AdminContentFormState,
  formData: FormData,
): Promise<AdminContentFormState> {
  await requireAdminSession();

  try {
    const id = String(formData.get('id') || '').trim();
    const input = readStackGroupInputFromFormData(formData);
    if (id) {
      await profileAdminService.updateStackGroup(id, input);
    } else {
      await profileAdminService.createStackGroup(input);
    }
    revalidatePublicProfilePaths();
    revalidatePath('/admin/stack');
    return { ok: true, message: 'Saved.', fieldErrors: {} };
  } catch (error) {
    return toSafeActionState(error);
  }
}

export async function deleteStackGroupAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = String(formData.get('id') || '').trim();
  await profileAdminService.softDeleteStackGroup(id);
  revalidatePublicProfilePaths();
  revalidatePath('/admin/stack');
}

export async function saveStackItemAction(
  _previousState: AdminContentFormState,
  formData: FormData,
): Promise<AdminContentFormState> {
  await requireAdminSession();

  try {
    const id = String(formData.get('id') || '').trim();
    const input = readStackItemInputFromFormData(formData);
    if (id) {
      await profileAdminService.updateStackItem(id, input);
    } else {
      await profileAdminService.createStackItem(input);
    }
    revalidatePublicProfilePaths();
    revalidatePath('/admin/stack');
    return { ok: true, message: 'Saved.', fieldErrors: {} };
  } catch (error) {
    return toSafeActionState(error);
  }
}

export async function deleteStackItemAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = String(formData.get('id') || '').trim();
  await profileAdminService.softDeleteStackItem(id);
  revalidatePublicProfilePaths();
  revalidatePath('/admin/stack');
}

export async function reorderStackGroupsAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const rawIds = String(formData.get('ids') || '').trim();
  const ids = rawIds.split(',').map((id) => id.trim()).filter(Boolean);
  await profileAdminService.reorderStackGroups(ids);
  revalidatePublicProfilePaths();
  revalidatePath('/admin/stack');
}

export async function reorderStackItemsAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const groupId = String(formData.get('groupId') || '').trim();
  const rawIds = String(formData.get('ids') || '').trim();
  const ids = rawIds.split(',').map((id) => id.trim()).filter(Boolean);
  await profileAdminService.reorderStackItems(groupId, ids);
  revalidatePublicProfilePaths();
  revalidatePath('/admin/stack');
}
