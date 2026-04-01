import type { ScenarioType } from '@/types'

interface ScenarioAdjustments {
  rentGrowthDelta: number       // delta k realistickému
  propertyGrowthDelta: number
  vacancyRateDelta: number
  repairsDelta: number          // multiplikátor (1 = beze změny)
  rateAfterFixationDelta: number
}

export const SCENARIO_ADJUSTMENTS: Record<ScenarioType, ScenarioAdjustments> = {
  conservative: {
    rentGrowthDelta: -1.5,
    propertyGrowthDelta: -2,
    vacancyRateDelta: +3,
    repairsDelta: 1.5,
    rateAfterFixationDelta: +1,
  },
  realistic: {
    rentGrowthDelta: 0,
    propertyGrowthDelta: 0,
    vacancyRateDelta: 0,
    repairsDelta: 1,
    rateAfterFixationDelta: 0,
  },
  optimistic: {
    rentGrowthDelta: +1.5,
    propertyGrowthDelta: +2,
    vacancyRateDelta: -2,
    repairsDelta: 0.7,
    rateAfterFixationDelta: -0.5,
  },
}

export const SCENARIO_LABELS: Record<ScenarioType, string> = {
  conservative: 'Konzervativní',
  realistic: 'Realistický',
  optimistic: 'Optimistický',
}
