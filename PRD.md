# PRD - Karty Duel

## Vize
Jednoduchá webová appka, kde Adam a Káťa hrají proti sobě online karetní hry (Prší, Uno) — z počítače i mobilu, kdykoliv, bez instalace čehokoliv.

## Cílová skupina
Dva hráči — Adam a Káťa. Žádné publikum, žádné účty třetích stran, jen sdílený odkaz na místnost.

## Klíčové funkce

### 1. Lobby / místnost
- Vytvoření místnosti: zadání jména, výběr hry (Prší / Uno), vygenerování krátkého `room_code` a odkazu ke sdílení
- Připojení do místnosti: zadání jména + kódu (nebo přímo přes odkaz)
- Zobrazení, kdo je v místnosti připojený (real-time, bez refreshe)
- Host spustí hru tlačítkem "Začít hru"

### 2. Herní engine (sdílený pro obě hry)
- Balíček karet, míchání, rozdání
- Střídání tahů mezi dvěma hráči
- Detekce konce hry (kdo se zbaví karet první)
- Synchronizace stavu hry mezi oběma hráči v reálném čase (Supabase Realtime)

### 3. Prší
32 karet, 4 barvy (srdce, káry, kříže, piky), hodnoty 7, 8, 9, 10, J, Q, K, A.

**Cíl:** zbavit se všech karet jako první.

**Pravidlo tahu:** karta na ruce musí sedět barvou NEBO hodnotou na vrchní kartu lícovky.

**Speciální karty (house rules — potvrzeno s Adamem):**
| Karta | Efekt |
|---|---|
| **7** | Další hráč lízne 2 karty z balíčku. Dá se stackovat — pokud má i druhý hráč 7, může ji přihodit a poslat "dluh" zpět místo lízání. |
| **Eso (A)** | Druhý hráč má stop (u 2 hráčů to znamená: hráč, co eso zahrál, hraje hned znovu). |
| **Svršek (Q)** | Mění barvu — hráč, co ho zahrál, řekne, jaká barva se hraje dál. |
| **Spodek (J)** | Žádný speciální efekt, hraje se jako normální karta (musí sednout barvou/hodnotou). |

**Nemůžeš hrát?** Lízneš 1 kartu z balíčku. Pokud je hratelná, můžeš ji hned zahrát (upřesní se v Fázi 2, defaultně ano — konzistentní s většinou domácích pravidel).

### 4. Uno
Standardní pravidla (108 karet, barvy červená/žlutá/zelená/modrá 0-9, Skip, Reverse, Draw Two, Wild, Wild Draw Four). Case bez speciálních house rules — pokud Adam a Káťa chtějí odchylku, upřesní se před Fází 3.

### 5. Konec hry / restart
- Zobrazení vítěze
- Tlačítko "Hrát znovu" — nová hra ve stejné místnosti (stejná nebo jiná hra)

## User Stories
| ID | Jako | Chci | Abych |
|----|------|------|-------|
| US-01 | Hráč | vytvořit místnost a vybrat hru | mohl pozvat druhého hráče |
| US-02 | Hráč | se připojit přes odkaz/kód | mohl hned hrát bez registrace |
| US-03 | Hráč | vidět v reálném čase tahy soupeře | hra působila plynule, ne jako obnovování stránky |
| US-04 | Hráč | hrát na mobilu i počítači | mohl hrát odkudkoliv |
| US-05 | Hráč | vidět kdo vyhrál a dát si odvetu | mohl hrát víc kol za sebou |

## Požadavky na UI/UX
- **Responsivní od základu** — plně funkční na mobilním prohlížeči i desktopu (typicky jeden hráč na mobilu, druhý na PC)
- Jazyk UI: čeština
- Vzhled: jednoduchý a čistý (neutrální shadcn styl, světlý/tmavý režim dle systému), čitelné karty, minimum ozdob
- Žádná autentizace — jen jméno hráče uložené v localStorage

## Fáze
1. Setup + lobby s realtime spojením
2. Herní engine + Prší
3. Uno na stejném enginu
4. Polish (animace, "hrát znovu", reconnect)
5. Deploy na Vercel + reálný test mezi Adamem a Káťou
