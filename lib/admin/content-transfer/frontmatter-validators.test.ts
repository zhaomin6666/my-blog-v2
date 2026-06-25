import { describe, expect, it } from 'vitest';
import { parseMarkdownFile } from './markdown-parser';
import { validateBlogMarkdown, validateProjectMarkdown } from './frontmatter-validators';

function parse(filename: string, text: string) {
  return parseMarkdownFile({ filename, size: text.length, text });
}

describe('content transfer frontmatter validators', () => {
  it('parses valid blog Markdown frontmatter', () => {
    const result = validateBlogMarkdown(
      parse(
        'hello-world.md',
        `---
title: Hello World
slug: hello-world
summary: A post
date: "2026-06-25"
tags: ["Next.js", "CMS"]
status: published
lang: en
---

Body`,
      ),
    );

    expect(result.ok).toBe(true);
    expect(result.input).toMatchObject({
      title: 'Hello World',
      slug: 'hello-world',
      status: 'published',
      lang: 'en',
      tags: ['Next.js', 'CMS'],
    });
  });

  it('marks missing blog title invalid and defaults missing status to draft', () => {
    const result = validateBlogMarkdown(
      parse(
        'missing-title.md',
        `---
slug: missing-title
tags: tag-a, tag-b
---

Body`,
      ),
    );

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('title is required.');
    expect(result.warnings).toContain('status is missing or invalid; defaulted to draft.');
    expect(result.warnings).toContain('tags was a string; split it by comma for compatibility.');
  });

  it('parses valid project Markdown frontmatter', () => {
    const result = validateProjectMarkdown(
      parse(
        'agent-demo.md',
        `---
title: Agent Demo
slug: agent-demo
summary: A scoped agent demo
status: mvp
type: AI App
role: ["Backend", "AI"]
published: true
featured: true
order: 3
techStack: ["Next.js", "PostgreSQL"]
features: ["Scope checks"]
highlights: ["Trace display"]
links:
  live: "/agent-demo"
relatedPosts: []
lang: zh
---

Body`,
      ),
    );

    expect(result.ok).toBe(true);
    expect(result.input).toMatchObject({
      title: 'Agent Demo',
      slug: 'agent-demo',
      status: 'mvp',
      published: true,
      featured: true,
      displayOrder: 3,
    });
  });

  it('rejects invalid project arrays and links', () => {
    const result = validateProjectMarkdown(
      parse(
        'bad-project.md',
        `---
title: Bad Project
slug: bad-project
role: "owner"
techStack: []
features: []
highlights: []
links: []
relatedPosts: {}
---

Body`,
      ),
    );

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('role must be an array.');
    expect(result.errors).toContain('links must be an object.');
    expect(result.errors).toContain('relatedPosts must be an array.');
  });
});
