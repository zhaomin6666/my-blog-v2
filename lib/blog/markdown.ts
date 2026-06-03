/**
 * Markdown rendering utilities.
 *
 * Phase 6.1 scope: basic helpers for frontmatter parsing and raw content access.
 * Phase 6.2 will add HTML rendering (remark / remark-html).
 */

/**
 * Extract a plain-text excerpt from Markdown content.
 *
 * Strips heading markers, code fences, and link syntax,
 * then returns the first `maxLength` characters.
 */
export function extractExcerpt(content: string, maxLength = 200): string {
  const cleaned = content
    // Remove headings
    .replace(/^#{1,6}\s+/gm, '')
    // Remove code fences and their contents
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove links, keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Remove bold/italic markers
    .replace(/(\*{1,2}|_{1,2})([^*_]+)\1/g, '$2')
    // Remove blockquotes
    .replace(/^>\s?/gm, '')
    // Remove horizontal rules
    .replace(/^-{3,}\s*$/gm, '')
    // Collapse multiple whitespace
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  // Try to break at a sentence boundary
  const truncated = cleaned.slice(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('。');
  const lastSpace = truncated.lastIndexOf(' ');

  const breakPoint =
    lastPeriod > maxLength * 0.7 ? lastPeriod + 1 : lastSpace > 0 ? lastSpace : maxLength;

  return cleaned.slice(0, breakPoint).trim() + '...';
}

/**
 * Parse a date string into a display-friendly format.
 */
export function formatBlogDate(dateStr: string, lang: 'zh' | 'en' = 'zh'): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return dateStr;
  }

  if (lang === 'zh') {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
