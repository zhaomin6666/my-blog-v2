import type {
  ContactChannelRow,
  ProfilePageRow,
  SystemStackGroupRow,
  SystemStackItemRow,
} from '@/lib/db/dbTypes';
import type { LocalizedText } from '@/lib/types';
import type {
  ContactChannelData,
  ContactChannels,
  ContactChannelType,
  ProfileContent,
  ProfileField,
  ProfileFieldLabel,
  ProfileLanguage,
  ProfileLink,
  ProfileProject,
  SystemStack,
  SystemStackGroup,
} from './profile-types';

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function rowData(row: ProfilePageRow): JsonRecord {
  return isRecord(row.data) ? row.data : {};
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
  if (!Array.isArray(value)) return [];
  return value.map((item) => toLocalizedText(item)).filter((item) => item.zh || item.en);
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function toProfileLanguage(value: string): ProfileLanguage {
  return value === 'en' ? 'en' : 'zh';
}

function toBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return fallback;
}

function toProfileField(value: unknown): ProfileField | null {
  if (!isRecord(value)) return null;
  const labelKey = value.labelKey;

  if (
    labelKey !== 'about.role' &&
    labelKey !== 'about.direction' &&
    labelKey !== 'about.status'
  ) {
    return null;
  }

  return {
    labelKey: labelKey as ProfileFieldLabel,
    value: toLocalizedText(value.value),
  };
}

function toProfileFields(value: unknown): ProfileField[] {
  if (!Array.isArray(value)) return [];
  return value.map(toProfileField).filter((item): item is ProfileField => item !== null);
}

function toProfileLink(value: unknown): ProfileLink | null {
  if (!isRecord(value) || typeof value.href !== 'string') return null;

  return {
    label: toLocalizedText(value.label),
    href: value.href,
    description: toLocalizedText(value.description),
  };
}

function toProfileLinks(value: unknown): ProfileLink[] {
  if (!Array.isArray(value)) return [];
  return value.map(toProfileLink).filter((item): item is ProfileLink => item !== null);
}

function toProfileProject(value: unknown): ProfileProject | null {
  if (!isRecord(value) || typeof value.href !== 'string') return null;

  return {
    title: toLocalizedText(value.title),
    href: value.href,
    summary: toLocalizedText(value.summary),
  };
}

function toProfileProjects(value: unknown): ProfileProject[] {
  if (!Array.isArray(value)) return [];
  return value.map(toProfileProject).filter((item): item is ProfileProject => item !== null);
}

function toContactType(value: string): ContactChannelType {
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

export function mapProfilePageRowToProfile(row: ProfilePageRow): ProfileContent {
  const data = rowData(row);
  const content = row.content_markdown ?? '';

  return {
    title: row.title?.trim() || 'Profile',
    slug: typeof data.slug === 'string' ? data.slug : 'profile',
    summary: toLocalizedText(data.summary, row.summary ?? ''),
    role: toLocalizedText(data.role),
    status: toLocalizedText(data.status),
    intro: toLocalizedText(data.intro),
    fields: toProfileFields(data.fields),
    focus: toLocalizedTextArray(data.focus),
    background: toLocalizedTextArray(data.background),
    building: toProfileLinks(data.building),
    workStyle: toLocalizedTextArray(data.workStyle),
    coreSkills: toStringArray(data.coreSkills),
    aiFocus: toLocalizedTextArray(data.aiFocus),
    enterpriseExperience: toLocalizedTextArray(data.enterpriseExperience),
    featuredProjects: toProfileProjects(data.featuredProjects),
    careerDirection: toLocalizedTextArray(data.careerDirection),
    privacyNote: toLocalizedText(data.privacyNote),
    published: toBoolean(data.published, true),
    lang: toProfileLanguage(row.lang),
    content,
    rawContent: content,
  };
}

export function mapContactRowsToChannels(rows: ContactChannelRow[]): ContactChannelData[] {
  return rows
    .filter((row) => row.visible)
    .map((row) => {
      const href = row.href ?? '';
      const description = row.description ?? '';

      return {
        label: toLocalizedText(row.label),
        type: toContactType(row.type),
        href,
        value: toLocalizedText(description),
        endpoint: href ? `GET ${href}` : '',
        visible: row.visible,
        disabled: !href,
        privacyNote: null,
      };
    });
}

export function mapProfilePageRowToContactChannels(
  row: ProfilePageRow,
  channelRows: ContactChannelRow[],
): ContactChannels {
  const data = rowData(row);
  const content = row.content_markdown ?? '';

  return {
    title: row.title?.trim() || 'Contact Channels',
    slug: typeof data.slug === 'string' ? data.slug : 'contact-channels',
    summary: toLocalizedText(data.summary, row.summary ?? ''),
    channels: mapContactRowsToChannels(channelRows),
    privacyNote: toLocalizedText(data.privacyNote),
    resumeNote: toLocalizedText(data.resumeNote),
    published: toBoolean(data.published, true),
    lang: toProfileLanguage(row.lang),
    content,
    rawContent: content,
  };
}

export function mapStackRowsToGroups(
  groupRows: SystemStackGroupRow[],
  itemRows: SystemStackItemRow[],
): SystemStackGroup[] {
  return groupRows.map((group) => ({
    name: toLocalizedText(group.name),
    items: itemRows
      .filter((item) => item.group_id === group.id)
      .map((item) => item.name),
  }));
}

export function mapProfilePageRowToSystemStack(
  row: ProfilePageRow,
  groupRows: SystemStackGroupRow[],
  itemRows: SystemStackItemRow[],
): SystemStack {
  const data = rowData(row);
  const content = row.content_markdown ?? '';

  return {
    title: row.title?.trim() || 'System Stack',
    slug: typeof data.slug === 'string' ? data.slug : 'system-stack',
    summary: toLocalizedText(data.summary, row.summary ?? ''),
    groups: mapStackRowsToGroups(groupRows, itemRows),
    published: toBoolean(data.published, true),
    lang: toProfileLanguage(row.lang),
    content,
    rawContent: content,
  };
}
