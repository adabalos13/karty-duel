-- Karty Duel — základní schéma
-- Bez autentizace: kdokoliv se zná room_code, může do místnosti číst/zapisovat.
-- To je záměr (hra pro dva známé lidi), ne bezpečnostní díra k řešení navíc.

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  game_type text not null check (game_type in ('prsi', 'uno')),
  status text not null default 'waiting' check (status in ('waiting', 'playing', 'finished')),
  created_at timestamptz default now()
);

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  name text not null,
  joined_at timestamptz default now()
);

create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz default now()
);

-- Row Level Security
alter table rooms enable row level security;
alter table players enable row level security;
alter table games enable row level security;

-- Veřejný přístup přes anon key (žádná autentizace v appce) — room_code funguje
-- jako sdílené heslo do místnosti.
create policy "anon full access rooms" on rooms
  for all using (true) with check (true);

create policy "anon full access players" on players
  for all using (true) with check (true);

create policy "anon full access games" on games
  for all using (true) with check (true);

-- Realtime — potřeba pro live sync mezi hráči
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table players;
alter publication supabase_realtime add table games;
