import { getContentSource } from '@/lib/content/contentSource';
import { DatabaseHomepageRepository } from './database-homepage-repository';
import type { HomepageSection } from './homepage-types';

export class HomepageService {
  constructor(
    private readonly repository: DatabaseHomepageRepository,
    private readonly contentSource = getContentSource('profile'),
  ) {}

  async getVisibleSections(): Promise<HomepageSection[]> {
    if (this.contentSource !== 'database') {
      return [];
    }

    return this.repository.listVisibleSections();
  }
}

export const homepageService = new HomepageService(new DatabaseHomepageRepository());
