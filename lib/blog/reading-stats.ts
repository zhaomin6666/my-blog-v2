export interface ReadingStats {
  wordCount: number;
  readingTimeMinutes: number;
}

function stripMarkdownSyntax(content: string): string {
  return content
    // Remove frontmatter if a caller passes a full Markdown document.
    .replace(/^---[\s\S]*?---\s*/m, '')
    // Keep code content but remove fence markers and inline code markers.
    .replace(/```[\w-]*\n?/g, ' ')
    .replace(/```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    // Keep link text and image alt text.
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove common Markdown control characters.
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/(^|\s)[*_~]{1,3}([^*_~]+)[*_~]{1,3}(\s|$)/g, '$1$2$3')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^-{3,}\s*$/gm, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-zA-Z0-9#]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function calculateReadingStats(markdownContent: string): ReadingStats {
  const plainText = stripMarkdownSyntax(markdownContent);

  if (!plainText) {
    return {
      wordCount: 0,
      readingTimeMinutes: 1,
    };
  }

  const cjkCount = (plainText.match(/[\u3400-\u9fff\uf900-\ufaff]/g) || []).length;
  const latinWordCount = (plainText.match(/[A-Za-z]+(?:['-][A-Za-z]+)*/g) || []).length;
  const numberCount = (plainText.match(/\b\d+(?:\.\d+)?\b/g) || []).length;
  const nonCjkUnitCount = latinWordCount + numberCount;

  const readingTimeMinutes = Math.max(
    1,
    Math.ceil(cjkCount / 450 + nonCjkUnitCount / 220),
  );

  return {
    wordCount: cjkCount + nonCjkUnitCount,
    readingTimeMinutes,
  };
}

