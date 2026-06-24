-- Phase 11.6.3 stable translation pairing for Contact and Stack.
-- Adds explicit cross-language translation keys so zh/en rows no longer rely
-- on display order for public localization.

create extension if not exists pgcrypto;

alter table contact_channels
  add column if not exists translation_key uuid;

update contact_channels
set translation_key = gen_random_uuid()
where translation_key is null;

alter table contact_channels
  alter column translation_key set not null;

create index if not exists contact_channels_translation_key_idx
  on contact_channels (translation_key);

alter table system_stack_groups
  add column if not exists translation_key uuid;

update system_stack_groups
set translation_key = gen_random_uuid()
where translation_key is null;

alter table system_stack_groups
  alter column translation_key set not null;

create index if not exists system_stack_groups_translation_key_idx
  on system_stack_groups (translation_key);

alter table system_stack_items
  add column if not exists translation_key uuid;

update system_stack_items
set translation_key = gen_random_uuid()
where translation_key is null;

alter table system_stack_items
  alter column translation_key set not null;

create index if not exists system_stack_items_translation_key_idx
  on system_stack_items (translation_key);
