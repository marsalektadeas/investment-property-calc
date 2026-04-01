import type { InputParams, ExitResult, YearlyProjection } from '@/types'

export function calcExit(
  params: InputParams,
  projections: YearlyProjection[],
  initialInvestment: number,
): ExitResult {
  const { exit } = params
  const holdingYears = exit.holdingYears

  // Vezmu projekci pro rok prodeje (nebo poslední dostupný)
  const exitProjection = projections[holdingYears - 1] ?? projections[projections.length - 1]

  const projectedValue = exitProjection.propertyValue
  const remainingLoan = exitProjection.loanBalance

  const sellingCostsAmount = projectedValue * (exit.sellingCosts / 100)
  const grossSaleProfit = projectedValue - remainingLoan - sellingCostsAmount

  // Daň z kapitálového zisku (ze zisku oproti pořizovací ceně)
  const capitalGain = projectedValue - params.property.purchasePrice
  const capitalGainsTaxAmount =
    capitalGain > 0 ? capitalGain * (exit.capitalGainsTax / 100) : 0

  const netSaleProfit = grossSaleProfit - capitalGainsTaxAmount

  // Celkový kumulativní cashflow za dobu držení (po daních, nominální)
  const totalCashflow = exitProjection.cumulativeNetCashflow

  // Celkový výnos = čistý zisk z prodeje + cashflow - počáteční investice
  const totalReturn = netSaleProfit + totalCashflow - initialInvestment

  // ROI celkové
  const totalROI = (totalReturn / initialInvestment) * 100

  // Anualizované ROI (CAGR)
  // CAGR = (finalValue / initialValue)^(1/roky) - 1
  // Pokud je ztráta větší než investice, CAGR není definovaný — vrátíme 0
  const cumulativeMultiple = 1 + totalReturn / initialInvestment
  const annualizedROI =
    holdingYears > 0 && cumulativeMultiple > 0
      ? (Math.pow(cumulativeMultiple, 1 / holdingYears) - 1) * 100
      : 0

  return {
    projectedValue,
    remainingLoan,
    grossSaleProfit,
    sellingCosts: sellingCostsAmount,
    capitalGainsTax: capitalGainsTaxAmount,
    netSaleProfit,
    totalCashflow,
    totalReturn,
    totalROI,
    annualizedROI,
  }
}
