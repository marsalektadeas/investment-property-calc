'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useCalculatorStore } from '@/store/useCalculatorStore'
import { formatCZKShort, formatCZK } from '@/utils/format'

export function EquityChart() {
  const { result } = useCalculatorStore()

  const data = result.projections.map((p) => ({
    year: `Rok ${p.year}`,
    propertyValue: Math.round(p.propertyValue),
    loanBalance: Math.round(p.loanBalance),
    equity: Math.round(p.equity),
  }))

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
        Hodnota nemovitosti vs dluh
      </h3>
      <div className="w-full overflow-hidden">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={formatCZKShort} tick={{ fontSize: 11 }} width={80} />
          <Tooltip
            formatter={(value, name) => [
              formatCZK(Number(value)),
              name === 'propertyValue'
                ? 'Hodnota nemovitosti'
                : name === 'loanBalance'
                  ? 'Zůstatek úvěru'
                  : 'Equity',
            ]}
          />
          <Area
            type="monotone"
            dataKey="propertyValue"
            stroke="#2563eb"
            strokeWidth={2}
            fill="url(#colorValue)"
          />
          <Area
            type="monotone"
            dataKey="loanBalance"
            stroke="#ef4444"
            strokeWidth={2}
            fill="none"
          />
          <Area
            type="monotone"
            dataKey="equity"
            stroke="#16a34a"
            strokeWidth={2}
            fill="url(#colorEquity)"
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 bg-blue-600 rounded" />Hodnota nemovitosti</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 bg-red-500 rounded" />Zůstatek úvěru</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 bg-green-600 rounded" />Equity</span>
      </div>
    </div>
  )
}
