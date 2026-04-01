import type { InputParams, MonthlyCashflow } from '@/types'

/**
 * Roční provozní náklady (bez hypotéky)
 */
export function calcAnnualOperatingCosts(params: InputParams): number {
  const { costs } = params
  const managementCost = costs.managementFee * 12

  return (
    costs.repairFund * 12 +
    costs.insurance +
    costs.propertyTax +
    managementCost +
    costs.repairs +
    costs.tenantChangeCost +
    costs.legalCosts
  )
}

/**
 * Výpočet daně dle zvoleného režimu
 */
export function calcTax(
  params: InputParams,
  effectiveAnnualRent: number,
  annualOperatingCosts: number,
  annualInterest: number,
  mortgagePayment: number,
): number {
  const { tax } = params

  let taxableIncome: number

  if (tax.regime === 'pausal') {
    // Paušál 30 % (max 600 000 Kč výdajů)
    const flatExpenses = Math.min(effectiveAnnualRent * 0.3, 600_000)
    taxableIncome = Math.max(0, effectiveAnnualRent - flatExpenses)
  } else {
    // Skutečné náklady — odpisy jsou zahrnuty v annualOperatingCosts při volání z projections.ts
    const deductible = annualOperatingCosts + annualInterest
    taxableIncome = Math.max(0, effectiveAnnualRent - deductible)
  }

  return taxableIncome * (tax.incomeTaxRate / 100)
}

/**
 * Měsíční cashflow (rok 0, bez růstu nájmu)
 */
export function calcMonthlyCashflow(
  params: InputParams,
  monthlyMortgage: number,
  monthlyInterest: number,
): MonthlyCashflow {
  const { rental, costs } = params

  const grossRent = rental.monthlyRent + rental.otherIncome
  const effectiveRent = grossRent * (1 - rental.vacancyRate / 100)

  const annualOperatingCosts = calcAnnualOperatingCosts(params)
  const monthlyOperatingCosts = annualOperatingCosts / 12

  const noi = effectiveRent - monthlyOperatingCosts
  const cashflow = noi - monthlyMortgage

  const annualTax = calcTax(
    params,
    effectiveRent * 12,
    annualOperatingCosts,
    monthlyInterest * 12,
    monthlyMortgage * 12,
  )
  const monthlyTax = annualTax / 12

  return {
    grossRent,
    effectiveRent,
    operatingCosts: monthlyOperatingCosts,
    mortgagePayment: monthlyMortgage,
    noi,
    cashflow,
    taxableIncome: Math.max(0, effectiveRent * 12 - annualOperatingCosts) / 12,
    tax: monthlyTax,
    netCashflow: cashflow - monthlyTax,
  }
}
