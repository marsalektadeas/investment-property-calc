# RentScope — rozhodnutí a stav projektu

> Poslední aktualizace: 2026-07-06. Slouží jako handoff mezi sezeními — co je
> hotové, proč, a co zbývá doladit.

## Aktuální stav

- **Brand:** RentScope (deep blue + emerald), přejmenováno z „Anomia Real Estate".
  Bez loga, jen textový wordmark „Rent**Scope**".
- **Routing:**
  - `/` → prodejní **landing page** (lead magnet)
  - `/kalkulacka` → **kalkulačka** (původní `app/page.tsx`)
  - `middleware.ts` přepíše `/` → `/kalkulacka` při příchodu `?propertyId=…`,
    takže **BuyFlat embed funguje beze změny** (URL v adresním řádku zůstává `/`).
- **Lead capture:** zatím **jen CTA** do free kalkulačky, žádný sběr e-mailů.
- **Produkce:** https://realapp-gamma.vercel.app (Vercel auto-deploy z `main`).
  Pozn.: `realapp.vercel.app` patří jinému projektu.

## Klíčová rozhodnutí

| Téma | Rozhodnutí | Proč |
|---|---|---|
| Paleta | Deep blue `#1E3A8A` / accent `#2563EB`, dark `#0F172A`, zelená=pozitivní, červená=negativní | Fintech důvěryhodnost; tokeny v `app/globals.css` |
| LP routing | LP na `/`, kalkulačka na `/kalkulacka` + middleware rewrite | Akvizice přes LP, ale nerozbít BuyFlat embed |
| Lead capture | Jen CTA do toolu (MVP) | Nejjednodušší; e-mail gate doplníme později |
| Social proof | Vynecháno | Bez reálných dat nevymýšlet fake recenze (etický/právní risk) |
| Výpočet — alternativa | Opraveno: srovnání na jednom terminálním základě | Viz níže |
| Exit UX — vysvětlení | Přidány tooltips + rozbalovací výklad „proč se čísla liší" | Uživatelé pletli „čistý zisk z prodeje" (hotovost v den prodeje) s „nemovitostí na účtu" (terminální bohatství s časem peněz) |

## Oprava výpočtu #1 (hotovo)

Srovnání „nemovitost vs. alternativní investice" počítalo kladný cashflow
dvakrát ve prospěch nemovitosti a používalo jinou metodu CAGR než alternativa.
Sjednoceno (`lib/alternative.ts`): alternativa = počáteční kapitál složeně
úročený; nemovitost = výtěžek z prodeje + cashflow reinvestovaný stejnou sazbou.
Přidáno pole `propertyFinalWealth` do `AlternativeResult`.

## Exit UX — vysvětlení metrik (hotovo 2026-07-06)

Uživatel nechápal rozdíl mezi dvěma čísly v `ExitSummary` a chtěl ho vysvětlit
přímo v aplikaci. Rozdíl **není bug** — ověřeno výpočtem proti reálným číslům:

- **Čistý zisk z prodeje** (`exit.netSaleProfit`) = hotovost v ruce v den prodeje
  (cena − hypotéka − náklady − daň). Ignoruje průběžné doplácení.
- **Nemovitost — na účtu** (`alternative.propertyFinalWealth`) = výtěžek z prodeje
  + každý roční cashflow reinvestovaný alternativní sazbou (čas peněz). Při
  záporném cashflow tato část bohatství **snižuje** → bývá nižší než čistý zisk
  z prodeje. Právě tohle číslo je férově srovnatelné s alternativou.

Rozdíl obou = budoucí hodnota všeho, co majitel do nemovitosti během držení
doplatil (úročeno oportunitní sazbou).

**Poznámka k metodice:** zelený „Čistý zisk (nad vloženou investicí)"
(`exit.totalReturn`) používá **nominální** cashflow, kdežto „na účtu" ho **úročí**.
Není to nekonzistence — jsou to dvě různé otázky (celkový nominální zisk vs.
terminální bohatství pro férové srovnání). Nový výklad to uživateli pojmenovává.

Implementace:
- Nová komponenta `components/ui/InfoTooltip.tsx` (hover/tap, align left/right).
- Tooltips u 4 řádků v `ExitSummary` + rozbalovací `<details>` box s dynamicky
  dopočítaným rozdílem (funguje pro kladný i záporný cashflow).
- Opraveno zobrazení: „Kumulovaný cashflow" ukazoval `+ -1 609 164` → nyní
  znaménkově korektní `− 1 609 164` (helper `signedCZK`).

## Otevřené TODO (doladíme příště)

### Výpočty (z analýzy, zbývající)
- **#2** `taxableIncome` v měsíčním cashflow ignoruje daňový režim a úrok
  (`lib/cashflow.ts`) — kosmetické, pole se zdá nepoužité v UI.
- **#4** `totalInterest`/headline splátka v `calcMortgage` ignoruje sazbu po
  fixaci (`lib/mortgage.ts`) — podhodnocený celkový úrok.
- **#5** `otherIncome` (parkování) se krátí neobsazeností — typicky nemá.
- **#6** Daň z kapitálového zisku neodečítá rekonstrukci/náklady na pořízení.
- **#7** Odpisy 1,125 % p.a. — zjednodušení (skupina 5 reálně 1,4 % → 3,4 %).

### Produkt / konverze
- **E-mail gate na PDF export** = plnohodnotný lead magnet. Návrh: Supabase
  tabulka `leads` (RLS, jen insert přes server endpoint), e-mail výměnou za
  poslání PDF reportu. Nejlevnější vysokokonverzní krok.
- **Interpretační věta** nad výsledky („Tahle nemovitost vydělá o X víc než
  akcie" / „pozor, záporný cashflow") — snižuje tření, zvyšuje aha-moment.
- **Vlastní doména** místo `realapp-gamma.vercel.app`.
- **Vizuální QA**: projet LP na mobilu + PDF print kalkulačky v nové paletě.

## Známá úskalí

### Z-index / sticky layering (vyřešeno 2026-06-11)
Hlavička kalkulačky je `sticky top-0` a `YearlyTable` má přilepený levý sloupec
(`sticky left-0`). Oba měly `z-10` → při shodě z-indexu vyhrává pozdější prvek
v DOM, takže buňky se sloupcem *Rok* se při scrollu propisovaly přes hlavičku.

**Pravidlo:** hlavička musí mít vyšší z-index než přilepené buňky tabulky.
Aktuální vrstvení: hlavička `z-40` > tooltip metriky `z-20` > sticky buňky
tabulky `z-10`. Při přidávání dalších sticky/overlay prvků tohle pořadí držet.
