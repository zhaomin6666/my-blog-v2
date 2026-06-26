import 'server-only';
import { getContentSource } from '@/lib/content/contentSource';
import { getPersonalSiteDatabaseUrl } from '@/lib/db/dbConfig';
import { assertDatabaseContentSourceConfig } from '@/lib/content/contentSourceConfig';
import { DatabasePageConfigRepository } from './database-page-config-repository';
import { FilePageConfigRepository } from './file-page-config-repository';
import type {
  PageConfig,
  PageConfigKey,
  PageConfigLanguage,
  PageConfigRepository,
} from './page-config-types';

const fallbackPageConfigs: Record<PageConfigKey, Record<PageConfigLanguage, PageConfig>> = {
  projects: {
    zh: {
      key: 'projects',
      title: '项目案例',
      subtitle: '示例项目案例。',
      footer: '',
      seoTitle: '项目案例',
      seoDescription: '示例项目案例。',
      data: {},
      published: true,
      lang: 'zh',
    },
    en: {
      key: 'projects',
      title: 'Project Case Studies',
      subtitle: 'Example project case studies.',
      footer: '',
      seoTitle: 'Project Case Studies',
      seoDescription: 'Example project case studies.',
      data: {},
      published: true,
      lang: 'en',
    },
  },
  blog: {
    zh: {
      key: 'blog',
      title: '技术博客',
      subtitle: '示例技术写作。',
      footer: '',
      seoTitle: '技术博客',
      seoDescription: '示例技术写作。',
      data: {},
      published: true,
      lang: 'zh',
    },
    en: {
      key: 'blog',
      title: 'Technical Blog',
      subtitle: 'Example technical writing.',
      footer: '',
      seoTitle: 'Technical Blog',
      seoDescription: 'Example technical writing.',
      data: {},
      published: true,
      lang: 'en',
    },
  },
};

function getDomainForPageConfig(key: PageConfigKey) {
  return key === 'blog' ? 'blog' : 'project';
}

function normalizeLang(lang?: PageConfigLanguage): PageConfigLanguage {
  return lang === 'en' ? 'en' : 'zh';
}

export class PageConfigService {
  constructor(
    private readonly fileRepository: PageConfigRepository = new FilePageConfigRepository(),
    private readonly databaseRepository: PageConfigRepository = new DatabasePageConfigRepository(),
  ) {}

  private getRepository(key: PageConfigKey): PageConfigRepository {
    const domain = getDomainForPageConfig(key);
    const source = getContentSource(domain);

    if (source === 'database') {
      assertDatabaseContentSourceConfig(domain, getPersonalSiteDatabaseUrl());
      return this.databaseRepository;
    }

    return this.fileRepository;
  }

  async getPageConfig(
    key: PageConfigKey,
    preferredLang?: PageConfigLanguage,
  ): Promise<PageConfig> {
    const lang = normalizeLang(preferredLang);
    const repository = this.getRepository(key);
    const config = await repository.getPageConfig(key, lang);

    return config ?? fallbackPageConfigs[key][lang];
  }
}

export const pageConfigService = new PageConfigService();
