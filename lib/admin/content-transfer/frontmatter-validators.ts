import type {
  BlogMarkdownInput,
  ParsedMarkdownFile,
  ProjectMarkdownInput,
} from './content-transfer-types';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface MarkdownValidationResult<T> {
  ok: boolean;
  input: T | null;
  warnings: string[];
  errors: string[];
}

function readString(frontmatter: Record<string, unknown>, key: string): string {
  const value = frontmatter[key];
  return typeof value === 'string' ? value.trim() : '';
}

function readOptionalDate(frontmatter: Record<string, unknown>, key: string): string | null {
  const value = frontmatter[key];
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null;
}

function readNumberOrNull(frontmatter: Record<string, unknown>, key: string): number | null {
  const value = frontmatter[key];
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function readBoolean(
  frontmatter: Record<string, unknown>,
  key: string,
  fallback: boolean,
  warnings: string[],
): boolean {
  const value = frontmatter[key];
  if (typeof value === 'boolean') return value;
  if (value === undefined) {
    warnings.push(`${key} is missing; defaulted to ${String(fallback)}.`);
    return fallback;
  }
  warnings.push(`${key} must be a boolean; defaulted to ${String(fallback)}.`);
  return fallback;
}

function readStringArray(
  frontmatter: Record<string, unknown>,
  key: string,
  warnings: string[],
  errors: string[],
  options: { splitString?: boolean; requiredArray?: boolean } = {},
): string[] {
  const value = frontmatter[key];

  if (Array.isArray(value)) {
    const invalid = value.some((item) => typeof item !== 'string');
    if (invalid) {
      errors.push(`${key} must contain only strings.`);
      return [];
    }
    return value.map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === 'string' && options.splitString) {
    warnings.push(`${key} was a string; split it by comma for compatibility.`);
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (value === undefined) return [];

  if (options.requiredArray) {
    errors.push(`${key} must be an array.`);
  } else {
    warnings.push(`${key} must be an array; ignored.`);
  }

  return [];
}

function readLinksObject(
  frontmatter: Record<string, unknown>,
  warnings: string[],
  errors: string[],
): Record<string, string> {
  const value = frontmatter.links;
  if (value === undefined) return {};

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push('links must be an object.');
    return {};
  }

  const links: Record<string, string> = {};
  for (const [key, href] of Object.entries(value as Record<string, unknown>)) {
    if (typeof href !== 'string') {
      warnings.push(`links.${key} is not a string; ignored.`);
      continue;
    }
    links[key] = href;
  }
  return links;
}

function readRelatedPosts(
  frontmatter: Record<string, unknown>,
  errors: string[],
): ProjectMarkdownInput['relatedPosts'] {
  const value = frontmatter.relatedPosts;
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    errors.push('relatedPosts must be an array.');
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
      const record = item as Record<string, unknown>;
      if (typeof record.title !== 'string' || typeof record.slug !== 'string') return null;
      return {
        title: record.title.trim(),
        slug: record.slug.trim(),
      };
    })
    .filter((item): item is { title: string; slug: string } => Boolean(item?.title && item.slug));
}

function validateCommonTitleSlug(
  parsed: ParsedMarkdownFile,
  warnings: string[],
  errors: string[],
): { title: string; slug: string } {
  const title = readString(parsed.frontmatter, 'title');
  const slug = readString(parsed.frontmatter, 'slug').toLowerCase();

  if (!title) errors.push('title is required.');
  if (!slug) {
    errors.push('slug is required.');
  } else if (!SLUG_PATTERN.test(slug)) {
    errors.push('slug may only contain lowercase letters, numbers, and hyphens.');
  }

  if (slug && parsed.basenameSlug && slug !== parsed.basenameSlug) {
    warnings.push('filename and frontmatter slug do not match.');
  }

  return { title, slug };
}

