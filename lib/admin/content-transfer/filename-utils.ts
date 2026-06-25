const SAFE_FILENAME_PATTERN = /[^a-z0-9._-]+/gi;

export function safeFilename(value: string, fallback = 'content'): string {
  const normalized = value
    .trim()
    .replace(SAFE_FILENAME_PATTERN, '-')
    .replace(/-+/g, '-')
    .replace(/^\.+/, '')
    .replace(/^[-_]+|[-_]+$/g, '')
    .slice(0, 120);

  return normalized || fallback;
}

export function basenameWithoutMarkdownExtension(filename: string): string {
  const normalized = filename.replace(/\\/g, '/').split('/').pop() || filename;
  return normalized.replace(/\.md$/i, '');
}

export function filenameSlug(filename: string): string {
  return safeFilename(basenameWithoutMarkdownExtension(filename).toLowerCase());
}

export function markdownDownloadFilename(slug: string): string {
  return `${safeFilename(slug, 'content')}.md`;
}

export function zipDownloadFilename(type: 'blog' | 'projects'): string {
  return `${type}-markdown-export.zip`;
}
