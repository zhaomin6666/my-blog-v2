export type AdminBlogStatus = 'draft' | 'published';
export type AdminBlogLanguage = 'zh' | 'en';

export interface AdminBlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  contentMarkdown: string;
  status: AdminBlogStatus;
  lang: AdminBlogLanguage;
  cover: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  series: string;
  seriesSlug: string;
  seriesOrder: number | null;
  date: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBlogPostInput {
  title: string;
  slug: string;
  summary: string;
  contentMarkdown: string;
  status: AdminBlogStatus;
  lang: AdminBlogLanguage;
  cover: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  series: string;
  seriesSlug: string;
  seriesOrder: number | null;
  date: string | null;
}

export interface AdminBlogListParams {
  status?: AdminBlogStatus;
  lang?: AdminBlogLanguage;
  keyword?: string;
  limit?: number;
}

export interface AdminBlogValidationResult {
  ok: boolean;
  fieldErrors: Record<string, string>;
  message?: string;
}
