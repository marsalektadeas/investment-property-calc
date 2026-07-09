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
| Exit — srovnání s ETF | Přeformulováno na reálné terminální zůstatky „na účtu" (viz níže) | Opportunity-cost salda byla správná pro rozdíl, ale jako absolutní čísla matoucí — nešlo z nich vyčíst „kolik budu mít na účtu" |

## Oprava výpočtu #1 (hotovo)

Srovnání „nemovitost vs. alternativní investice" počítalo kladný cashflow
dvakrát ve prospěch nemovitosti a používalo jinou metodu CAGR než alternativa.
Sjednoceno (`lib/alternative.ts`): alternativa = počáteční kapitál složeně
úročený; nemovitost = výtěžek z prodeje + cashflow reinvestovaný stejnou sazbou.
Přidáno pole `propertyFinalWealth` do `AlternativeResult`.

## Exit — srovnání „koupím vs. ETF" jako zůstatky na účtu (hotovo 2026-07-06)

Uživatel chtěl jednu věc: **kolik reálně budu mít na účtu**, když nemovitost
koupím a prodám, vs. když peníze dám do ETF. Dosavadní dlaždice „na účtu"
zobrazovaly opportunity-cost salda — jejich **rozdíl byl správný**, ale absolutní
čísla nebyla skutečné zůstatky (nemovitost očištěná o oportunitní náklad
doplácení, alternativa jen počáteční kapitál bez reinvestice ušetřených doplatků).
Matoucí.

**Nová metodika (`lib/alternative.ts`)** — obě strany dostanou stejnou hotovost
ve stejný čas a počítají se jako reálné terminální zůstatky:

- **Koupím nemovitost** (`propertyFinalWealth`) = čistý výtěžek z prodeje +
  přebytkový (kladný) cashflow reinvestovaný alt. sazbou. Doplatky jsou utopené
  v nemovitosti → vrací se v prodejní ceně.
- **Dám do ETF** (`finalPortfolio`) = počáteční kapitál složeně úročený + každý
  doplatek (záporný cashflow), který by jinak šel do hypotéky, investovaný do ETF.

`advantage = propertyFinalWealth − finalPortfolio` je **matematicky totožný** se
starým opportunity-cost modelem → landing a ostatní výpočty beze změny. Ověřeno:
na příkladu rok 20 dává starý model 3,04M vs 3,58M (rozdíl −538 874), nový 7,76M
vs 8,30M (rozdíl −538 873, jen zaokrouhlení). Stejný závěr, reálná čísla.

Implementace:
- `lib/alternative.ts` přepsán (terminální zůstatky, `Math.max(0, ±cashflow)`).
- Nová komponenta `components/ui/InfoTooltip.tsx` (hover/tap, align left/right).
- `ExitSummary`: dlaždice „Koupím nemovitost" / „Dám do ETF" + podnadpis „Kolik
  budeš mít na účtu", tooltips, přepsaný `<details>` výklad. Info-tooltips i u
  řádků „Čistý zisk z prodeje" a „Kumulovaný cashflow".
- Každá dlaždice má **rozpad složek** (`BreakdownRow`): nemovitost = výtěžek
  z prodeje + reinvestovaný přebytek; ETF = počáteční kapitál zúročený +
  doplatky investované do ETF. Nová pole v `AlternativeResult`
  (`netSaleProfit`, `reinvestedSurplus`, `etfBaseGrowth`, `etfTopUpsInvested`).
  Pozn.: do ETF jde jen **doplatek** (záporný cashflow po nájmu), ne celá
  splátka — nájemce svůj díl už platí a jistina se vrací v prodejní ceně.
- Opraveno zobrazení: „Kumulovaný cashflow" ukazoval `+ -1 609 164` → nyní
  znaménkově korektní `− 1 609 164` (helper `signedCZK`).

**Pozn.:** zelený „Čistý zisk (nad vloženou investicí)" (`exit.totalReturn`) je
stále nominální zisk nad vloženou investicí — pro rozhodnutí koupit vs. ETF slouží
srovnání zůstatků, ne tento řádek (výklad na to upozorňuje).

## Exit — citlivost, splátka po fixaci, varování (hotovo 2026-07-06)

