import type { DbJsonValue } from '@/lib/db/dbTypes';
import type {
  AdminContactChannelInput,
  AdminContentLanguage,
  AdminHomepageSectionInput,
  AdminProfilePageInput,
  AdminStackGroupInput,
  AdminStackItemInput,
} from './profile-admin-types';
import {
  CONTACT_PLATFORM_META,
  type ContactPlatform,
  isContactPlatform,
  sanitizeContactValue,
} from '@/lib/profile/contact-platforms';

export class AdminContentValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = 'AdminContentValidationError';
  }
}

const KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function readString(formData: FormData, key: string, maxLength: number): string {
  return String(formData.get(key) || '').trim().slice(0, maxLength);
}

function readBoolean(formData: FormData, key: string): boolean {
  return formData.get(key) === 'on' || formData.get(key) === 'true';
}

function readNumber(formData: FormData, key: string, fallback = 0): number {
  const raw = String(formData.get(key) || '').trim();
  if (!raw) return fallback;

  const value = Number(raw);
  return Number.isFinite(value) ? value : Number.NaN;
}

function readLang(formData: FormData): AdminContentLanguage {
  return formData.get('lang') === 'en' ? 'en' : 'zh';
}

export function parseJsonText(value: string, fieldName = 'data'): DbJsonValue {
  const trimmed = value.trim();
  if (!trimmed) return {};

  try {
    return JSON.parse(trimmed) as DbJsonValue;
  } catch {
    throw new AdminContentValidationError('Please fix the highlighted fields.', {
      [fieldName]: 'JSON must be valid.',
    });
  }
}

function validateKey(key: string, fieldErrors: Record<string, string>): void {
  if (!key) {
    fieldErrors.key = 'Key is required.';
  } else if (key.length > 80) {
    fieldErrors.key = 'Key must be 80 characters or fewer.';
  } else if (!KEY_PATTERN.test(key)) {
    fieldErrors.key = 'Key may only contain lowercase letters, numbers, and hyphens.';
  }
}

function validateLang(lang: AdminContentLanguage, fieldErrors: Record<string, string>): void {
  if (lang !== 'zh' && lang !== 'en') {
    fieldErrors.lang = 'Language must be zh or en.';
  }
}

function validateDisplayOrder(value: number, fieldErrors: Record<string, string>): void {
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    fieldErrors.displayOrder = 'Display order must be an integer.';
  }
}

function assertValid(fieldErrors: Record<string, string>): void {
  if (Object.keys(fieldErrors).length > 0) {
    throw new AdminContentValidationError('Please fix the highlighted fields.', fieldErrors);
  }
}

export function validateProfilePageInput(input: AdminProfilePageInput): void {
  const fieldErrors: Record<string, string> = {};
  validateKey(input.key, fieldErrors);
  validateLang(input.lang, fieldErrors);

  if (input.title.length > 160) fieldErrors.title = 'Title must be 160 characters or fewer.';
  if (input.summary.length > 800) fieldErrors.summary = 'Summary must be 800 characters or fewer.';
  if (input.contentMarkdown.length > 100_000) {
    fieldErrors.contentMarkdown = 'Markdown content must be 100,000 characters or fewer.';
  }

  assertValid(fieldErrors);
}

