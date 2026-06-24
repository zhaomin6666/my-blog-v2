import 'server-only';

import { queryPostgres } from '@/lib/db/postgres';
import type { HomepageSectionRow } from '@/lib/db/dbTypes';
import type { HomepageSection } from './homepage-types';

const HOMEPAGE_SECTION_COLUMNS = `
  id,
  key,
  title,
  subtitle,
  content_markdown,
  data,
  visible,
  display_order,
  lang
`;

function nullableText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function mapHomepageSectionRow(row: HomepageSectionRow): HomepageSection {
  return {
    id: row.id,
    key: row.key,
    title: nullableText(row.title),
    subtitle: nullableText(row.subtitle),
    contentMarkdown: nullableText(row.content_markdown),
    data: row.data,
    visible: row.visible,
    displayOrder: row.display_order ?? 0,
    lang: row.lang === 'en' ? 'en' : 'zh',
  };
}

export class DatabaseHomepageRepository {
  async listVisibleSections(): Promise<HomepageSection[]> {
    const result = await queryPostgres<HomepageSectionRow>(
      `
        select ${HOMEPAGE_SECTION_COLUMNS}
        from homepage_sections
        where visible = true
        order by display_order asc nulls last, created_at asc
      `,
    );

    return result.rows.map(mapHomepageSectionRow);
  }
}
