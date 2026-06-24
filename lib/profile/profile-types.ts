import type { LocalizedText } from '@/lib/types';
import type { ContactPlatform } from './contact-platforms';

export type ProfileLanguage = 'zh' | 'en';
export type ProfileFieldLabel = 'about.role' | 'about.direction' | 'about.status';

export interface ProfileField {
  labelKey: ProfileFieldLabel;
  value: LocalizedText;
}

export interface ProfileLink {
  label: LocalizedText;
  href: string;
  description: LocalizedText;
}

export interface ProfileProject {
  title: LocalizedText;
  href: string;
  summary: LocalizedText;
}

export interface ProfileFrontmatter {
  title?: string;
  slug?: string;
  summary?: LocalizedText | string;
  role?: LocalizedText | string;
  status?: LocalizedText | string;
  intro?: LocalizedText | string;
  fields?: ProfileField[];
  focus?: Array<LocalizedText | string>;
  background?: Array<LocalizedText | string>;
  building?: ProfileLink[];
  workStyle?: Array<LocalizedText | string>;
  coreSkills?: string[] | string;
  aiFocus?: Array<LocalizedText | string>;
  enterpriseExperience?: Array<LocalizedText | string>;
  featuredProjects?: ProfileProject[];
  careerDirection?: Array<LocalizedText | string>;
  privacyNote?: LocalizedText | string;
  published?: boolean | string;
  lang?: string;
}

export interface ProfileContent {
  title: string;
  slug: string;
  summary: LocalizedText;
  role: LocalizedText;
  status: LocalizedText;
  intro: LocalizedText;
  fields: ProfileField[];
  focus: LocalizedText[];
  background: LocalizedText[];
  building: ProfileLink[];
  workStyle: LocalizedText[];
  coreSkills: string[];
  aiFocus: LocalizedText[];
  enterpriseExperience: LocalizedText[];
  featuredProjects: ProfileProject[];
  careerDirection: LocalizedText[];
  privacyNote: LocalizedText;
  published: boolean;
  lang: ProfileLanguage;
  content: string;
  rawContent: string;
}

export interface ContactChannelData {
  platform: ContactPlatform;
  label: string;
  href: string;
  value: string;
  displayOrder: number;
}

export interface ContactChannels {
  channels: ContactChannelData[];
}

export interface SystemStackItem {
  name: string;
  displayOrder: number;
}

export interface SystemStackGroup {
  name: string;
  displayOrder: number;
  items: SystemStackItem[];
}

export interface SystemStackFrontmatter {
  groups?: SystemStackGroup[];
}

export interface SystemStack {
  groups: SystemStackGroup[];
}

export interface PublicProfile {
  profile: ProfileContent;
  contactChannels: ContactChannels;
  systemStack: SystemStack;
}
