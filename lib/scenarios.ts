import type { InputParams, ScenarioType } from '@/types'
import { SCENARIO_ADJUSTMENTS } from '@/constants/scenarios'

/**
 * Aplikuje úpravy scénáře na vstupní parametry.
 * Scénář upravuje klíčové makro/provozní parametry.
 */
export function applyScenario(params: InputParams, scenario: ScenarioType): InputParams {
  const adj = SCENARIO_ADJUSTMENTS[scenario]

  return {
    ...params,
    rental: {
      ...params.rental,
      annualRentGrowth: Math.max(0, params.rental.annualRentGrowth + adj.rentGrowthDelta),
      vacancyRate: Math.max(0, Math.min(30, params.rental.vacancyRate + adj.vacancyRateDelta)),
    },
    macro: {
      ...params.macro,
      propertyGrowthRate: Math.max(0, params.macro.propertyGrowthRate + adj.propertyGrowthDelta),
    },
    costs: {
      ...params.costs,
      repairs: params.costs.repairs * adj.repairsDelta,
    },
    mortgage: {
      ...params.mortgage,
      rateAfterFixation: Math.max(
        0,
        params.mortgage.rateAfterFixation + adj.rateAfterFixationDelta,
      ),
    },
  }
}
