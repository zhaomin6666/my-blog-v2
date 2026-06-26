import type { DbJsonValue } from '@/lib/db/dbTypes';
import type {
  SiteConfigKey,
  SiteConfigLanguage,
} from '@/lib/site-config/site-config-types';

export type AdminSiteConfigKey = SiteConfigKey;
export type AdminSiteConfigLanguage = SiteConfigLanguage;

export interface AdminSiteConfig {
  id: string;
  key: AdminSiteConfigKey;
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  author: string;
  twitterHandle: string;
  defaultLocale: string;
  data: DbJsonValue;
  published: boolean;
  lang: AdminSiteConfigLanguage;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSiteConfigInput {
  key: AdminSiteConfigKey;
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  author: string;
  twitterHandle: string;
  defaultLocale: string;
  data: DbJsonValue;
  published: boolean;
  lang: AdminSiteConfigLanguage;
}
