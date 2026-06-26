-- Phase 12 Step 6B-2A Page Config schema.
-- This migration is intentionally not executed automatically.
-- Run it manually against PostgreSQL before enabling database-backed page config.

create table if not exists page_configs (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  title text default '',
  subtitle text default '',
  footer text default '',
  seo_title text default '',
  seo_description text default '',
  data jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  lang text not null default 'zh',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  deleted_at timestamp with time zone,
  constraint page_configs_lang_check check (lang in ('zh', 'en')),
  constraint page_configs_key_lang_unique unique (key, lang)
);

create index if not exists page_configs_key_lang_idx on page_configs (key, lang);
create index if not exists page_configs_published_idx on page_configs (published);
create index if not exists page_configs_deleted_at_idx on page_configs (deleted_at);

drop trigger if exists page_configs_updated_at on page_configs;
create trigger page_configs_updated_at
  before update on page_configs
  for each row execute function update_updated_at_column();
