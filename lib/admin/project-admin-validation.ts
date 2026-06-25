import type {
  AdminProjectInput,
  AdminProjectLanguage,
  AdminProjectStatus,
} from './project-admin-types';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const URL_PATTERN = /^(https?:\/\/|\/)[^\s]*$/;

export class AdminProjectValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = 'AdminProjectValidationError';
  }
}

function trimMax(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

function readBoolean(formData: FormData, key: string): boolean {
  return formData.get(key) === 'on' || formData.get(key) === 'true';
}

function parseJsonField<T>(value: string, field: string, fallback: T): T {
  const trimmed = value.trim();
  if (!trimmed) return fallback;

  try {
    return JSON.parse(trimmed) as T;
  } catch {
    throw new AdminProjectValidationError('Please fix the highlighted fields.', {
      [field]: 'Invalid JSON.',
    });
  }
}

function ensureStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new AdminProjectValidationError('Please fix the highlighted fields.', {
      [field]: 'Value must be a JSON array of strings.',
    });
  }

  return value.map((item) => item.trim()).filter(Boolean).slice(0, 50);
}

function ensureLinksObject(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new AdminProjectValidationError('Please fix the highlighted fields.', {
      links: 'Links must be a JSON object.',
    });
  }

  const links: Record<string, string> = {};
  for (const [key, href] of Object.entries(value as Record<string, unknown>)) {
    const label = key.trim().slice(0, 40);
    if (!label) continue;
    if (typeof href !== 'string' || !URL_PATTERN.test(href.trim())) {
      throw new AdminProjectValidationError('Please fix the highlighted fields.', {
        links: 'Each link value must be an absolute URL or an internal path.',
      });
    }
    links[label] = href.trim().slice(0, 500);
  }

  return links;
}

function ensureRelatedPosts(value: unknown): AdminProjectInput['relatedPosts'] {
  if (!Array.isArray(value)) {
    throw new AdminProjectValidationError('Please fix the highlighted fields.', {
      relatedPosts: 'Related posts must be a JSON array.',
    });
  }

  return value
    .map((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
      const record = item as Record<string, unknown>;
      if (typeof record.title !== 'string' || typeof record.slug !== 'string') return null;
      return {
        title: record.title.trim().slice(0, 160),
        slug: record.slug.trim().slice(0, 120),
      };
    })
    .filter((item): item is { title: string; slug: string } => Boolean(item?.title && item.slug))
    .slice(0, 30);
}

export function parseProjectJsonArrayInput(value: string, field: string): string[] {
  return ensureStringArray(parseJsonField<unknown>(value, field, []), field);
}

export function parseProjectLinksInput(value: string): Record<string, string> {
  return ensureLinksObject(parseJsonField<unknown>(value, 'links', {}));
}

export function parseProjectRelatedPostsInput(value: string): AdminProjectInput['relatedPosts'] {
  return ensureRelatedPosts(parseJsonField<unknown>(value, 'relatedPosts', []));
}

export function validateAdminProjectInput(input: AdminProjectInput): void {
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

  if (input.subtitle.length > 240) {
    fieldErrors.subtitle = 'Subtitle must be 240 characters or fewer.';
  }

  if (input.summary.length > 700) {
    fieldErrors.summary = 'Summary must be 700 characters or fewer.';
  }

  if (input.contentMarkdown.length > 100_000) {
    fieldErrors.contentMarkdown = 'Markdown content must be 100,000 characters or fewer.';
  }

  if (!['building', 'production', 'mvp'].includes(input.status)) {
    fieldErrors.status = 'Status must be building, production, or mvp.';
  }

  if (input.type.length > 120) {
    fieldErrors.type = 'Type must be 120 characters or fewer.';
  }

  if (!Number.isInteger(input.displayOrder)) {
    fieldErrors.displayOrder = 'Display order must be an integer.';
  }

  if (!['zh', 'en'].includes(input.lang)) {
    fieldErrors.lang = 'Language must be zh or en.';
  }

  if (input.relatedSeriesSlug && !SLUG_PATTERN.test(input.relatedSeriesSlug)) {
    fieldErrors.relatedSeriesSlug =
      'Related series slug may only contain lowercase letters, numbers, and hyphens.';
  }

  if (input.seoTitle.length > 180) {
    fieldErrors.seoTitle = 'SEO title must be 180 characters or fewer.';
  }

  if (input.seoDescription.length > 300) {
    fieldErrors.seoDescription = 'SEO description must be 300 characters or fewer.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new AdminProjectValidationError('Please fix the highlighted fields.', fieldErrors);
  }
}

export function readAdminProjectInputFromFormData(formData: FormData): AdminProjectInput {
  const statusValue = String(formData.get('status') || 'building');
  const langValue = String(formData.get('lang') || 'zh');
  const displayOrderValue = String(formData.get('displayOrder') || '0').trim();

  return {
    title: trimMax(String(formData.get('title') || ''), 200),
    slug: trimMax(String(formData.get('slug') || '').toLowerCase(), 140),
    subtitle: trimMax(String(formData.get('subtitle') || ''), 260),
    summary: trimMax(String(formData.get('summary') || ''), 760),
    contentMarkdown: String(formData.get('contentMarkdown') || ''),
    status: (['production', 'mvp'].includes(statusValue) ? statusValue : 'building') as AdminProjectStatus,
    type: trimMax(String(formData.get('type') || ''), 140),
    role: parseProjectJsonArrayInput(String(formData.get('role') || ''), 'role'),
    timeline: trimMax(String(formData.get('timeline') || ''), 160),
    published: readBoolean(formData, 'published'),
    featured: readBoolean(formData, 'featured'),
    displayOrder: displayOrderValue ? Number(displayOrderValue) : 0,
    techStack: parseProjectJsonArrayInput(String(formData.get('techStack') || ''), 'techStack'),
    features: parseProjectJsonArrayInput(String(formData.get('features') || ''), 'features'),
    highlights: parseProjectJsonArrayInput(String(formData.get('highlights') || ''), 'highlights'),
    links: parseProjectLinksInput(String(formData.get('links') || '')),
    relatedPosts: parseProjectRelatedPostsInput(String(formData.get('relatedPosts') || '')),
    relatedSeriesSlug: trimMax(
      String(formData.get('relatedSeriesSlug') || '').toLowerCase(),
      140,
    ),
    lang: (langValue === 'en' ? 'en' : 'zh') as AdminProjectLanguage,
    seoTitle: trimMax(String(formData.get('seoTitle') || ''), 220),
    seoDescription: trimMax(String(formData.get('seoDescription') || ''), 340),
  };
}
