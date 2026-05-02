-- Waitlist: typical size + what matters for first drop (sock-brand context).

alter table public.waitlist_signups
  add column if not exists shoe_size text,
  add column if not exists drop_focus text;
