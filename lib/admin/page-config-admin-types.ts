import type { DbJsonValue } from '@/lib/db/dbTypes';
import type { PageConfigKey, PageConfigLanguage } from '@/lib/page-config/page-config-types';

export type AdminPageConfigKey = PageConfigKey;
export type AdminPageConfigLanguage = PageConfigLanguage;

export interface AdminPageConfig {
  id: string;
  key: AdminPageConfigKey;
  title: string;
  subtitle: string;
  footer: string;
  seoTitle: string;
  seoDescription: string;
  data: DbJsonValue;
  published: boolean;
  lang: AdminPageConfigLanguage;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPageConfigInput {
  key: AdminPageConfigKey;
  title: string;
  subtitle: string;
  footer: string;
  seoTitle: string;
  seoDescription: string;
  data: DbJsonValue;
  published: boolean;
  lang: AdminPageConfigLanguage;
}
