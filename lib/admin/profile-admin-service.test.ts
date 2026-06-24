import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProfileAdminRepository } from './profile-admin-repository';
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

vi.mock('server-only', () => ({}));

vi.mock('@/lib/db/dbConfig', () => ({
  hasPersonalSiteDatabaseConfig: vi.fn(() => true),
}));

const { hasPersonalSiteDatabaseConfig } = await import('@/lib/db/dbConfig');
const { ProfileAdminService, ProfileAdminDatabaseConfigError } = await import('./profile-admin-service');
const hasDatabaseConfigMock = vi.mocked(hasPersonalSiteDatabaseConfig);

class MemoryProfileAdminRepository implements ProfileAdminRepository {
  homepageSections: AdminHomepageSection[] = [];
  profilePages: AdminProfilePage[] = [];
  contactChannels: AdminContactChannel[] = [];
  stackGroups: AdminStackGroup[] = [];
  stackItems: AdminStackItem[] = [];
  async listHomepageSections(): Promise<AdminHomepageSection[]> {
    return [...this.homepageSections].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getHomepageSectionById(id: string): Promise<AdminHomepageSection | null> {
    return this.homepageSections.find((section) => section.id === id) ?? null;
  }

  async upsertHomepageSection(input: AdminHomepageSectionInput): Promise<AdminHomepageSection> {
    const normalizedInput: AdminHomepageSectionInput = {
      ...input,
      key: 'hero',
      displayOrder: 0,
      data: {},
    };
    const existing = this.homepageSections.find(
      (section) => section.key === 'hero' && section.lang === input.lang,
    );
    const section: AdminHomepageSection = {
      id: existing?.id ?? `homepage-${this.homepageSections.length + 1}`,
      ...normalizedInput,
      createdAt: existing?.createdAt ?? '2026-06-23',
      updatedAt: '2026-06-23',
    };

    if (existing) {
      this.homepageSections = this.homepageSections.map((item) =>
        item.id === existing.id ? section : item,
      );
    } else {
      this.homepageSections.push(section);
    }

    return section;
  }

  async ensureHomepageHeroSection(lang: AdminContentLanguage): Promise<AdminHomepageSection> {
    return this.upsertHomepageSection({
      key: 'hero',
      title: '',
      subtitle: '',
      contentMarkdown: '',
      data: {},
      visible: true,
      displayOrder: 0,
      lang,
    });
  }

  async getProfilePage(key: string, lang: AdminContentLanguage): Promise<AdminProfilePage | null> {
    return this.profilePages.find((page) => page.key === key && page.lang === lang) ?? null;
  }

  async upsertProfilePage(input: AdminProfilePageInput): Promise<AdminProfilePage> {
    const existing = await this.getProfilePage(input.key, input.lang);
    const page: AdminProfilePage = {
      id: existing?.id ?? `profile-${this.profilePages.length + 1}`,
      ...input,
      createdAt: existing?.createdAt ?? '2026-06-23',
      updatedAt: '2026-06-23',
    };
    this.profilePages = this.profilePages.filter(
      (item) => item.key !== input.key || item.lang !== input.lang,
    );
    this.profilePages.push(page);
    return page;
  }

  async listContactChannels(): Promise<AdminContactChannel[]> {
    return [...this.contactChannels].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getContactChannelById(id: string): Promise<AdminContactChannel | null> {
    return this.contactChannels.find((channel) => channel.id === id) ?? null;
  }

  async createContactChannel(input: AdminContactChannelInput): Promise<AdminContactChannel> {
    const channel: AdminContactChannel = {
      id: `contact-${this.contactChannels.length + 1}`,
      ...input,
      createdAt: '2026-06-23',
      updatedAt: '2026-06-23',
    };
    this.contactChannels.push(channel);
    return channel;
  }

  async updateContactChannel(id: string, input: AdminContactChannelInput): Promise<AdminContactChannel> {
    const channel: AdminContactChannel = {
      id,
      ...input,
      createdAt: '2026-06-23',
      updatedAt: '2026-06-23',
    };
    this.contactChannels = this.contactChannels.map((item) =>
      item.id === id ? channel : item,
    );
    return channel;
  }

  async softDeleteContactChannel(id: string): Promise<void> {
    this.contactChannels = this.contactChannels.filter((channel) => channel.id !== id);
  }

  async listStackGroupsWithItems(): Promise<AdminStackGroup[]> {
    return this.stackGroups
      .map((group) => ({
        ...group,
        items: this.stackItems
          .filter((item) => item.groupId === group.id)
          .sort((a, b) => a.displayOrder - b.displayOrder),
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getStackGroupById(id: string): Promise<AdminStackGroup | null> {
    return (await this.listStackGroupsWithItems()).find((group) => group.id === id) ?? null;
  }

  async createStackGroup(input: AdminStackGroupInput): Promise<AdminStackGroup> {
    const group: AdminStackGroup = {
      id: `group-${this.stackGroups.length + 1}`,
      ...input,
      items: [],
      createdAt: '2026-06-23',
      updatedAt: '2026-06-23',
    };
    this.stackGroups.push(group);
    return group;
  }

  async updateStackGroup(id: string, input: AdminStackGroupInput): Promise<AdminStackGroup> {
    const current = await this.getStackGroupById(id);
    const group: AdminStackGroup = {
      id,
      ...input,
      items: current?.items ?? [],
      createdAt: '2026-06-23',
      updatedAt: '2026-06-23',
    };
    this.stackGroups = this.stackGroups.map((item) => (item.id === id ? group : item));
    return group;
  }

  async softDeleteStackGroup(id: string): Promise<void> {
    this.stackGroups = this.stackGroups.filter((group) => group.id !== id);
    this.stackItems = this.stackItems.filter((item) => item.groupId !== id);
  }

  async getStackItemById(id: string): Promise<AdminStackItem | null> {
    return this.stackItems.find((item) => item.id === id) ?? null;
  }

  async createStackItem(input: AdminStackItemInput): Promise<AdminStackItem> {
    const item: AdminStackItem = {
      id: `item-${this.stackItems.length + 1}`,
      ...input,
      createdAt: '2026-06-23',
      updatedAt: '2026-06-23',
    };
    this.stackItems.push(item);
    return item;
  }

  async updateStackItem(id: string, input: AdminStackItemInput): Promise<AdminStackItem> {
    const item: AdminStackItem = {
      id,
      ...input,
      createdAt: '2026-06-23',
      updatedAt: '2026-06-23',
    };
    this.stackItems = this.stackItems.map((current) => (current.id === id ? item : current));
    return item;
  }

  async softDeleteStackItem(id: string): Promise<void> {
    this.stackItems = this.stackItems.filter((item) => item.id !== id);
  }

  async reorderContactChannels(): Promise<void> {
    return;
  }

  async reorderStackGroups(ids: string[]): Promise<void> {
    this.stackGroups = ids
      .map((id, index) => {
        const group = this.stackGroups.find((item) => item.id === id);
        return group ? { ...group, displayOrder: index } : null;
      })
      .filter((group): group is AdminStackGroup => group !== null);
  }

  async reorderStackItems(groupId: string, ids: string[]): Promise<void> {
    const reorderedItems = ids
      .map((id, index) => {
        const item = this.stackItems.find((entry) => entry.id === id && entry.groupId === groupId);
        return item ? { ...item, displayOrder: index } : null;
      })
      .filter((item): item is AdminStackItem => item !== null);

    this.stackItems = [
      ...this.stackItems.filter((item) => item.groupId !== groupId),
      ...reorderedItems,
    ];
  }
}

describe('ProfileAdminService', () => {
  beforeEach(() => {
    hasDatabaseConfigMock.mockReturnValue(true);
  });

  it('ensures hero sections and upserts hero content only', async () => {
    const repository = new MemoryProfileAdminRepository();
    const service = new ProfileAdminService(repository);

    await service.ensureHomepageHeroSection('zh');
    await service.ensureHomepageHeroSection('en');
    const updated = await service.upsertHomepageSection({
      key: 'hero',
      title: 'Database Hero',
      subtitle: 'From Admin',
      contentMarkdown: 'Body',
      data: { cta: 'projects' },
      visible: true,
      displayOrder: 5,
      lang: 'zh',
    });

    expect(updated.title).toBe('Database Hero');
    expect(await service.listHomepageSections()).toHaveLength(2);
    expect((await service.listHomepageSections()).every((section) => section.key === 'hero')).toBe(true);
  });

  it('upserts profile page data', async () => {
    const service = new ProfileAdminService(new MemoryProfileAdminRepository());

    const profile = await service.upsertProfilePage({
      key: 'profile',
      title: 'Profile',
      summary: 'Public summary',
      contentMarkdown: 'Body',
      data: { published: true },
      lang: 'zh',
    });

    expect(profile).toMatchObject({
      key: 'profile',
      title: 'Profile',
      data: { published: true },
    });
  });

  it('creates and updates contact channels while ensuring metadata pages', async () => {
    const repository = new MemoryProfileAdminRepository();
    const service = new ProfileAdminService(repository);

    const channel = await service.createContactChannel({
      platform: 'github',
      customLabel: '',
      value: 'example',
      hrefOverride: '',
      displayOrder: 2,
    });
    const updated = await service.updateContactChannel(channel.id, {
      ...channel,
      hrefOverride: 'https://github.com/example-dev',
      displayOrder: 1,
    });

    expect(updated.hrefOverride).toBe('https://github.com/example-dev');
  });

  it('creates stack groups and items with ordering', async () => {
    const repository = new MemoryProfileAdminRepository();
    const service = new ProfileAdminService(repository);

    const backend = await service.createStackGroup({
      name: 'Backend',
      displayOrder: 20,
    });
    const frontend = await service.createStackGroup({
      name: 'Frontend',
      displayOrder: 10,
    });
    await service.createStackItem({
      groupId: backend.id,
      name: 'Spring Boot',
      displayOrder: 2,
    });
    await service.createStackItem({
      groupId: backend.id,
      name: 'Java',
      displayOrder: 1,
    });

    const groups = await service.listStackGroupsWithItems();
    expect(groups.map((group) => group.name)).toEqual(['Frontend', 'Backend']);
    expect(groups.find((group) => group.id === backend.id)?.items.map((item) => item.name)).toEqual([
      'Java',
      'Spring Boot',
    ]);
    expect(frontend.items).toEqual([]);
  });

  it('reorders stack groups and items', async () => {
    const repository = new MemoryProfileAdminRepository();
    const service = new ProfileAdminService(repository);

    const backend = await service.createStackGroup({
      name: 'Backend',
      displayOrder: 0,
    });
    const frontend = await service.createStackGroup({
      name: 'Frontend',
      displayOrder: 1,
    });
    const java = await service.createStackItem({
      groupId: backend.id,
      name: 'Java',
      displayOrder: 0,
    });
    const spring = await service.createStackItem({
      groupId: backend.id,
      name: 'Spring Boot',
      displayOrder: 1,
    });

    await service.reorderStackGroups([frontend.id, backend.id]);
    await service.reorderStackItems(backend.id, [spring.id, java.id]);

    const groups = await service.listStackGroupsWithItems();
    expect(groups.map((group) => group.name)).toEqual(['Frontend', 'Backend']);
    expect(groups.find((group) => group.id === backend.id)?.items.map((item) => item.name)).toEqual([
      'Spring Boot',
      'Java',
    ]);
  });

  it('throws a clear database configuration error when database url is missing', async () => {
    hasDatabaseConfigMock.mockReturnValue(false);
    const service = new ProfileAdminService(new MemoryProfileAdminRepository());

    await expect(service.listHomepageSections()).rejects.toBeInstanceOf(
      ProfileAdminDatabaseConfigError,
    );
  });
});
