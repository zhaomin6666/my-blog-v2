'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdminSession } from '@/lib/admin/admin-auth';
import { blogAdminService } from '@/lib/admin/blog-admin-service';
import {
  runMarkdownImportAction,
  type ContentImportActionState,
} from '../markdown-import-actions';
import {
  AdminBlogValidationError,
  readAdminBlogInputFromFormData,
} from '@/lib/admin/blog-admin-validation';

export interface AdminBlogFormState {
  ok: boolean;
  message: string;
  fieldErrors: Record<string, string>;
}

const initialErrorState: AdminBlogFormState = {
  ok: false,
  message: '',
  fieldErrors: {},
};

function revalidateBlogPaths(slug?: string): void {
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  revalidatePath('/blog/search');
  revalidatePath('/blog/tags');
  revalidatePath('/blog/series');
  revalidatePath('/sitemap.xml');
  revalidatePath('/rss.xml');

  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}

function toSafeActionState(error: unknown): AdminBlogFormState {
  if (error instanceof AdminBlogValidationError) {
    return {
      ok: false,
      message: error.message,
      fieldErrors: error.fieldErrors,
    };
  }

  return {
    ...initialErrorState,
    message: 'Unable to save the post. Check the database configuration and try again.',
  };
}

export async function createBlogPostAction(
  _previousState: AdminBlogFormState,
  formData: FormData,
): Promise<AdminBlogFormState> {
  await requireAdminSession();
  let postId = '';
  let postSlug = '';

  try {
    const input = readAdminBlogInputFromFormData(formData);
    const post = await blogAdminService.createBlogPost(input);
    postId = post.id;
    postSlug = post.slug;
  } catch (error) {
    return toSafeActionState(error);
  }

  revalidateBlogPaths(postSlug);
  redirect(`/admin/blog/${postId}`);
}

export async function updateBlogPostAction(
  id: string,
  _previousState: AdminBlogFormState,
  formData: FormData,
): Promise<AdminBlogFormState> {
  await requireAdminSession();

  try {
    const input = readAdminBlogInputFromFormData(formData);
    const post = await blogAdminService.updateBlogPost(id, input);
    revalidateBlogPaths(post.slug);
    return {
      ok: true,
      message: 'Saved.',
      fieldErrors: {},
    };
  } catch (error) {
    return toSafeActionState(error);
  }
}

export async function publishBlogPostAction(formData: FormData): Promise<void> {
  await requireAdminSession();

  const id = String(formData.get('id') || '');
  const post = await blogAdminService.publishBlogPost(id);
  revalidateBlogPaths(post.slug);
  redirect(`/admin/blog/${post.id}`);
}

export async function unpublishBlogPostAction(formData: FormData): Promise<void> {
  await requireAdminSession();

  const id = String(formData.get('id') || '');
  const post = await blogAdminService.unpublishBlogPost(id);
  revalidateBlogPaths(post.slug);
  redirect(`/admin/blog/${post.id}`);
}

export async function softDeleteBlogPostAction(formData: FormData): Promise<void> {
  await requireAdminSession();

  const id = String(formData.get('id') || '');
  let redirectPath = '/admin/blog';

  try {
    const post = await blogAdminService.softDeleteBlogPost(id);
    revalidateBlogPaths(post.slug);
  } catch {
    redirectPath = '/admin/blog?error=delete-failed';
  }

  redirect(redirectPath);
}

export async function importBlogMarkdownAction(
  _previousState: ContentImportActionState,
  formData: FormData,
): Promise<ContentImportActionState> {
  return runMarkdownImportAction('blog', formData);
}
