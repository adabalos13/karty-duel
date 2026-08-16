# CLAUDE.md - Pravidla pro AI asistenta

## POVINNÉ: Dokumentace PŘED každým commitem

Po každé změně kódu MUSÍŠ aktualizovat:
1. **TODO.md** - označ hotové [x], přidej nové úkoly
2. **TECHSTACK.md** - pokud měníš API, DB, nebo strukturu
3. **PRD.md** - pokud měníš/přidáváš funkce (hlavně pravidla her!)

### Proč je to kritické
- Kontext se ZTRATÍ (context window overflow)
- Dokumentace = jediná "paměť" projektu

## Před KAŽDOU prací přečti:
- CLAUDE.md, TODO.md, PRD.md, TECHSTACK.md

## Příkazy pro vývoj
- `npm run dev` - vývojový server
- `npm run build` - produkční build
- `npm run lint` - kontrola kódu

## Konvence kódu
- Komponenty: PascalCase (`GameCard.tsx`)
- Funkce: camelCase (`dealCards`)
- DB sloupce: snake_case (`room_id`)
- Jazyk UI: čeština
- Mobile-first: každá nová komponenta se navrhuje nejdřív pro mobilní šířku, pak se rozšiřuje breakpointy nahoru

## Pravidla Prší — NEMĚNIT bez potvrzení od Adama
- České karty: Žaludy, Zelené, Červené, Kule (NE francouzský žolíkový balíček srdce/káry/kříže/piky)
- 7 = líznutí 2, stackovatelné (max 8, dané počtem sedmiček v balíčku)
- Eso = zastavovací karta, soupeř ztrácí tah — může přebít vlastním esem, ale NENÍ to povinné (i s esem může přeskočení přijmout)
- Svršek = mění barvu
- Spodek = žádný efekt
- Líznutí je VŽDY dobrovolné, i s hratelnou kartou v ruce — tlačítko "Lízni" je na tahu vidět pořád, ne jen jako fallback
- Líznutí (povinné i dobrovolné) VŽDY rovnou ukončí tah — žádné "zahraj taženou kartu" ani tlačítko na ukončení tahu
- Karty 7-10 zobrazují skutečné pipsy (N ikon barvy, liché jako N-1-N se středovým pipsem) + římské číslice (VII, VIII, IX, X) v rohu, ne arabské číslo + jedna ikona
- Karty v ruce se NEZEŠEDIVUJÍ podle hratelnosti — všechny vypadají stejně dokud je tvůj tah, klik na nehratelnou jen ukáže hlášku (viz `PrsiGame.tsx` `invalidMessage`). Ztlumená je celá ruka jen když není tvůj tah.
Kompletní pravidla viz `PRD.md`. Zdroj: https://karetnihry.blogspot.com/2010/05/prsi-pravidla.html

## Jména hráčů a kódy místností — NEMĚNIT bez potvrzení od Adama
- Žádné přednastavené/zapamatované jméno (appka není natvrdo pro Adama a Káťu, hraje s ní kdokoliv) — `local-identity.ts` ukládá jen `player_id`, ne jméno
- `room_code` generovaný jako souhláska-samohláska-souhláska-samohláska (`src/lib/room-code.ts`), vždy malými písmeny — snadno vyslovitelné nahlas
- Volba hry (Prší/Uno) je v UI schovaná, appka zatím zakládá jen Prší — vrátit až se začne dělat Uno (Fáze 3)

## Workflow pro nové funkce
1. Přečti PRD.md - ověř, že funkce je v plánu
2. Zkontroluj TODO.md - najdi relevantní úkol
3. Prostuduj existující kód (hlavně `src/lib/game-engine/`)
4. Implementuj
5. Otestuj (`npm run build`, a pokud jde o herní logiku, ručně přehrát scénář ve dvou oknech prohlížeče)
6. Aktualizuj dokumentaci

## Struktura projektu
Viz `TECHSTACK.md` — aktualizuj tam, ne tady.

## Známé problémy a řešení
(zatím žádné — přidávej sem, jak narazíte na záludné bugy)
