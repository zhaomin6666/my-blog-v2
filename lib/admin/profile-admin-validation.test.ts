import { describe, expect, it } from 'vitest';
import {
  AdminContentValidationError,
  parseJsonText,
  validateContactChannelInput,
  validateHomepageSectionInput,
  validateProfilePageInput,
  validateStackGroupInput,
  validateStackItemInput,
} from './profile-admin-validation';

describe('profile admin validation', () => {
  it('parses valid JSON textarea content', () => {
    expect(parseJsonText('{ "published": true }')).toEqual({ published: true });
    expect(parseJsonText('')).toEqual({});
  });

  it('rejects invalid JSON with a field error', () => {
    expect(() => parseJsonText('{invalid}', 'data')).toThrow(AdminContentValidationError);

    try {
      parseJsonText('{invalid}', 'data');
    } catch (error) {
      expect(error).toBeInstanceOf(AdminContentValidationError);
      expect((error as AdminContentValidationError).fieldErrors.data).toBe('JSON must be valid.');
    }
  });

  it('restricts homepage admin input to the hero key', () => {
    expect(() =>
      validateHomepageSectionInput({
        key: 'Hero',
        title: '',
        subtitle: '',
        contentMarkdown: '',
        data: {},
        visible: true,
        displayOrder: Number.NaN,
        lang: 'zh',
      }),
    ).toThrow(AdminContentValidationError);

    expect(() =>
      validateHomepageSectionInput({
        key: 'logs',
        title: '',
        subtitle: '',
        contentMarkdown: '',
        data: {},
        visible: true,
        displayOrder: 0,
        lang: 'zh',
      }),
    ).toThrow(AdminContentValidationError);
  });

  it('accepts valid profile, contact, group, and item inputs', () => {
    expect(() =>
      validateProfilePageInput({
        key: 'profile',
        title: 'Profile',
        summary: '',
        contentMarkdown: '',
        data: { published: true },
        lang: 'zh',
      }),
    ).not.toThrow();

    expect(() =>
      validateContactChannelInput({
        platform: 'github',
        customLabel: '',
        value: 'example',
        hrefOverride: '',
        displayOrder: 1,
      }),
    ).not.toThrow();

    expect(() =>
      validateStackGroupInput({
        name: 'Backend',
        displayOrder: 1,
      }),
    ).not.toThrow();

    expect(() =>
      validateStackItemInput({
        groupId: 'group-1',
        name: 'Java',
        displayOrder: 1,
      }),
    ).not.toThrow();
  });

  it('rejects invalid translation key values before hitting PostgreSQL', () => {
    expect(() =>
      validateContactChannelInput({
        platform: 'email',
        customLabel: '',
        value: 'invalid-email',
        hrefOverride: '',
        displayOrder: 1,
      }),
    ).toThrow(AdminContentValidationError);
  });
});
