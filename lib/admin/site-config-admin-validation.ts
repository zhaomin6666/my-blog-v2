import type { DbJsonValue } from '@/lib/db/dbTypes';
import type {
  AdminSiteConfigInput,
  AdminSiteConfigKey,
  AdminSiteConfigLanguage,
} from './site-config-admin-types';

const SITE_CONFIG_KEYS = ['default'] as const;
const SITE_CONFIG_LANGS = ['zh', 'en'] as const;

export class AdminSiteConfigValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = 'AdminSiteConfigValidationError';
  }
}

function trimMax(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

function readBoolean(formData: FormData, key: string): boolean {
  return formData.get(key) === 'on' || formData.get(key) === 'true';
}

function isSiteConfigKey(value: string): value is AdminSiteConfigKey {
  return SITE_CONFIG_KEYS.includes(value as AdminSiteConfigKey);
}

function isSiteConfigLanguage(value: string): value is AdminSiteConfigLanguage {
  return SITE_CONFIG_LANGS.includes(value as AdminSiteConfigLanguage);
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
    throw new AdminSiteConfigValidationError('Please fix the highlighted fields.', {
      data: 'Data must be a valid JSON object.',
    });
  }
}

export function validateAdminSiteConfigInput(input: AdminSiteConfigInput): void {
  const fieldErrors: Record<string, string> = {};

  if (!isSiteConfigKey(input.key)) {
    fieldErrors.key = 'Site config key must be default.';
  }

  if (!isSiteConfigLanguage(input.lang)) {
    fieldErrors.lang = 'Language must be zh or en.';
  }

  if (input.siteName.length > 120) {
    fieldErrors.siteName = 'Site name must be 120 characters or fewer.';
  }

  if (input.defaultTitle.length > 160) {
    fieldErrors.defaultTitle = 'Default title must be 160 characters or fewer.';
  }

  if (input.defaultDescription.length > 300) {
    fieldErrors.defaultDescription = 'Default description must be 300 characters or fewer.';
  }

  if (input.author.length > 120) {
    fieldErrors.author = 'Author must be 120 characters or fewer.';
  }

  if (input.twitterHandle.length > 80) {
    fieldErrors.twitterHandle = 'Twitter handle must be 80 characters or fewer.';
  }

  if (input.defaultLocale.length > 20) {
    fieldErrors.defaultLocale = 'Default locale must be 20 characters or fewer.';
  }

  if (!input.data || typeof input.data !== 'object' || Array.isArray(input.data)) {
    fieldErrors.data = 'Data must be a JSON object.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new AdminSiteConfigValidationError('Please fix the highlighted fields.', fieldErrors);
  }
}

export function readAdminSiteConfigInputFromFormData(formData: FormData): AdminSiteConfigInput {
  const rawKey = String(formData.get('key') || '');
  const rawLang = String(formData.get('lang') || '');

  if (!isSiteConfigKey(rawKey) || !isSiteConfigLanguage(rawLang)) {
    throw new AdminSiteConfigValidationError('Please fix the highlighted fields.', {
      ...(!isSiteConfigKey(rawKey) ? { key: 'Site config key must be default.' } : {}),
      ...(!isSiteConfigLanguage(rawLang) ? { lang: 'Language must be zh or en.' } : {}),
    });
  }

  return {
    key: rawKey,
    siteName: trimMax(String(formData.get('siteName') || ''), 140),
    defaultTitle: trimMax(String(formData.get('defaultTitle') || ''), 200),
    defaultDescription: trimMax(String(formData.get('defaultDescription') || ''), 340),
    author: trimMax(String(formData.get('author') || ''), 140),
    twitterHandle: trimMax(String(formData.get('twitterHandle') || ''), 100),
    defaultLocale: trimMax(String(formData.get('defaultLocale') || ''), 40),
    data: parseData(String(formData.get('data') || '')),
    published: readBoolean(formData, 'published'),
    lang: rawLang,
  };
}
