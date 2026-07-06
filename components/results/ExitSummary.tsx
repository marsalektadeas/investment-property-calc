'use client'

import { useCalculatorStore } from '@/store/useCalculatorStore'
import { formatCZK, formatPercent } from '@/utils/format'
import { InfoTooltip } from '@/components/ui/InfoTooltip'

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
  const { exit, alternative } = result

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="w-0.5 h-3.5 bg-[#2563EB] rounded-full flex-shrink-0" />
        Výpočet při prodeji — rok {params.exit.holdingYears}
      </h3>

      <div className="space-y-0">
        <Row label="Odhadovaná cena nemovitosti" value={formatCZK(exit.projectedValue)} />
        <Row label="Zůstatek hypotéky" value={`− ${formatCZK(exit.remainingLoan)}`} />
        <Row label="Náklady na prodej" value={`− ${formatCZK(exit.sellingCosts)}`} />
        {exit.capitalGainsTax > 0 && (
          <Row label="Daň z prodeje" value={`− ${formatCZK(exit.capitalGainsTax)}`} />
        )}
        <Row
          label="Čistý zisk z prodeje"
          value={formatCZK(exit.netSaleProfit)}
          highlight="neutral"
          tooltip="Hotovost, kterou dostaneš v ruce v den prodeje: prodejní cena − zůstatek hypotéky − náklady na prodej − daň. Neobsahuje peníze, které jsi do nemovitosti během držení průběžně vkládal."
        />
        <Row
          label="Kumulovaný cashflow"
          value={signedCZK(exit.totalCashflow)}
          highlight={exit.totalCashflow >= 0 ? 'positive' : 'negative'}
          tooltip="Součet ročních čistých cashflow (po daních) za celou dobu držení. Kladné = nájem pokryl splátku i náklady a ještě zbylo. Záporné = každý rok jsi musel doplácet z vlastní kapsy."
        />

        <div className="mt-3 pt-3 border-t border-[#E2E8F0] space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Čistý zisk (nad vloženou investicí)</span>
            <span className={`text-lg font-bold ${exit.totalReturn >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {formatCZK(exit.totalReturn)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-[#F8FAFC] rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">ROI celkové</p>
              <p className={`text-lg font-bold ${exit.totalROI >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {formatPercent(exit.totalROI, 0)}
              </p>
            </div>
            <div className="bg-[#F8FAFC] rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Anualizované ROI</p>
              <p className={`text-lg font-bold ${exit.annualizedROI >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {formatPercent(exit.annualizedROI, 1)}
              </p>
            </div>
          </div>
        </div>

        {/* Srovnání s alternativní investicí */}
        <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Kolik budeš mít na účtu ({params.exit.alternativeReturnRate} % p.a.)
          </p>
          <p className="text-xs text-gray-400 mb-3">
            Stejná hotovost do obou scénářů — zůstatek na konci roku {params.exit.holdingYears}.
          </p>
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
                {formatCZK(alternative.propertyFinalWealth)}
              </p>
              <div className="mt-2 pt-2 border-t border-[#DBEAFE] space-y-1">
                <BreakdownRow label="Čistý výtěžek z prodeje" value={formatCZK(alternative.netSaleProfit)} />
                <BreakdownRow label="+ Reinvestovaný přebytek nájmu" value={formatCZK(alternative.reinvestedSurplus)} />
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
                {formatCZK(alternative.finalPortfolio)}
              </p>
              <div className="mt-2 pt-2 border-t border-[#E2E8F0] space-y-1">
                <BreakdownRow label="Počáteční kapitál (zúročený)" value={formatCZK(alternative.etfBaseGrowth)} />
                <BreakdownRow label="+ Doplatky investované do ETF" value={formatCZK(alternative.etfTopUpsInvested)} />
              </div>
            </div>
          </div>
          <div className={`mt-3 rounded-lg p-3 text-center ${alternative.advantage >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className="text-xs text-gray-500 mb-1">
              {alternative.advantage >= 0 ? 'Nemovitostí získáš navíc' : 'V ETF získáš navíc'}
            </p>
            <p className={`text-lg font-bold ${alternative.advantage >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {formatCZK(Math.abs(alternative.advantage))}
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
                <span className="font-semibold text-gray-700">Koupím nemovitost</span> ({formatCZK(alternative.propertyFinalWealth)}):
                čistý výtěžek z prodeje ({formatCZK(exit.netSaleProfit)}) + přebytkový nájem reinvestovaný do ETF.
                Doplatky, které jsi během let posílal do hypotéky, dostáváš zpět v prodejní ceně.
              </p>
              <p>
                <span className="font-semibold text-gray-700">Dám do ETF</span> ({formatCZK(alternative.finalPortfolio)}):
                počáteční kapitál + každý doplatek, který bys jinak poslal do hypotéky, necháš růst
                v ETF za {params.exit.alternativeReturnRate} % p.a.
              </p>
              <p className="text-gray-400">
                Pozn.: „Čistý zisk z prodeje" ({formatCZK(exit.netSaleProfit)}) výše je jen hotovost v den prodeje —
                neřeší, kolik jsi do nemovitosti během let vložil. Pro rozhodnutí koupit vs. ETF se řiď tímhle
                srovnáním zůstatků na účtu.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}
