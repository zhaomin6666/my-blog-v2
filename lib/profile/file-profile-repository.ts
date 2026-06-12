import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { LocalizedText } from '@/lib/types';
import type { ProfileRepository } from './profile-repository';
import type {
  ContactChannelData,
  ContactChannels,
  ContactChannelsFrontmatter,
  ContactChannelType,
  ProfileContent,
  ProfileField,
  ProfileFieldLabel,
  ProfileFrontmatter,
  ProfileLanguage,
  ProfileLink,
  ProfileProject,
  PublicProfile,
  SystemStack,
  SystemStackFrontmatter,
  SystemStackGroup,
} from './profile-types';

const PROFILE_DIR = path.join(process.cwd(), 'content', 'profile');

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return fallback;
}

function toLang(value: unknown): ProfileLanguage {
  if (value === 'en') return 'en';
  return 'zh';
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }

  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

function toLocalizedText(value: unknown, fallback = ''): LocalizedText {
  if (isRecord(value)) {
    const zh = typeof value.zh === 'string' ? value.zh : fallback;
    const en = typeof value.en === 'string' ? value.en : zh || fallback;
    return { zh, en };
  }

  if (typeof value === 'string') {
    return { zh: value, en: value };
  }

  return { zh: fallback, en: fallback };
}

function toLocalizedTextArray(value: unknown): LocalizedText[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => toLocalizedText(item)).filter((item) => item.zh || item.en);
}

function toProfileField(value: unknown): ProfileField | null {
  if (!isRecord(value)) return null;

  const labelKey = value.labelKey;
  if (labelKey !== 'about.role' && labelKey !== 'about.direction' && labelKey !== 'about.status') {
    return null;
  }

  return {
    labelKey: labelKey as ProfileFieldLabel,
    value: toLocalizedText(value.value),
  };
}

function toProfileFields(value: unknown): ProfileField[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(toProfileField).filter((item): item is ProfileField => item !== null);
}

function toProfileLink(value: unknown): ProfileLink | null {
  if (!isRecord(value)) return null;
  if (typeof value.href !== 'string') return null;

  return {
    label: toLocalizedText(value.label),
    href: value.href,
    description: toLocalizedText(value.description),
  };
}

function toProfileLinks(value: unknown): ProfileLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(toProfileLink).filter((item): item is ProfileLink => item !== null);
}

function toProfileProject(value: unknown): ProfileProject | null {
  if (!isRecord(value)) return null;
  if (typeof value.href !== 'string') return null;

  return {
    title: toLocalizedText(value.title),
    href: value.href,
    summary: toLocalizedText(value.summary),
  };
}

function toProfileProjects(value: unknown): ProfileProject[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(toProfileProject).filter((item): item is ProfileProject => item !== null);
}

function toContactType(value: unknown): ContactChannelType {
  if (
    value === 'email' ||
    value === 'github' ||
    value === 'linkedin' ||
    value === 'blog' ||
    value === 'projects' ||
    value === 'resume'
  ) {
    return value;
  }

  return 'other';
}

function toContactChannel(value: unknown): ContactChannelData | null {
  if (!isRecord(value)) return null;

  const href = typeof value.href === 'string' ? value.href : '';
  const visible = toBoolean(value.visible, Boolean(href));

  return {
    label: toLocalizedText(value.label),
    type: toContactType(value.type),
    href,
    value: toLocalizedText(value.value),
    endpoint: typeof value.endpoint === 'string' ? value.endpoint : '',
    visible,
    disabled: toBoolean(value.disabled),
    privacyNote: value.privacyNote ? toLocalizedText(value.privacyNote) : null,
  };
}

function toContactChannels(value: unknown): ContactChannelData[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(toContactChannel).filter((item): item is ContactChannelData => item !== null);
}

function toStackGroup(value: unknown): SystemStackGroup | null {
  if (!isRecord(value)) return null;

  return {
    name: toLocalizedText(value.name),
    items: toStringArray(value.items),
  };
}

function toStackGroups(value: unknown): SystemStackGroup[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(toStackGroup).filter((item): item is SystemStackGroup => item !== null);
}

