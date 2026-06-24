import type {
  ContactChannelRow,
  ProfilePageRow,
  SystemStackGroupRow,
  SystemStackItemRow,
} from '@/lib/db/dbTypes';
import type { LocalizedText } from '@/lib/types';
import type {
  ContactChannelData,
  ProfileContent,
  ProfileField,
  ProfileFieldLabel,
  ProfileLink,
  ProfileProject,
  SystemStack,
  SystemStackGroup,
  SystemStackItem,
} from './profile-types';
import {
  buildContactHref,
  CONTACT_PLATFORM_META,
  formatContactDisplayValue,
  isContactPlatform,
  sanitizeContactValue,
} from './contact-platforms';

type JsonRecord = Record<string, unknown>;

interface LocalizedProfilePageRows {
  zh?: ProfilePageRow | null;
  en?: ProfilePageRow | null;
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function rowData(row: ProfilePageRow | null | undefined): JsonRecord {
  return row && isRecord(row.data) ? row.data : {};
}

function toText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function localizedText(
  zhValue: unknown,
  enValue: unknown,
  fallbackZh = '',
  fallbackEn = '',
): LocalizedText {
  const zh = typeof zhValue === 'string' ? zhValue : fallbackZh;
  const en = typeof enValue === 'string' ? enValue : fallbackEn || zh;
  return { zh, en };
}

function localizedTextFromData(
  zhData: JsonRecord,
  enData: JsonRecord,
  key: string,
  fallbackZh = '',
  fallbackEn = '',
): LocalizedText {
  return localizedText(zhData[key], enData[key], fallbackZh, fallbackEn);
}

function localizedTextFromNestedData(
  zhData: JsonRecord,
  enData: JsonRecord,
  key: string,
  fallbackZh = '',
  fallbackEn = '',
): LocalizedText {
  const zhValue = localizedTextFromValue(zhData[key]);
  const enValue = localizedTextFromValue(enData[key]);
  const zh = zhValue.zh || fallbackZh;
  const en = enValue.en || fallbackEn || zh;
  return { zh, en };
}

function localizedTextFromValue(value: unknown): LocalizedText {
  if (isRecord(value)) {
    return localizedText(value.zh, value.en);
  }

  return localizedText(value, value);
}

function localizedTextArray(zhValue: unknown, enValue: unknown): LocalizedText[] {
  const zhItems = Array.isArray(zhValue) ? zhValue : [];
  const enItems = Array.isArray(enValue) ? enValue : [];
  const length = Math.max(zhItems.length, enItems.length);
  const items: LocalizedText[] = [];

  for (let index = 0; index < length; index += 1) {
    const zhItem = localizedTextFromValue(zhItems[index]);
    const enItem = localizedTextFromValue(enItems[index]);
    const merged = localizedText(zhItem.zh, enItem.en, zhItem.zh, enItem.en);

    if (merged.zh || merged.en) {
      items.push(merged);
    }
  }

  return items;
}

function toBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return fallback;
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function profileFieldLabel(value: unknown): ProfileFieldLabel | null {
  if (
    value === 'about.role' ||
    value === 'about.direction' ||
    value === 'about.status'
  ) {
    return value;
  }

  return null;
}

function profileFields(zhValue: unknown, enValue: unknown): ProfileField[] {
  const zhItems = Array.isArray(zhValue) ? zhValue : [];
  const enItems = Array.isArray(enValue) ? enValue : [];
  const length = Math.max(zhItems.length, enItems.length);
  const fields: ProfileField[] = [];

  for (let index = 0; index < length; index += 1) {
    const zhItem = zhItems[index];
    const enItem = enItems[index];

    const labelKey = profileFieldLabel(
      isRecord(zhItem) ? zhItem.labelKey : isRecord(enItem) ? enItem.labelKey : null,
    );
    if (!labelKey) continue;

    const zhFieldValue = isRecord(zhItem) ? zhItem.value : undefined;
    const enFieldValue = isRecord(enItem) ? enItem.value : undefined;

    fields.push({
      labelKey,
      value: localizedText(
        isRecord(zhFieldValue) ? zhFieldValue.zh : zhFieldValue,
        isRecord(enFieldValue) ? enFieldValue.en : enFieldValue,
      ),
    });
  }

  return fields;
}

function profileLinks(zhValue: unknown, enValue: unknown): ProfileLink[] {
  const zhItems = Array.isArray(zhValue) ? zhValue : [];
  const enItems = Array.isArray(enValue) ? enValue : [];
  const length = Math.max(zhItems.length, enItems.length);
  const links: ProfileLink[] = [];

  for (let index = 0; index < length; index += 1) {
    const zhItem = isRecord(zhItems[index]) ? zhItems[index] : null;
    const enItem = isRecord(enItems[index]) ? enItems[index] : null;
    const href = toText(zhItem?.href) || toText(enItem?.href);
    if (!href) continue;

    links.push({
      href,
      label: (() => {
        const zhLabel = localizedTextFromValue(zhItem?.label);
        const enLabel = localizedTextFromValue(enItem?.label);
        return {
          zh: zhLabel.zh,
          en: enLabel.en || zhLabel.zh,
        };
      })(),
      description: (() => {
        const zhDescription = localizedTextFromValue(zhItem?.description);
        const enDescription = localizedTextFromValue(enItem?.description);
        return {
          zh: zhDescription.zh,
          en: enDescription.en || zhDescription.zh,
        };
      })(),
    });
  }

  return links;
}

function profileProjects(zhValue: unknown, enValue: unknown): ProfileProject[] {
  const zhItems = Array.isArray(zhValue) ? zhValue : [];
  const enItems = Array.isArray(enValue) ? enValue : [];
  const length = Math.max(zhItems.length, enItems.length);
  const projects: ProfileProject[] = [];

  for (let index = 0; index < length; index += 1) {
    const zhItem = isRecord(zhItems[index]) ? zhItems[index] : null;
    const enItem = isRecord(enItems[index]) ? enItems[index] : null;
    const href = toText(zhItem?.href) || toText(enItem?.href);
    if (!href) continue;

    projects.push({
      href,
      title: localizedText(
        isRecord(zhItem?.title) ? zhItem.title.zh : zhItem?.title,
        isRecord(enItem?.title) ? enItem.title.en : enItem?.title,
      ),
      summary: localizedText(
        isRecord(zhItem?.summary) ? zhItem.summary.zh : zhItem?.summary,
        isRecord(enItem?.summary) ? enItem.summary.en : enItem?.summary,
      ),
    });
  }

  return projects;
}

function sortRowsByDisplayOrder<T extends { display_order: number | null }>(rows: T[]): T[] {
  return [...rows].sort((left, right) => {
    const leftOrder = left.display_order ?? 0;
    const rightOrder = right.display_order ?? 0;
    return leftOrder - rightOrder;
  });
}

export function mapProfilePageRowsToProfile(rows: LocalizedProfilePageRows): ProfileContent {
  const zhRow = rows.zh ?? rows.en ?? null;
  const enRow = rows.en ?? rows.zh ?? null;
  const zhData = rowData(zhRow);
  const enData = rowData(enRow);
  const content = zhRow?.content_markdown ?? enRow?.content_markdown ?? '';

  return {
    title: zhRow?.title?.trim() || enRow?.title?.trim() || 'Profile',
    slug: toText(zhData.slug).trim() || toText(enData.slug).trim() || 'profile',
    summary: localizedTextFromData(zhData, enData, 'summary', zhRow?.summary ?? '', enRow?.summary ?? ''),
    role: localizedTextFromNestedData(zhData, enData, 'role'),
    status: localizedTextFromNestedData(zhData, enData, 'status'),
    intro: localizedTextFromNestedData(zhData, enData, 'intro'),
    fields: profileFields(zhData.fields, enData.fields),
    focus: localizedTextArray(zhData.focus, enData.focus),
    background: localizedTextArray(zhData.background, enData.background),
    building: profileLinks(zhData.building, enData.building),
    workStyle: localizedTextArray(zhData.workStyle, enData.workStyle),
    coreSkills: stringArray(zhData.coreSkills).length ? stringArray(zhData.coreSkills) : stringArray(enData.coreSkills),
    aiFocus: localizedTextArray(zhData.aiFocus, enData.aiFocus),
    enterpriseExperience: localizedTextArray(zhData.enterpriseExperience, enData.enterpriseExperience),
    featuredProjects: profileProjects(zhData.featuredProjects, enData.featuredProjects),
    careerDirection: localizedTextArray(zhData.careerDirection, enData.careerDirection),
    privacyNote: localizedTextFromNestedData(zhData, enData, 'privacyNote'),
    published: toBoolean(zhData.published, toBoolean(enData.published, true)),
    lang: 'zh',
    content,
    rawContent: content,
  };
}

export function mapContactRowsToChannels(rows: ContactChannelRow[]): ContactChannelData[] {
  return rows
    .map((row) => {
      const platformValue = typeof row.platform === 'string' ? row.platform.trim() : '';
      if (!isContactPlatform(platformValue)) return null;

      const platform = platformValue;
      const rawValue = row.value.trim();
      const customLabel = toText(row.custom_label).trim();
      const hrefOverride = toText(row.href_override).trim();
      const sanitizedValue = sanitizeContactValue(platform, rawValue);
      const href = buildContactHref(platform, sanitizedValue, hrefOverride);
      const label =
        platform === 'custom'
          ? customLabel
          : platform === 'x'
            ? 'X'
            : CONTACT_PLATFORM_META[platform].label;

      if (!sanitizedValue) return null;
      if (platform === 'custom' && (!customLabel || !href)) return null;

      return {
        platform,
        label,
        href,
        value: formatContactDisplayValue(platform, sanitizedValue),
        displayOrder: row.display_order ?? 0,
      } satisfies ContactChannelData;
    })
    .filter((channel): channel is ContactChannelData => channel !== null)
    .sort((left, right) => left.displayOrder - right.displayOrder);
}

export function mapStackRowsToGroups(
  groupRows: SystemStackGroupRow[],
  itemRows: SystemStackItemRow[],
): SystemStackGroup[] {
  const itemsByGroupId = new Map<string, SystemStackItem[]>();

  for (const itemRow of sortRowsByDisplayOrder(itemRows)) {
    const item: SystemStackItem = {
      name: itemRow.name,
      displayOrder: itemRow.display_order ?? 0,
    };
    const list = itemsByGroupId.get(itemRow.group_id) ?? [];
    list.push(item);
    itemsByGroupId.set(itemRow.group_id, list);
  }

  return sortRowsByDisplayOrder(groupRows).map((groupRow) => ({
    name: groupRow.name,
    displayOrder: groupRow.display_order ?? 0,
    items: itemsByGroupId.get(groupRow.id) ?? [],
  }));
}

export function mapSystemStackRows(
  groupRows: SystemStackGroupRow[],
  itemRows: SystemStackItemRow[],
): SystemStack {
  return {
    groups: mapStackRowsToGroups(groupRows, itemRows),
  };
}
