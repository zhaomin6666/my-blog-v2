import type { MetadataRoute } from 'next';
import { getAbsoluteUrl } from '@/lib/seo';
import { siteConfigService } from '@/lib/site-config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteConfig = await siteConfigService.getSiteConfig();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/preview'],
    },
    sitemap: getAbsoluteUrl('/sitemap.xml', siteConfig),
  };
}
