import type { DbJsonValue } from '@/lib/db/dbTypes';

export type HomepageSectionLanguage = 'zh' | 'en';

export interface HomepageSection {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  contentMarkdown: string;
  data: DbJsonValue;
  visible: boolean;
  displayOrder: number;
  lang: HomepageSectionLanguage;
}
