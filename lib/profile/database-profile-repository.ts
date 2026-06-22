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
  mapProfilePageRowToContactChannels,
  mapProfilePageRowToProfile,
  mapProfilePageRowToSystemStack,
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

async function getProfilePage(key: string): Promise<ProfilePageRow | null> {
  const result = await queryPostgres<ProfilePageRow>(
    `
      select ${PROFILE_PAGE_COLUMNS}
      from profile_pages
      where key = $1
      order by case when lang = 'zh' then 0 else 1 end, updated_at desc
      limit 1
    `,
    [key],
  );

  return result.rows[0] ?? null;
}

export class DatabaseProfileRepository implements ProfileRepository {
  async getProfile(): Promise<ProfileContent | null> {
    const row = await getProfilePage('profile');
    if (!row) return null;

    const profile = mapProfilePageRowToProfile(row);
    return profile.published ? profile : null;
  }

  async getContactChannels(): Promise<ContactChannels | null> {
    const [pageRow, channelRows] = await Promise.all([
      getProfilePage('contact-channels'),
      queryPostgres<ContactChannelRow>(
        `
          select
            id,
            label,
            type,
            href,
            description,
            visible,
            display_order,
            lang
          from contact_channels
          where deleted_at is null
            and visible = true
          order by display_order asc nulls last, created_at asc
        `,
      ),
    ]);

    if (!pageRow) return null;

    const channels = mapProfilePageRowToContactChannels(pageRow, channelRows.rows);
    return channels.published ? channels : null;
  }

  async getSystemStack(): Promise<SystemStack | null> {
    const [pageRow, groupRows, itemRows] = await Promise.all([
      getProfilePage('system-stack'),
      queryPostgres<SystemStackGroupRow>(
        `
          select
            id,
            name,
            description,
            display_order,
            lang
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
            description,
            level,
            status,
            display_order
          from system_stack_items
          where deleted_at is null
          order by display_order asc nulls last, created_at asc
        `,
      ),
    ]);

    if (!pageRow) return null;

    const stack = mapProfilePageRowToSystemStack(pageRow, groupRows.rows, itemRows.rows);
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
