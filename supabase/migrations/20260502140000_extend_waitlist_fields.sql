-- Extra waitlist fields + pipeline status. Re-run safe on empty DBs.

alter table public.waitlist_signups
  add column if not exists phone text,
  add column if not exists note text,
  add column if not exists hear_about_us text,
  add column if not exists sock_interests text[] not null default '{}',
  add column if not exists status text not null default 'waiting';

update public.waitlist_signups
set status = 'waiting'
where status is null or trim(status) = '';

-- Tighten anon inserts: only new signups in "waiting" (defaults satisfy this).
drop policy if exists "waitlist insert for anon" on public.waitlist_signups;

create policy "waitlist insert for anon"
  on public.waitlist_signups
  for insert
  to anon
  with check (status = 'waiting');
