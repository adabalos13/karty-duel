# Tech Stack - Karty Duel

## Frontend
- **Next.js 16** (App Router) - React framework
- **TypeScript** - typová bezpečnost
- **Tailwind CSS v4** - styling, mobile-first
- **shadcn/ui** - UI komponenty (button, card, dialog, input, label, badge)
- **lucide-react** - ikony

## Backend & Databáze
- **Supabase** (PostgreSQL + Realtime) - jediný backend, žádný vlastní server
  - Herní stav se ukládá jako `jsonb` sloupec, synchronizace mezi hráči přes Realtime subscriptions
  - Bez autentizace — hráč = jméno v localStorage, identita v místnosti = náhodné `player_id` (uuid) uložené lokálně

## Hosting
- **Vercel** - deployment z GitHubu, automatický deploy na push do `main`

## Struktura projektu
```
karty-duel/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # úvodní stránka — vytvořit/připojit místnost
│   │   ├── hra/[roomCode]/page.tsx  # lobby + samotná hra v místnosti
│   │   └── api/                     # (pokud bude potřeba server-side logika)
│   ├── components/
│   │   ├── ui/                      # shadcn komponenty
│   │   ├── lobby/                   # komponenty pro čekárnu
│   │   └── game/                    # herní UI (karty, ruka, lícovka)
│   ├── lib/
│   │   ├── supabase/                # klient, typy
│   │   ├── game-engine/             # obecná herní logika (balíček, tahy, výhra)
│   │   │   └── rules/
│   │   │       ├── prsi.ts
│   │   │       └── uno.ts
│   │   └── utils.ts
│   └── types/
├── supabase/
│   └── schema.sql
├── public/cards/                    # grafika karet (viz níže)
├── scripts/process-card-art.py      # zpracování AI-generované grafiky do public/cards/
└── ...
```

## Grafika karet
Ikony barev (`suit-{zaludy,zelene,cervene,kule}.png`) a ilustrace figur
(`face-{barva}-{J,Q,K,A}.png`, J=Spodek, Q=Svršek, K=Král, A=Eso) jsou
AI-generované (ChatGPT), ořezané a zprůhledněné skriptem
`scripts/process-card-art.py`. Číselné karty (7–10) používají suit ikonu +
text, karty J/Q/K/A zobrazují celou ilustraci. Chceš-li grafiku vyměnit,
vygeneruj nový zdrojový obrázek ve stejném rozvržení (řada = barva, sloupec
= Spodek/Svršek/Král/Eso) a uprav cesty ve skriptu.

## Databázové schéma
```sql
create table rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  game_type text not null check (game_type in ('prsi', 'uno')),
  status text not null default 'waiting' check (status in ('waiting', 'playing', 'finished')),
  created_at timestamptz default now()
);

create table players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  name text not null,
  joined_at timestamptz default now()
);

create table games (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz default now()
);
```

RLS zapnuté na všech tabulkách, veřejný anon přístup (žádná autentizace) omezený jen na operace potřebné pro hru — upřesní se při psaní `schema.sql`.

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Poznámky
- Supabase CLI (pokud nainstalováno) pro `supabase db push` místo ručního vkládání SQL do dashboardu.
- Real-time kanál: rozhodnuto ve Fázi 1 mezi `postgres_changes` (jednodušší, trochu vyšší latence) a `Broadcast` (nižší latence, o něco víc kódu) podle reálně naměřené odezvy.
