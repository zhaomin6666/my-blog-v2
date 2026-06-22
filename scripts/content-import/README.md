# Content Import Placeholder

Phase 11.3 does not import or migrate real content.

This directory is reserved for a later external Markdown import workflow that
may read an author-controlled writing directory and insert validated content
into PostgreSQL CMS tables.

Current boundaries:

- Do not scan external directories in Phase 11.3.
- Do not write content into PostgreSQL in Phase 11.3.
- Do not overwrite existing Markdown files.
- Do not delete `content/blog`, `content/projects`, or `content/profile`.
- Keep file content as the default source until an explicit migration phase.
