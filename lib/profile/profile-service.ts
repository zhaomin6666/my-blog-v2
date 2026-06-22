import {
  getContentSource,
  getProfileRepository,
  type ContentSource,
} from '@/lib/content/contentSource';
import type { ProfileRepository } from './profile-repository';
import type { ContactChannels, ProfileContent, PublicProfile, SystemStack } from './profile-types';
import {
  createEmptyContactChannels,
  createEmptyProfileContent,
  createEmptySystemStack,
} from './empty-profile';

export class ProfileService {
  constructor(
    private readonly repository: ProfileRepository,
    private readonly contentSource: ContentSource = 'file',
  ) {}

  private allowsEmptyContent(): boolean {
    return this.contentSource === 'database';
  }

  async getProfile(): Promise<ProfileContent> {
    const profile = await this.repository.getProfile();
    if (!profile) {
      if (this.allowsEmptyContent()) return createEmptyProfileContent();
      throw new Error('Profile content "profile" is missing or unpublished.');
    }

    return profile;
  }

  async getContactChannels(): Promise<ContactChannels> {
    const channels = await this.repository.getContactChannels();
    if (!channels) {
      if (this.allowsEmptyContent()) return createEmptyContactChannels();
      throw new Error('Profile content "contact-channels" is missing or unpublished.');
    }

    return channels;
  }

  async getSystemStack(): Promise<SystemStack> {
    const stack = await this.repository.getSystemStack();
    if (!stack) {
      if (this.allowsEmptyContent()) return createEmptySystemStack();
      throw new Error('Profile content "system-stack" is missing or unpublished.');
    }

    return stack;
  }

  async getPublicProfile(): Promise<PublicProfile> {
    if (this.allowsEmptyContent()) {
      const [profile, contactChannels, systemStack] = await Promise.all([
        this.repository.getProfile(),
        this.repository.getContactChannels(),
        this.repository.getSystemStack(),
      ]);

      return {
        profile: profile ?? createEmptyProfileContent(),
        contactChannels: contactChannels ?? createEmptyContactChannels(),
        systemStack: systemStack ?? createEmptySystemStack(),
      };
    }

    const profile = await this.repository.getPublicProfile();
    if (!profile) {
      throw new Error('Public profile content is incomplete or unpublished.');
    }

    return profile;
  }
}

export const profileService = new ProfileService(
  getProfileRepository(),
  getContentSource('profile'),
);
