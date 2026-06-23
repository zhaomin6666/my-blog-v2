import type {
  AdminBlogLanguage,
  AdminBlogPostInput,
  AdminBlogStatus,
} from './blog-admin-types';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class AdminBlogValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = 'AdminBlogValidationError';
  }
}

function trimMax(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

export function parseTagsInput(value: string): string[] {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 30)
    .map((tag) => tag.slice(0, 40));
}

export function validateAdminBlogInput(input: AdminBlogPostInput): void {
  const fieldErrors: Record<string, string> = {};

  if (!input.title.trim()) {
    fieldErrors.title = 'Title is required.';
  } else if (input.title.length > 160) {
    fieldErrors.title = 'Title must be 160 characters or fewer.';
  }

  if (!input.slug.trim()) {
    fieldErrors.slug = 'Slug is required.';
  } else if (input.slug.length > 120) {
    fieldErrors.slug = 'Slug must be 120 characters or fewer.';
  } else if (!SLUG_PATTERN.test(input.slug)) {
    fieldErrors.slug = 'Slug may only contain lowercase letters, numbers, and hyphens.';
  }

  if (input.summary.length > 600) {
    fieldErrors.summary = 'Summary must be 600 characters or fewer.';
  }

  if (input.contentMarkdown.length > 100_000) {
    fieldErrors.contentMarkdown = 'Markdown content must be 100,000 characters or fewer.';
  }

  if (!['draft', 'published'].includes(input.status)) {
    fieldErrors.status = 'Status must be draft or published.';
  }

  if (!['zh', 'en'].includes(input.lang)) {
    fieldErrors.lang = 'Language must be zh or en.';
  }

  if (input.date && !/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    fieldErrors.date = 'Date must use YYYY-MM-DD format.';
  }

  if (input.seriesSlug && !SLUG_PATTERN.test(input.seriesSlug)) {
    fieldErrors.seriesSlug = 'Series slug may only contain lowercase letters, numbers, and hyphens.';
  }

  if (input.seriesOrder !== null && (!Number.isInteger(input.seriesOrder) || input.seriesOrder < 0)) {
    fieldErrors.seriesOrder = 'Series order must be a non-negative integer.';
  }

  if (input.cover.length > 500) {
    fieldErrors.cover = 'Cover URL must be 500 characters or fewer.';
  }

  if (input.seoTitle.length > 180) {
    fieldErrors.seoTitle = 'SEO title must be 180 characters or fewer.';
  }

  if (input.seoDescription.length > 300) {
    fieldErrors.seoDescription = 'SEO description must be 300 characters or fewer.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new AdminBlogValidationError('Please fix the highlighted fields.', fieldErrors);
  }
}

export function readAdminBlogInputFromFormData(formData: FormData): AdminBlogPostInput {
  const statusValue = String(formData.get('status') || 'draft');
  const langValue = String(formData.get('lang') || 'zh');
  const seriesOrderValue = String(formData.get('seriesOrder') || '').trim();
  const date = String(formData.get('date') || '').trim();

  return {
    title: trimMax(String(formData.get('title') || ''), 200),
    slug: trimMax(String(formData.get('slug') || '').toLowerCase(), 140),
    summary: trimMax(String(formData.get('summary') || ''), 700),
    contentMarkdown: String(formData.get('contentMarkdown') || ''),
    status: (statusValue === 'published' ? 'published' : 'draft') as AdminBlogStatus,
    lang: (langValue === 'en' ? 'en' : 'zh') as AdminBlogLanguage,
    cover: trimMax(String(formData.get('cover') || ''), 550),
    seoTitle: trimMax(String(formData.get('seoTitle') || ''), 220),
    seoDescription: trimMax(String(formData.get('seoDescription') || ''), 340),
    tags: parseTagsInput(String(formData.get('tags') || '')),
    series: trimMax(String(formData.get('series') || ''), 160),
    seriesSlug: trimMax(String(formData.get('seriesSlug') || '').toLowerCase(), 140),
    seriesOrder: seriesOrderValue ? Number(seriesOrderValue) : null,
    date: date || null,
  };
}
