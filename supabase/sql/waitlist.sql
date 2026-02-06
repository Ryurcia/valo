-- Waitlist table for Valo
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.waitlist enable row level security;

-- Allow inserts from the anon key (public signups)
create policy "Allow public inserts" on public.waitlist
  for insert
  with check (true);

-- Only allow service_role to read/update/delete
create policy "Service role full access" on public.waitlist
  for all
  using (auth.role() = 'service_role');
