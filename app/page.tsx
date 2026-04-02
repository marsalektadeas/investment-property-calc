'use client'

import { useCalculatorStore } from '@/store/useCalculatorStore'
import { ScenarioSelector } from '@/components/inputs/ScenarioSelector'
import { PropertyInputs } from '@/components/inputs/PropertyInputs'
import { MortgageInputs } from '@/components/inputs/MortgageInputs'
import { RentalInputs } from '@/components/inputs/RentalInputs'
import { CostInputs } from '@/components/inputs/CostInputs'
import { TaxInputs } from '@/components/inputs/TaxInputs'
import { MacroInputs } from '@/components/inputs/MacroInputs'
import { ExitInputs } from '@/components/inputs/ExitInputs'
import { SummaryCards } from '@/components/results/SummaryCards'
import { CashflowChart } from '@/components/results/CashflowChart'
import { EquityChart } from '@/components/results/EquityChart'
import { ExitSummary } from '@/components/results/ExitSummary'
import { YearlyTable } from '@/components/results/YearlyTable'
import { Toggle } from '@/components/ui/Toggle'

export default function Home() {
  const { params, setShowInflationAdjusted, setShowAfterTax, resetToDefaults } =
    useCalculatorStore()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-gray-900 truncate">
              Kalkulačka investiční nemovitosti
            </h1>
            <p className="text-xs text-gray-400">Realistický výpočet výnosnosti</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 shrink-0">
            <Toggle
              label="Po inflaci"
              checked={params.showInflationAdjusted}
              onChange={setShowInflationAdjusted}
            />
            <Toggle
              label="Po daních"
              checked={params.showAfterTax}
              onChange={setShowAfterTax}
            />
            <button
              onClick={resetToDefaults}
              className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Main layout: inputs left, results right */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col lg:flex-row gap-6 items-start">
        {/* Left column — inputs */}
        <div className="w-full lg:w-[380px] lg:flex-shrink-0 space-y-3">
          <ScenarioSelector />
          <PropertyInputs />
          <MortgageInputs />
          <RentalInputs />
          <CostInputs />
          <TaxInputs />
          <MacroInputs />
          <ExitInputs />
        </div>

        {/* Right column — results */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          <SummaryCards />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CashflowChart />
            <EquityChart />
          </div>
          <ExitSummary />
          <YearlyTable />
        </div>
      </div>
    </div>
  )
}
