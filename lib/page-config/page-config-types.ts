import type { DbJsonValue } from '@/lib/db/dbTypes';

export type PageConfigKey = 'projects' | 'blog';
export type PageConfigLanguage = 'zh' | 'en';

export interface PageConfig {
  key: PageConfigKey;
  title: string;
  subtitle: string;
  footer: string;
  seoTitle: string;
  seoDescription: string;
  data: DbJsonValue;
  published: boolean;
  lang: PageConfigLanguage;
}

export interface PageConfigRepository {
  getPageConfig(
    key: PageConfigKey,
    preferredLang?: PageConfigLanguage,
  ): Promise<PageConfig | null>;
}
