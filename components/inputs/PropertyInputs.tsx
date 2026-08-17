'use client'

import { useState } from 'react'
import { useCalculatorStore } from '@/store/useCalculatorStore'
import { SliderInput } from '@/components/ui/SliderInput'
import { SectionCard } from './SectionCard'
import { formatCZK } from '@/utils/format'

type FinancingMode = 'akontace' | 'uver'

const MODE_LABELS: Record<FinancingMode, string> = {
  akontace: 'Zadám akontaci',
  uver: 'Zadám výši úvěru',
}

const MODES: FinancingMode[] = ['akontace', 'uver']

export function PropertyInputs() {
  const { params, setProperty } = useCalculatorStore()
  const { property } = params
  const [mode, setMode] = useState<FinancingMode>('akontace')

  const loanAmount = property.purchasePrice - property.equity
  const ltv = property.purchasePrice > 0 ? (loanAmount / property.purchasePrice) * 100 : 0

  return (
    <SectionCard title="Nemovitost a pořízení">
      <SliderInput
        label="Cena nemovitosti"
        value={property.purchasePrice}
        min={500_000}
        max={20_000_000}
        step={50_000}
        unit="Kč"
        onChange={(v) => setProperty({ purchasePrice: v })}
        formatDisplay={formatCZK}
      />
      <div className="flex gap-1.5">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium transition-all
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-1 ${
              mode === m
                ? 'bg-[#2563EB] text-white border-[#2563EB]'
                : 'bg-white text-gray-600 border-[#E2E8F0] hover:border-[#2563EB]'
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {mode === 'akontace' ? (
        <SliderInput
          label="Vlastní kapitál (akontace)"
          value={property.equity}
          min={0}
          max={property.purchasePrice}
          step={50_000}
          unit="Kč"
          onChange={(v) => setProperty({ equity: v })}
          formatDisplay={formatCZK}
          hint={`úvěr ${formatCZK(loanAmount)} · LTV ${ltv.toFixed(0)} %`}
        />
      ) : (
        <SliderInput
          label="Výše úvěru"
          value={loanAmount}
          min={0}
          max={property.purchasePrice}
          step={50_000}
          unit="Kč"
          onChange={(v) => setProperty({ equity: property.purchasePrice - v })}
          formatDisplay={formatCZK}
          hint={`akontace ${formatCZK(property.equity)} · LTV ${ltv.toFixed(0)} %`}
        />
      )}
      <SliderInput
        label="Pořizovací náklady"
        value={property.acquisitionCosts}
        min={0}
        max={10}
        step={0.1}
        unit="%"
        decimals={1}
        onChange={(v) => setProperty({ acquisitionCosts: v })}
        hint={formatCZK(property.purchasePrice * property.acquisitionCosts / 100)}
      />
      <SliderInput
        label="Rekonstrukce / vybavení"
        value={property.renovationCosts}
        min={0}
        max={2_000_000}
        step={10_000}
        unit="Kč"
        onChange={(v) => setProperty({ renovationCosts: v })}
        formatDisplay={formatCZK}
      />
      <SliderInput
        label="Počáteční rezerva"
        value={property.initialReserve}
        min={0}
        max={500_000}
        step={10_000}
        unit="Kč"
        onChange={(v) => setProperty({ initialReserve: v })}
        formatDisplay={formatCZK}
      />
    </SectionCard>
  )
}
