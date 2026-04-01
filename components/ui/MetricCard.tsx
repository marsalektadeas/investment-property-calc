'use client'

import { useState } from 'react'

interface MetricCardProps {
  label: string
  value: string
  sub?: string
  positive?: boolean | null
  large?: boolean
  tooltip?: string
}

export function MetricCard({ label, value, sub, positive, large, tooltip }: MetricCardProps) {
  const [show, setShow] = useState(false)

  const valueColor =
    positive === null || positive === undefined
      ? 'text-gray-900'
      : positive
        ? 'text-green-600'
        : 'text-red-500'

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-1 mb-1">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
        {tooltip && (
          <div className="relative ml-auto">
            <button
              onMouseEnter={() => setShow(true)}
              onMouseLeave={() => setShow(false)}
              className="text-gray-300 hover:text-gray-400 transition-colors"
              aria-label="Vysvětlivka"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-.25 3.5h.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V8.5a.5.5 0 0 1 .5-.5h-.5z"/>
              </svg>
            </button>
            {show && (
              <div className="absolute right-0 bottom-5 z-20 w-56 bg-gray-900 text-white text-xs rounded-lg p-3 leading-relaxed shadow-lg">
                {tooltip}
                <div className="absolute right-1 bottom-[-5px] w-2.5 h-2.5 bg-gray-900 rotate-45" />
              </div>
            )}
          </div>
        )}
      </div>
      <p className={`font-semibold ${large ? 'text-2xl' : 'text-lg'} ${valueColor}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}
