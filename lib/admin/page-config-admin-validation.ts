import type {
  AdminPageConfigInput,
  AdminPageConfigKey,
  AdminPageConfigLanguage,
} from './page-config-admin-types';
import type { DbJsonValue } from '@/lib/db/dbTypes';

const PAGE_CONFIG_KEYS = ['projects', 'blog'] as const;
const PAGE_CONFIG_LANGS = ['zh', 'en'] as const;

export class AdminPageConfigValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = 'AdminPageConfigValidationError';
  }
}

function trimMax(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

function readBoolean(formData: FormData, key: string): boolean {
  return formData.get(key) === 'on' || formData.get(key) === 'true';
}

function isPageConfigKey(value: string): value is AdminPageConfigKey {
  return PAGE_CONFIG_KEYS.includes(value as AdminPageConfigKey);
}

function isPageConfigLanguage(value: string): value is AdminPageConfigLanguage {
  return PAGE_CONFIG_LANGS.includes(value as AdminPageConfigLanguage);
}

function parseData(value: string): DbJsonValue {
  const trimmed = value.trim();
  if (!trimmed) return {};

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Data must be a JSON object.');
    }
    return parsed as DbJsonValue;
  } catch {
    throw new AdminPageConfigValidationError('Please fix the highlighted fields.', {
      data: 'Data must be a valid JSON object.',
    });
  }
}

export function validateAdminPageConfigInput(input: AdminPageConfigInput): void {
  const fieldErrors: Record<string, string> = {};

  if (!isPageConfigKey(input.key)) {
    fieldErrors.key = 'Page key must be projects or blog.';
  }

  if (!isPageConfigLanguage(input.lang)) {
    fieldErrors.lang = 'Language must be zh or en.';
  }

  if (input.title.length > 160) {
    fieldErrors.title = 'Title must be 160 characters or fewer.';
  }

  if (input.subtitle.length > 500) {
    fieldErrors.subtitle = 'Subtitle must be 500 characters or fewer.';
  }

  if (input.footer.length > 160) {
    fieldErrors.footer = 'Footer must be 160 characters or fewer.';
  }

  if (input.seoTitle.length > 160) {
    fieldErrors.seoTitle = 'SEO title must be 160 characters or fewer.';
  }

  if (input.seoDescription.length > 300) {
    fieldErrors.seoDescription = 'SEO description must be 300 characters or fewer.';
  }

  if (!input.data || typeof input.data !== 'object' || Array.isArray(input.data)) {
    fieldErrors.data = 'Data must be a JSON object.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new AdminPageConfigValidationError('Please fix the highlighted fields.', fieldErrors);
  }
}

export function readAdminPageConfigInputFromFormData(formData: FormData): AdminPageConfigInput {
  const rawKey = String(formData.get('key') || '');
  const rawLang = String(formData.get('lang') || '');

  if (!isPageConfigKey(rawKey) || !isPageConfigLanguage(rawLang)) {
    throw new AdminPageConfigValidationError('Please fix the highlighted fields.', {
      ...(!isPageConfigKey(rawKey) ? { key: 'Page key must be projects or blog.' } : {}),
      ...(!isPageConfigLanguage(rawLang) ? { lang: 'Language must be zh or en.' } : {}),
    });
  }

  return {
    key: rawKey,
    title: trimMax(String(formData.get('title') || ''), 200),
    subtitle: trimMax(String(formData.get('subtitle') || ''), 540),
    footer: trimMax(String(formData.get('footer') || ''), 200),
    seoTitle: trimMax(String(formData.get('seoTitle') || ''), 200),
    seoDescription: trimMax(String(formData.get('seoDescription') || ''), 340),
    data: parseData(String(formData.get('data') || '')),
    published: readBoolean(formData, 'published'),
    lang: rawLang,
  };
}
