'use client'

import { useCalculatorStore } from '@/store/useCalculatorStore'
import { SliderInput } from '@/components/ui/SliderInput'
import { SectionCard } from './SectionCard'

export function MacroInputs() {
  const { params, setMacro } = useCalculatorStore()
  const { macro } = params

  return (
    <SectionCard title="Makro faktory">
      <SliderInput
        label="Inflace"
        value={macro.inflation}
        min={0}
        max={15}
        step={0.25}
        unit="%"
        decimals={2}
        onChange={(v) => setMacro({ inflation: v })}
      />
      <SliderInput
        label="Růst ceny nemovitosti"
        value={macro.propertyGrowthRate}
        min={0}
        max={15}
        step={0.25}
        unit="% / rok"
        decimals={2}
        onChange={(v) => setMacro({ propertyGrowthRate: v })}
      />
    </SectionCard>
  )
}
