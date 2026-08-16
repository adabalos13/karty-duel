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
- [ ] Ověřit real-time i na reálném druhém zařízení (ne jen dva taby) — vyzkoušet s Kátou před Fází 2

## Fáze 2: Herní engine + Prší
- [ ] Obecný engine: balíček, míchání, rozdání, střídání tahů, detekce konce
- [ ] Pravidla Prší (7, eso, svršek, spodek — viz PRD.md)
- [ ] Herní UI: ruka, lícovka, tah karty, výběr barvy u svršku
- [ ] Synchronizace tahů přes Supabase Realtime
- [ ] Zobrazení vítěze + "Hrát znovu"

## Fáze 3: Uno
- [ ] Pravidla Uno na stejném enginu
- [ ] Herní UI pro Uno (barvy, speciální karty)
- [ ] Výběr hry v lobby (Prší / Uno) funguje pro obě

## Fáze 4: Polish
- [ ] Animace tahů
- [ ] Reconnect po výpadku spojení
- [ ] Doladění mobilního UI (menší detaily, ne základní responsivita — ta je hotová od Fáze 1)

## Fáze 5: Deploy
- [ ] Vercel deploy + env vars
- [ ] Reálná partie Adam vs. Káťa přes internet

## Bugs a technický dluh
(sem přidávej bugy jak je najdeš)
