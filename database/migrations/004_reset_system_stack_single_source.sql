-- Phase 11.6.4 Stack reset: single global stack configuration.
-- This migration intentionally resets system_stack_groups and system_stack_items.

create extension if not exists pgcrypto;

drop trigger if exists system_stack_items_updated_at on system_stack_items;
drop trigger if exists system_stack_groups_updated_at on system_stack_groups;
drop table if exists system_stack_items;
drop table if exists system_stack_groups;

create table system_stack_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  display_order integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  deleted_at timestamp with time zone
);

create table system_stack_items (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references system_stack_groups(id) on delete cascade,
  name text not null,
  display_order integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  deleted_at timestamp with time zone
);

create index system_stack_groups_display_order_idx
  on system_stack_groups (display_order);

create index system_stack_groups_deleted_at_idx
  on system_stack_groups (deleted_at);

create index system_stack_items_group_order_idx
  on system_stack_items (group_id, display_order);

create index system_stack_items_deleted_at_idx
  on system_stack_items (deleted_at);

create trigger system_stack_groups_updated_at
  before update on system_stack_groups
  for each row execute function update_updated_at_column();

create trigger system_stack_items_updated_at
  before update on system_stack_items
  for each row execute function update_updated_at_column();
