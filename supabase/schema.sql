-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  instagram_handle text,
  created_at timestamptz not null default now(),
  constraint waitlist_signups_email_unique unique (email)
);

alter table public.waitlist_signups enable row level security;

-- Public landing page can insert rows using the anon key.
create policy "waitlist insert for anon"
  on public.waitlist_signups
  for insert
  to anon
  with check (true);

-- No public read access; admin reads go through the service role on your server.
