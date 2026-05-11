'use client'

import { useState, useCallback } from 'react'

interface SliderInputProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  unitPosition?: 'prefix' | 'suffix'
  decimals?: number
  onChange: (value: number) => void
  formatDisplay?: (v: number) => string
  hint?: string
}

export function SliderInput({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  unitPosition = 'suffix',
  decimals = 0,
  onChange,
  formatDisplay,
  hint,
}: SliderInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const display = formatDisplay ? formatDisplay(value) : value.toFixed(decimals).replace('.', ',')

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(',', '.')
      setInputValue(e.target.value)
      const parsed = parseFloat(raw)
      if (!isNaN(parsed)) {
        const clamped = Math.min(max, Math.max(min, parsed))
        onChange(clamped)
      }
    },
    [min, max, onChange],
  )

  const handleFocus = () => {
    setIsEditing(true)
    setInputValue(value.toFixed(decimals).replace('.', ','))
  }

  const handleBlur = () => {
    setIsEditing(false)
    setInputValue('')
  }

  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-500">{label}</label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1.5 appearance-none bg-gray-200 rounded-full cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[#C9A84C] [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-sm"
            style={{
              background: `linear-gradient(to right, #C9A84C ${pct}%, #e5e7eb ${pct}%)`,
            }}
          />
        </div>

        <div className="flex items-center gap-1 min-w-[110px] justify-end">
          {unit && unitPosition === 'prefix' && (
            <span className="text-sm text-gray-400">{unit}</span>
          )}
          <input
            type="text"
            inputMode="decimal"
            value={isEditing ? inputValue : display}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleInputChange}
            className="w-24 text-right text-sm font-medium text-gray-900 bg-[#f9f7f4] border border-[#ede9e2]
              rounded px-2 py-1 focus:outline-none focus:border-[#C9A84C] focus:bg-white transition-colors"
          />
          {unit && unitPosition === 'suffix' && (
            <span className="text-sm text-gray-400">{unit}</span>
          )}
        </div>
      </div>
    </div>
  )
}
