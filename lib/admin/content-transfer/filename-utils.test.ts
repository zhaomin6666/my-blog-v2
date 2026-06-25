import { describe, expect, it } from 'vitest';
import { filenameSlug, markdownDownloadFilename, safeFilename } from './filename-utils';

describe('content transfer filename utils', () => {
  it('sanitizes filenames', () => {
    expect(safeFilename('../Hello World!!.md')).toBe('Hello-World-.md');
    expect(markdownDownloadFilename('my-post')).toBe('my-post.md');
  });

  it('derives a slug-like filename basename', () => {
    expect(filenameSlug('folder\\my-post.md')).toBe('my-post');
  });
});
