import 'server-only';

import { hasPersonalSiteDatabaseConfig } from '@/lib/db/dbConfig';
import type {
  AdminPageConfig,
  AdminPageConfigInput,
  AdminPageConfigKey,
  AdminPageConfigLanguage,
} from './page-config-admin-types';
import {
  type PageConfigAdminRepository,
  PostgresPageConfigAdminRepository,
} from './page-config-admin-repository';
import { validateAdminPageConfigInput } from './page-config-admin-validation';

const PAGE_CONFIG_KEYS: AdminPageConfigKey[] = ['projects', 'blog'];
const PAGE_CONFIG_LANGS: AdminPageConfigLanguage[] = ['zh', 'en'];

export class PageConfigAdminDatabaseConfigError extends Error {
  constructor() {
    super('PERSONAL_SITE_DATABASE_URL is required for Page Config Admin.');
    this.name = 'PageConfigAdminDatabaseConfigError';
  }
}

function createEmptyPageConfig(
  key: AdminPageConfigKey,
  lang: AdminPageConfigLanguage,
): AdminPageConfig {
  return {
    id: '',
    key,
    title: '',
    subtitle: '',
    footer: '',
    seoTitle: '',
    seoDescription: '',
    data: {},
    published: true,
    lang,
    createdAt: '',
    updatedAt: '',
  };
}

export class PageConfigAdminService {
  constructor(private readonly repository: PageConfigAdminRepository) {}

  private assertDatabaseConfigured(): void {
    if (!hasPersonalSiteDatabaseConfig()) {
      throw new PageConfigAdminDatabaseConfigError();
    }
  }

  async getPageConfigAdminPage(): Promise<AdminPageConfig[]> {
    this.assertDatabaseConfigured();
    const existing = await this.repository.listPageConfigs();

    return PAGE_CONFIG_KEYS.flatMap((key) =>
      PAGE_CONFIG_LANGS.map(
        (lang) =>
          existing.find((config) => config.key === key && config.lang === lang) ??
          createEmptyPageConfig(key, lang),
      ),
    );
  }

  async savePageConfig(input: AdminPageConfigInput): Promise<AdminPageConfig> {
    this.assertDatabaseConfigured();
    validateAdminPageConfigInput(input);
    return this.repository.upsertPageConfig(input);
  }
}

export const pageConfigAdminService = new PageConfigAdminService(
  new PostgresPageConfigAdminRepository(),
);
