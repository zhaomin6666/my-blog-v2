import { describe, expect, it, vi } from 'vitest';
import type { HomepageSection } from './homepage-types';

vi.mock('server-only', () => ({}));

const { HomepageService } = await import('./homepage-service');

class MemoryHomepageRepository {
  constructor(private readonly sections: HomepageSection[]) {}

  async listVisibleSections(): Promise<HomepageSection[]> {
    return this.sections.filter((section) => section.visible);
  }
}

const sections: HomepageSection[] = [
  {
    id: 'section-1',
    key: 'hero',
    title: 'Database Hero',
    subtitle: 'From Admin',
    contentMarkdown: '',
    data: {},
    visible: true,
    displayOrder: 1,
    lang: 'en',
  },
  {
    id: 'section-2',
    key: 'overview',
    title: 'Hidden',
    subtitle: '',
    contentMarkdown: '',
    data: {},
    visible: false,
    displayOrder: 2,
    lang: 'en',
  },
];

describe('HomepageService', () => {
  it('returns database homepage sections in database mode', async () => {
    const service = new HomepageService(
      new MemoryHomepageRepository(sections),
      'database',
    );

    await expect(service.getVisibleSections()).resolves.toEqual([sections[0]]);
  });

  it('keeps file mode independent from database homepage rows', async () => {
    const service = new HomepageService(
      new MemoryHomepageRepository(sections),
      'file',
    );

    await expect(service.getVisibleSections()).resolves.toEqual([]);
  });

  it('passes through non-hero rows without runtime fallback logic in the service layer', async () => {
    const service = new HomepageService(
      new MemoryHomepageRepository([
        {
          id: 'section-3',
          key: 'overview',
          title: 'Legacy Overview',
          subtitle: '',
          contentMarkdown: '',
          data: {},
          visible: true,
          displayOrder: 1,
          lang: 'en',
        },
      ]),
      'database',
    );

    await expect(service.getVisibleSections()).resolves.toEqual([
      {
        id: 'section-3',
        key: 'overview',
        title: 'Legacy Overview',
        subtitle: '',
        contentMarkdown: '',
        data: {},
        visible: true,
        displayOrder: 1,
        lang: 'en',
      },
    ]);
  });
});