export function validateHomepageSectionInput(input: AdminHomepageSectionInput): void {
  const fieldErrors: Record<string, string> = {};
  validateKey(input.key, fieldErrors);
  validateLang(input.lang, fieldErrors);
  validateDisplayOrder(input.displayOrder, fieldErrors);

  if (input.key && input.key !== 'hero') {
    fieldErrors.key = 'Hero Admin only accepts the "hero" key.';
  }

  if (input.title.length > 160) fieldErrors.title = 'Title must be 160 characters or fewer.';
  if (input.subtitle.length > 240) fieldErrors.subtitle = 'Subtitle must be 240 characters or fewer.';
  if (input.contentMarkdown.length > 100_000) {
    fieldErrors.contentMarkdown = 'Markdown content must be 100,000 characters or fewer.';
  }

  assertValid(fieldErrors);
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'mailto:';
  } catch {
    return false;
  }
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateContactChannelInput(input: AdminContactChannelInput): void {
  const fieldErrors: Record<string, string> = {};
  validateDisplayOrder(input.displayOrder, fieldErrors);

  if (!isContactPlatform(input.platform)) {
    fieldErrors.platform = 'Platform is required.';
    assertValid(fieldErrors);
  }

  const platform = input.platform as ContactPlatform;
  const meta = CONTACT_PLATFORM_META[platform];
  const sanitizedValue = sanitizeContactValue(platform, input.value);
  const hrefOverride = input.hrefOverride.trim();
  const customLabel = input.customLabel.trim();

  if (!sanitizedValue) {
    fieldErrors.value = 'Value is required.';
  } else if (sanitizedValue.length > 200) {
    fieldErrors.value = 'Value must be 200 characters or fewer.';
  }

  if (platform === 'email' && sanitizedValue && !isValidEmail(sanitizedValue)) {
    fieldErrors.value = 'Email must be valid.';
  }

  if (meta.inputMode === 'url' && sanitizedValue && !isValidUrl(sanitizedValue)) {
    fieldErrors.value = 'URL must be valid.';
  }

  if (platform === 'custom') {
    if (!customLabel) {
      fieldErrors.customLabel = 'Custom label is required.';
    } else if (customLabel.length > 120) {
      fieldErrors.customLabel = 'Custom label must be 120 characters or fewer.';
    }
    if (!hrefOverride) {
      fieldErrors.hrefOverride = 'Custom link is required.';
    }
  } else if (customLabel) {
    fieldErrors.customLabel = 'Custom label is only allowed for custom platform.';
  }

  if (hrefOverride) {
    if (hrefOverride.length > 500) {
      fieldErrors.hrefOverride = 'Override URL must be 500 characters or fewer.';
    } else if (!isValidUrl(hrefOverride)) {
      fieldErrors.hrefOverride = 'Override URL must be valid.';
    }
  }

  assertValid(fieldErrors);
}

export function validateStackGroupInput(input: AdminStackGroupInput): void {
  const fieldErrors: Record<string, string> = {};
  validateDisplayOrder(input.displayOrder, fieldErrors);

  if (!input.name) fieldErrors.name = 'Name is required.';
  if (input.name.length > 120) fieldErrors.name = 'Name must be 120 characters or fewer.';

  assertValid(fieldErrors);
}

export function validateStackItemInput(input: AdminStackItemInput): void {
  const fieldErrors: Record<string, string> = {};
  validateDisplayOrder(input.displayOrder, fieldErrors);

  if (!input.groupId) fieldErrors.groupId = 'Group is required.';
  if (!input.name) fieldErrors.name = 'Name is required.';
  if (input.name.length > 120) fieldErrors.name = 'Name must be 120 characters or fewer.';

  assertValid(fieldErrors);
}

export function readProfilePageInputFromFormData(formData: FormData): AdminProfilePageInput {
  return {
    key: readString(formData, 'key', 100),
    title: readString(formData, 'title', 180),
    summary: readString(formData, 'summary', 900),
    contentMarkdown: String(formData.get('contentMarkdown') || ''),
    data: parseJsonText(String(formData.get('data') || ''), 'data'),
    lang: readLang(formData),
  };
}

export function readHomepageSectionInputFromFormData(formData: FormData): AdminHomepageSectionInput {
  return {
    key: readString(formData, 'key', 100),
    title: readString(formData, 'title', 180),
    subtitle: readString(formData, 'subtitle', 260),
    contentMarkdown: String(formData.get('contentMarkdown') || ''),
    data: parseJsonText(String(formData.get('data') || ''), 'data'),
    visible: readBoolean(formData, 'visible'),
    displayOrder: readNumber(formData, 'displayOrder'),
    lang: readLang(formData),
  };
}

export function readContactChannelInputFromFormData(formData: FormData): AdminContactChannelInput {
  return {
    platform: readString(formData, 'platform', 40),
    customLabel: readString(formData, 'customLabel', 140),
    value: readString(formData, 'value', 220),
    hrefOverride: readString(formData, 'hrefOverride', 520),
    displayOrder: readNumber(formData, 'displayOrder'),
  };
}

export function readStackGroupInputFromFormData(formData: FormData): AdminStackGroupInput {
  return {
    name: readString(formData, 'name', 140),
    displayOrder: readNumber(formData, 'displayOrder'),
  };
}

export function readStackItemInputFromFormData(formData: FormData): AdminStackItemInput {
  return {
    groupId: readString(formData, 'groupId', 80),
    name: readString(formData, 'name', 140),
    displayOrder: readNumber(formData, 'displayOrder'),
  };
}
