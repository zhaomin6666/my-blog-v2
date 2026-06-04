import type { Metadata } from 'next';

const fallbackSiteUrl = 'http://localhost:3000';

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

export const seoConfig = {
  siteName: 'Personal Developer OS',
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl),
  defaultTitle: 'Personal Developer OS | Backend Developer in the AI Era',
  defaultDescription:
    'A browser-based Personal Developer OS for a backend developer building AI-era products, engineering logs, and portfolio projects.',
  zhDescription:
    'A Personal Developer OS focused on backend development, AI Agents, engineering learning, and personal project showcases.',
  defaultLocale: 'en_US',
  author: 'Personal Developer OS',
  twitterHandle: '',
};

export function getAbsoluteUrl(path = '/'): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${seoConfig.siteUrl}${normalizedPath}`;
}

export function buildPageTitle(title?: string): string {
  if (!title) {
    return seoConfig.defaultTitle;
  }

  return title === seoConfig.siteName
    ? seoConfig.defaultTitle
    : `${title} | ${seoConfig.siteName}`;
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
  description = seoConfig.defaultDescription,
  path = '/',
  type = 'website',
  publishedTime,
  modifiedTime,
  tags,
}: BuildMetadataOptions = {}): Metadata {
  const pageTitle = title ? buildPageTitle(title) : seoConfig.defaultTitle;
  const metadataTitle = !title || title === seoConfig.siteName
    ? { absolute: seoConfig.defaultTitle }
    : title;
  const url = getAbsoluteUrl(path);

  return {
    title: metadataTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: seoConfig.siteName,
      locale: seoConfig.defaultLocale,
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
      description,
      ...(seoConfig.twitterHandle ? { creator: seoConfig.twitterHandle } : {}),
    },
  };
}
