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
    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm ${valueClass}`}>{value}</span>
    </div>
  )
}

export function ExitSummary() {
  const { result, params } = useCalculatorStore()
  const { exit } = result

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
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

        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Celkový výnos</span>
            <span className={`text-lg font-bold ${exit.totalReturn >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {formatCZK(exit.totalReturn)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">ROI celkové</p>
              <p className={`text-lg font-bold ${exit.totalROI >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {formatPercent(exit.totalROI, 0)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Anualizované ROI</p>
              <p className={`text-lg font-bold ${exit.annualizedROI >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {formatPercent(exit.annualizedROI, 1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
