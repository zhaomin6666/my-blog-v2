import type { LocalizedText } from '@/lib/types';

export type ProfileLanguage = 'zh' | 'en';
export type ProfileFieldLabel = 'about.role' | 'about.direction' | 'about.status';
export type ContactChannelType = 'email' | 'github' | 'linkedin' | 'blog' | 'projects' | 'resume' | 'other';

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
  label: LocalizedText;
  type: ContactChannelType;
  href: string;
  value: LocalizedText;
  endpoint: string;
  visible: boolean;
  disabled: boolean;
  privacyNote: LocalizedText | null;
}

export interface ContactChannelsFrontmatter {
  title?: string;
  slug?: string;
  summary?: LocalizedText | string;
  channels?: ContactChannelData[];
  privacyNote?: LocalizedText | string;
  resumeNote?: LocalizedText | string;
  published?: boolean | string;
  lang?: string;
}

export interface ContactChannels {
  title: string;
  slug: string;
  summary: LocalizedText;
  channels: ContactChannelData[];
  privacyNote: LocalizedText;
  resumeNote: LocalizedText;
  published: boolean;
  lang: ProfileLanguage;
  content: string;
  rawContent: string;
}

export interface SystemStackGroup {
  name: LocalizedText;
  items: string[];
}

export interface SystemStackFrontmatter {
  title?: string;
  slug?: string;
  summary?: LocalizedText | string;
  groups?: SystemStackGroup[];
  published?: boolean | string;
  lang?: string;
}

export interface SystemStack {
  title: string;
  slug: string;
  summary: LocalizedText;
  groups: SystemStackGroup[];
  published: boolean;
  lang: ProfileLanguage;
  content: string;
  rawContent: string;
}

export interface PublicProfile {
  profile: ProfileContent;
  contactChannels: ContactChannels;
  systemStack: SystemStack;
}
