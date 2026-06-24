-- Phase 11.6.3 Contact reset: single global contact configuration.
-- This migration intentionally resets contact_channels and is not backward compatible.

create extension if not exists pgcrypto;

drop trigger if exists contact_channels_updated_at on contact_channels;
drop table if exists contact_channels;

create table contact_channels (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  custom_label text not null default '',
  value text not null default '',
  href_override text not null default '',
  display_order integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  deleted_at timestamp with time zone,
  constraint contact_channels_platform_check check (
    platform in (
      'email',
      'github',
      'gitlab',
      'linkedin',
      'x',
      'telegram',
      'discord',
      'wechat',
      'weibo',
      'zhihu',
      'juejin',
      'bilibili',
      'xiaohongshu',
      'youtube',
      'instagram',
      'threads',
      'facebook',
      'tiktok',
      'medium',
      'devto',
      'hashnode',
      'substack',
      'leetcode',
      'stackoverflow',
      'kaggle',
      'npm',
      'huggingface',
      'website',
      'blog',
      'custom'
    )
  )
);

create unique index contact_channels_platform_unique_active_idx
  on contact_channels (platform)
  where deleted_at is null and platform <> 'custom';

create index contact_channels_display_order_idx
  on contact_channels (display_order);

create index contact_channels_deleted_at_idx
  on contact_channels (deleted_at);

create trigger contact_channels_updated_at
  before update on contact_channels
  for each row execute function update_updated_at_column();