export function validateBlogMarkdown(parsed: ParsedMarkdownFile): MarkdownValidationResult<BlogMarkdownInput> {
  const warnings: string[] = [];
  const errors: string[] = [];
  const { title, slug } = validateCommonTitleSlug(parsed, warnings, errors);
  const summary = readString(parsed.frontmatter, 'summary');
  const date = readOptionalDate(parsed.frontmatter, 'date');
  const statusValue = readString(parsed.frontmatter, 'status');
  const langValue = readString(parsed.frontmatter, 'lang');
  const seriesOrder = readNumberOrNull(parsed.frontmatter, 'seriesOrder');

  if (!summary) warnings.push('summary is empty.');
  if (!date) warnings.push('date is missing or invalid.');
  if (!parsed.body.trim()) warnings.push('Markdown body is empty.');

  let status: BlogMarkdownInput['status'] = 'draft';
  if (statusValue === 'draft' || statusValue === 'published' || statusValue === 'archived') {
    status = statusValue;
  } else {
    warnings.push('status is missing or invalid; defaulted to draft.');
  }

  let lang: BlogMarkdownInput['lang'] = 'zh';
  if (langValue === 'zh' || langValue === 'en') {
    lang = langValue;
  } else {
    warnings.push('lang is missing or invalid; defaulted to zh.');
  }

  if (parsed.frontmatter.seriesOrder !== undefined && seriesOrder === null) {
    errors.push('seriesOrder must be a number when provided.');
  }

  const input: BlogMarkdownInput = {
    title,
    slug,
    summary,
    contentMarkdown: parsed.body,
    status,
    lang,
    cover: readString(parsed.frontmatter, 'cover'),
    seoTitle: readString(parsed.frontmatter, 'seoTitle'),
    seoDescription: readString(parsed.frontmatter, 'seoDescription'),
    tags: readStringArray(parsed.frontmatter, 'tags', warnings, errors, { splitString: true }),
    series: readString(parsed.frontmatter, 'series'),
    seriesSlug: readString(parsed.frontmatter, 'seriesSlug').toLowerCase(),
    seriesOrder,
    date,
  };

  return {
    ok: errors.length === 0,
    input: errors.length === 0 ? input : null,
    warnings,
    errors,
  };
}

export function validateProjectMarkdown(
  parsed: ParsedMarkdownFile,
): MarkdownValidationResult<ProjectMarkdownInput> {
  const warnings: string[] = [];
  const errors: string[] = [];
  const { title, slug } = validateCommonTitleSlug(parsed, warnings, errors);
  const summary = readString(parsed.frontmatter, 'summary');
  const langValue = readString(parsed.frontmatter, 'lang');
  const statusValue = readString(parsed.frontmatter, 'status');
  const order = readNumberOrNull(parsed.frontmatter, 'order');

  if (!summary) warnings.push('summary is empty.');
  if (!parsed.body.trim()) warnings.push('Markdown body is empty.');
  if (parsed.frontmatter.order !== undefined && order === null) {
    warnings.push('order must be a number; defaulted to 0.');
  }

  let lang: ProjectMarkdownInput['lang'] = 'zh';
  if (langValue === 'zh' || langValue === 'en') {
    lang = langValue;
  } else {
    warnings.push('lang is missing or invalid; defaulted to zh.');
  }

  let status: ProjectMarkdownInput['status'] = 'building';
  if (statusValue === 'building' || statusValue === 'production' || statusValue === 'mvp') {
    status = statusValue;
  } else if (statusValue) {
    warnings.push('status is invalid; defaulted to building.');
  }

  const input: ProjectMarkdownInput = {
    title,
    slug,
    subtitle: readString(parsed.frontmatter, 'subtitle'),
    summary,
    contentMarkdown: parsed.body,
    status,
    type: readString(parsed.frontmatter, 'type'),
    role: readStringArray(parsed.frontmatter, 'role', warnings, errors, { requiredArray: true }),
    timeline: readString(parsed.frontmatter, 'timeline'),
    published: readBoolean(parsed.frontmatter, 'published', false, warnings),
    featured: readBoolean(parsed.frontmatter, 'featured', false, warnings),
    displayOrder: order ?? 0,
    techStack: readStringArray(parsed.frontmatter, 'techStack', warnings, errors, {
      requiredArray: true,
    }),
    features: readStringArray(parsed.frontmatter, 'features', warnings, errors, {
      requiredArray: true,
    }),
    highlights: readStringArray(parsed.frontmatter, 'highlights', warnings, errors, {
      requiredArray: true,
    }),
    links: readLinksObject(parsed.frontmatter, warnings, errors),
    relatedPosts: readRelatedPosts(parsed.frontmatter, errors),
    relatedSeriesSlug: readString(parsed.frontmatter, 'relatedSeriesSlug').toLowerCase(),
    lang,
    seoTitle: readString(parsed.frontmatter, 'seoTitle'),
    seoDescription: readString(parsed.frontmatter, 'seoDescription'),
  };

  return {
    ok: errors.length === 0,
    input: errors.length === 0 ? input : null,
    warnings,
    errors,
  };
}
