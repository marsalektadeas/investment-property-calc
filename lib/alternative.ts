import type { AlternativeResult, YearlyProjection } from '@/types'

/**
 * Porovnání s alternativní investicí (opportunity cost).
 *
 * Logika (fair srovnání):
 * - Investuješ stejnou počáteční částku (initialInvestment) do alternativy.
 * - Každý rok se portfolio zhodnotí o returnRate.
 * - Pokud má nemovitost záporný cashflow (doplatíš), tuto částku přidáš do alternativy
 *   (peníze, které by jinak šly do nemovitosti, reinvestuješ).
 * - Pokud má nemovitost kladný cashflow (vyděláš), tuto částku z alternativy odebereš
 *   (nemovitost ti ji dala, alternativa ne — ekvivalentní výběr).
 *
 * Výsledek = co bys měl po holdingYears, kdybys nekoupil nemovitost.
 */
export function calcAlternative(
  initialInvestment: number,
  projections: YearlyProjection[],
  returnRate: number,
  holdingYears: number,
): AlternativeResult {
  const rate = returnRate / 100
  let portfolio = initialInvestment

  const totalReturn = portfolio - initialInvestment
  const totalROI = (totalReturn / initialInvestment) * 100
  const cumulativeMultiple = portfolio / initialInvestment
  const annualizedROI =
    holdingYears > 0 && cumulativeMultiple > 0
      ? (Math.pow(cumulativeMultiple, 1 / holdingYears) - 1) * 100
      : 0

  return {
    finalPortfolio: portfolio,
    totalReturn,
    totalROI,
    annualizedROI,
    advantage: 0,
  }
}
