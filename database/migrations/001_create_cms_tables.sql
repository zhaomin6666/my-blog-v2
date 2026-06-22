-- Phase 11.3 CMS content schema foundation.
-- This migration is intentionally not executed automatically.
-- Run it manually against the Personal Dev OS PostgreSQL database when
-- database-backed content is ready to be tested.

create extension if not exists pgcrypto;

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  summary text not null default '',
  content_markdown text not null default '',
  status text not null default 'draft',
  lang text not null default 'zh',
  cover text default '',
  seo_title text default '',
  seo_description text default '',
  tags text[] not null default '{}',
  series text default '',
  series_slug text default '',
  series_order integer,
  date date,
  published_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  deleted_at timestamp with time zone,
  constraint blog_posts_status_check check (status in ('draft', 'published', 'archived')),
  constraint blog_posts_lang_check check (lang in ('zh', 'en'))
);

create table if not exists blog_series (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  summary text default '',
  description text default '',
  lang text not null default 'zh',
  display_order integer default 0,
  published boolean not null default true,
  related_project_slug text default '',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  deleted_at timestamp with time zone,
  constraint blog_series_lang_check check (lang in ('zh', 'en'))
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  subtitle text default '',
  summary text default '',
  content_markdown text default '',
  status text default '',
  type text default '',
  role jsonb not null default '[]'::jsonb,
  timeline text default '',
  featured boolean not null default false,
  display_order integer default 0,
  tech_stack jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  highlights jsonb not null default '[]'::jsonb,
  links jsonb not null default '{}'::jsonb,
  related_posts jsonb not null default '[]'::jsonb,
  related_series_slug text default '',
  published boolean not null default false,
  lang text not null default 'zh',
  seo_title text default '',
  seo_description text default '',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  deleted_at timestamp with time zone,
  constraint projects_lang_check check (lang in ('zh', 'en'))
);

create table if not exists profile_pages (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  title text default '',
  summary text default '',
  content_markdown text default '',
  data jsonb not null default '{}'::jsonb,
  lang text not null default 'zh',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint profile_pages_lang_check check (lang in ('zh', 'en')),
  constraint profile_pages_key_lang_unique unique (key, lang)
);

create table if not exists contact_channels (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  type text not null,
  href text default '',
  description text default '',
  visible boolean not null default true,
  display_order integer default 0,
  lang text not null default 'zh',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  deleted_at timestamp with time zone,
  constraint contact_channels_lang_check check (lang in ('zh', 'en'))
);

create table if not exists system_stack_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  display_order integer default 0,
  lang text not null default 'zh',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  deleted_at timestamp with time zone,
  constraint system_stack_groups_lang_check check (lang in ('zh', 'en'))
);

create table if not exists system_stack_items (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references system_stack_groups(id) on delete cascade,
  name text not null,
  description text default '',
  level text default '',
  status text default '',
  display_order integer default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  deleted_at timestamp with time zone
);

create table if not exists homepage_sections (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  title text default '',
  subtitle text default '',
  content_markdown text default '',
  data jsonb not null default '{}'::jsonb,
  visible boolean not null default true,
  display_order integer default 0,
  lang text not null default 'zh',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint homepage_sections_lang_check check (lang in ('zh', 'en')),
  constraint homepage_sections_key_lang_unique unique (key, lang)
);

create unique index if not exists blog_posts_slug_active_idx
  on blog_posts (slug)
  where deleted_at is null;
create index if not exists blog_posts_status_idx on blog_posts (status);
create index if not exists blog_posts_lang_idx on blog_posts (lang);
create index if not exists blog_posts_published_at_date_idx on blog_posts (published_at desc, date desc);
create index if not exists blog_posts_series_slug_idx on blog_posts (series_slug);
create index if not exists blog_posts_tags_gin_idx on blog_posts using gin (tags);
create index if not exists blog_posts_deleted_at_idx on blog_posts (deleted_at);

create unique index if not exists blog_series_slug_active_idx
  on blog_series (slug)
  where deleted_at is null;
create index if not exists blog_series_published_idx on blog_series (published);
create index if not exists blog_series_display_order_idx on blog_series (display_order);
create index if not exists blog_series_deleted_at_idx on blog_series (deleted_at);

create unique index if not exists projects_slug_active_idx
  on projects (slug)
  where deleted_at is null;
create index if not exists projects_published_idx on projects (published);
create index if not exists projects_featured_idx on projects (featured);
create index if not exists projects_display_order_idx on projects (display_order);
create index if not exists projects_deleted_at_idx on projects (deleted_at);

create index if not exists profile_pages_key_lang_idx on profile_pages (key, lang);

create index if not exists contact_channels_visible_idx on contact_channels (visible);
create index if not exists contact_channels_display_order_idx on contact_channels (display_order);
create index if not exists contact_channels_deleted_at_idx on contact_channels (deleted_at);

create index if not exists system_stack_groups_order_idx
  on system_stack_groups (lang, display_order);
create index if not exists system_stack_groups_deleted_at_idx on system_stack_groups (deleted_at);
create index if not exists system_stack_items_group_order_idx
  on system_stack_items (group_id, display_order);
create index if not exists system_stack_items_deleted_at_idx on system_stack_items (deleted_at);

create index if not exists homepage_sections_key_lang_idx on homepage_sections (key, lang);
create index if not exists homepage_sections_visible_idx on homepage_sections (visible);
create index if not exists homepage_sections_display_order_idx on homepage_sections (display_order);

drop trigger if exists blog_posts_updated_at on blog_posts;
create trigger blog_posts_updated_at
  before update on blog_posts
  for each row execute function update_updated_at_column();

drop trigger if exists blog_series_updated_at on blog_series;
create trigger blog_series_updated_at
  before update on blog_series
  for each row execute function update_updated_at_column();

drop trigger if exists projects_updated_at on projects;
create trigger projects_updated_at
  before update on projects
  for each row execute function update_updated_at_column();

drop trigger if exists profile_pages_updated_at on profile_pages;
create trigger profile_pages_updated_at
  before update on profile_pages
  for each row execute function update_updated_at_column();

drop trigger if exists contact_channels_updated_at on contact_channels;
create trigger contact_channels_updated_at
  before update on contact_channels
  for each row execute function update_updated_at_column();

drop trigger if exists system_stack_groups_updated_at on system_stack_groups;
create trigger system_stack_groups_updated_at
  before update on system_stack_groups
  for each row execute function update_updated_at_column();

drop trigger if exists system_stack_items_updated_at on system_stack_items;
create trigger system_stack_items_updated_at
  before update on system_stack_items
  for each row execute function update_updated_at_column();

drop trigger if exists homepage_sections_updated_at on homepage_sections;
create trigger homepage_sections_updated_at
  before update on homepage_sections
  for each row execute function update_updated_at_column();
