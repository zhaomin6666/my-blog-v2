import { describe, expect, it } from 'vitest';
import type { AdminProjectInput } from './project-admin-types';
import {
  AdminProjectValidationError,
  parseProjectJsonArrayInput,
  parseProjectLinksInput,
  validateAdminProjectInput,
} from './project-admin-validation';

const validInput: AdminProjectInput = {
  title: 'Valid Project',
  slug: 'valid-project',
  subtitle: 'Subtitle',
  summary: 'Summary',
  contentMarkdown: 'Markdown',
  status: 'building',
  type: 'Case Study',
  role: ['Owner'],
  timeline: '2026',
  published: false,
  featured: false,
  displayOrder: 0,
  techStack: ['Next.js'],
  features: [],
  highlights: [],
  links: { github: 'https://github.com/example/repo' },
  relatedPosts: [],
  relatedSeriesSlug: '',
  lang: 'zh',
  seoTitle: '',
  seoDescription: '',
};

describe('project-admin-validation', () => {
  it('accepts valid input', () => {
    expect(() => validateAdminProjectInput(validInput)).not.toThrow();
  });

  it('rejects unsafe slugs', () => {
    expect(() =>
      validateAdminProjectInput({
        ...validInput,
        slug: 'bad/slug',
      }),
    ).toThrow(AdminProjectValidationError);
  });

  it('rejects invalid JSON arrays', () => {
    expect(() => parseProjectJsonArrayInput('{"bad": true}', 'techStack')).toThrow(
      AdminProjectValidationError,
    );
  });

  it('accepts links JSON objects and rejects link arrays', () => {
    expect(parseProjectLinksInput('{"live":"https://example.com","case":"/projects/demo"}')).toEqual({
      live: 'https://example.com',
      case: '/projects/demo',
    });

    expect(() => parseProjectLinksInput('[{"label":"Live"}]')).toThrow(
      AdminProjectValidationError,
    );
  });

  it('rejects overlong markdown content', () => {
    expect(() =>
      validateAdminProjectInput({
        ...validInput,
        contentMarkdown: 'x'.repeat(100_001),
      }),
    ).toThrow(AdminProjectValidationError);
  });
});
