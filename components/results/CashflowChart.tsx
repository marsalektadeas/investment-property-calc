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
  Legend,
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
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Cashflow v čase
        </h3>
        <div className="flex gap-1.5">
          {real && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
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
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={formatCZKShort} tick={{ fontSize: 11 }} width={70} />
          <Tooltip
            formatter={(value, name) => [
              formatCZK(Number(value)),
              name === 'cashflow' ? cashflowLabel : cumulativeLabel,
            ]}
          />
          <Legend formatter={(v) => (v === 'cashflow' ? cashflowLabel : cumulativeLabel)} />
          <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" />
          <Area
            type="monotone"
            dataKey="cashflow"
            stroke="#2563eb"
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
    </div>
  )
}
