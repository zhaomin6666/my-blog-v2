import { describe, expect, it } from 'vitest';
import type {
  ContactChannelRow,
  ProfilePageRow,
  SystemStackGroupRow,
  SystemStackItemRow,
} from '@/lib/db/dbTypes';
import {
  mapContactRowsToChannels,
  mapProfilePageRowsToProfile,
  mapStackRowsToGroups,
} from './profile-db-mapper';

describe('profile-db-mapper', () => {
  it('maps zh/en profile rows into localized public profile content', () => {
    const zhRow: ProfilePageRow = {
      id: 'profile-zh',
      key: 'profile',
      title: 'Profile',
      summary: 'Chinese summary',
      content_markdown: '',
      lang: 'zh',
      data: {
        intro: 'Chinese intro',
        status: 'Open',
        fields: [
          { labelKey: 'about.role', value: 'Product Builder' },
          { labelKey: 'about.direction', value: 'AI Agent' },
        ],
        focus: ['RAG', 'LangGraph'],
        published: true,
      },
    };
    const enRow: ProfilePageRow = {
      id: 'profile-en',
      key: 'profile',
      title: 'Profile',
      summary: 'English summary',
      content_markdown: '',
      lang: 'en',
      data: {
        intro: 'English intro',
        status: 'Open to talk',
        fields: [
          { labelKey: 'about.role', value: 'Product Builder' },
          { labelKey: 'about.direction', value: 'AI Agent' },
        ],
        focus: ['RAG', 'LangGraph'],
        published: true,
      },
    };

    const profile = mapProfilePageRowsToProfile({ zh: zhRow, en: enRow });

    expect(profile.intro).toEqual({ zh: 'Chinese intro', en: 'English intro' });
    expect(profile.status).toEqual({ zh: 'Open', en: 'Open to talk' });
    expect(profile.fields[0]).toEqual({
      labelKey: 'about.role',
      value: { zh: 'Product Builder', en: 'Product Builder' },
    });
    expect(profile.focus[0]).toEqual({ zh: 'RAG', en: 'RAG' });
    expect(profile.published).toBe(true);
  });

  it('reads nested localized profile data from admin-managed database rows', () => {
    const zhRow: ProfilePageRow = {
      id: 'profile-zh',
      key: 'profile',
      title: '测试个人档案',
      summary: '这是摘要',
      content_markdown: '',
      lang: 'zh',
      data: {
        intro: { zh: '中文介绍', en: '' },
        role: { zh: '后端开发', en: '' },
        status: { zh: '开放机会', en: '' },
        privacyNote: { zh: '仅公开必要信息', en: '' },
        fields: [
          { labelKey: 'about.role', value: { zh: '后端开发', en: '' } },
          { labelKey: 'about.direction', value: { zh: 'AI Agent', en: '' } },
          { labelKey: 'about.status', value: { zh: '开放机会', en: '' } },
        ],
        focus: [{ zh: 'RAG', en: '' }],
        background: [{ zh: '企业系统经验', en: '' }],
        building: [
          {
            href: 'https://example.com/demo',
            label: { zh: '个人站点', en: '' },
            description: { zh: '持续迭代中', en: '' },
          },
        ],
        workStyle: [{ zh: '偏长期主义', en: '' }],
        published: true,
      },
    };

    const profile = mapProfilePageRowsToProfile({ zh: zhRow, en: null });

    expect(profile.intro).toEqual({ zh: '中文介绍', en: '中文介绍' });
    expect(profile.role).toEqual({ zh: '后端开发', en: '后端开发' });
    expect(profile.status).toEqual({ zh: '开放机会', en: '开放机会' });
    expect(profile.privacyNote).toEqual({ zh: '仅公开必要信息', en: '仅公开必要信息' });
    expect(profile.building).toEqual([
      {
        href: 'https://example.com/demo',
        label: { zh: '个人站点', en: '个人站点' },
        description: { zh: '持续迭代中', en: '持续迭代中' },
      },
    ]);
  });

  it('keeps pipe-delimited admin focus and background entries split into multiple homepage items', () => {
    const zhRow: ProfilePageRow = {
      id: 'profile-zh',
      key: 'profile',
      title: 'Profile',
      summary: '',
      content_markdown: '',
      lang: 'zh',
      data: {
        focus: [
          { zh: 'AI Agent', en: '' },
          { zh: 'TypeScript', en: '' },
          { zh: 'Next.js', en: '' },
        ],
        background: [
          { zh: 'Starter systems', en: '' },
          { zh: 'Example projects', en: '' },
        ],
        workStyle: [
          { zh: 'Start from real business problems', en: '' },
          { zh: 'Keep delivery records', en: '' },
        ],
        published: true,
      },
    };

    const profile = mapProfilePageRowsToProfile({ zh: zhRow, en: null });

    expect(profile.focus.map((item) => item.zh)).toEqual(['AI Agent', 'TypeScript', 'Next.js']);
    expect(profile.background.map((item) => item.zh)).toEqual(['Starter systems', 'Example projects']);
    expect(profile.workStyle.map((item) => item.zh)).toEqual([
      'Start from real business problems',
      'Keep delivery records',
    ]);
  });

  it('merges contact rows by translation key for localized homepage rendering', () => {
    const rows: ContactChannelRow[] = [
      {
        id: 'contact-1',
        platform: 'blog',
        custom_label: '',
        value: 'https://example.com/blog',
        href_override: '',
        display_order: 1,
      },
      {
        id: 'contact-2',
        platform: 'github',
        custom_label: '',
        value: 'example-dev',
        href_override: '',
        display_order: 2,
      },
    ];

    const channels = mapContactRowsToChannels(rows);

    expect(channels).toHaveLength(2);
    expect(channels[0]).toMatchObject({
      platform: 'blog',
      label: 'Blog',
      href: 'https://example.com/blog',
      value: 'https://example.com/blog',
    });
    expect(channels[1]).toMatchObject({
      platform: 'github',
      label: 'GitHub',
      href: 'https://github.com/example-dev',
      value: '@example-dev',
    });
  });

  it('maps stack rows into a single global homepage structure', () => {
    const groupRows: SystemStackGroupRow[] = [
      {
        id: 'group-1',
        name: 'Backend',
        display_order: 1,
      },
    ];
    const itemRows: SystemStackItemRow[] = [
      {
        id: 'item-1',
        group_id: 'group-1',
        name: 'Java',
        display_order: 1,
      },
      {
        id: 'item-2',
        group_id: 'group-1',
        name: 'Spring Boot',
        display_order: 2,
      },
    ];

    const groups = mapStackRowsToGroups(groupRows, itemRows);

    expect(groups).toEqual([
      {
        name: 'Backend',
        displayOrder: 1,
        items: [
          { name: 'Java', displayOrder: 1 },
          { name: 'Spring Boot', displayOrder: 2 },
        ],
      },
    ]);
  });
});