function normalizeProfile(
  raw: ProfileFrontmatter,
  content: string,
  rawContent: string,
): ProfileContent {
  const slug = raw.slug?.trim() || 'profile';

  return {
    title: raw.title?.trim() || 'Profile',
    slug,
    summary: toLocalizedText(raw.summary),
    role: toLocalizedText(raw.role),
    status: toLocalizedText(raw.status),
    intro: toLocalizedText(raw.intro),
    fields: toProfileFields(raw.fields),
    focus: toLocalizedTextArray(raw.focus),
    background: toLocalizedTextArray(raw.background),
    building: toProfileLinks(raw.building),
    workStyle: toLocalizedTextArray(raw.workStyle),
    coreSkills: toStringArray(raw.coreSkills),
    aiFocus: toLocalizedTextArray(raw.aiFocus),
    enterpriseExperience: toLocalizedTextArray(raw.enterpriseExperience),
    featuredProjects: toProfileProjects(raw.featuredProjects),
    careerDirection: toLocalizedTextArray(raw.careerDirection),
    privacyNote: toLocalizedText(raw.privacyNote),
    published: toBoolean(raw.published, true),
    lang: toLang(raw.lang),
    content,
    rawContent,
  };
}

function normalizeContactChannels(
  raw: ContactChannelsFrontmatter,
  content: string,
  rawContent: string,
): ContactChannels {
  const slug = raw.slug?.trim() || 'contact-channels';

  return {
    title: raw.title?.trim() || 'Contact Channels',
    slug,
    summary: toLocalizedText(raw.summary),
    channels: toContactChannels(raw.channels),
    privacyNote: toLocalizedText(raw.privacyNote),
    resumeNote: toLocalizedText(raw.resumeNote),
    published: toBoolean(raw.published, true),
    lang: toLang(raw.lang),
    content,
    rawContent,
  };
}

function normalizeSystemStack(
  raw: SystemStackFrontmatter,
  content: string,
  rawContent: string,
): SystemStack {
  const slug = raw.slug?.trim() || 'system-stack';

  return {
    title: raw.title?.trim() || 'System Stack',
    slug,
    summary: toLocalizedText(raw.summary),
    groups: toStackGroups(raw.groups),
    published: toBoolean(raw.published, true),
    lang: toLang(raw.lang),
    content,
    rawContent,
  };
}

export class FileProfileRepository implements ProfileRepository {
  private async readProfileFile(slug: string): Promise<{ data: Record<string, unknown>; content: string; rawContent: string } | null> {
    const filePath = path.join(PROFILE_DIR, `${slug}.md`);

    try {
      const rawContent = await fs.readFile(filePath, 'utf-8');
      const parsed = matter(rawContent);

      return {
        data: parsed.data,
        content: parsed.content,
        rawContent,
      };
    } catch (error) {
      throw new Error(`Failed to read profile content "${slug}" from content/profile: ${(error as Error).message}`);
    }
  }

  async getProfile(): Promise<ProfileContent | null> {
    const parsed = await this.readProfileFile('profile');
    if (!parsed) return null;

    const profile = normalizeProfile(
      parsed.data as ProfileFrontmatter,
      parsed.content,
      parsed.rawContent,
    );

    return profile.published ? profile : null;
  }

  async getContactChannels(): Promise<ContactChannels | null> {
    const parsed = await this.readProfileFile('contact-channels');
    if (!parsed) return null;

    const channels = normalizeContactChannels(
      parsed.data as ContactChannelsFrontmatter,
      parsed.content,
      parsed.rawContent,
    );

    return channels.published ? channels : null;
  }

  async getSystemStack(): Promise<SystemStack | null> {
    const parsed = await this.readProfileFile('system-stack');
    if (!parsed) return null;

    const stack = normalizeSystemStack(
      parsed.data as SystemStackFrontmatter,
      parsed.content,
      parsed.rawContent,
    );

    return stack.published ? stack : null;
  }

  async getPublicProfile(): Promise<PublicProfile | null> {
    const [profile, contactChannels, systemStack] = await Promise.all([
      this.getProfile(),
      this.getContactChannels(),
      this.getSystemStack(),
    ]);

    if (!profile || !contactChannels || !systemStack) {
      return null;
    }

    return {
      profile,
      contactChannels,
      systemStack,
    };
  }
}
