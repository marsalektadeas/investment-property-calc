import type { AlternativeResult, YearlyProjection } from '@/types'

/**
 * Fér srovnání „koupím nemovitost" vs. „dám peníze do ETF" na jednom
 * intuitivním základě: kolik reálně skončí na účtu v každém scénáři, když do
 * obou nasypeš úplně stejnou hotovost ve stejných okamžicích.
 *
 * Společný cash schéma:
 *   - t0: obě varianty startují stejným počátečním kapitálem (initialInvestment).
 *   - každý rok: nemovitost buď žádá doplatek (záporný cashflow), nebo vyplácí
 *     přebytek (kladný cashflow).
 *
 * Nemovitost — na účtu:
 *   čistý výtěžek z prodeje (netSaleProfit) + přebytkový nájem (kladný cashflow)
 *   reinvestovaný alternativní sazbou až do horizontu. Doplatky jsou utopené
 *   v nemovitosti (dostaneš je zpět v ceně při prodeji).
 *
 * Alternativa (ETF) — na účtu:
 *   počáteční kapitál složeně úročený + KAŽDÝ doplatek, který bys jinak poslal
 *   do hypotéky, místo toho investovaný stejnou sazbou. Tím oba scénáře
 *   spotřebují stejnou hotovost a jsou přímo srovnatelné jako zůstatky na účtu.
 *
 * Rozdíl (advantage) je matematicky totožný s klasickým opportunity-cost
 * modelem (netSaleProfit + FV(všech cashflow) − FV(počátečního kapitálu)),
 * jen jsou obě strany prezentované jako reálné terminální zůstatky, ne jako
 * salda očištěná o oportunitní náklad.
 */
export function calcAlternative(
  initialInvestment: number,
  projections: YearlyProjection[],
  netSaleProfit: number,
  returnRate: number,
  holdingYears: number,
): AlternativeResult {
  const rate = returnRate / 100

  // Budoucí hodnota částky vložené na konci roku Y → roste (holdingYears − Y) let.
  const fvAtRate = (amount: number, yearIndex: number) =>
    amount * Math.pow(1 + rate, Math.max(0, holdingYears - (yearIndex + 1)))

  // Nemovitost: výtěžek z prodeje + reinvestovaný přebytkový (kladný) cashflow.
  const reinvestedSurplus = projections.reduce(
    (sum, p, i) => sum + fvAtRate(Math.max(0, p.netCashflow), i),
    0,
  )
  const propertyFinalWealth = netSaleProfit + reinvestedSurplus

  // ETF: počáteční kapitál + doplatky (záporný cashflow) investované do ETF.
  const baseGrowth = initialInvestment * Math.pow(1 + rate, holdingYears)
  const topUpsInvested = projections.reduce(
    (sum, p, i) => sum + fvAtRate(Math.max(0, -p.netCashflow), i),
    0,
  )
  const finalPortfolio = baseGrowth + topUpsInvested

  // Kolik jsi do ETF celkem vložil (nominálně) — pro výnos alternativy.
  const totalContributed =
    initialInvestment +
    projections.reduce((sum, p) => sum + Math.max(0, -p.netCashflow), 0)

  const totalReturn = finalPortfolio - totalContributed
  const totalROI = totalContributed > 0 ? (totalReturn / totalContributed) * 100 : 0
  // Každá koruna v ETF roste alternativní sazbou → CAGR = sazba.
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
