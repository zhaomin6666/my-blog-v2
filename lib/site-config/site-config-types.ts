import type { DbJsonValue } from '@/lib/db/dbTypes';

export type SiteConfigLanguage = 'zh' | 'en';
export type SiteConfigKey = 'default';

export interface SiteConfig {
  key: SiteConfigKey;
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  author: string;
  twitterHandle: string;
  defaultLocale: string;
  data: DbJsonValue;
  published: boolean;
  lang: SiteConfigLanguage;
}

export interface SiteConfigRepository {
  getSiteConfig(preferredLang?: SiteConfigLanguage): Promise<SiteConfig | null>;
}
