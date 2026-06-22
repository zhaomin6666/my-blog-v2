import { describe, expect, it, vi } from 'vitest';
import type { ProfileRepository } from './profile-repository';

vi.mock('@/lib/content/contentSource', () => ({
  getContentSource: () => 'file',
  getProfileRepository: () => ({
    getProfile: async () => null,
    getContactChannels: async () => null,
    getSystemStack: async () => null,
    getPublicProfile: async () => null,
  }),
}));

import { ProfileService } from './profile-service';
import { createEmptyProfileContent, isProfileContentEmpty } from './empty-profile';

function createEmptyRepository(): ProfileRepository {
  return {
    getProfile: async () => null,
    getContactChannels: async () => null,
    getSystemStack: async () => null,
    getPublicProfile: async () => null,
  };
}

describe('ProfileService empty database content', () => {
  it('treats metadata-only profile rows as empty content', () => {
    const profile = createEmptyProfileContent();
    profile.title = 'Profile';

    expect(isProfileContentEmpty(profile)).toBe(true);
  });

  it('returns a safe empty public profile in database mode', async () => {
    const service = new ProfileService(createEmptyRepository(), 'database');

    await expect(service.getPublicProfile()).resolves.toMatchObject({
      profile: {
        title: '',
        fields: [],
        focus: [],
        featuredProjects: [],
        careerDirection: [],
        content: '',
      },
      contactChannels: { channels: [] },
      systemStack: { groups: [] },
    });
  });

  it('returns safe empty values from each database profile getter', async () => {
    const service = new ProfileService(createEmptyRepository(), 'database');

    await expect(service.getProfile()).resolves.toMatchObject({ title: '', fields: [] });
    await expect(service.getContactChannels()).resolves.toMatchObject({ channels: [] });
    await expect(service.getSystemStack()).resolves.toMatchObject({ groups: [] });
  });

  it('keeps strict missing-content behavior in file mode', async () => {
    const service = new ProfileService(createEmptyRepository(), 'file');

    await expect(service.getPublicProfile()).rejects.toThrow(
      'Public profile content is incomplete or unpublished.',
    );
  });

  it('does not swallow repository connection or SQL errors', async () => {
    const repository = createEmptyRepository();
    repository.getProfile = async () => {
      throw new Error('database connection failed');
    };
    const service = new ProfileService(repository, 'database');

    await expect(service.getPublicProfile()).rejects.toThrow(
      'database connection failed',
    );
  });

  it('preserves available database content when another profile section is empty', async () => {
    const repository = createEmptyRepository();
    repository.getProfile = async () => ({
      title: 'Published profile',
      slug: 'profile',
      summary: { zh: '', en: '' },
      role: { zh: '', en: '' },
      status: { zh: '', en: '' },
      intro: { zh: '已发布', en: 'Published' },
      fields: [],
      focus: [],
      background: [],
      building: [],
      workStyle: [],
      coreSkills: [],
      aiFocus: [],
      enterpriseExperience: [],
      featuredProjects: [],
      careerDirection: [],
      privacyNote: { zh: '', en: '' },
      published: true,
      lang: 'zh',
      content: '',
      rawContent: '',
    });
    const service = new ProfileService(repository, 'database');

    const result = await service.getPublicProfile();

    expect(result.profile.title).toBe('Published profile');
    expect(result.contactChannels.channels).toEqual([]);
    expect(result.systemStack.groups).toEqual([]);
  });
});
