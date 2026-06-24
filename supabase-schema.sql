-- ════════════════════════════════════════════════════════════════
-- KMITL Bootcamp — Supabase schema
-- Run once: Supabase dashboard → SQL Editor → paste all → Run.
-- Then copy your Project URL + anon key into config.js.
--
-- NOTE: RLS is deliberately OPEN (anyone with the link can read/write).
-- This is a one-day classroom throwaway — fine. Delete the project after.
-- ════════════════════════════════════════════════════════════════

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  room text not null default 'default',
  team text,
  problem text,
  customer text,
  risk text,
  mvp_level text,
  metric text,
  pitch text,
  demo_url text,
  created_at timestamptz not null default now()
);

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  room text not null default 'default',
  submission_id uuid references submissions(id) on delete cascade,
  choice text not null check (choice in ('persevere','pivot')),
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists room_state (
  room text primary key,
  active_submission_id uuid,
  updated_at timestamptz not null default now()
);

-- Open access for the workshop --------------------------------------
alter table submissions enable row level security;
alter table votes       enable row level security;
alter table room_state  enable row level security;

create policy "open submissions" on submissions for all using (true) with check (true);
create policy "open votes"       on votes       for all using (true) with check (true);
create policy "open room_state"  on room_state  for all using (true) with check (true);
