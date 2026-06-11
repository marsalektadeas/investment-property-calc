'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { useCalculatorStore } from '@/store/useCalculatorStore'
import { formatCZKShort, formatCZK } from '@/utils/format'
import { pickCashflow, pickCumulative } from '@/utils/projectionHelpers'

export function CashflowChart() {
  const { result, params } = useCalculatorStore()
  const { showAfterTax: afterTax, showInflationAdjusted: real } = params

  const data = result.projections.map((p) => ({
    year: `Rok ${p.year}`,
    cashflow: Math.round(pickCashflow(p, afterTax, real)),
    cumulative: Math.round(pickCumulative(p, afterTax, real)),
  }))

  const taxLabel = afterTax ? 'po daních' : 'před daněmi'
  const realLabel = real ? ', reálný' : ', nominální'
  const cashflowLabel = `Roční cashflow (${taxLabel}${realLabel})`
  const cumulativeLabel = `Kumulativní (${taxLabel}${realLabel})`

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-0.5 h-3.5 bg-[#2563EB] rounded-full flex-shrink-0" />
          Cashflow v čase
        </h3>
        <div className="flex gap-1.5">
          {real && (
            <span className="text-xs text-[#1E40AF] bg-[#EFF6FF] px-2 py-0.5 rounded-full">
              po inflaci
            </span>
          )}
          {!afterTax && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              před daněmi
            </span>
          )}
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCashflow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={formatCZKShort} tick={{ fontSize: 11 }} width={70} />
            <Tooltip
              formatter={(value, name) => [
                formatCZK(Number(value)),
                name === 'cashflow' ? cashflowLabel : cumulativeLabel,
              ]}
            />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" />
            <Area
              type="monotone"
              dataKey="cashflow"
              stroke="#2563EB"
              strokeWidth={2}
              fill="url(#colorCashflow)"
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#16a34a"
              strokeWidth={2}
              fill="url(#colorCumulative)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-[#2563EB] rounded" />
          {cashflowLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-green-600 rounded" />
          {cumulativeLabel}
        </span>
      </div>
    </div>
  )
}
