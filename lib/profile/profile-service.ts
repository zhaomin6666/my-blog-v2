import { FileProfileRepository } from './file-profile-repository';
import type { ProfileRepository } from './profile-repository';
import type { ContactChannels, ProfileContent, PublicProfile, SystemStack } from './profile-types';

export class ProfileService {
  constructor(private readonly repository: ProfileRepository) {}

  async getProfile(): Promise<ProfileContent> {
    const profile = await this.repository.getProfile();
    if (!profile) {
      throw new Error('Profile content "profile" is missing or unpublished.');
    }

    return profile;
  }

  async getContactChannels(): Promise<ContactChannels> {
    const channels = await this.repository.getContactChannels();
    if (!channels) {
      throw new Error('Profile content "contact-channels" is missing or unpublished.');
    }

    return channels;
  }

  async getSystemStack(): Promise<SystemStack> {
    const stack = await this.repository.getSystemStack();
    if (!stack) {
      throw new Error('Profile content "system-stack" is missing or unpublished.');
    }

    return stack;
  }

  async getPublicProfile(): Promise<PublicProfile> {
    const profile = await this.repository.getPublicProfile();
    if (!profile) {
      throw new Error('Public profile content is incomplete or unpublished.');
    }

    return profile;
  }
}

export const profileService = new ProfileService(new FileProfileRepository());
