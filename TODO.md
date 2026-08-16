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
- [x] Vlastní grafika karet (AI-generované ikony barev + ilustrace Spodek/Svršek/Král/Eso) — viz `public/cards/` a `scripts/process-card-art.py`
- [x] Úprava dle zpětné vazby: eso lze přebít druhým esem (volitelně), ověřeno proti pravidlům na karetnihry.blogspot.com
- [x] Úprava dle zpětné vazby: karty 7-10 zobrazují skutečné pipsy místo čísla + ikony
- [x] Modernější vzhled — nový font (Plus Jakarta Sans), teplá barevná paleta (bordó/zlatá), hezčí tlačítka
- [x] Úprava dle zpětné vazby: líznutí vždy dobrovolné, i s hratelnou kartou v ruce
- [x] Úprava dle zpětné vazby: římské číslice (VII-X) na kartách 7-10
- [x] Úprava dle zpětné vazby: výrazně zvětšené karty/pipsy pro mobil
- [x] Úprava dle zpětné vazby: bez přednastaveného jména (generický placeholder), aby appku mohl hrát kdokoliv
- [x] Úprava dle zpětné vazby: vyslovitelné kódy místností (souhláska-samohláska-souhláska-samohláska, `src/lib/room-code.ts`)
- [x] Úprava dle zpětné vazby: pipsy 3-1-3 pro lichá čísla (VII, IX), sudá zůstávají 2 sloupce
- [x] Úprava dle zpětné vazby: jméno se vůbec nepamatuje mezi návštěvami (odstraněno z `local-identity.ts`)
- [x] Úprava dle zpětné vazby: tlačítko "Opustit hru" — trvalý odkaz zpět na úvod v hlavičce místnosti
- [x] Úprava dle zpětné vazby: nehratelné karty se nezešedivují, jen krátká hláška po kliknutí
- [x] Uno dočasně schované v UI (jen Prší lze založit), dokud nezačneme na Unu pracovat
- [x] Oprava bugu: Svršek je žolík (jde na jakoukoli barvu/hodnotu), dřív musel sedět jako normální karta — ověřeno testem enginu

## Fáze 3: Uno
- [ ] Pravidla Uno na stejném enginu
- [ ] Herní UI pro Uno (barvy, speciální karty)
- [ ] Vrátit výběr hry v lobby (Prší / Uno) — teď schovaný v `page.tsx` (`GAME_TYPE` konstanta)

## Fáze 4: Polish
- [ ] Animace tahů
- [ ] Reconnect po výpadku spojení
- [ ] Doladění mobilního UI (menší detaily, ne základní responsivita — ta je hotová od Fáze 1)
- [ ] Průběžné skóre napříč koly ve stejné místnosti (přežije "Hrát znovu") — nutno domluvit: skóre zvlášť pro Prší/Uno, nebo dohromady? + tlačítko na reset

## Fáze 5: Finální deploy a test
- [ ] Reálná partie Adam vs. Káťa přes internet (po dokončení Fáze 2/3)

## Bugs a technický dluh
(sem přidávej bugy jak je najdeš)
