'use client'

import { useCalculatorStore } from '@/store/useCalculatorStore'
import { SliderInput } from '@/components/ui/SliderInput'
import { SectionCard } from './SectionCard'

export function ExitInputs() {
  const { params, setExit } = useCalculatorStore()
  const { exit } = params

  return (
    <SectionCard title="Prodej (exit)">
      <SliderInput
        label="Doba držení"
        value={exit.holdingYears}
        min={1}
        max={30}
        step={1}
        unit="let"
        onChange={(v) => setExit({ holdingYears: v })}
      />
      <SliderInput
        label="Náklady na prodej"
        value={exit.sellingCosts}
        min={0}
        max={10}
        step={0.25}
        unit="%"
        decimals={2}
        onChange={(v) => setExit({ sellingCosts: v })}
      />
      <SliderInput
        label="Daň z prodeje"
        value={exit.capitalGainsTax}
        min={0}
        max={23}
        step={1}
        unit="%"
        onChange={(v) => setExit({ capitalGainsTax: v })}
        hint="Po 5 letech 0 %"
      />
      <SliderInput
        label="Výnos alternativy"
        value={exit.alternativeReturnRate}
        min={0}
        max={20}
        step={0.5}
        unit="%"
        decimals={1}
        onChange={(v) => setExit({ alternativeReturnRate: v })}
        hint="Spořák / akcie — ročně (p.a.)"
      />
    </SectionCard>
  )
}
