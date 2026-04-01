'use client'

import { useCalculatorStore } from '@/store/useCalculatorStore'
import { SliderInput } from '@/components/ui/SliderInput'
import { SectionCard } from './SectionCard'
import { formatCZK } from '@/utils/format'

export function CostInputs() {
  const { params, setCosts } = useCalculatorStore()
  const { costs } = params

  const annualTotal =
    costs.repairFund * 12 +
    costs.insurance +
    costs.propertyTax +
    costs.managementFee * 12 +
    costs.repairs +
    costs.tenantChangeCost +
    costs.legalCosts

  return (
    <SectionCard title="Provozní náklady">
      <SliderInput
        label="Fond oprav"
        value={costs.repairFund}
        min={0}
        max={10_000}
        step={100}
        unit="Kč/měs"
        onChange={(v) => setCosts({ repairFund: v })}
        formatDisplay={(v) => `${formatCZK(v)}`}
      />
      <SliderInput
        label="Pojištění"
        value={costs.insurance}
        min={0}
        max={30_000}
        step={500}
        unit="Kč/rok"
        onChange={(v) => setCosts({ insurance: v })}
        formatDisplay={formatCZK}
      />
      <SliderInput
        label="Daň z nemovitosti"
        value={costs.propertyTax}
        min={0}
        max={20_000}
        step={100}
        unit="Kč/rok"
        onChange={(v) => setCosts({ propertyTax: v })}
        formatDisplay={formatCZK}
      />
      <SliderInput
        label="Správa nemovitosti"
        value={costs.managementFee}
        min={0}
        max={10_000}
        step={100}
        unit="Kč/měs"
        onChange={(v) => setCosts({ managementFee: v })}
        formatDisplay={formatCZK}
      />
      <SliderInput
        label="Opravy a údržba"
        value={costs.repairs}
        min={0}
        max={100_000}
        step={1_000}
        unit="Kč/rok"
        onChange={(v) => setCosts({ repairs: v })}
        formatDisplay={formatCZK}
      />
      <SliderInput
        label="Výměna nájemníka"
        value={costs.tenantChangeCost}
        min={0}
        max={50_000}
        step={1_000}
        unit="Kč/rok"
        onChange={(v) => setCosts({ tenantChangeCost: v })}
        formatDisplay={formatCZK}
      />
      <SliderInput
        label="Právní / neočekávané"
        value={costs.legalCosts}
        min={0}
        max={30_000}
        step={500}
        unit="Kč/rok"
        onChange={(v) => setCosts({ legalCosts: v })}
        formatDisplay={formatCZK}
      />
      <div className="pt-1 flex justify-between text-sm text-gray-500 border-t border-gray-100">
        <span>Celkem ročně</span>
        <span className="font-semibold text-gray-900">{formatCZK(annualTotal)}</span>
      </div>
    </SectionCard>
  )
}
