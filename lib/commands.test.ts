import { describe, expect, it } from 'vitest';
import { createEmptyPublicProfile } from './profile/empty-profile';
import type { PublicProfile } from './profile/profile-types';
import { executeCommand } from './commands';

function createProfile(overrides: Partial<PublicProfile>): PublicProfile {
  return {
    ...createEmptyPublicProfile(),
    ...overrides,
  };
}

describe('executeCommand profile-backed output', () => {
  it('formats skills from the same system stack groups used by Main App', () => {
    const profile = createProfile({
      systemStack: {
        groups: [
          {
            name: 'Backend',
            displayOrder: 0,
            items: [
              { name: 'Java', displayOrder: 0 },
              { name: 'Spring Boot', displayOrder: 1 },
            ],
          },
          {
            name: 'Empty Group',
            displayOrder: 1,
            items: [],
          },
        ],
      },
    });

    const result = executeCommand('skills', {
      lang: 'en',
      blogPosts: [],
      projects: [],
      profile,
    });

    expect(result.output).toContain('Backend: Java, Spring Boot');
    expect(result.output).toContain('Empty Group:');
  });

  it('formats contact from channels visible in Main App contact section', () => {
    const profile = createProfile({
      contactChannels: {
        channels: [
          {
            platform: 'github',
            label: 'GitHub',
            href: 'https://github.com/example',
            value: '@example',
            displayOrder: 0,
          },
          {
            platform: 'discord',
            label: 'Discord',
            href: '',
            value: 'example-user',
            displayOrder: 1,
          },
        ],
      },
    });

    const result = executeCommand('contact', {
      lang: 'en',
      blogPosts: [],
      projects: [],
      profile,
    });

    expect(result.output).toContain('GitHub: https://github.com/example');
    expect(result.output).not.toContain('Discord');
  });
});
