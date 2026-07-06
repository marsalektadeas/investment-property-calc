import type { InputParams, SensitivityResult } from '@/types'
import { buildProjections } from './projections'
import { calcExit } from './exit'
import { calcAlternative } from './alternative'

// Odchylky v procentních bodech oproti aktuálnímu nastavení.
const GROWTH_DELTAS = [-2, 0, 2] // zhodnocení nemovitosti
const ALT_DELTAS = [-2, 0, 2] // alternativní (ETF) sazba

/**
 * Jak křehký je výsledek „koupit vs. ETF"? Přepočítá rozdíl (advantage) přes
 * mřížku dvou nejcitlivějších předpokladů: zhodnocení nemovitosti (řádky) ×
 * alternativní výnos (sloupce). Střední buňka (0, 0) odpovídá hlavnímu výsledku.
 *
 * Zhodnocení nemovitosti mění projekce i výtěžek z prodeje → přepočítáváme
 * projekce+exit pro každý řádek. Alternativní sazba ovlivňuje jen srovnání →
 * měníme ji uvnitř řádku.
 */
export function calcSensitivity(
  params: InputParams,
  loanAmount: number,
  initialInvestment: number,
): SensitivityResult {
  const matrix = GROWTH_DELTAS.map((growthDelta) => {
    const p: InputParams = {
      ...params,
      macro: {
        ...params.macro,
        propertyGrowthRate: params.macro.propertyGrowthRate + growthDelta,
      },
    }
    const projections = buildProjections(p, loanAmount)
    const exit = calcExit(p, projections, initialInvestment)

    return ALT_DELTAS.map((altDelta) => {
      const alternative = calcAlternative(
        initialInvestment,
        projections,
        exit.netSaleProfit,
        params.exit.alternativeReturnRate + altDelta,
        params.exit.holdingYears,
      )
      return alternative.advantage
    })
  })

  return {
    growthDeltas: GROWTH_DELTAS,
    altDeltas: ALT_DELTAS,
    baseGrowth: params.macro.propertyGrowthRate,
    baseAlt: params.exit.alternativeReturnRate,
    matrix,
  }
}
