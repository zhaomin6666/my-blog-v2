export type ContentTransferType = 'blog' | 'projects';

export type ImportMode = 'dry-run' | 'create_only' | 'update_by_slug' | 'create_or_update';

export type ImportAction =
  | 'would_create'
  | 'would_update'
  | 'would_skip'
  | 'created'
  | 'updated'
  | 'skipped'
  | 'invalid'
  | 'failed';

export type ExportScope = 'all' | 'published' | 'draft';

export interface MarkdownUploadFile {
  filename: string;
  size: number;
  text: string;
}

export interface ParsedMarkdownFile {
  filename: string;
  basenameSlug: string;
  frontmatter: Record<string, unknown>;
  body: string;
}

export interface ImportFileResult {
  filename: string;
  slug: string;
  title: string;
  action: ImportAction;
  warnings: string[];
  errors: string[];
}

export interface ImportReportSummary {
  scanned: number;
  valid: number;
  invalid: number;
  created: number;
  updated: number;
  skipped: number;
  wouldCreate: number;
  wouldUpdate: number;
  wouldSkip: number;
  warnings: number;
  failed: number;
}

export interface ImportReport {
  contentType: ContentTransferType;
  mode: ImportMode;
  summary: ImportReportSummary;
  files: ImportFileResult[];
}

export interface SlugLookupResult {
  activeId: string | null;
  deletedCount: number;
  activeCount: number;
}

export interface BlogMarkdownInput {
  title: string;
  slug: string;
  summary: string;
  contentMarkdown: string;
  status: 'draft' | 'published' | 'archived';
  lang: 'zh' | 'en';
  cover: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  series: string;
  seriesSlug: string;
  seriesOrder: number | null;
  date: string | null;
}

export interface ProjectMarkdownInput {
  title: string;
  slug: string;
  subtitle: string;
  summary: string;
  contentMarkdown: string;
  status: 'building' | 'production' | 'mvp';
  type: string;
  role: string[];
  timeline: string;
  published: boolean;
  featured: boolean;
  displayOrder: number;
  techStack: string[];
  features: string[];
  highlights: string[];
  links: Record<string, string>;
  relatedPosts: Array<{
    title: string;
    slug: string;
  }>;
  relatedSeriesSlug: string;
  lang: 'zh' | 'en';
  seoTitle: string;
  seoDescription: string;
}

export interface ExportedMarkdownFile {
  filename: string;
  content: string;
}
