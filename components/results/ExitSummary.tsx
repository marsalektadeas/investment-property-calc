'use client'

import { useCalculatorStore } from '@/store/useCalculatorStore'
import { formatCZK, formatCZKShort, formatPercent } from '@/utils/format'
import { InfoTooltip } from '@/components/ui/InfoTooltip'
import type { SensitivityResult } from '@/types'

/** Znaménkově čitelný cashflow: „+ 120 000 Kč" / „− 120 000 Kč" */
function signedCZK(value: number): string {
  return `${value >= 0 ? '+ ' : '− '}${formatCZK(Math.abs(value))}`
}

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-2 text-xs">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-700 font-medium tabular-nums whitespace-nowrap">{value}</span>
    </div>
  )
}

/** „+1,2 mil. Kč" / „−204 tis. Kč" */
function signedShort(value: number): string {
  return `${value >= 0 ? '+' : '−'}${formatCZKShort(Math.abs(value))}`
}

/** Procenta kompaktně — bez zbytečných desetin (3 %, 2,5 %) */
function pct(value: number): string {
  const rounded = Math.round(value * 10) / 10
  return `${(Number.isInteger(rounded) ? rounded.toString() : rounded.toString().replace('.', ','))} %`
}

function SensitivityTable({ data, divisor }: { data: SensitivityResult; divisor: number }) {
  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="p-1.5 text-left font-normal text-gray-400 align-bottom">
              Zhodnocení&nbsp;↓ / ETF&nbsp;→
            </th>
            {data.altDeltas.map((d) => (
              <th key={d} className="p-1.5 text-right font-medium text-gray-500 whitespace-nowrap">
                {pct(data.baseAlt + d)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.growthDeltas.map((gd, i) => (
            <tr key={gd}>
              <th className="p-1.5 text-left font-medium text-gray-500 whitespace-nowrap">
                {pct(data.baseGrowth + gd)}
              </th>
              {data.altDeltas.map((ad, j) => {
                const v = data.matrix[i][j] / divisor
                const isBase = gd === 0 && ad === 0
                return (
                  <td
                    key={ad}
                    className={`p-1.5 text-right tabular-nums whitespace-nowrap rounded ${
                      v >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                    } ${isBase ? 'ring-2 ring-inset ring-[#2563EB] font-bold' : 'font-medium'}`}
                  >
                    {signedShort(v)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Row({
  label,
  value,
  highlight,
  tooltip,
}: {
  label: string
  value: string
  highlight?: 'positive' | 'negative' | 'neutral'
  tooltip?: string
}) {
  const valueClass =
    highlight === 'positive'
      ? 'text-green-600 font-semibold'
      : highlight === 'negative'
        ? 'text-red-500'
        : 'text-gray-900'

  return (
    <div className="flex justify-between items-center py-2 border-b border-[#F1F5F9] last:border-0">
      <span className="text-sm text-gray-500 flex items-center gap-1.5">
        {label}
        {tooltip && <InfoTooltip text={tooltip} align="left" />}
      </span>
      <span className={`text-sm ${valueClass}`}>{value}</span>
    </div>
  )
}

export function ExitSummary() {
  const { result, params } = useCalculatorStore()
  const { exit, alternative, sensitivity } = result
  const rentBelowInflation = params.rental.annualRentGrowth < params.macro.inflation

  // „Po inflaci": všechny terminální hodnoty (rok N) diskontuj na dnešní kupní sílu.
  // Kumulovaný cashflow a návratnosti mají vlastní reálné varianty z exit.ts (per-year diskont).
  const real = params.showInflationAdjusted
  const realFactor = Math.pow(1 + params.macro.inflation / 100, params.exit.holdingYears)
  const today = (v: number) => (real ? v / realFactor : v)

  const totalCashflow = real ? exit.realTotalCashflow : exit.totalCashflow
  const totalReturn = real ? exit.realTotalReturn : exit.totalReturn
  const totalROI = real ? exit.realTotalROI : exit.totalROI
  const annualizedROI = real ? exit.realAnnualizedROI : exit.annualizedROI

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="w-0.5 h-3.5 bg-[#2563EB] rounded-full flex-shrink-0" />
        Výpočet při prodeji — rok {params.exit.holdingYears}
        {real && <span className="text-[#2563EB] normal-case tracking-normal font-medium">· dnešní ceny</span>}
      </h3>

      <div className="space-y-0">
        <Row label="Odhadovaná cena nemovitosti" value={formatCZK(today(exit.projectedValue))} />
        <Row label="Zůstatek hypotéky" value={`− ${formatCZK(today(exit.remainingLoan))}`} />
        <Row label="Náklady na prodej" value={`− ${formatCZK(today(exit.sellingCosts))}`} />
        {exit.capitalGainsTax > 0 && (
          <Row label="Daň z prodeje" value={`− ${formatCZK(today(exit.capitalGainsTax))}`} />
        )}
        <Row
          label="Čistý zisk z prodeje"
          value={formatCZK(today(exit.netSaleProfit))}
          highlight="neutral"
          tooltip="Hotovost, kterou dostaneš v ruce v den prodeje: prodejní cena − zůstatek hypotéky − náklady na prodej − daň. Neobsahuje peníze, které jsi do nemovitosti během držení průběžně vkládal."
        />
        <Row
          label="Kumulovaný cashflow"
          value={signedCZK(totalCashflow)}
          highlight={totalCashflow >= 0 ? 'positive' : 'negative'}
          tooltip="Součet ročních čistých cashflow (po daních) za celou dobu držení. Kladné = nájem pokryl splátku i náklady a ještě zbylo. Záporné = každý rok jsi musel doplácet z vlastní kapsy."
        />

        <div className="mt-3 pt-3 border-t border-[#E2E8F0] space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Čistý zisk (nad vloženou investicí)</span>
            <span className={`text-lg font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {formatCZK(totalReturn)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-[#F8FAFC] rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">ROI celkové{real && ' · reálné'}</p>
              <p className={`text-lg font-bold ${totalROI >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {formatPercent(totalROI, 0)}
              </p>
            </div>
            <div className="bg-[#F8FAFC] rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Anualizované ROI{real && ' · reálné'}</p>
              <p className={`text-lg font-bold ${annualizedROI >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {formatPercent(annualizedROI, 1)}
              </p>
            </div>
          </div>
        </div>

        {/* Srovnání s alternativní investicí */}
        <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Kolik budeš mít na účtu ({params.exit.alternativeReturnRate} % p.a.)
            {real && <span className="text-[#2563EB] normal-case tracking-normal"> · dnešní ceny</span>}
          </p>
          <p className="text-xs text-gray-400 mb-3">
            Stejná hotovost do obou scénářů — zůstatek na konci roku {params.exit.holdingYears}.
          </p>
          {rentBelowInflation && (
            <div className="mb-3 rounded-lg bg-amber-50 border border-amber-200 p-3 flex gap-2">
              <span className="text-amber-500 flex-shrink-0 leading-none text-sm">⚠</span>
              <p className="text-xs text-amber-800 leading-relaxed">
                Růst nájmu ({pct(params.rental.annualRentGrowth)}) je pod inflací nákladů (
                {pct(params.macro.inflation)}). Náklady tak rostou rychleji než příjem a marže se
                každý rok stlačuje — cashflow se v čase zhoršuje. Zvaž, jestli je odhad růstu nájmu
                realistický.
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#EFF6FF] rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
                Koupím nemovitost
                <InfoTooltip
                  align="left"
                  text="Kolik reálně skončí na tvém účtu, když nemovitost koupíš a na konci prodáš. Čistý výtěžek z prodeje + přebytkový nájem (kladný cashflow) reinvestovaný alternativní sazbou. Doplatky do hypotéky dostáváš zpět v prodejní ceně."
                />
              </p>
              <p className="text-base font-bold text-[#1E40AF]">
                {formatCZK(today(alternative.propertyFinalWealth))}
              </p>
              <div className="mt-2 pt-2 border-t border-[#DBEAFE] space-y-1">
                <BreakdownRow label="Čistý výtěžek z prodeje" value={formatCZK(today(alternative.netSaleProfit))} />
                <BreakdownRow label="+ Reinvestovaný přebytek nájmu" value={formatCZK(today(alternative.reinvestedSurplus))} />
              </div>
            </div>
            <div className="bg-[#F8FAFC] rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
                Dám do ETF
                <InfoTooltip
                  align="left"
                  text="Kolik skončí na účtu, když nemovitost nekoupíš. Počáteční kapitál + KAŽDÁ koruna, kterou bys jinak doplácel do hypotéky, místo toho investovaná do ETF stejnou sazbou. Oba scénáře tak spotřebují úplně stejnou hotovost."
                />
              </p>
              <p className="text-base font-bold text-gray-700">
                {formatCZK(today(alternative.finalPortfolio))}
              </p>
              <div className="mt-2 pt-2 border-t border-[#E2E8F0] space-y-1">
                <BreakdownRow label="Počáteční kapitál (zúročený)" value={formatCZK(today(alternative.etfBaseGrowth))} />
                <BreakdownRow label="+ Doplatky investované do ETF" value={formatCZK(today(alternative.etfTopUpsInvested))} />
              </div>
            </div>
          </div>
          <div className={`mt-3 rounded-lg p-3 text-center ${alternative.advantage >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className="text-xs text-gray-500 mb-1">
              {alternative.advantage >= 0 ? 'Nemovitostí získáš navíc' : 'V ETF získáš navíc'}
            </p>
            <p className={`text-lg font-bold ${alternative.advantage >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {formatCZK(today(Math.abs(alternative.advantage)))}
            </p>
          </div>

          <details className="mt-3 group">
            <summary className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-[#2563EB] list-none select-none">
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="transition-transform group-open:rotate-90"
              >
                <path d="M6 4l4 4-4 4V4z" />
              </svg>
              Jak se ta dvě čísla počítají?
            </summary>
            <div className="mt-2 text-xs text-gray-500 leading-relaxed space-y-2 pl-[18px]">
              <p>
                Obě varianty dostanou <span className="font-medium">úplně stejnou hotovost ve stejný čas</span>:
                počáteční kapitál teď a případné doplatky do hypotéky každý rok. Jinak by srovnání nebylo férové.
              </p>
              <p>
                <span className="font-semibold text-gray-700">Koupím nemovitost</span> ({formatCZK(today(alternative.propertyFinalWealth))}):
                čistý výtěžek z prodeje ({formatCZK(today(exit.netSaleProfit))}) + přebytkový nájem reinvestovaný do ETF.
                Doplatky, které jsi během let posílal do hypotéky, dostáváš zpět v prodejní ceně.
              </p>
              <p>
                <span className="font-semibold text-gray-700">Dám do ETF</span> ({formatCZK(today(alternative.finalPortfolio))}):
                počáteční kapitál + každý doplatek, který bys jinak poslal do hypotéky, necháš růst
                v ETF za {params.exit.alternativeReturnRate} % p.a.
              </p>
              <p className="text-gray-400">
                Pozn.: „Čistý zisk z prodeje“ ({formatCZK(today(exit.netSaleProfit))}) výše je jen hotovost v den prodeje —
                neřeší, kolik jsi do nemovitosti během let vložil. Pro rozhodnutí koupit vs. ETF se řiď tímhle
                srovnáním zůstatků na účtu.
              </p>
            </div>
          </details>

          {/* Citlivost — jak křehký je výsledek */}
          <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              Co když se odhady netrefí?
              <InfoTooltip
                align="left"
                text="Výsledek stojí hlavně na dvou nejistých číslech: jak poroste cena nemovitosti a jaký výnos by mělo ETF. Tabulka ukazuje rozdíl (nemovitost − ETF) při jejich změně o ±2 pb. Modrý rámeček = tvůj aktuální odhad."
              />
            </p>
            <p className="text-xs text-gray-400 mb-2">
              Rozdíl nemovitost − ETF. Zeleně = vyhrává nemovitost, červeně = ETF.
            </p>
            <SensitivityTable data={sensitivity} divisor={real ? realFactor : 1} />
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Když se výsledek mezi buňkami převrací ze zeleného na červený, znamená to, že
              rozhodnutí visí na odhadu — neber jedno číslo jako jistotu.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
