/**
 * Markdown rendering utilities.
 *
 * Phase 6.1 scope: basic helpers for frontmatter parsing and raw content access.
 * Phase 6.2 scope: HTML rendering via remark / remark-html.
 */

import { remark } from 'remark';
import remarkHtml from 'remark-html';
import type { Root, Content } from 'mdast';
import type { Plugin } from 'unified';
import { createHeadingId } from './toc';

type MarkdownNode = Root | Content;

function collectNodeText(node: MarkdownNode): string {
  if ('value' in node && typeof node.value === 'string') {
    return node.value;
  }

  if ('children' in node) {
    return node.children.map(collectNodeText).join('');
  }

  return '';
}

const addHeadingIds: Plugin<[], Root> = () => {
  return (tree) => {
    const usedIds = new Map<string, number>();

    function visit(node: MarkdownNode) {
      if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
        const text = collectNodeText(node).trim();

        if (text) {
          node.data = {
            ...node.data,
            hProperties: {
              ...node.data?.hProperties,
              id: createHeadingId(text, usedIds),
            },
          };
        }
      }

      if ('children' in node) {
        node.children.forEach(visit);
      }
    }

    visit(tree);
  };
};

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

/**
 * Render Markdown content to sanitized HTML string.
 *
 * Uses remark + remark-html. In a future CMS phase, additional
 * sanitization (e.g. DOMPurify) should be added for untrusted content.
 *
 * @param content Raw Markdown content
 * @returns HTML string
 */
export async function renderMarkdownToHtml(content: string): Promise<string> {
  const result = await remark()
    .use(addHeadingIds)
    .use(remarkHtml, {
      sanitize: {
        clobberPrefix: '',
      },
    })
    .process(content);
  return String(result);
}

/**
 * Calculate estimated reading time in minutes.
 *
 * Assumes ~250 CJK characters or ~200 English words per minute.
 */
export function estimateReadingTime(content: string): number {
  const trimmed = content.trim();
  if (!trimmed) return 1;

  // Count CJK characters
  const cjkCount = (trimmed.match(/[一-鿿　-〿＀-￯]/g) || []).length;
  // Count words (non-CJK sequences)
  const wordCount = trimmed.replace(/[一-鿿　-〿＀-￯]/g, ' ').split(/\s+/).filter(Boolean).length;

  const cjkWpm = 400;
  const enWpm = 200;

  const minutes = Math.ceil(cjkCount / cjkWpm + wordCount / enWpm);
  return Math.max(1, minutes);
}
