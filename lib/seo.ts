import type { Metadata } from 'next';
import type { SiteConfig } from '@/lib/site-config/site-config-types';

const fallbackSiteUrl = 'http://localhost:3000';

export function normalizeSiteUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

export const fallbackSeoConfig: SiteConfig = {
  key: 'default',
  siteName: 'AI Native Portfolio CMS',
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl),
  defaultTitle: 'AI Native Portfolio CMS | Developer Portfolio Starter',
  defaultDescription:
    'A starter for building a developer portfolio, technical blog, project showcase, and optional Admin CMS.',
  defaultLocale: 'en_US',
  author: 'AI Native Portfolio CMS',
  twitterHandle: '',
  data: {},
  published: true,
  lang: 'en',
};

export const seoConfig = fallbackSeoConfig;

function resolveSiteConfig(siteConfig?: SiteConfig): SiteConfig {
  return siteConfig ?? fallbackSeoConfig;
}

export function getAbsoluteUrl(
  path = '/',
  siteConfigOrUrl?: SiteConfig | string,
): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const siteUrl = typeof siteConfigOrUrl === 'string'
    ? siteConfigOrUrl
    : resolveSiteConfig(siteConfigOrUrl).siteUrl;

  return `${normalizeSiteUrl(siteUrl)}${normalizedPath}`;
}

export function buildPageTitle(title?: string, siteConfig?: SiteConfig): string {
  const config = resolveSiteConfig(siteConfig);

  if (!title) {
    return config.defaultTitle;
  }

  return title === config.siteName
    ? config.defaultTitle
    : `${title} | ${config.siteName}`;
}

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

export function buildMetadata({
  title,
  description,
  path = '/',
  type = 'website',
  publishedTime,
  modifiedTime,
  tags,
}: BuildMetadataOptions = {}, siteConfig?: SiteConfig): Metadata {
  const config = resolveSiteConfig(siteConfig);
  const resolvedDescription = description || config.defaultDescription;
  const pageTitle = title ? buildPageTitle(title, config) : config.defaultTitle;
  const metadataTitle = !title || title === config.siteName
    ? { absolute: config.defaultTitle }
    : title;
  const url = getAbsoluteUrl(path, config);

  return {
    title: metadataTitle,
    description: resolvedDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description: resolvedDescription,
      url,
      siteName: config.siteName,
      locale: config.defaultLocale,
      type,
      ...(type === 'article'
        ? {
            publishedTime,
            modifiedTime,
            tags,
          }
        : {}),
    },
    twitter: {
      card: 'summary',
      title: pageTitle,
      description: resolvedDescription,
      ...(config.twitterHandle ? { creator: config.twitterHandle } : {}),
    },
  };
}
