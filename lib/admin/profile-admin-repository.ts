import 'server-only';

import { queryPostgres } from '@/lib/db/postgres';
import type {
  ContactChannelRow,
  HomepageSectionRow,
  ProfilePageRow,
  SystemStackGroupRow,
  SystemStackItemRow,
} from '@/lib/db/dbTypes';
import type {
  AdminContactChannel,
  AdminContactChannelInput,
  AdminContentLanguage,
  AdminHomepageSection,
  AdminHomepageSectionInput,
  AdminProfilePage,
  AdminProfilePageInput,
  AdminStackGroup,
  AdminStackGroupInput,
  AdminStackItem,
  AdminStackItemInput,
} from './profile-admin-types';

const PROFILE_PAGE_COLUMNS = `
  id,
  key,
  title,
  summary,
  content_markdown,
  data,
  lang,
  created_at,
  updated_at
`;

const HOMEPAGE_SECTION_COLUMNS = `
  id,
  key,
  title,
  subtitle,
  content_markdown,
  data,
  visible,
  display_order,
  lang,
  created_at,
  updated_at
`;

const CONTACT_CHANNEL_COLUMNS = `
  id,
  platform,
  custom_label,
  value,
  href_override,
  display_order,
  created_at,
  updated_at
`;

const STACK_GROUP_COLUMNS = `
  id,
  name,
  display_order,
  created_at,
  updated_at
`;

const STACK_ITEM_COLUMNS = `
  id,
  group_id,
  name,
  display_order,
  created_at,
  updated_at
`;

const HERO_SECTION_KEY = 'hero';

