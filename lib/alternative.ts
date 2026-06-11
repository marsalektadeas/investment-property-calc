import type { AlternativeResult, YearlyProjection } from '@/types'

/**
 * Fér srovnání nemovitosti s alternativní investicí (opportunity cost).
 *
 * Obě varianty startují se stejným počátečním kapitálem (initialInvestment)
 * a průběžné peníze se v obou úročí stejnou alternativní sazbou — porovnáváme
 * tedy terminální bohatství na jednom společném základě.
 *
 * - Alternativa (nekoupíš): počáteční kapitál se složeně úročí alternativní
 *   sazbou po celou dobu držení.
 * - Nemovitost (koupíš): na konci dostaneš čistý výtěžek z prodeje
 *   (netSaleProfit) + průběžný čistý cashflow reinvestovaný stejnou
 *   alternativní sazbou až do horizontu. Záporný cashflow (doplácíš)
 *   bohatství snižuje, kladný zvyšuje.
 *
 * Pozn.: Dřívější verze odečítala cashflow z alternativy a zároveň ho
 * přičítala k nemovitosti, což ho u kladného cashflow počítalo dvakrát ve
 * prospěch nemovitosti. Navíc property CAGR a alternativa používaly jinou
 * metodu. Tahle verze obojí sjednocuje.
 */
export function calcAlternative(
  initialInvestment: number,
  projections: YearlyProjection[],
  netSaleProfit: number,
  returnRate: number,
  holdingYears: number,
): AlternativeResult {
  const rate = returnRate / 100

  // Alternativa: počáteční kapitál složeně úročený alternativní sazbou
  const finalPortfolio = initialInvestment * Math.pow(1 + rate, holdingYears)

  // Nemovitost: výtěžek z prodeje + cashflow reinvestovaný alt. sazbou.
  // Cashflow roku Y přijde na konci roku Y → zhodnocuje se (holdingYears − Y) let.
  const cashflowFutureValue = projections.reduce((sum, p, i) => {
    const yearsRemaining = Math.max(0, holdingYears - (i + 1))
    return sum + p.netCashflow * Math.pow(1 + rate, yearsRemaining)
  }, 0)
  const propertyFinalWealth = netSaleProfit + cashflowFutureValue

  const totalReturn = finalPortfolio - initialInvestment
  const totalROI = initialInvestment > 0 ? (totalReturn / initialInvestment) * 100 : 0
  // CAGR čistého složeného úročení je přesně alternativní sazba
  const annualizedROI = holdingYears > 0 ? returnRate : 0
  const advantage = propertyFinalWealth - finalPortfolio

  return {
    finalPortfolio,
    propertyFinalWealth,
    totalReturn,
    totalROI,
    annualizedROI,
    advantage,
  }
}
