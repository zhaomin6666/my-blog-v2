import type { ContactChannels, ProfileContent, PublicProfile, SystemStack } from './profile-types';

/**
 * ProfileRepository abstracts public profile content storage.
 *
 * Current implementation reads Markdown files from content/profile.
 * Future implementations can use a CMS or database without changing pages.
 */
export interface ProfileRepository {
  getProfile(): Promise<ProfileContent | null>;

  getContactChannels(): Promise<ContactChannels | null>;

  getSystemStack(): Promise<SystemStack | null>;

  getPublicProfile(): Promise<PublicProfile | null>;
}
