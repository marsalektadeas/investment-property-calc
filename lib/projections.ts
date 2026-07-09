import type { InputParams, YearlyProjection } from '@/types'
import { buildAmortizationTable } from './mortgage'
import { calcAnnualOperatingCosts, calcTax } from './cashflow'
import { toReal } from '@/utils/inflation'

export function buildProjections(params: InputParams, loanAmount: number): YearlyProjection[] {
  const { rental, macro, mortgage, tax, property } = params
  // Přehled sahá po horizont (projectionYears), ne jen po rok prodeje —
  // ať jsou vidět i roky po splacení hypotéky (čistý nájem bez splátky).
  const years = Math.max(params.exit.projectionYears, params.exit.holdingYears)
  const amortization = buildAmortizationTable(loanAmount, mortgage)

  const projections: YearlyProjection[] = []
  let cumulativeCashflow = 0
  let cumulativeNetCashflow = 0
  let cumulativeRealCashflow = 0
  let cumulativeRealNetCashflow = 0

  for (let year = 1; year <= years; year++) {
    const rentGrowthFactor = Math.pow(1 + rental.annualRentGrowth / 100, year - 1)
    const monthlyRent = rental.monthlyRent * rentGrowthFactor
    const monthlyEffectiveRent = monthlyRent * (1 - rental.vacancyRate / 100)
    const annualEffectiveRent = monthlyEffectiveRent * 12

    // Provozní náklady rostou s inflací
    const costInflationFactor = Math.pow(1 + macro.inflation / 100, year - 1)
    const paramsThisYear: InputParams = {
      ...params,
      costs: {
        ...params.costs,
        repairFund: params.costs.repairFund * costInflationFactor,
        insurance: params.costs.insurance * costInflationFactor,
        propertyTax: params.costs.propertyTax * costInflationFactor,
        managementFee: params.costs.managementFee * costInflationFactor,
        repairs: params.costs.repairs * costInflationFactor,
        tenantChangeCost: params.costs.tenantChangeCost * costInflationFactor,
        legalCosts: params.costs.legalCosts * costInflationFactor,
      },
    }
    const annualOperatingCosts = calcAnnualOperatingCosts(paramsThisYear)

    const startMonth = (year - 1) * 12 + 1
    const endMonth = Math.min(year * 12, amortization.length)

    let annualPayment = 0
    let annualInterest = 0
    let annualPrincipal = 0

    for (let m = startMonth; m <= endMonth; m++) {
      const row = amortization[m - 1]
      annualPayment += row.payment
      annualInterest += row.interest
      annualPrincipal += row.principal
    }

    const loanBalance = endMonth <= amortization.length ? amortization[endMonth - 1].balance : 0

    const noi = annualEffectiveRent - annualOperatingCosts
    const cashflow = noi - annualPayment

    // Odpisy — předáme do calcTax přes upravené params
    const depreciationAmount =
      tax.depreciation && tax.regime === 'skutecne'
        ? property.purchasePrice * 0.75 * 0.015
        : 0

    const annualTax = calcTax(
      paramsThisYear,
      annualEffectiveRent,
      annualOperatingCosts + depreciationAmount,
      annualInterest,
      annualPayment,
    )

    const netCashflow = cashflow - annualTax
    const realCashflow = toReal(cashflow, macro.inflation, year)
    const realNetCashflow = toReal(netCashflow, macro.inflation, year)

    cumulativeCashflow += cashflow
    cumulativeNetCashflow += netCashflow
    cumulativeRealCashflow += realCashflow
    cumulativeRealNetCashflow += realNetCashflow

    const propertyValue = property.purchasePrice * Math.pow(1 + macro.propertyGrowthRate / 100, year)
    const equity = propertyValue - loanBalance

    projections.push({
      year,
      rent: monthlyRent * 12,
      effectiveRent: annualEffectiveRent,
      operatingCosts: annualOperatingCosts,
      noi,
      mortgagePayment: annualPayment,
      interest: annualInterest,
      principal: annualPrincipal,
      loanBalance,
      cashflow,
      netCashflow,
      realCashflow,
      realNetCashflow,
      cumulativeCashflow,
      cumulativeNetCashflow,
      cumulativeRealCashflow,
      cumulativeRealNetCashflow,
      propertyValue,
      equity,
      tax: annualTax,
    })
  }

  return projections
}
