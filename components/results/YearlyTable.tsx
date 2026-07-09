'use client'

import { useCalculatorStore } from '@/store/useCalculatorStore'
import { formatCZK } from '@/utils/format'
import { pickCashflow, pickCumulative } from '@/utils/projectionHelpers'

export function YearlyTable() {
  const { result, params } = useCalculatorStore()

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-0.5 h-3.5 bg-[#2563EB] rounded-full flex-shrink-0" />
          Přehled po letech
        </h3>
        {params.showInflationAdjusted && (
          <span className="text-xs text-[#1E40AF] bg-[#EFF6FF] px-2 py-0.5 rounded-full">
            cashflow po inflaci
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8FAFC] text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-4 py-3 text-left sticky left-0 bg-[#F8FAFC] z-10">Rok</th>
              <th className="px-4 py-3 text-right">Nájem</th>
              <th className="px-4 py-3 text-right">Náklady</th>
              <th className="px-4 py-3 text-right">Hypotéka</th>
              <th className="px-4 py-3 text-right">Úrok</th>
              <th className="px-4 py-3 text-right">Cashflow</th>
              <th className="px-4 py-3 text-right">Kumulativní</th>
              <th className="px-4 py-3 text-right">Equity</th>
              <th className="px-4 py-3 text-right">Hodnota nem.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {result.projections.map((p, i) => {
              const cashflow = pickCashflow(p, params.showAfterTax, params.showInflationAdjusted)
              const cumulative = pickCumulative(p, params.showAfterTax, params.showInflationAdjusted)

              return (
                <tr key={p.year} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}>
                  <td className={`px-4 py-2.5 font-medium text-gray-900 sticky left-0 z-10 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}`}>
                    {p.year}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-700">
                    {formatCZK(p.effectiveRent)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-500">
                    {formatCZK(p.operatingCosts)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-500">
                    {formatCZK(p.mortgagePayment)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-400">
                    {formatCZK(p.interest)}
                  </td>
                  <td className={`px-4 py-2.5 text-right font-medium ${cashflow >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {formatCZK(cashflow)}
                  </td>
                  <td className={`px-4 py-2.5 text-right ${cumulative >= 0 ? 'text-green-600' : 'text-red-400'}`}>
                    {formatCZK(cumulative)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium text-[#1E40AF]">
                    {formatCZK(p.equity)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-700">
                    {formatCZK(p.propertyValue)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
