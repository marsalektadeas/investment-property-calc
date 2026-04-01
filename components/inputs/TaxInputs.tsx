'use client'

import { useCalculatorStore } from '@/store/useCalculatorStore'
import { SliderInput } from '@/components/ui/SliderInput'
import { SectionCard } from './SectionCard'

export function TaxInputs() {
  const { params, setTax } = useCalculatorStore()
  const { tax } = params

  return (
    <SectionCard title="Daně">
      <SliderInput
        label="Sazba daně z příjmu"
        value={tax.incomeTaxRate}
        min={0}
        max={23}
        step={1}
        unit="%"
        onChange={(v) => setTax({ incomeTaxRate: v })}
      />

      <div className="space-y-1.5">
        <label className="text-sm text-gray-500">Daňový režim</label>
        <div className="flex gap-2">
          {[
            { value: 'pausal', label: 'Paušál 30 %' },
            { value: 'skutecne', label: 'Skutečné náklady' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTax({ regime: opt.value as 'pausal' | 'skutecne' })}
              className={`flex-1 py-1.5 px-3 rounded-lg text-sm border transition-colors ${
                tax.regime === opt.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-500">Uplatnit odpisy</label>
        <button
          onClick={() => setTax({ depreciation: !tax.depreciation })}
          className={`relative w-9 h-5 rounded-full transition-colors ${
            tax.depreciation ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              tax.depreciation ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </SectionCard>
  )
}
