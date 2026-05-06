-- Per-influencer tracked share links + click logging.
-- Built 2026-05-06 so Ak can hand a unique URL to each influencer / promoter
-- and measure exactly who drives conversions. Slugs are NOT pre-registered —
-- the /go/:slug endpoint accepts anything and stamps ?ref=<slug> on the
-- redirect, so a click shows up in this table the moment someone follows
-- the link. Optional `referral_links` row lets us override the destination
-- per slug (e.g. /go/gospel routes to a curated category instead of home).

create table if not exists public.referral_clicks (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  destination text not null,
  user_agent text,
  referrer text,
  ip_hash text,            -- truncated/hashed; we don't store raw IPs
  country text,
  region text,
  city text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  clicked_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_referral_clicks_slug
  on public.referral_clicks (slug, clicked_at desc);

create index if not exists idx_referral_clicks_clicked_at
  on public.referral_clicks (clicked_at desc);

-- Optional override table — only insert a row if you want a slug to
-- redirect somewhere other than the homepage with ?ref=<slug>. Most slugs
-- will work fine without ever appearing in this table.
create table if not exists public.referral_links (
  slug text primary key,
  destination_path text not null default '/',  -- e.g. '/shop/mothers-day'
  utm_source text,
  utm_medium text default 'referral',
  utm_campaign text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_referral_links_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_referral_links_updated_at on public.referral_links;
create trigger trg_referral_links_updated_at
before update on public.referral_links
for each row execute function public.set_referral_links_updated_at();

-- Service role only — anon/auth never touch these directly. The /go/
-- endpoint uses the service-role key from Vercel env to write clicks
-- and read overrides server-side.
alter table public.referral_clicks enable row level security;
alter table public.referral_links  enable row level security;