function nullableText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function dateToText(value: unknown): string {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function toLang(value: string): AdminContentLanguage {
  return value === 'en' ? 'en' : 'zh';
}

function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function assertUuid(id: string, label: string): void {
  if (!isUuid(id)) {
    throw new Error(`Invalid ${label} id.`);
  }
}

function mapProfilePageRow(row: ProfilePageRow): AdminProfilePage {
  return {
    id: row.id,
    key: row.key,
    title: nullableText(row.title),
    summary: nullableText(row.summary),
    contentMarkdown: nullableText(row.content_markdown),
    data: row.data,
    lang: toLang(row.lang),
    createdAt: dateToText(row.created_at),
    updatedAt: dateToText(row.updated_at),
  };
}

function mapHomepageSectionRow(row: HomepageSectionRow): AdminHomepageSection {
  return {
    id: row.id,
    key: row.key,
    title: nullableText(row.title),
    subtitle: nullableText(row.subtitle),
    contentMarkdown: nullableText(row.content_markdown),
    data: row.data,
    visible: row.visible,
    displayOrder: row.display_order ?? 0,
    lang: toLang(row.lang),
    createdAt: dateToText(row.created_at),
    updatedAt: dateToText(row.updated_at),
  };
}

function mapContactChannelRow(row: ContactChannelRow): AdminContactChannel {
  return {
    id: row.id,
    platform: row.platform,
    customLabel: nullableText(row.custom_label),
    value: row.value,
    hrefOverride: nullableText(row.href_override),
    displayOrder: row.display_order ?? 0,
    createdAt: dateToText(row.created_at),
    updatedAt: dateToText(row.updated_at),
  };
}

function mapStackItemRow(row: SystemStackItemRow): AdminStackItem {
  return {
    id: row.id,
    groupId: row.group_id,
    name: row.name,
    displayOrder: row.display_order ?? 0,
    createdAt: dateToText(row.created_at),
    updatedAt: dateToText(row.updated_at),
  };
}

function mapStackGroupRow(row: SystemStackGroupRow, items: AdminStackItem[]): AdminStackGroup {
  return {
    id: row.id,
    name: row.name,
    displayOrder: row.display_order ?? 0,
    items: items.filter((item) => item.groupId === row.id),
    createdAt: dateToText(row.created_at),
    updatedAt: dateToText(row.updated_at),
  };
}

export interface ProfileAdminRepository {
  listHomepageSections(): Promise<AdminHomepageSection[]>;
  getHomepageSectionById(id: string): Promise<AdminHomepageSection | null>;
  upsertHomepageSection(input: AdminHomepageSectionInput): Promise<AdminHomepageSection>;
  ensureHomepageHeroSection(lang: AdminContentLanguage): Promise<AdminHomepageSection>;
  getProfilePage(key: string, lang: AdminContentLanguage): Promise<AdminProfilePage | null>;
  upsertProfilePage(input: AdminProfilePageInput): Promise<AdminProfilePage>;
  listContactChannels(): Promise<AdminContactChannel[]>;
  getContactChannelById(id: string): Promise<AdminContactChannel | null>;
  createContactChannel(input: AdminContactChannelInput): Promise<AdminContactChannel>;
  updateContactChannel(id: string, input: AdminContactChannelInput): Promise<AdminContactChannel>;
  softDeleteContactChannel(id: string): Promise<void>;
  listStackGroupsWithItems(): Promise<AdminStackGroup[]>;
  getStackGroupById(id: string): Promise<AdminStackGroup | null>;
  createStackGroup(input: AdminStackGroupInput): Promise<AdminStackGroup>;
  updateStackGroup(id: string, input: AdminStackGroupInput): Promise<AdminStackGroup>;
  softDeleteStackGroup(id: string): Promise<void>;
  getStackItemById(id: string): Promise<AdminStackItem | null>;
  createStackItem(input: AdminStackItemInput): Promise<AdminStackItem>;
  updateStackItem(id: string, input: AdminStackItemInput): Promise<AdminStackItem>;
  softDeleteStackItem(id: string): Promise<void>;
  reorderContactChannels(ids: string[]): Promise<void>;
  reorderStackGroups(ids: string[]): Promise<void>;
  reorderStackItems(groupId: string, ids: string[]): Promise<void>;
}

export class PostgresProfileAdminRepository implements ProfileAdminRepository {
  async listHomepageSections(): Promise<AdminHomepageSection[]> {
    const result = await queryPostgres<HomepageSectionRow>(
      `
        select ${HOMEPAGE_SECTION_COLUMNS}
        from homepage_sections
        where key = $1
        order by lang asc, display_order asc nulls last, key asc
      `,
      [HERO_SECTION_KEY],
    );

    return result.rows.map(mapHomepageSectionRow);
  }

  async getHomepageSectionById(id: string): Promise<AdminHomepageSection | null> {
    if (!isUuid(id)) return null;

    const result = await queryPostgres<HomepageSectionRow>(
      `
        select ${HOMEPAGE_SECTION_COLUMNS}
        from homepage_sections
        where id = $1
        limit 1
      `,
      [id],
    );

    const row = result.rows[0];
    return row ? mapHomepageSectionRow(row) : null;
  }

  async upsertHomepageSection(input: AdminHomepageSectionInput): Promise<AdminHomepageSection> {
    const result = await queryPostgres<HomepageSectionRow>(
      `
        insert into homepage_sections (
          key,
          title,
          subtitle,
          content_markdown,
          data,
          visible,
          display_order,
          lang
        )
        values ($1, $2, $3, $4, $5::jsonb, $6, $7, $8)
        on conflict (key, lang) do update set
          title = excluded.title,
          subtitle = excluded.subtitle,
          content_markdown = excluded.content_markdown,
          data = excluded.data,
          visible = excluded.visible,
          display_order = excluded.display_order
        returning ${HOMEPAGE_SECTION_COLUMNS}
      `,
      [
        HERO_SECTION_KEY,
        input.title,
        input.subtitle,
        input.contentMarkdown,
        JSON.stringify(input.data),
        input.visible,
        input.displayOrder,
        input.lang,
      ],
    );

    return mapHomepageSectionRow(result.rows[0]);
  }

  async ensureHomepageHeroSection(lang: AdminContentLanguage): Promise<AdminHomepageSection> {
    await queryPostgres(
      `
        insert into homepage_sections (key, title, subtitle, content_markdown, data, visible, display_order, lang)
        values ($1, '', '', '', '{}'::jsonb, true, 0, $2)
        on conflict (key, lang) do nothing
      `,
      [HERO_SECTION_KEY, lang],
    );

    const result = await queryPostgres<HomepageSectionRow>(
      `
        select ${HOMEPAGE_SECTION_COLUMNS}
        from homepage_sections
        where key = $1 and lang = $2
        limit 1
      `,
      [HERO_SECTION_KEY, lang],
    );

    const row = result.rows[0];
    if (!row) {
      throw new Error('Hero section was not created.');
    }

    return mapHomepageSectionRow(row);
  }

  async getProfilePage(key: string, lang: AdminContentLanguage): Promise<AdminProfilePage | null> {
    const result = await queryPostgres<ProfilePageRow>(
      `
        select ${PROFILE_PAGE_COLUMNS}
        from profile_pages
        where key = $1 and lang = $2
        limit 1
      `,
      [key, lang],
    );

    const row = result.rows[0];
    return row ? mapProfilePageRow(row) : null;
  }

  async upsertProfilePage(input: AdminProfilePageInput): Promise<AdminProfilePage> {
    const result = await queryPostgres<ProfilePageRow>(
      `
        insert into profile_pages (
          key,
          title,
          summary,
          content_markdown,
          data,
          lang
        )
        values ($1, $2, $3, $4, $5::jsonb, $6)
        on conflict (key, lang) do update set
          title = excluded.title,
          summary = excluded.summary,
          content_markdown = excluded.content_markdown,
          data = excluded.data
        returning ${PROFILE_PAGE_COLUMNS}
      `,
      [
        input.key,
        input.title,
        input.summary,
        input.contentMarkdown,
        JSON.stringify(input.data),
        input.lang,
      ],
    );

    return mapProfilePageRow(result.rows[0]);
  }

  async listContactChannels(): Promise<AdminContactChannel[]> {
    const result = await queryPostgres<ContactChannelRow>(
      `
        select ${CONTACT_CHANNEL_COLUMNS}
        from contact_channels
        where deleted_at is null
        order by display_order asc nulls last, created_at asc
      `,
    );

    return result.rows.map(mapContactChannelRow);
  }

  async getContactChannelById(id: string): Promise<AdminContactChannel | null> {
    if (!isUuid(id)) return null;

    const result = await queryPostgres<ContactChannelRow>(
      `
        select ${CONTACT_CHANNEL_COLUMNS}
        from contact_channels
        where id = $1 and deleted_at is null
        limit 1
      `,
      [id],
    );

    const row = result.rows[0];
    return row ? mapContactChannelRow(row) : null;
  }

  async createContactChannel(input: AdminContactChannelInput): Promise<AdminContactChannel> {
    const result = await queryPostgres<ContactChannelRow>(
      `
        insert into contact_channels (
          platform,
          custom_label,
          value,
          href_override,
          display_order,
          deleted_at
        )
        values ($1, $2, $3, $4, $5, null)
        returning ${CONTACT_CHANNEL_COLUMNS}
      `,
      [
        input.platform,
        input.customLabel,
        input.value,
        input.hrefOverride,
        input.displayOrder,
      ],
    );

    return mapContactChannelRow(result.rows[0]);
  }

  async updateContactChannel(id: string, input: AdminContactChannelInput): Promise<AdminContactChannel> {
    assertUuid(id, 'contact channel');

    const result = await queryPostgres<ContactChannelRow>(
      `
        update contact_channels
        set
          platform = $2,
          custom_label = $3,
          value = $4,
          href_override = $5,
          display_order = $6
        where id = $1 and deleted_at is null
        returning ${CONTACT_CHANNEL_COLUMNS}
      `,
      [
        id,
        input.platform,
        input.customLabel,
        input.value,
        input.hrefOverride,
        input.displayOrder,
      ],
    );

    const row = result.rows[0];
    if (!row) throw new Error('Contact channel not found.');
    return mapContactChannelRow(row);
  }

  async softDeleteContactChannel(id: string): Promise<void> {
    assertUuid(id, 'contact channel');
    await queryPostgres(
      `
        update contact_channels
        set deleted_at = now()
        where id = $1 and deleted_at is null
      `,
      [id],
    );
  }

  async reorderContactChannels(ids: string[]): Promise<void> {
    if (ids.length === 0) return;

    ids.forEach((id) => assertUuid(id, 'contact channel'));

    const cases = ids
      .map((id, index) => `when '${id}'::uuid then ${index}`)
      .join(' ');

    await queryPostgres(
      `
        update contact_channels
        set display_order = case id
          ${cases}
          else display_order
        end
        where id = any($1::uuid[])
          and deleted_at is null
      `,
      [ids],
    );
  }

  async listStackGroupsWithItems(): Promise<AdminStackGroup[]> {
    const [groupsResult, itemsResult] = await Promise.all([
      queryPostgres<SystemStackGroupRow>(
        `
          select ${STACK_GROUP_COLUMNS}
          from system_stack_groups
          where deleted_at is null
          order by display_order asc nulls last, created_at asc
        `,
      ),
      queryPostgres<SystemStackItemRow>(
        `
          select ${STACK_ITEM_COLUMNS}
          from system_stack_items
          where deleted_at is null
          order by display_order asc nulls last, created_at asc
        `,
      ),
    ]);

    const items = itemsResult.rows.map(mapStackItemRow);
    return groupsResult.rows.map((row) => mapStackGroupRow(row, items));
  }

  async getStackGroupById(id: string): Promise<AdminStackGroup | null> {
    if (!isUuid(id)) return null;
    const groups = await this.listStackGroupsWithItems();
    return groups.find((group) => group.id === id) ?? null;
  }

  async createStackGroup(input: AdminStackGroupInput): Promise<AdminStackGroup> {
    const result = await queryPostgres<SystemStackGroupRow>(
      `
        insert into system_stack_groups (
          name,
          display_order
        )
        values ($1, $2)
        returning ${STACK_GROUP_COLUMNS}
      `,
      [input.name, input.displayOrder],
    );

    return mapStackGroupRow(result.rows[0], []);
  }

  async updateStackGroup(id: string, input: AdminStackGroupInput): Promise<AdminStackGroup> {
    assertUuid(id, 'stack group');

    const result = await queryPostgres<SystemStackGroupRow>(
      `
        update system_stack_groups
        set
          name = $2,
          display_order = $3
        where id = $1 and deleted_at is null
        returning ${STACK_GROUP_COLUMNS}
      `,
      [id, input.name, input.displayOrder],
    );

    const row = result.rows[0];
    if (!row) throw new Error('Stack group not found.');
    return mapStackGroupRow(row, []);
  }

  async softDeleteStackGroup(id: string): Promise<void> {
    assertUuid(id, 'stack group');
    await queryPostgres(
      `
        update system_stack_groups
        set deleted_at = now()
        where id = $1 and deleted_at is null
      `,
      [id],
    );
    await queryPostgres(
      `
        update system_stack_items
        set deleted_at = now()
        where group_id = $1 and deleted_at is null
      `,
      [id],
    );
  }

  async getStackItemById(id: string): Promise<AdminStackItem | null> {
    if (!isUuid(id)) return null;

    const result = await queryPostgres<SystemStackItemRow>(
      `
        select ${STACK_ITEM_COLUMNS}
        from system_stack_items
        where id = $1 and deleted_at is null
        limit 1
      `,
      [id],
    );

    const row = result.rows[0];
    return row ? mapStackItemRow(row) : null;
  }

  async createStackItem(input: AdminStackItemInput): Promise<AdminStackItem> {
    assertUuid(input.groupId, 'stack group');

    const result = await queryPostgres<SystemStackItemRow>(
      `
        insert into system_stack_items (
          group_id,
          name,
          display_order
        )
        values ($1, $2, $3)
        returning ${STACK_ITEM_COLUMNS}
      `,
      [input.groupId, input.name, input.displayOrder],
    );

    return mapStackItemRow(result.rows[0]);
  }

  async updateStackItem(id: string, input: AdminStackItemInput): Promise<AdminStackItem> {
    assertUuid(id, 'stack item');
    assertUuid(input.groupId, 'stack group');

    const result = await queryPostgres<SystemStackItemRow>(
      `
        update system_stack_items
        set
          group_id = $2,
          name = $3,
          display_order = $4
        where id = $1 and deleted_at is null
        returning ${STACK_ITEM_COLUMNS}
      `,
      [id, input.groupId, input.name, input.displayOrder],
    );

    const row = result.rows[0];
    if (!row) throw new Error('Stack item not found.');
    return mapStackItemRow(row);
  }

  async softDeleteStackItem(id: string): Promise<void> {
    assertUuid(id, 'stack item');
    await queryPostgres(
      `
        update system_stack_items
        set deleted_at = now()
        where id = $1 and deleted_at is null
      `,
      [id],
    );
  }

  async reorderStackGroups(ids: string[]): Promise<void> {
    if (ids.length === 0) return;

    ids.forEach((id) => assertUuid(id, 'stack group'));

    const cases = ids
      .map((id, index) => `when '${id}'::uuid then ${index}`)
      .join(' ');

    await queryPostgres(
      `
        update system_stack_groups
        set display_order = case id
          ${cases}
          else display_order
        end
        where id = any($1::uuid[])
          and deleted_at is null
      `,
      [ids],
    );
  }

  async reorderStackItems(groupId: string, ids: string[]): Promise<void> {
    assertUuid(groupId, 'stack group');
    if (ids.length === 0) return;

    ids.forEach((id) => assertUuid(id, 'stack item'));

    const cases = ids
      .map((id, index) => `when '${id}'::uuid then ${index}`)
      .join(' ');

    await queryPostgres(
      `
        update system_stack_items
        set display_order = case id
          ${cases}
          else display_order
        end
        where id = any($1::uuid[])
          and group_id = $2
          and deleted_at is null
      `,
      [ids, groupId],
    );
  }
}
