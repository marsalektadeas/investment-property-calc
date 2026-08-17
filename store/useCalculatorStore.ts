import { create } from 'zustand'
import type {
  InputParams,
  CalculationResult,
  PropertyParams,
  MortgageParams,
  RentalParams,
  CostParams,
  TaxParams,
  MacroParams,
  ExitParams,
  ScenarioType,
} from '@/types'
import { DEFAULT_PARAMS } from '@/constants/defaults'
import { calcMortgage } from '@/lib/mortgage'
import { calcMonthlyCashflow } from '@/lib/cashflow'
import { calcMetrics } from '@/lib/metrics'
import { buildProjections } from '@/lib/projections'
import { calcExit } from '@/lib/exit'
import { calcAlternative } from '@/lib/alternative'
import { calcSensitivity } from '@/lib/sensitivity'
import { applyScenario } from '@/lib/scenarios'

interface CalculatorStore {
  params: InputParams
  result: CalculationResult

  // Settery pro každou sekci
  setProperty: (p: Partial<PropertyParams>) => void
  setMortgage: (p: Partial<MortgageParams>) => void
  setRental: (p: Partial<RentalParams>) => void
  setCosts: (p: Partial<CostParams>) => void
  setTax: (p: Partial<TaxParams>) => void
  setMacro: (p: Partial<MacroParams>) => void
  setExit: (p: Partial<ExitParams>) => void
  setScenario: (s: ScenarioType) => void
  setShowInflationAdjusted: (v: boolean) => void
  setShowAfterTax: (v: boolean) => void
  resetToDefaults: () => void
}

function calculate(params: InputParams): CalculationResult {
  const adjustedParams = applyScenario(params, params.scenario)

  const loanAmount = adjustedParams.property.purchasePrice - adjustedParams.property.equity
  const mortgage = calcMortgage(adjustedParams.property, adjustedParams.mortgage)

  // Měsíční úrok (rok 1, měsíc 1)
  const monthlyInterest = loanAmount * (adjustedParams.mortgage.interestRate / 100 / 12)

  const monthly = calcMonthlyCashflow(adjustedParams, mortgage.monthlyPayment, monthlyInterest)

  const projections = buildProjections(adjustedParams, loanAmount)

  // Počáteční investice pro metriky
  const acquisitionCosts =
    adjustedParams.property.purchasePrice * (adjustedParams.property.acquisitionCosts / 100)
  const initialInvestment =
    adjustedParams.property.equity +
    acquisitionCosts +
    adjustedParams.property.renovationCosts +
    adjustedParams.property.initialReserve

  const metrics = calcMetrics(adjustedParams, mortgage, monthly, projections)
  const exit = calcExit(adjustedParams, projections, initialInvestment)

  const alternative = calcAlternative(
    initialInvestment,
    projections,
    exit.netSaleProfit,
    adjustedParams.exit.alternativeReturnRate,
    adjustedParams.exit.holdingYears,
  )

  const sensitivity = calcSensitivity(adjustedParams, loanAmount, initialInvestment)

  return { mortgage, monthly, metrics, projections, exit, alternative, sensitivity }
}

const initialResult = calculate(DEFAULT_PARAMS)

export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
  params: DEFAULT_PARAMS,
  result: initialResult,

  setProperty: (p) => {
    const property = { ...get().params.property, ...p }
    // Akontace nesmí přerůst cenu — jinak by úvěr vyšel záporný.
    // Hlídáme tady, protože cena i akontace se mění nezávisle na sobě.
    property.equity = Math.min(Math.max(0, property.equity), property.purchasePrice)
    const params = { ...get().params, property }
    set({ params, result: calculate(params) })
  },
  setMortgage: (p) => {
    const params = { ...get().params, mortgage: { ...get().params.mortgage, ...p } }
    set({ params, result: calculate(params) })
  },
  setRental: (p) => {
    const params = { ...get().params, rental: { ...get().params.rental, ...p } }
    set({ params, result: calculate(params) })
  },
  setCosts: (p) => {
    const params = { ...get().params, costs: { ...get().params.costs, ...p } }
    set({ params, result: calculate(params) })
  },
  setTax: (p) => {
    const params = { ...get().params, tax: { ...get().params.tax, ...p } }
    set({ params, result: calculate(params) })
  },
  setMacro: (p) => {
    const params = { ...get().params, macro: { ...get().params.macro, ...p } }
    set({ params, result: calculate(params) })
  },
  setExit: (p) => {
    const params = { ...get().params, exit: { ...get().params.exit, ...p } }
    set({ params, result: calculate(params) })
  },
  setScenario: (scenario) => {
    const params = { ...get().params, scenario }
    set({ params, result: calculate(params) })
  },
  setShowInflationAdjusted: (showInflationAdjusted) => {
    const params = { ...get().params, showInflationAdjusted }
    set({ params, result: calculate(params) })
  },
  setShowAfterTax: (showAfterTax) => {
    const params = { ...get().params, showAfterTax }
    set({ params, result: calculate(params) })
  },
  resetToDefaults: () => {
    set({ params: DEFAULT_PARAMS, result: calculate(DEFAULT_PARAMS) })
  },
}))
