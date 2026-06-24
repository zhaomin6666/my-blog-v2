import 'server-only';

import { hasPersonalSiteDatabaseConfig } from '@/lib/db/dbConfig';
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
import {
  type ProfileAdminRepository,
  PostgresProfileAdminRepository,
} from './profile-admin-repository';
import {
  validateContactChannelInput,
  validateHomepageSectionInput,
  validateProfilePageInput,
  validateStackGroupInput,
  validateStackItemInput,
} from './profile-admin-validation';

export class ProfileAdminDatabaseConfigError extends Error {
  constructor() {
    super('PERSONAL_SITE_DATABASE_URL is required for Homepage / Profile Admin.');
    this.name = 'ProfileAdminDatabaseConfigError';
  }
}

export class ProfileAdminService {
  constructor(private readonly repository: ProfileAdminRepository) {}

  private assertDatabaseConfigured(): void {
    if (!hasPersonalSiteDatabaseConfig()) {
      throw new ProfileAdminDatabaseConfigError();
    }
  }

  async listHomepageSections(): Promise<AdminHomepageSection[]> {
    this.assertDatabaseConfigured();
    return this.repository.listHomepageSections();
  }

  async getHomepageSectionById(id: string): Promise<AdminHomepageSection | null> {
    this.assertDatabaseConfigured();
    return this.repository.getHomepageSectionById(id);
  }

  async upsertHomepageSection(input: AdminHomepageSectionInput): Promise<AdminHomepageSection> {
    this.assertDatabaseConfigured();
    validateHomepageSectionInput(input);
    return this.repository.upsertHomepageSection(input);
  }

  async ensureHomepageHeroSection(lang: AdminContentLanguage): Promise<AdminHomepageSection> {
    this.assertDatabaseConfigured();
    return this.repository.ensureHomepageHeroSection(lang);
  }

  async getProfilePage(
    key: string,
    lang: AdminContentLanguage,
  ): Promise<AdminProfilePage | null> {
    this.assertDatabaseConfigured();
    return this.repository.getProfilePage(key, lang);
  }

  async upsertProfilePage(input: AdminProfilePageInput): Promise<AdminProfilePage> {
    this.assertDatabaseConfigured();
    validateProfilePageInput(input);
    return this.repository.upsertProfilePage(input);
  }

  async listContactChannels(): Promise<AdminContactChannel[]> {
    this.assertDatabaseConfigured();
    return this.repository.listContactChannels();
  }

  async getContactChannelById(id: string): Promise<AdminContactChannel | null> {
    this.assertDatabaseConfigured();
    return this.repository.getContactChannelById(id);
  }

  async createContactChannel(input: AdminContactChannelInput): Promise<AdminContactChannel> {
    this.assertDatabaseConfigured();
    validateContactChannelInput(input);
    if (input.platform !== 'custom') {
      const existing = await this.repository.listContactChannels();
      if (existing.some((channel) => channel.platform === input.platform)) {
        throw new Error('Contact platform already exists.');
      }
    }
    return this.repository.createContactChannel(input);
  }

  async updateContactChannel(
    id: string,
    input: AdminContactChannelInput,
  ): Promise<AdminContactChannel> {
    this.assertDatabaseConfigured();
    validateContactChannelInput(input);
    if (input.platform !== 'custom') {
      const existing = await this.repository.listContactChannels();
      if (existing.some((channel) => channel.id !== id && channel.platform === input.platform)) {
        throw new Error('Contact platform already exists.');
      }
    }
    return this.repository.updateContactChannel(id, input);
  }

  async softDeleteContactChannel(id: string): Promise<void> {
    this.assertDatabaseConfigured();
    await this.repository.softDeleteContactChannel(id);
  }

  async reorderContactChannels(ids: string[]): Promise<void> {
    this.assertDatabaseConfigured();
    await this.repository.reorderContactChannels(ids);
  }

  async listStackGroupsWithItems(): Promise<AdminStackGroup[]> {
    this.assertDatabaseConfigured();
    return this.repository.listStackGroupsWithItems();
  }

  async getStackGroupById(id: string): Promise<AdminStackGroup | null> {
    this.assertDatabaseConfigured();
    return this.repository.getStackGroupById(id);
  }

  async createStackGroup(input: AdminStackGroupInput): Promise<AdminStackGroup> {
    this.assertDatabaseConfigured();
    validateStackGroupInput(input);
    return this.repository.createStackGroup(input);
  }

  async updateStackGroup(id: string, input: AdminStackGroupInput): Promise<AdminStackGroup> {
    this.assertDatabaseConfigured();
    validateStackGroupInput(input);
    return this.repository.updateStackGroup(id, input);
  }

  async softDeleteStackGroup(id: string): Promise<void> {
    this.assertDatabaseConfigured();
    await this.repository.softDeleteStackGroup(id);
  }

  async getStackItemById(id: string): Promise<AdminStackItem | null> {
    this.assertDatabaseConfigured();
    return this.repository.getStackItemById(id);
  }

  async createStackItem(input: AdminStackItemInput): Promise<AdminStackItem> {
    this.assertDatabaseConfigured();
    validateStackItemInput(input);
    return this.repository.createStackItem(input);
  }

  async updateStackItem(id: string, input: AdminStackItemInput): Promise<AdminStackItem> {
    this.assertDatabaseConfigured();
    validateStackItemInput(input);
    return this.repository.updateStackItem(id, input);
  }

  async softDeleteStackItem(id: string): Promise<void> {
    this.assertDatabaseConfigured();
    await this.repository.softDeleteStackItem(id);
  }

  async reorderStackGroups(ids: string[]): Promise<void> {
    this.assertDatabaseConfigured();
    await this.repository.reorderStackGroups(ids);
  }

  async reorderStackItems(groupId: string, ids: string[]): Promise<void> {
    this.assertDatabaseConfigured();
    await this.repository.reorderStackItems(groupId, ids);
  }
}

export const profileAdminService = new ProfileAdminService(
  new PostgresProfileAdminRepository(),
);
