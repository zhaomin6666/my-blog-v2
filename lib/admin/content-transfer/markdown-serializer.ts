import matter from 'gray-matter';

export function serializeMarkdown(frontmatter: Record<string, unknown>, body: string): string {
  return matter.stringify(body || '', frontmatter);
}
