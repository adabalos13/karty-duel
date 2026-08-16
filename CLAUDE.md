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
- 7 = líznutí 2, stackovatelné
- Eso = stop / u 2 hráčů = hraj znovu
- Svršek (Q) = mění barvu
- Spodek (J) = žádný efekt
Kompletní pravidla viz `PRD.md`.

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
