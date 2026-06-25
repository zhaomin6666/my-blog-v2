import matter from 'gray-matter';
import type { MarkdownUploadFile, ParsedMarkdownFile } from './content-transfer-types';
import { filenameSlug } from './filename-utils';

export class MarkdownParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MarkdownParseError';
  }
}

export function parseMarkdownFile(file: MarkdownUploadFile): ParsedMarkdownFile {
  try {
    const parsed = matter(file.text);

    return {
      filename: file.filename,
      basenameSlug: filenameSlug(file.filename),
      frontmatter: parsed.data as Record<string, unknown>,
      body: parsed.content,
    };
  } catch {
    throw new MarkdownParseError('Frontmatter could not be parsed.');
  }
}