Navazuje na diskuzi o správnosti modelu. Tři vylepšení:

1. **Splátka po fixaci (vyřešeno TODO #4 na úrovni zobrazení).** `calcMortgage`
   nově vrací `monthlyPaymentAfterFixation` (re-amortizace zůstatku novou sazbou
   na zbytek doby; `null` když se sazba nemění nebo fixace kryje celý úvěr).
   Zobrazeno v `SummaryCards` (sub „po fixaci …") a `MortgageInputs` (amber
   řádek). Jádro výpočtu (cashflow/exit) už fixaci řešilo přes
   `buildAmortizationTable` — tohle opravuje jen zavádějící headline číslo.
2. **Citlivostní tabulka** (`lib/sensitivity.ts` → `SensitivityResult` v
   `CalculationResult`, `SensitivityTable` v `ExitSummary`). Mřížka 3×3: zhodnocení
   nemovitosti (±2 pb) × alternativní sazba (±2 pb), buňka = `advantage`. Střední
   buňka = aktuální odhad (odpovídá `alternative.advantage`). Ukazuje křehkost
   výsledku — „nedívej se na jedno číslo".
3. **Varování nájem < inflace** — amber banner v `ExitSummary`, když
   `rental.annualRentGrowth < macro.inflation` (stlačování marže v čase).

## Horizont přehledu oddělený od roku prodeje (hotovo 2026-07-09)

Uživatel chtěl vidět, **kolik nemovitost vynáší po splacené hypotéce** (čistý nájem
bez splátky) — natáhnout přehled cashflow klidně na 50 let. Dosud `holdingYears`
řídil zároveň (1) délku tabulky i (2) rok prodeje, a jeho max byl 30 = splatnost
hypotéky → roky bez hypotéky se nikdy nevykreslily.

**Jádro už čistý nájem po splacení počítalo správně** — po `termYears × 12`
měsících nejsou v amortizaci žádné řádky, takže `buildProjections` dává pro rok
31+ splátku 0, úrok 0, zůstatek 0 → cashflow = NOI (po dani). Ověřeno: 30letá
hypotéka, rok 30 zůstatek 0, rok 31+ splátka 0. Problém byl **jen zobrazovací**.

Řešení — nový vstup `exit.projectionYears` (délka přehledu, nezávislá na prodeji):
- `lib/projections.ts` — smyčka do `max(projectionYears, holdingYears)`.
- `ExitInputs` — nový posuvník „Horizont přehledu" (max 50, ruční zadání čísla
  přes textové pole SliderInput). „Doba držení" dostala hint „Rok prodeje".
- `store.setExit` — clamp `projectionYears ≥ holdingYears` (přehled nesmí končit
  před prodejem).
- **Korektnost:** `lib/alternative.ts` sčítalo přes všechny projekce → přidán
  `projections.slice(0, holdingYears)`. Roky po prodeji do scénáře „koupím vs.
  ETF" nepatří (jinak by FV počítalo doplatky/přebytky za rokem prodeje v nominále).
- `lib/metrics.ts` — payback scan omezen na `holdingYears` (zachování významu).
- `YearlyTable` — rok prodeje má badge „prodej", roky bez hypotéky mají v buňce
  Hypotéka „—", jemný emerald tint a legendu „bez hypotéky".
- `calcExit` beze změny (indexuje `projections[holdingYears−1]`), `calcSensitivity`
  pokryto opravou v `alternative.ts`. Grafy a PDF export se protáhnou automaticky.

Default `projectionYears = 30` (celý životní cyklus hypotéky; pro roky bez
hypotéky přetáhni na 31+).

## Otevřené TODO (doladíme příště)

### Výpočty (z analýzy, zbývající)
- **#2** `taxableIncome` v měsíčním cashflow ignoruje daňový režim a úrok
  (`lib/cashflow.ts`) — kosmetické, pole se zdá nepoužité v UI.
- **#4** ~~headline splátka ignoruje sazbu po fixaci~~ → zobrazení opraveno
  (splátka po fixaci). Zbývá: `totalInterest`/`totalPaid` v `calcMortgage` stále
  dvoufázově nepočítá — podhodnocený celkový úrok (kosmetika, není v jádru).
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
