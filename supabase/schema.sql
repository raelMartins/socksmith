-- Full reference schema (Dashboard SQL or align with migrations in order).

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  instagram_handle text,
  phone text,
  note text,
  shoe_size text,
  drop_focus text,
  hear_about_us text,
  sock_interests text[] not null default '{}',
  status text not null default 'waiting',
  created_at timestamptz not null default now(),
  constraint waitlist_signups_email_unique unique (email)
);

alter table public.waitlist_signups enable row level security;

drop policy if exists "waitlist insert for anon" on public.waitlist_signups;

create policy "waitlist insert for anon"
  on public.waitlist_signups
  for insert
  to anon
  with check (status = 'waiting');
