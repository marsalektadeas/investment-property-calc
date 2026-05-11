'use client'

import { useCalculatorStore } from '@/store/useCalculatorStore'
import { formatCZK, formatPercent, formatYears } from '@/utils/format'

function Row({ label, value, highlight }: { label: string; value: string; highlight?: 'positive' | 'negative' | 'neutral' }) {
  const valueClass =
    highlight === 'positive'
      ? 'text-green-600 font-semibold'
      : highlight === 'negative'
        ? 'text-red-500'
        : 'text-gray-900'

  return (
    <div className="flex justify-between items-center py-2 border-b border-[#f5f2ed] last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm ${valueClass}`}>{value}</span>
    </div>
  )
}

export function ExitSummary() {
  const { result, params } = useCalculatorStore()
  const { exit, alternative } = result

  return (
    <div className="bg-white border border-[#ede9e2] rounded-xl p-5 shadow-sm">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="w-0.5 h-3.5 bg-[#C9A84C] rounded-full flex-shrink-0" />
        Výpočet při prodeji — rok {params.exit.holdingYears}
      </h3>

      <div className="space-y-0">
        <Row label="Odhadovaná cena nemovitosti" value={formatCZK(exit.projectedValue)} />
        <Row label="Zůstatek hypotéky" value={`− ${formatCZK(exit.remainingLoan)}`} />
        <Row label="Náklady na prodej" value={`− ${formatCZK(exit.sellingCosts)}`} />
        {exit.capitalGainsTax > 0 && (
          <Row label="Daň z prodeje" value={`− ${formatCZK(exit.capitalGainsTax)}`} />
        )}
        <Row label="Čistý zisk z prodeje" value={formatCZK(exit.netSaleProfit)} highlight="neutral" />
        <Row label="Kumulovaný cashflow" value={`+ ${formatCZK(exit.totalCashflow)}`} highlight={exit.totalCashflow >= 0 ? 'positive' : 'negative'} />

        <div className="mt-3 pt-3 border-t border-[#ede9e2] space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Čistý zisk (nad vloženou investicí)</span>
            <span className={`text-lg font-bold ${exit.totalReturn >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {formatCZK(exit.totalReturn)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-[#f9f7f4] rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">ROI celkové</p>
              <p className={`text-lg font-bold ${exit.totalROI >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {formatPercent(exit.totalROI, 0)}
              </p>
            </div>
            <div className="bg-[#f9f7f4] rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Anualizované ROI</p>
              <p className={`text-lg font-bold ${exit.annualizedROI >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {formatPercent(exit.annualizedROI, 1)}
              </p>
            </div>
          </div>
        </div>

        {/* Srovnání s alternativní investicí */}
        <div className="mt-4 pt-4 border-t border-[#ede9e2]">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Srovnání s alternativou ({params.exit.alternativeReturnRate} % p.a.)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f5edda] rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Nemovitost — na účtu</p>
              <p className="text-base font-bold text-[#8B6B1A]">
                {formatCZK(exit.netSaleProfit + exit.totalCashflow)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                výtěžek z prodeje + cashflow
              </p>
            </div>
            <div className="bg-[#f9f7f4] rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Alternativa — na účtu</p>
              <p className="text-base font-bold text-gray-700">
                {formatCZK(alternative.finalPortfolio)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                složené úročení + CF korekce
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
        </div>
      </div>
    </div>
  )
}
