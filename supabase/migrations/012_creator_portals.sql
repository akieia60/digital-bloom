-- Creator portal system — Ak's content-creator partnerships.
-- Built 2026-05-06 night for first creator (Breana). Each creator gets:
--   1. A row in `creators` with their slug, name, contact, optional notes
--   2. A list of video assignments — what Ak has pushed for them to post
-- The /c/:slug page on digitalbloom.store renders their video grid; the
-- /admin/creators page lets Ak push more videos to their queue. Click
-- analytics on each creator's tracked URL come from the existing
-- referral_clicks table (slug matches creator.slug).

create table if not exists public.creators (
  slug text primary key,
  display_name text not null,
  contact_phone text,
  contact_email text,
  notes text,
  is_active boolean not null default true,
  -- Optional password if Ak wants to gate the portal; null means open.
  -- Stored as a SHA-256 hash so plaintext is never persisted.
  access_password_hash text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_creators_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_creators_updated_at on public.creators;
create trigger trg_creators_updated_at
before update on public.creators
for each row execute function public.set_creators_updated_at();

create table if not exists public.creator_video_assignments (
  id uuid primary key default gen_random_uuid(),
  creator_slug text not null references public.creators(slug) on delete cascade,
  -- Public URL the creator downloads from (Vercel Blob).
  video_url text not null,
  -- Optional thumbnail / poster image URL.
  thumbnail_url text,
  title text not null,
  category text,
  -- Folder bucket for organizing the portal grid (commercials / flyers /
  -- mothers-day / fathers-day / etc).
  bucket text not null default 'misc',
  blob_path text,
  size_bytes bigint,
  duration_seconds numeric,
  suggested_caption text,
  position integer not null default 0,
  is_active boolean not null default true,
  assigned_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_creator_video_assignments_creator
  on public.creator_video_assignments (creator_slug, assigned_at desc);

create index if not exists idx_creator_video_assignments_active
  on public.creator_video_assignments (creator_slug, is_active, position);

-- RLS — service role writes; anon can read assignments for any active
-- creator if they know the slug. The slug is the access token.
alter table public.creators enable row level security;
alter table public.creator_video_assignments enable row level security;

drop policy if exists creators_public_select on public.creators;
create policy creators_public_select on public.creators
  for select using (is_active = true);

drop policy if exists creator_video_assignments_public_select
  on public.creator_video_assignments;
create policy creator_video_assignments_public_select
  on public.creator_video_assignments
  for select using (is_active = true);

grant select on public.creators to anon, authenticated;
grant select on public.creator_video_assignments to anon, authenticated;
