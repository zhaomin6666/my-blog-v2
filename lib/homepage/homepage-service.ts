import { getContentSource } from '@/lib/content/contentSource';
import { DatabaseHomepageRepository } from './database-homepage-repository';
import { FileHomepageRepository } from './file-homepage-repository';
import type { HomepageSection } from './homepage-types';

type HomepageRepository = {
  listVisibleSections(): Promise<HomepageSection[]>;
};

export class HomepageService {
  constructor(
    private readonly databaseRepository: HomepageRepository,
    private readonly contentSource = getContentSource('profile'),
    private readonly fileRepository: HomepageRepository = new FileHomepageRepository(),
  ) {}

  async getVisibleSections(): Promise<HomepageSection[]> {
    if (this.contentSource === 'database') {
      return this.databaseRepository.listVisibleSections();
    }

    return this.fileRepository.listVisibleSections();
  }
}

export const homepageService = new HomepageService(new DatabaseHomepageRepository());
