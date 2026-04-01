'use client'

import { useCalculatorStore } from '@/store/useCalculatorStore'
import { SliderInput } from '@/components/ui/SliderInput'
import { SectionCard } from './SectionCard'
import { formatCZK } from '@/utils/format'

export function RentalInputs() {
  const { params, setRental } = useCalculatorStore()
  const { rental } = params

  return (
    <SectionCard title="Příjmy z nájmu">
      <SliderInput
        label="Měsíční nájem"
        value={rental.monthlyRent}
        min={3_000}
        max={80_000}
        step={500}
        unit="Kč"
        onChange={(v) => setRental({ monthlyRent: v })}
        formatDisplay={formatCZK}
      />
      <SliderInput
        label="Neobsazenost"
        value={rental.vacancyRate}
        min={0}
        max={30}
        step={0.5}
        unit="%"
        decimals={1}
        onChange={(v) => setRental({ vacancyRate: v })}
        hint={`${(rental.vacancyRate / 100 * 12).toFixed(1)} měs./rok`}
      />
      <SliderInput
        label="Další příjmy (parking apod.)"
        value={rental.otherIncome}
        min={0}
        max={10_000}
        step={500}
        unit="Kč"
        onChange={(v) => setRental({ otherIncome: v })}
        formatDisplay={formatCZK}
      />
      <SliderInput
        label="Roční růst nájmu"
        value={rental.annualRentGrowth}
        min={0}
        max={10}
        step={0.25}
        unit="%"
        decimals={2}
        onChange={(v) => setRental({ annualRentGrowth: v })}
      />
    </SectionCard>
  )
}
