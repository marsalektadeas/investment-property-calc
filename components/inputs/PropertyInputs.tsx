'use client'

import { useCalculatorStore } from '@/store/useCalculatorStore'
import { SliderInput } from '@/components/ui/SliderInput'
import { SectionCard } from './SectionCard'
import { formatCZK } from '@/utils/format'

export function PropertyInputs() {
  const { params, setProperty } = useCalculatorStore()
  const { property } = params

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
      <SliderInput
        label="Vlastní kapitál (akontace)"
        value={property.equity}
        min={0}
        max={property.purchasePrice}
        step={50_000}
        unit="Kč"
        onChange={(v) => setProperty({ equity: v })}
        formatDisplay={formatCZK}
        hint={`LTV ${ltv.toFixed(0)} %`}
      />
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
