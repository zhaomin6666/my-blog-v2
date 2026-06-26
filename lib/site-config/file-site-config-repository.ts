import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { DbJsonValue } from '@/lib/db/dbTypes';
import type {
  SiteConfig,
  SiteConfigKey,
  SiteConfigLanguage,
  SiteConfigRepository,
} from './site-config-types';

const SITE_DIR = path.join(process.cwd(), 'content', 'site');
const SITE_CONFIG_KEY: SiteConfigKey = 'default';
const SITE_CONFIG_LANGS = ['zh', 'en'] as const;
const fallbackSiteUrl = 'http://localhost:3000';

type SiteConfigFrontmatter = {
  key?: unknown;
  siteName?: unknown;
  defaultTitle?: unknown;
  defaultDescription?: unknown;
  author?: unknown;
  twitterHandle?: unknown;
  defaultLocale?: unknown;
  data?: unknown;
  published?: unknown;
  lang?: unknown;
};

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

function getConfiguredSiteUrl(): string {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl);
}

function isSiteConfigLanguage(value: unknown): value is SiteConfigLanguage {
  return SITE_CONFIG_LANGS.includes(value as SiteConfigLanguage);
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
  preferredLang: SiteConfigLanguage,
): SiteConfigLanguage[] {
  return Array.from(new Set([preferredLang, 'en', 'zh']));
}

function normalizeFrontmatter(
  raw: SiteConfigFrontmatter,
  expectedLang: SiteConfigLanguage,
): SiteConfig | null {
  if (raw.key !== SITE_CONFIG_KEY) {
    return null;
  }

  const lang = isSiteConfigLanguage(raw.lang) ? raw.lang : expectedLang;

  if (lang !== expectedLang) {
    return null;
  }

  const published = toBoolean(raw.published, true);
  if (!published) return null;

  return {
    key: SITE_CONFIG_KEY,
    siteName: toString(raw.siteName),
    siteUrl: getConfiguredSiteUrl(),
    defaultTitle: toString(raw.defaultTitle),
    defaultDescription: toString(raw.defaultDescription),
    author: toString(raw.author),
    twitterHandle: toString(raw.twitterHandle),
    defaultLocale: toString(raw.defaultLocale) || 'en_US',
    data: toDbJsonValue(raw.data),
    published,
    lang,
  };
}

export class FileSiteConfigRepository implements SiteConfigRepository {
  private async readConfigFile(lang: SiteConfigLanguage): Promise<SiteConfig | null> {
    try {
      const raw = await fs.readFile(path.join(SITE_DIR, `settings.${lang}.md`), 'utf-8');
      const parsed = matter(raw);
      return normalizeFrontmatter(
        parsed.data as SiteConfigFrontmatter,
        lang,
      );
    } catch {
      return null;
    }
  }

  async getSiteConfig(
    preferredLang: SiteConfigLanguage = 'en',
  ): Promise<SiteConfig | null> {
    if (!isSiteConfigLanguage(preferredLang)) {
      return null;
    }

    for (const lang of getLanguageFallbacks(preferredLang)) {
      const config = await this.readConfigFile(lang);
      if (config) return config;
    }

    return null;
  }
}
