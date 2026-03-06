create table if not exists public.competitions (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

alter table public.competitions enable row level security;

drop policy if exists "competitions_read_all" on public.competitions;
create policy "competitions_read_all"
on public.competitions
for select
to anon, authenticated
using (true);
