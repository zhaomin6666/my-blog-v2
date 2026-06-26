import 'server-only';

import { hasPersonalSiteDatabaseConfig } from '@/lib/db/dbConfig';
import type {
  AdminSiteConfig,
  AdminSiteConfigInput,
  AdminSiteConfigLanguage,
} from './site-config-admin-types';
import {
  type SiteConfigAdminRepository,
  PostgresSiteConfigAdminRepository,
} from './site-config-admin-repository';
import { validateAdminSiteConfigInput } from './site-config-admin-validation';

const SITE_CONFIG_LANGS: AdminSiteConfigLanguage[] = ['zh', 'en'];

export class SiteConfigAdminDatabaseConfigError extends Error {
  constructor() {
    super('PERSONAL_SITE_DATABASE_URL is required for Site Config Admin.');
    this.name = 'SiteConfigAdminDatabaseConfigError';
  }
}

function createDefaultSiteConfig(lang: AdminSiteConfigLanguage): AdminSiteConfig {
  const isZh = lang === 'zh';

  return {
    id: '',
    key: 'default',
    siteName: isZh ? 'AI 原生作品集 CMS' : 'AI Native Portfolio CMS',
    defaultTitle: isZh
      ? 'AI 原生作品集 CMS | 开发者作品集 Starter'
      : 'AI Native Portfolio CMS | Developer Portfolio Starter',
    defaultDescription: isZh
      ? '一个用于构建开发者作品集、技术博客、项目案例和可选后台 CMS 的 starter。'
      : 'A starter for building a developer portfolio, technical blog, project showcase, and optional Admin CMS.',
    author: isZh ? 'AI 原生作品集 CMS' : 'AI Native Portfolio CMS',
    twitterHandle: '',
    defaultLocale: isZh ? 'zh_CN' : 'en_US',
    data: {},
    published: true,
    lang,
    createdAt: '',
    updatedAt: '',
  };
}

export class SiteConfigAdminService {
  constructor(private readonly repository: SiteConfigAdminRepository) {}

  private assertDatabaseConfigured(): void {
    if (!hasPersonalSiteDatabaseConfig()) {
      throw new SiteConfigAdminDatabaseConfigError();
    }
  }

  async getSiteConfigAdminPage(): Promise<AdminSiteConfig[]> {
    this.assertDatabaseConfigured();
    const existing = await this.repository.listSiteConfigs();

    return SITE_CONFIG_LANGS.map(
      (lang) =>
        existing.find((config) => config.key === 'default' && config.lang === lang) ??
        createDefaultSiteConfig(lang),
    );
  }

  async saveSiteConfig(input: AdminSiteConfigInput): Promise<AdminSiteConfig> {
    this.assertDatabaseConfigured();
    validateAdminSiteConfigInput(input);
    return this.repository.upsertSiteConfig(input);
  }
}

export const siteConfigAdminService = new SiteConfigAdminService(
  new PostgresSiteConfigAdminRepository(),
);
