import type { InputParams, KeyMetrics, MonthlyCashflow, MortgageResult, YearlyProjection } from '@/types'

export function calcMetrics(
  params: InputParams,
  mortgage: MortgageResult,
  monthly: MonthlyCashflow,
  projections: YearlyProjection[],
): KeyMetrics {
  const { property } = params

  // Počáteční investice z vlastní kapsy
  const acquisitionCosts = property.purchasePrice * (property.acquisitionCosts / 100)
  const initialInvestment =
    property.equity + acquisitionCosts + property.renovationCosts + property.initialReserve

  // NOI (roční, rok 1)
  const annualNOI = monthly.noi * 12

  // Hrubá výnosnost = hrubý roční nájem / cena nemovitosti
  const grossYield = (monthly.grossRent * 12 / property.purchasePrice) * 100

  // Cap Rate = NOI / Purchase Price (= čistá výnosnost)
  const capRate = (annualNOI / property.purchasePrice) * 100

  // Cash-on-Cash Return = roční čistý cashflow / počáteční investice
  const annualNetCashflow = monthly.netCashflow * 12
  const cashOnCash = (annualNetCashflow / initialInvestment) * 100

  // ROI (rok 1) = (cashflow + odpis dluhu) / investice
  const firstYearPrincipal = projections[0]?.principal ?? 0
  const roi = ((annualNetCashflow + firstYearPrincipal) / initialInvestment) * 100

  // DSCR = NOI / roční hypotéka
  const annualMortgage = mortgage.monthlyPayment * 12
  const dscr = annualMortgage > 0 ? annualNOI / annualMortgage : 0

  // Break-even obsazenost: při jaké obsazenosti je cashflow = 0
  // cashflow = rent * occupancy - costs - mortgage = 0
  // occupancy = (costs + mortgage) / rent
  const grossMonthlyRent = monthly.grossRent
  const breakEvenOccupancy =
    grossMonthlyRent > 0
      ? ((monthly.operatingCosts + monthly.mortgagePayment) / grossMonthlyRent) * 100
      : 100

  // Doba návratnosti — kdy kumulativní cashflow (po daních) pokryje počáteční
  // investici. Jen v rámci doby držení (přehled může sahat dál kvůli zobrazení).
  let paybackYears: number | null = null
  for (const p of projections) {
    if (p.year > params.exit.holdingYears) break
    if (p.cumulativeNetCashflow >= initialInvestment) {
      paybackYears = p.year
      break
    }
  }

  return {
    initialInvestment,
    monthlyMortgage: mortgage.monthlyPayment,
    monthlyMortgageAfterFixation: mortgage.monthlyPaymentAfterFixation,
    monthlyCashflow: monthly.cashflow,
    annualCashflow: annualNetCashflow,
    noi: annualNOI,
    grossYield,
    capRate,
    cashOnCash,
    roi,
    dscr,
    breakEvenOccupancy,
    paybackYears,
    loanAmount: mortgage.loanAmount,
    ltv: mortgage.ltv,
  }
}
