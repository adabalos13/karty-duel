# PRD - Karty Duel

## Vize
Jednoduchá webová appka, kde Adam a Káťa hrají proti sobě online karetní hry (Prší, Uno) — z počítače i mobilu, kdykoliv, bez instalace čehokoliv.

## Cílová skupina
Dva hráči kdokoliv (vzniklo pro Adama a Káťu, ale appka není na ně natvrdo navázaná — žádné přednastavené jméno). Žádné publikum, žádné účty třetích stran, jen sdílený odkaz/kód místnosti.

## Klíčové funkce

### 1. Lobby / místnost
- Vytvoření místnosti: zadání jména, vygenerování krátkého `room_code` a odkazu ke sdílení. Výběr hry (Prší/Uno) je v UI dočasně schovaný — appka zatím vždy zakládá Prší, dokud nezačneme pracovat na Unu (viz Fáze 3)
- `room_code` má formát souhláska-samohláska-souhláska-samohláska (např. `hoka`, `kico`) — snadno se nahlas nadiktuje druhému hráči, i když každý hraje na svém mobilu vedle sebe
- Připojení do místnosti: zadání jména + kódu (nebo přímo přes odkaz). Jméno se NIKDY nepředvyplňuje (appku hraje kdokoliv, ne natvrdo Adam/Káťa)
- Zobrazení, kdo je v místnosti připojený (real-time, bez refreshe)
- Host spustí hru tlačítkem "Začít hru"
- Trvalý odkaz "Opustit hru" zpět na úvod — nemaže hráče z místnosti, lze se vrátit stejným odkazem

### 2. Herní engine (sdílený pro obě hry)
- Balíček karet, míchání, rozdání
- Střídání tahů mezi dvěma hráči
- Detekce konce hry (kdo se zbaví karet první)
- Synchronizace stavu hry mezi oběma hráči v reálném čase (Supabase Realtime)

### 3. Prší
32 karet, **4 české barvy: Žaludy 🌰, Zelené 🍃 (listy), Červené ♥ (srdce), Kule 🔔** — ne francouzský žolíkový balíček. Hodnoty 7, 8, 9, 10, Spodek, Svršek, Král, Eso.

**Cíl:** zbavit se všech karet jako první.

**Pravidlo tahu:** karta na ruce musí sedět barvou NEBO hodnotou na vrchní kartu lícovky.

**Speciální karty (house rules — potvrzeno s Adamem):**
| Karta | Efekt |
|---|---|
| **7** | Další hráč lízne 2 karty z balíčku. Dá se stackovat — pokud má i druhý hráč 7, může ji přihodit a poslat "dluh" zpět místo lízání. |
| **Eso** | Zastavovací karta — druhý hráč ztrácí tah, POKUD ho nepřebije vlastním esem (volitelné, není to povinnost — i s esem v ruce může hráč přeskočení přijmout). Esa se dají přebíjet opakovaně, dokud někomu nedojdou. |
| **Svršek** | Mění barvu — hráč, co ho zahrál, řekne, jaká barva se hraje dál. |
| **Spodek** | Žádný speciální efekt, hraje se jako normální karta (musí sednout barvou/hodnotou). |

**Líznutí je vždy dobrovolné** — i když máš hratelnou kartu, můžeš se rozhodnout radši líznout (např. abys nemusel zahrát nevýhodnou kartu). Líznutí (ať povinné, nebo dobrovolné) **vždy rovnou končí tvůj tah** — i kdyby byla tažená karta hratelná, nezahraješ ji hned, tah automaticky přechází na soupeře.

**Vzhled karet 7-10:** karta zobrazuje skutečný počet ikon barvy (pipsy, jako na klasickém balíčku), ne jen jednu ikonu + číslo. Sudé počty (VIII, X) ve dvou rovnoměrných sloupcích, liché (VII, IX) jako N-1-N se středovým pipsem (např. VII = 3-1-3). Číslo v rohu je psané římskými číslicemi (VII, VIII, IX, X) pro rychlou orientaci.

**Zvýrazňování karet — záměrně NE:** appka nezešedivuje karty, které teď nejdou zahrát — všechny karty v ruce vypadají stejně, hráč musí sám poznat, jestli karta sedí (jako u fyzického balíčku). Klik na nehratelnou kartu nic nezmění, jen se na chvíli zobrazí hláška "Tuhle kartu teď nemůžeš zahrát." Když není tvůj tah, celá ruka je ztlumená (to je jen stavová informace, ne nápověda k pravidlům).

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
- Žádná autentizace — v localStorage se ukládá jen `player_id` per místnost (pro znovupřipojení po refreshi), jméno hráče se NEPAMATUJE mezi návštěvami

## Fáze
1. Setup + lobby s realtime spojením
2. Herní engine + Prší
3. Uno na stejném enginu
4. Polish (animace, "hrát znovu", reconnect)
5. Deploy na Vercel + reálný test mezi Adamem a Káťou
