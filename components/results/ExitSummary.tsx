'use client'

import { useCalculatorStore } from '@/store/useCalculatorStore'
import { formatCZK, formatPercent } from '@/utils/format'
import { InfoTooltip } from '@/components/ui/InfoTooltip'

/** Znaménkově čitelný cashflow: „+ 120 000 Kč" / „− 120 000 Kč" */
function signedCZK(value: number): string {
  return `${value >= 0 ? '+ ' : '− '}${formatCZK(Math.abs(value))}`
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
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Srovnání s alternativou ({params.exit.alternativeReturnRate} % p.a.)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#EFF6FF] rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
                Nemovitost — na účtu
                <InfoTooltip
                  align="left"
                  text="Kolik reálně máš na konci na účtu, když počítáš čas peněz. Výtěžek z prodeje + každý roční cashflow reinvestovaný alternativní sazbou. Když jsi průběžně doplácel (záporný cashflow), tyto vklady tu částku snižují — proto bývá nižší než čistý zisk z prodeje."
                />
              </p>
              <p className="text-base font-bold text-[#1E40AF]">
                {formatCZK(alternative.propertyFinalWealth)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                výtěžek z prodeje + reinvestovaný cashflow
              </p>
            </div>
            <div className="bg-[#F8FAFC] rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
                Alternativa — na účtu
                <InfoTooltip
                  align="left"
                  text="Kolik bys měl, kdybys nemovitost nekoupil a stejný počáteční kapitál nechal složeně úročit alternativní sazbou po celou dobu držení. Férová srovnávací základna (oportunitní náklad)."
                />
              </p>
              <p className="text-base font-bold text-gray-700">
                {formatCZK(alternative.finalPortfolio)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                počáteční kapitál složeně úročený
              </p>
            </div>
          </div>
          <div className={`mt-3 rounded-lg p-3 text-center ${alternative.advantage >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className="text-xs text-gray-500 mb-1">
              {alternative.advantage >= 0 ? 'Nemovitost vydělá navíc' : 'Alternativa vydělá navíc'}
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
              Proč se „čistý zisk z prodeje" a „nemovitost na účtu" liší?
            </summary>
            <div className="mt-2 text-xs text-gray-500 leading-relaxed space-y-2 pl-[18px]">
              <p>
                <span className="font-semibold text-gray-700">Čistý zisk z prodeje</span> ({formatCZK(exit.netSaleProfit)}) je
                jednorázová hotovost v den prodeje. Dívá se jen na tento okamžik — kolik ti zbyde,
                když prodáš a splatíš hypotéku.
              </p>
              <p>
                <span className="font-semibold text-gray-700">Nemovitost — na účtu</span> ({formatCZK(alternative.propertyFinalWealth)})
                je poctivý součet celého příběhu: k výtěžku z prodeje přičte i každou korunu cashflow,
                ale s ohledem na <span className="font-medium">čas peněz</span> — jako by se dala uložit za{' '}
                {params.exit.alternativeReturnRate} % p.a. Tvůj cashflow byl{' '}
                {exit.totalCashflow >= 0 ? 'kladný' : 'záporný'}, takže tato část hodnotu{' '}
                {exit.totalCashflow >= 0 ? 'zvyšuje' : 'snižuje'}.
              </p>
              <p>
                Rozdíl {formatCZK(Math.abs(exit.netSaleProfit - alternative.propertyFinalWealth))} je{' '}
                {exit.totalCashflow >= 0
                  ? 'zhodnocení průběžného kladného cashflow.'
                  : 'budoucí hodnota všech peněz, které jsi musel do nemovitosti během držení doplatit (úročeno oportunitní sazbou).'}{' '}
                Právě „nemovitost na účtu" se dá férově porovnat s alternativou vedle.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}
