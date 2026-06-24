import type { DbJsonValue } from '@/lib/db/dbTypes';

export type AdminContentLanguage = 'zh' | 'en';

export interface AdminProfilePage {
  id: string;
  key: string;
  title: string;
  summary: string;
  contentMarkdown: string;
  data: DbJsonValue;
  lang: AdminContentLanguage;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfilePageInput {
  key: string;
  title: string;
  summary: string;
  contentMarkdown: string;
  data: DbJsonValue;
  lang: AdminContentLanguage;
}

export interface AdminHomepageSection {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  contentMarkdown: string;
  data: DbJsonValue;
  visible: boolean;
  displayOrder: number;
  lang: AdminContentLanguage;
  createdAt: string;
  updatedAt: string;
}

export interface AdminHomepageSectionInput {
  key: string;
  title: string;
  subtitle: string;
  contentMarkdown: string;
  data: DbJsonValue;
  visible: boolean;
  displayOrder: number;
  lang: AdminContentLanguage;
}

export interface AdminContactChannel {
  id: string;
  platform: string;
  customLabel: string;
  value: string;
  hrefOverride: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminContactChannelInput {
  platform: string;
  customLabel: string;
  value: string;
  hrefOverride: string;
  displayOrder: number;
}

export interface AdminStackGroup {
  id: string;
  name: string;
  displayOrder: number;
  items: AdminStackItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminStackGroupInput {
  name: string;
  displayOrder: number;
}

export interface AdminStackItem {
  id: string;
  groupId: string;
  name: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStackItemInput {
  groupId: string;
  name: string;
  displayOrder: number;
}
