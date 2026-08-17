# RentScope — rozhodnutí a stav projektu

> Poslední aktualizace: 2026-08-17. Slouží jako handoff mezi sezeními — co je
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

## Volič „Po inflaci" rozšířen na Exit blok + reálný CAGR (hotovo 2026-07-14, PR #1)

**Problém:** Uživatel testoval volič „Po inflaci" (`showInflationAdjusted`) a „nic
se nedělo s čísly". Zjištění: volič ovlivňoval **jen** graf cashflow
(`CashflowChart`) a roční tabulku (`YearlyTable`). Headline karta „Měsíční
cashflow" je snapshot **roku 0** (reálná = nominální z definice → nikdy se
nemění), a hlavně celý **Exit blok** (prodejní cena, čistý zisk, ROI, CAGR, ETF
srovnání) byl **čistě nominální** — výnos se s inflací neměnil, i když by měl.

**Řešení:**
- **Exit blok reaguje na volič.** Terminální hodnoty roku N (cena, zůstatek,
  náklady, daň, čistý zisk z prodeje, ETF zůstatky, citlivostní buňky) se
  diskontují na dnešní kupní sílu `/(1+inflace)^N` přímo v `ExitSummary`
  (`today()` helper + `divisor` u `SensitivityTable`).
- **Cashflow-závislé metriky mají vlastní reálné varianty v `lib/exit.ts`**
  (`realTotalCashflow` = `cumulativeRealNetCashflow` — per-year diskont, ne
  blanket; `realTotalReturn` / `realTotalROI` / `realAnnualizedROI`). Reálný CAGR
  ≈ nominální − inflace. `initialInvestment` (rok 0) se nediskontuje.
- **Diskontace obou stran ETF srovnání stejným faktorem nemění, kdo vyhrává** —
  jen velikost v dnešní hodnotě. Barvy/sign se nepřevrací.
- **UI signály:** `· dnešní ceny` v titulu Exit karty a v ETF srovnání, ROI/CAGR
  přeznačené `· reálné`. Headline „Měsíční cashflow" dostal jen `· dnešní ceny`
  popisek (hodnota se nemění — rok 0).
- Výnosnostní metriky (Cap Rate, CoC, DSCR, hrubá výnosnost) zůstávají nominální
  **záměrně** — jsou to poměry roku 1, inflace se jich netýká.

Nová pole v `ExitResult`: `realTotalCashflow`, `realTotalReturn`, `realTotalROI`,
`realAnnualizedROI`. Při ukládání do BuyFlat backendu se persistuje nominální
payload — volič je jen view preference. Mimochodem opraven i pre-existing
unescaped-quote lint error v `ExitSummary`.

## Zadání úvěru + opravy hypotéky (hotovo 2026-08-17)

**Problém:** Uživatel měl nabídku z banky (5 mil., 5 %, ~30 tis./měs.) a v appce
se na tu splátku nedostal — vyhodnotil to jako chybu ve výpočtu. Anuita byla
přitom správná (ověřeno proti uzavřenému vzorci: zůstatek po fixaci sedí
s amortizační tabulkou na haléř, konečný zůstatek přesně 0).

**Skutečná příčina — vstup, ne výpočet.** Appka nemá pole „výše úvěru", jistina
se odvozuje jako `purchasePrice − equity`. „5 mil." zadaných do *Ceny nemovitosti*
znamenalo s výchozí akontací 900 tis. úvěr jen 4,1 mil. Rozpad rozdílu:

| krok | splátka | vliv |
|---|---|---|
| banka: 5 000 000, 5 %, ~24 let | 29 845 Kč | — |
| appka má 30 let místo 24 | 26 841 Kč | −3 004 Kč |
| „5 mil" bere jako cenu → úvěr 4,1 mil | 22 010 Kč | **−4 831 Kč (66 %)** |
| výchozí sazba 5,2 % místo 5,0 % | 22 514 Kč | +504 Kč |

