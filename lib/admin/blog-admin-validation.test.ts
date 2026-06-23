import { describe, expect, it } from 'vitest';
import {
  AdminBlogValidationError,
  parseTagsInput,
  validateAdminBlogInput,
} from './blog-admin-validation';
import type { AdminBlogPostInput } from './blog-admin-types';

const validInput: AdminBlogPostInput = {
  title: 'Valid Post',
  slug: 'valid-post',
  summary: 'Summary',
  contentMarkdown: 'Markdown',
  status: 'draft',
  lang: 'zh',
  cover: '',
  seoTitle: '',
  seoDescription: '',
  tags: [],
  series: '',
  seriesSlug: '',
  seriesOrder: null,
  date: '2026-06-23',
};

describe('blog-admin-validation', () => {
  it('parses comma-separated tags', () => {
    expect(parseTagsInput(' Next.js, PostgreSQL,, CMS ')).toEqual([
      'Next.js',
      'PostgreSQL',
      'CMS',
    ]);
  });

  it('accepts valid input', () => {
    expect(() => validateAdminBlogInput(validInput)).not.toThrow();
  });

  it('rejects unsafe slugs and invalid series slugs', () => {
    expect(() =>
      validateAdminBlogInput({
        ...validInput,
        slug: '中文 slug',
        seriesSlug: 'bad/series',
      }),
    ).toThrow(AdminBlogValidationError);
  });

  it('rejects overlong markdown content', () => {
    expect(() =>
      validateAdminBlogInput({
        ...validInput,
        contentMarkdown: 'x'.repeat(100_001),
      }),
    ).toThrow(AdminBlogValidationError);
  });
});
