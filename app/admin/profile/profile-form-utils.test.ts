import { describe, expect, it } from 'vitest';
import {
  formatLineDelimitedList,
  formatPipeDelimitedList,
  mergeLineDelimitedListByLanguage,
  mergeLinksByLanguage,
  mergePipeDelimitedListByLanguage,
} from './profile-form-utils';

describe('profile form utils', () => {
  it('splits pipe-delimited admin fields into multiple localized items', () => {
    expect(
      mergePipeDelimitedListByLanguage([], 'AI Agent | TypeScript | Next.js', 'zh'),
    ).toEqual([
      { zh: 'AI Agent', en: '' },
      { zh: 'TypeScript', en: '' },
      { zh: 'Next.js', en: '' },
    ]);
  });

  it('splits multi-line work style input into multiple localized items', () => {
    expect(
      mergeLineDelimitedListByLanguage([], 'Start from real business problems\nKeep delivery records', 'zh'),
    ).toEqual([
      { zh: 'Start from real business problems', en: '' },
      { zh: 'Keep delivery records', en: '' },
    ]);
  });

  it('parses building textarea lines as title description link triplets', () => {
    expect(
      mergeLinksByLanguage([], '个人网站 | 主站入口 | https://oli6666.top/', 'zh'),
    ).toEqual([
      {
        href: 'https://oli6666.top/',
        label: { zh: '个人网站', en: '' },
        description: { zh: '主站入口', en: '' },
      },
    ]);
  });

  it('formats localized lists back into admin textarea values', () => {
    const items = [
      { zh: 'AI Agent', en: '' },
      { zh: 'TypeScript', en: '' },
    ];

    expect(formatPipeDelimitedList(items, 'zh')).toBe('AI Agent | TypeScript');
    expect(formatLineDelimitedList(items, 'zh')).toBe('AI Agent\nTypeScript');
  });
});
