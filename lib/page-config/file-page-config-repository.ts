import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { DbJsonValue } from '@/lib/db/dbTypes';
import type {
  PageConfig,
  PageConfigKey,
  PageConfigLanguage,
  PageConfigRepository,
} from './page-config-types';

const PAGES_DIR = path.join(process.cwd(), 'content', 'pages');
const PAGE_CONFIG_KEYS = ['projects', 'blog'] as const;
const PAGE_CONFIG_LANGS = ['zh', 'en'] as const;

type PageConfigFrontmatter = {
  key?: unknown;
  title?: unknown;
  subtitle?: unknown;
  footer?: unknown;
  seoTitle?: unknown;
  seoDescription?: unknown;
  data?: unknown;
  published?: unknown;
  lang?: unknown;
};

function isPageConfigKey(value: unknown): value is PageConfigKey {
  return PAGE_CONFIG_KEYS.includes(value as PageConfigKey);
}

function isPageConfigLanguage(value: unknown): value is PageConfigLanguage {
  return PAGE_CONFIG_LANGS.includes(value as PageConfigLanguage);
}

function toString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function toBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return fallback;
}

function toDbJsonValue(value: unknown): DbJsonValue {
  if (value === null) return null;
  if (
    typeof value === 'string'
    || typeof value === 'number'
    || typeof value === 'boolean'
  ) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(toDbJsonValue);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [
        entryKey,
        toDbJsonValue(entryValue),
      ]),
    );
  }

  return {};
}

function getLanguageFallbacks(
  preferredLang: PageConfigLanguage,
): PageConfigLanguage[] {
  return Array.from(new Set([preferredLang, 'en', 'zh']));
}

function normalizeFrontmatter(
  raw: PageConfigFrontmatter,
  expectedKey: PageConfigKey,
  expectedLang: PageConfigLanguage,
): PageConfig | null {
  const key = isPageConfigKey(raw.key) ? raw.key : expectedKey;
  const lang = isPageConfigLanguage(raw.lang) ? raw.lang : expectedLang;

  if (key !== expectedKey || lang !== expectedLang) {
    return null;
  }

  const published = toBoolean(raw.published, true);
  if (!published) return null;

  return {
    key,
    title: toString(raw.title),
    subtitle: toString(raw.subtitle),
    footer: toString(raw.footer),
    seoTitle: toString(raw.seoTitle),
    seoDescription: toString(raw.seoDescription),
    data: toDbJsonValue(raw.data),
    published,
    lang,
  };
}

export class FilePageConfigRepository implements PageConfigRepository {
  private async readConfigFile(
    key: PageConfigKey,
    lang: PageConfigLanguage,
  ): Promise<PageConfig | null> {
    try {
      const raw = await fs.readFile(path.join(PAGES_DIR, `${key}.${lang}.md`), 'utf-8');
      const parsed = matter(raw);
      return normalizeFrontmatter(
        parsed.data as PageConfigFrontmatter,
        key,
        lang,
      );
    } catch {
      return null;
    }
  }

  async getPageConfig(
    key: PageConfigKey,
    preferredLang: PageConfigLanguage = 'zh',
  ): Promise<PageConfig | null> {
    if (!isPageConfigKey(key) || !isPageConfigLanguage(preferredLang)) {
      return null;
    }

    for (const lang of getLanguageFallbacks(preferredLang)) {
      const config = await this.readConfigFile(key, lang);
      if (config) return config;
    }

    return null;
  }
}
