export type DbDateValue = Date | string | null;
export type DbJsonValue =
  | string
  | number
  | boolean
  | null
  | DbJsonValue[]
  | { [key: string]: DbJsonValue };

export interface BlogPostRow {
  [column: string]: unknown;
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content_markdown: string | null;
  status: string;
  lang: string;
  cover: string | null;
  seo_title: string | null;
  seo_description: string | null;
  tags: string[] | null;
  series: string | null;
  series_slug: string | null;
  series_order: number | null;
  date: DbDateValue;
  published_at: DbDateValue;
  created_at: DbDateValue;
  updated_at: DbDateValue;
}

export interface ProjectRow {
  [column: string]: unknown;
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  summary: string | null;
  content_markdown: string | null;
  status: string | null;
  type: string | null;
  role: DbJsonValue;
  timeline: string | null;
  featured: boolean;
  display_order: number | null;
  tech_stack: DbJsonValue;
  features: DbJsonValue;
  highlights: DbJsonValue;
  links: DbJsonValue;
  related_posts: DbJsonValue;
  related_series_slug: string | null;
  published: boolean;
  lang: string;
  seo_title: string | null;
  seo_description: string | null;
  created_at?: DbDateValue;
  updated_at?: DbDateValue;
}

export interface ProfilePageRow {
  [column: string]: unknown;
  id: string;
  key: string;
  title: string | null;
  summary: string | null;
  content_markdown: string | null;
  data: DbJsonValue;
  lang: string;
  created_at?: DbDateValue;
  updated_at?: DbDateValue;
}

export interface ContactChannelRow {
  [column: string]: unknown;
  id: string;
  platform: string;
  custom_label: string | null;
  value: string;
  href_override: string | null;
  display_order: number | null;
  created_at?: DbDateValue;
  updated_at?: DbDateValue;
}

export interface SystemStackGroupRow {
  [column: string]: unknown;
  id: string;
  name: string;
  display_order: number | null;
  created_at?: DbDateValue;
  updated_at?: DbDateValue;
}

export interface SystemStackItemRow {
  [column: string]: unknown;
  id: string;
  group_id: string;
  name: string;
  display_order: number | null;
  created_at?: DbDateValue;
  updated_at?: DbDateValue;
}

export interface HomepageSectionRow {
  [column: string]: unknown;
  id: string;
  key: string;
  title: string | null;
  subtitle: string | null;
  content_markdown: string | null;
  data: DbJsonValue;
  visible: boolean;
  display_order: number | null;
  lang: string;
  created_at?: DbDateValue;
  updated_at?: DbDateValue;
}
