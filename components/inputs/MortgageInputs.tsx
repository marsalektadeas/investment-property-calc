'use client'

import { useCalculatorStore } from '@/store/useCalculatorStore'
import { SliderInput } from '@/components/ui/SliderInput'
import { SectionCard } from './SectionCard'
import { formatCZK, formatPercent } from '@/utils/format'

export function MortgageInputs() {
  const { params, result, setMortgage } = useCalculatorStore()
  const { mortgage } = params

  return (
    <SectionCard title="Hypotéka">
      <SliderInput
        label="Úroková sazba"
        value={mortgage.interestRate}
        min={1}
        max={12}
        step={0.05}
        unit="%"
        decimals={2}
        onChange={(v) => setMortgage({ interestRate: v })}
      />
      <SliderInput
        label="Fixace"
        value={mortgage.fixationYears}
        min={1}
        max={15}
        step={1}
        unit="let"
        onChange={(v) => setMortgage({ fixationYears: v })}
      />
      <SliderInput
        label="Doba splatnosti"
        value={mortgage.termYears}
        min={5}
        max={30}
        step={1}
        unit="let"
        onChange={(v) => setMortgage({ termYears: v })}
      />
      <SliderInput
        label="Sazba po fixaci"
        value={mortgage.rateAfterFixation}
        min={1}
        max={12}
        step={0.05}
        unit="%"
        decimals={2}
        onChange={(v) => setMortgage({ rateAfterFixation: v })}
      />
      <div className="pt-1 flex justify-between text-sm text-gray-500 border-t border-gray-100">
        <span>Výše úvěru</span>
        <span className="font-semibold text-gray-900">{formatCZK(result.mortgage.loanAmount)}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Měsíční splátka</span>
        <span className="font-semibold text-gray-900">{formatCZK(result.mortgage.monthlyPayment)}</span>
      </div>
      {result.mortgage.monthlyPaymentAfterFixation != null && (
        <div className="flex justify-between text-sm text-gray-500">
          <span>
            Splátka po fixaci
            {result.mortgage.effectiveRateAfterFixation != null && (
              <span className="text-gray-400">
                {' '}
                ({formatPercent(result.mortgage.effectiveRateAfterFixation, 2)})
              </span>
            )}
          </span>
          <span className="font-semibold text-amber-600">
            {formatCZK(result.mortgage.monthlyPaymentAfterFixation)}
          </span>
        </div>
      )}
    </SectionCard>
  )
}
