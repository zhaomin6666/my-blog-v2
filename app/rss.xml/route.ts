import { blogService } from '@/lib/blog';
import { getAbsoluteUrl, seoConfig } from '@/lib/seo';

export const dynamic = 'force-static';

function sanitizeXmlText(value: string): string {
  return value.replace(
    /[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]/g,
    '',
  );
}

function escapeXml(value: string): string {
  return sanitizeXmlText(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRssDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? new Date().toUTCString()
    : date.toUTCString();
}

export async function GET(): Promise<Response> {
  const posts = await blogService.getPublishedPosts();
  const siteUrl = getAbsoluteUrl('/');
  const feedUrl = getAbsoluteUrl('/rss.xml');

  const items = posts.map((post) => {
    const postUrl = getAbsoluteUrl(`/blog/${post.slug}`);
    const categories = post.tags
      .map((tag) => `<category>${escapeXml(tag)}</category>`)
      .join('');

    return [
      '<item>',
      `<title>${escapeXml(post.seoTitle || post.title)}</title>`,
      `<link>${escapeXml(postUrl)}</link>`,
      `<guid isPermaLink="true">${escapeXml(postUrl)}</guid>`,
      `<pubDate>${toRssDate(post.date)}</pubDate>`,
      `<description>${escapeXml(post.seoDescription || post.summary)}</description>`,
      categories,
      '</item>',
    ].join('');
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '<channel>',
    `<title>${escapeXml(seoConfig.siteName)}</title>`,
    `<description>${escapeXml(seoConfig.defaultDescription)}</description>`,
    `<link>${escapeXml(siteUrl)}</link>`,
    `<atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    '<language>en</language>',
    ...items,
    '</channel>',
    '</rss>',
  ].join('');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
