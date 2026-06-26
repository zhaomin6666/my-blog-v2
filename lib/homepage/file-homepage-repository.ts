import 'server-only';

import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { DbJsonValue } from '@/lib/db/dbTypes';
import type { HomepageSection, HomepageSectionLanguage } from './homepage-types';

const HOMEPAGE_DIR = path.join(process.cwd(), 'content', 'homepage');

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function toBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.trim().toLowerCase() === 'true';
  return fallback;
}

function toNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function toLang(value: unknown): HomepageSectionLanguage {
  return value === 'zh' ? 'zh' : 'en';
}

function toJsonValue(value: unknown): DbJsonValue {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (Array.isArray(value)) {
    return value.map(toJsonValue);
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, toJsonValue(item)]),
    );
  }

  return null;
}

function toData(value: unknown): DbJsonValue {
  return isRecord(value) ? toJsonValue(value) : null;
}

function fallbackKeyFromFileName(fileName: string): string {
  return fileName.replace(/\.md$/, '').split('.')[0] || fileName;
}

function normalizeSection(
  fileName: string,
  raw: Record<string, unknown>,
  contentMarkdown: string,
): HomepageSection {
  const id = fileName.replace(/\.md$/, '');
  const fallbackKey = fallbackKeyFromFileName(fileName);
  const key = toText(raw.key).trim() || fallbackKey;

  return {
    id,
    key,
    title: toText(raw.title),
    subtitle: toText(raw.subtitle),
    contentMarkdown,
    data: toData(raw.data),
    visible: toBoolean(raw.visible, true),
    displayOrder: toNumber(raw.displayOrder, 0),
    lang: toLang(raw.lang),
  };
}

export class FileHomepageRepository {
  async listVisibleSections(): Promise<HomepageSection[]> {
    try {
      const entries = await fs.readdir(HOMEPAGE_DIR, { withFileTypes: true });
      const fileNames = entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
        .map((entry) => entry.name);

      const sections = await Promise.all(
        fileNames.map(async (fileName) => {
          const rawContent = await fs.readFile(
            path.join(HOMEPAGE_DIR, fileName),
            'utf-8',
          );
          const parsed = matter(rawContent);

          return normalizeSection(
            fileName,
            parsed.data,
            parsed.content.trim(),
          );
        }),
      );

      return sections
        .filter((section) => section.visible)
        .sort((left, right) => left.displayOrder - right.displayOrder);
    } catch {
      return [];
    }
  }
}
