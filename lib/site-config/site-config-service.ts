import 'server-only';
import { getContentSource } from '@/lib/content/contentSource';
import { assertDatabaseContentSourceConfig } from '@/lib/content/contentSourceConfig';
import { getPersonalSiteDatabaseUrl } from '@/lib/db/dbConfig';
import { DatabaseSiteConfigRepository } from './database-site-config-repository';
import { FileSiteConfigRepository } from './file-site-config-repository';
import type {
  SiteConfig,
  SiteConfigLanguage,
  SiteConfigRepository,
} from './site-config-types';

const fallbackSiteUrl = 'http://localhost:3000';

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

function getConfiguredSiteUrl(): string {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl);
}

function normalizeLang(lang?: SiteConfigLanguage): SiteConfigLanguage {
  return lang === 'zh' ? 'zh' : 'en';
}

function getFallbackSiteConfig(): SiteConfig {
  return {
    key: 'default',
    siteName: 'AI Native Portfolio CMS',
    siteUrl: getConfiguredSiteUrl(),
    defaultTitle: 'AI Native Portfolio CMS | Developer Portfolio Starter',
    defaultDescription:
      'A starter for building a developer portfolio, technical blog, project showcase, and optional Admin CMS.',
    author: 'AI Native Portfolio CMS',
    twitterHandle: '',
    defaultLocale: 'en_US',
    data: {},
    published: true,
    lang: 'en',
  };
}

export class SiteConfigService {
  constructor(
    private readonly fileRepository: SiteConfigRepository = new FileSiteConfigRepository(),
    private readonly databaseRepository: SiteConfigRepository = new DatabaseSiteConfigRepository(),
  ) {}

  private getRepository(): SiteConfigRepository {
    const source = getContentSource('profile');

    if (source === 'database') {
      assertDatabaseContentSourceConfig('profile', getPersonalSiteDatabaseUrl());
      return this.databaseRepository;
    }

    return this.fileRepository;
  }

  async getSiteConfig(
    preferredLang?: SiteConfigLanguage,
  ): Promise<SiteConfig> {
    const lang = normalizeLang(preferredLang);
    const repository = this.getRepository();
    const config = await repository.getSiteConfig(lang);

    return config ?? getFallbackSiteConfig();
  }
}

export const siteConfigService = new SiteConfigService();