**Řešení:**
- **Přepínač „Zadám akontaci / Zadám výši úvěru"** v `PropertyInputs`. Lokální
  `useState`, **ne** součást `InputParams` — je to způsob zadání, ne vstup
  výpočtu, do `lib/` se nepropisuje nic. Cena nemovitosti zůstává samostatná
  v obou režimech (je základ pro cap rate, odpisy i exit). Režim „úvěr" zapisuje
  přes stávající `setProperty({ equity: purchasePrice − v })` — žádný nový setter,
  žádný druhý zdroj pravdy. Výchozí režim zůstává *akontace* (nemenit default view).
- **Clamp akontace** na `<0; purchasePrice>` v `setProperty`. Předtím šlo snížit
  cenu pod akontaci a dostat **záporný úvěr** a LTV −80 %.
- **Výše úvěru je vidět v obou režimech** (hint u slideru + řádek v panelu
  Hypotéka). Dřív jen jako podtitulek LTV karty ve výsledcích, daleko od splátky.
- **#4 dokončeno** — `totalInterest`/`totalPaid` z amortizační tabulky.
- **Sazba u „Splátky po fixaci"** — nové pole `effectiveRateAfterFixation`
  v `MortgageResult`. Scénář `rateAfterFixation` posouvá (konzervativní +1 p.b.),
  takže částka dřív nesouhlasila se sliderem přímo nad ní.

**Vědomě neřešeno:** pojištění (banka ho často do splátky započítá, appka počítá
čistou anuitu a pojištění drží v provozních nákladech) · LTV > 100 % (hypotéka
zahrnující rekonstrukci) · clamp akontace se provede tiše, bez hlášky.

## Otevřené TODO (doladíme příště)

### Výpočty (z analýzy, zbývající)
- **#2** `taxableIncome` v měsíčním cashflow ignoruje daňový režim a úrok
  (`lib/cashflow.ts`) — kosmetické, pole se zdá nepoužité v UI.
- **#4** ~~headline splátka ignoruje sazbu po fixaci~~ → vyřešeno celé.
  `totalInterest`/`totalPaid` v `calcMortgage` se počítají sumou z amortizační
  tabulky místo `splátka × počet měsíců` (na 4 mil. / 5,2 % → 4,5 % šlo
  o nadhodnocení úroku o 447 tis. Kč). Panel Hypotéka navíc píše u splátky po
  fixaci sazbu, ze které se počítá — scénář ji posouvá (konzervativní +1 p.b.),
  takže dřív nesouhlasila se sliderem nad ní.
- **#5** `otherIncome` je HORŠÍ, než tu stálo (ověřeno 2026-08-17): nejen že se
  krátí neobsazeností — do `buildProjections` **nevstupuje vůbec**, používá se
  jen v `lib/cashflow.ts:58`. Při parkování 2 000 Kč/měs ukáže headline karta
  −6 055 Kč, ale graf a tabulka pro tentýž rok −7 755 Kč; za 10 let chybí
  v exitu a ETF srovnání ~228 tis. Kč. Latentní jen proto, že default je 0.
- **#8** Odpisy se počítají v projekcích, ale `calcMonthlyCashflow` volá
  `calcTax` bez nich → headline karta zdaňuje rok 1 jinak než tabulka.
  U výchozích hodnot schované (daň = 0), při LTV 22 % / nájmu 22 000 rozdíl
  629 Kč/měs. Společná příčina s #5: **rok 1 se počítá dvěma nezávislými
  cestami.** Opravit najednou — nechat headline kartu číst `projections[0]`,
  jinak se stejná divergence vrátí u dalšího pole.
- **#9** DSCR a break-even obsazenost (`lib/metrics.ts:34,43`) znají jen splátku
  před fixací. U konzervativního scénáře splátka po fixaci vyskočí o ~10 %,
  což DSCR nevidí. Produktové rozhodnutí: označit jako „rok 1", nebo přidat
  druhou hodnotu.
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
