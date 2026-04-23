create table if not exists public.prompt_engine_custom_prompts (
  id text primary key,
  workspace text not null default 'digital-bloom-shared',
  title text not null,
  cat text not null,
  badge text,
  workflow text,
  scenes jsonb not null default '[]'::jsonb,
  original_prompt text,
  transformed_scene_1 text,
  transformed_scene_2 text,
  transformed_scene_3 text,
  transform_status text,
  transform_version text,
  quality_flags jsonb not null default '[]'::jsonb,
  created_by text,
  updated_by text,
  is_deleted boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_prompt_engine_custom_prompts_workspace_updated
  on public.prompt_engine_custom_prompts (workspace, updated_at desc);

create index if not exists idx_prompt_engine_custom_prompts_active_workspace
  on public.prompt_engine_custom_prompts (workspace, updated_at desc)
  where is_deleted = false;

create or replace function public.set_prompt_engine_custom_prompts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_prompt_engine_custom_prompts_updated_at
  on public.prompt_engine_custom_prompts;

create trigger trg_prompt_engine_custom_prompts_updated_at
before update on public.prompt_engine_custom_prompts
for each row
execute function public.set_prompt_engine_custom_prompts_updated_at();

alter table public.prompt_engine_custom_prompts enable row level security;

drop policy if exists prompt_engine_custom_prompts_public_select
  on public.prompt_engine_custom_prompts;
create policy prompt_engine_custom_prompts_public_select
  on public.prompt_engine_custom_prompts
  for select
  using (true);

drop policy if exists prompt_engine_custom_prompts_public_insert
  on public.prompt_engine_custom_prompts;
create policy prompt_engine_custom_prompts_public_insert
  on public.prompt_engine_custom_prompts
  for insert
  with check (true);

drop policy if exists prompt_engine_custom_prompts_public_update
  on public.prompt_engine_custom_prompts;
create policy prompt_engine_custom_prompts_public_update
  on public.prompt_engine_custom_prompts
  for update
  using (true)
  with check (true);

grant select, insert, update on public.prompt_engine_custom_prompts to anon;
grant select, insert, update on public.prompt_engine_custom_prompts to authenticated;

do $$
begin
  if exists (
    select 1
    from pg_publication
    where pubname = 'supabase_realtime'
  ) and not exists (
    select 1
    from pg_publication_rel pr
    join pg_class c on c.oid = pr.prrelid
    join pg_namespace n on n.oid = c.relnamespace
    join pg_publication p on p.oid = pr.prpubid
    where p.pubname = 'supabase_realtime'
      and n.nspname = 'public'
      and c.relname = 'prompt_engine_custom_prompts'
  ) then
    execute 'alter publication supabase_realtime add table public.prompt_engine_custom_prompts';
  end if;
end
$$;
