# TODO - Karty Duel

## Legenda
- [ ] K udělání
- [x] Hotovo
- [ ] 🔥 Priorita

## Fáze 1: Setup + lobby
- [x] Inicializace Next.js projektu (TypeScript, Tailwind v4, App Router)
- [x] Git init + GitHub repo (adabalos13/karty-duel, veřejné)
- [x] shadcn/ui init + základní komponenty (button, card, dialog, input, label, badge)
- [x] PRD.md, TECHSTACK.md, CLAUDE.md, TODO.md
- [x] Supabase projekt + `.env.local`
- [x] `supabase/schema.sql` (rooms, players, games) + aplikace schématu
- [x] Úvodní stránka: vytvořit místnost (jméno, výběr hry, room code)
- [x] Připojení do místnosti přes odkaz/kód
- [x] Real-time zobrazení "kdo je v místnosti" (bez refreshe) — ověřeno ve dvou tabech
- [x] Responzivní layout ověřen na mobilní šířce (375px)
- [x] `npm run build` a `npm run lint` prochází, commit
- [x] Vercel deploy (https://karty-duel-pied.vercel.app) + env vars — ověřeno, funguje v produkci
- [ ] Ověřit real-time i na reálném druhém zařízení (ne jen dva taby) — vyzkoušet s Kátou před Fází 2

## Fáze 2: Herní engine + Prší
- [x] Obecný engine: balíček, míchání, rozdání, střídání tahů, detekce konce (`src/lib/game-engine/`)
- [x] Pravidla Prší (7 stackovatelné, eso = extra tah, svršek = změna barvy, spodek bez efektu) — ověřeno testy i ručně ve dvou oknech
- [x] Herní UI: ruka, lícovka, tah karty, líznutí, výběr barvy u svršku (`src/components/game/PrsiGame.tsx`)
- [x] Synchronizace tahů přes Supabase Realtime — ověřeno živě mezi dvěma okny
- [x] Zobrazení vítěze + "Hrát znovu" (přegeneruje stav ve stejné místnosti)
- [x] Úprava dle zpětné vazby: líznutí vždy rovnou ukončí tah (odstraněno tlačítko "Ukončit tah")
- [x] Úprava dle zpětné vazby: české karty (žaludy/zelené/červené/kule) místo francouzských symbolů

## Fáze 3: Uno
- [ ] Pravidla Uno na stejném enginu
- [ ] Herní UI pro Uno (barvy, speciální karty)
- [ ] Výběr hry v lobby (Prší / Uno) funguje pro obě

## Fáze 4: Polish
- [ ] Animace tahů
- [ ] Reconnect po výpadku spojení
- [ ] Doladění mobilního UI (menší detaily, ne základní responsivita — ta je hotová od Fáze 1)

## Fáze 5: Finální deploy a test
- [ ] Reálná partie Adam vs. Káťa přes internet (po dokončení Fáze 2/3)

## Bugs a technický dluh
(sem přidávej bugy jak je najdeš)
