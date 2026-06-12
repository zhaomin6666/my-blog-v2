import type { BlogTocItem } from './blog-types';

type SlugUsageMap = Map<string, number>;

function stripHeadingMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/<[^>]+>/g, '')
    .replace(/\\([\\`*_[\]{}()#+\-.!>])/g, '$1')
    .trim();
}

export function slugifyHeading(text: string): string {
  const slug = stripHeadingMarkdown(text)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return slug || 'section';
}

export function createHeadingId(text: string, usedIds: SlugUsageMap): string {
  const baseId = slugifyHeading(text);
  const previousCount = usedIds.get(baseId) ?? 0;
  const nextCount = previousCount + 1;

  usedIds.set(baseId, nextCount);

  return previousCount === 0 ? baseId : `${baseId}-${nextCount}`;
}

export function extractBlogToc(markdown: string): BlogTocItem[] {
  const toc: BlogTocItem[] = [];
  const usedIds: SlugUsageMap = new Map();
  let fenceMarker: '`' | '~' | null = null;
  let fenceLength = 0;

  for (const line of markdown.split(/\r?\n/)) {
    const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})/);

    if (fenceMatch) {
      const marker = fenceMatch[1][0] as '`' | '~';
      const length = fenceMatch[1].length;

      if (!fenceMarker) {
        fenceMarker = marker;
        fenceLength = length;
        continue;
      }

      if (fenceMarker === marker && length >= fenceLength) {
        fenceMarker = null;
        fenceLength = 0;
      }

      continue;
    }

    if (fenceMarker) {
      continue;
    }

    const headingMatch = line.match(/^ {0,3}(#{2,3})\s+(.+?)\s*$/);

    if (!headingMatch) {
      continue;
    }

    const rawText = headingMatch[2].replace(/\s+#+\s*$/, '');
    const text = stripHeadingMarkdown(rawText);

    if (!text) {
      continue;
    }

    toc.push({
      id: createHeadingId(text, usedIds),
      text,
      level: headingMatch[1].length as 2 | 3,
    });
  }

  return toc;
}
