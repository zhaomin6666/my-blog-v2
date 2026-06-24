import 'server-only';
import { queryPostgres } from '@/lib/db/postgres';
import type {
  ContactChannelRow,
  ProfilePageRow,
  SystemStackGroupRow,
  SystemStackItemRow,
} from '@/lib/db/dbTypes';
import type { ProfileRepository } from './profile-repository';
import type { ContactChannels, ProfileContent, PublicProfile, SystemStack } from './profile-types';
import {
  mapContactRowsToChannels,
  mapProfilePageRowsToProfile,
  mapSystemStackRows,
} from './profile-db-mapper';

const PROFILE_PAGE_COLUMNS = `
  id,
  key,
  title,
  summary,
  content_markdown,
  data,
  lang
`;

async function getProfilePageRows(key: string): Promise<{ zh?: ProfilePageRow; en?: ProfilePageRow }> {
  const result = await queryPostgres<ProfilePageRow>(
    `
      select ${PROFILE_PAGE_COLUMNS}
      from profile_pages
      where key = $1
        and lang in ('zh', 'en')
      order by case when lang = 'zh' then 0 else 1 end, updated_at desc
    `,
    [key],
  );

  return {
    zh: result.rows.find((row) => row.lang === 'zh'),
    en: result.rows.find((row) => row.lang === 'en'),
  };
}

export class DatabaseProfileRepository implements ProfileRepository {
  async getProfile(): Promise<ProfileContent | null> {
    const rows = await getProfilePageRows('profile');
    if (!rows.zh && !rows.en) return null;

    const profile = mapProfilePageRowsToProfile(rows);
    return profile.published ? profile : null;
  }

  async getContactChannels(): Promise<ContactChannels | null> {
    const channelRows = await queryPostgres<ContactChannelRow>(
      `
        select
          id,
          platform,
          custom_label,
          value,
          href_override,
          display_order
        from contact_channels
        where deleted_at is null
        order by display_order asc nulls last, created_at asc
      `,
    );

    return {
      channels: mapContactRowsToChannels(channelRows.rows),
    };
  }

  async getSystemStack(): Promise<SystemStack | null> {
    const [groupRows, itemRows] = await Promise.all([
      queryPostgres<SystemStackGroupRow>(
        `
          select
            id,
            name,
            display_order
          from system_stack_groups
          where deleted_at is null
          order by display_order asc nulls last, created_at asc
        `,
      ),
      queryPostgres<SystemStackItemRow>(
        `
          select
            id,
            group_id,
            name,
            display_order
          from system_stack_items
          where deleted_at is null
          order by display_order asc nulls last, created_at asc
        `,
      ),
    ]);

    if (groupRows.rows.length === 0) return null;

    return mapSystemStackRows(groupRows.rows, itemRows.rows);
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
