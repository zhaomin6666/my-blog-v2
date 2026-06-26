-- Phase 12 Step 6B-4A Site Config schema.
-- This migration is intentionally not executed automatically.
-- Run it manually against PostgreSQL before enabling database-backed site config.

create table if not exists site_configs (
  id uuid primary key default gen_random_uuid(),
  key text not null default 'default',
  site_name text default '',
  default_title text default '',
  default_description text default '',
  author text default '',
  twitter_handle text default '',
  default_locale text default 'en_US',
  data jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  lang text not null default 'en',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  deleted_at timestamp with time zone,
  constraint site_configs_lang_check check (lang in ('zh', 'en')),
  constraint site_configs_key_lang_unique unique (key, lang)
);

create index if not exists site_configs_key_lang_idx on site_configs (key, lang);
create index if not exists site_configs_published_idx on site_configs (published);
create index if not exists site_configs_deleted_at_idx on site_configs (deleted_at);

drop trigger if exists site_configs_updated_at on site_configs;
create trigger site_configs_updated_at
  before update on site_configs
  for each row execute function update_updated_at_column();
