import type { MortgageParams, PropertyParams, MortgageResult } from '@/types'

/**
 * Anuitní měsíční splátka
 * PMT = P × [r(1+r)^n] / [(1+r)^n - 1]
 */
export function calcMonthlyPayment(principal: number, annualRate: number, termYears: number): number {
  if (annualRate === 0) return principal / (termYears * 12)
  const r = annualRate / 100 / 12
  const n = termYears * 12
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

/**
 * Zůstatek úvěru po `monthsPaid` měsících
 */
export function calcLoanBalance(
  principal: number,
  annualRate: number,
  termYears: number,
  monthsPaid: number,
): number {
  if (annualRate === 0) return principal - (principal / (termYears * 12)) * monthsPaid
  const r = annualRate / 100 / 12
  const n = termYears * 12
  return principal * (Math.pow(1 + r, n) - Math.pow(1 + r, monthsPaid)) / (Math.pow(1 + r, n) - 1)
}

/**
 * Amortizační tabulka — měsíce 1..totalMonths
 * Vrací pole { month, payment, interest, principal, balance }
 */
export interface AmortizationRow {
  month: number
  payment: number
  interest: number
  principal: number
  balance: number
}

export function buildAmortizationTable(
  principal: number,
  params: MortgageParams,
): AmortizationRow[] {
  const totalMonths = params.termYears * 12
  const fixationMonths = params.fixationYears * 12
  const rows: AmortizationRow[] = []

  let balance = principal
  let currentRate = params.interestRate

  for (let month = 1; month <= totalMonths; month++) {
    // Změna sazby po fixaci
    if (month === fixationMonths + 1) {
      currentRate = params.rateAfterFixation
    }

    // Přepočítáme splátku při každé změně sazby (re-amortizace)
    const remainingMonths = totalMonths - month + 1
    const payment = calcMonthlyPayment(balance, currentRate, remainingMonths / 12)

    const interest = balance * (currentRate / 100 / 12)
    const principalPaid = payment - interest
    balance = Math.max(0, balance - principalPaid)

    rows.push({ month, payment, interest, principal: principalPaid, balance })
  }

  return rows
}

export function calcMortgage(
  property: PropertyParams,
  mortgage: MortgageParams,
): MortgageResult {
  const loanAmount = property.purchasePrice - property.equity
  const ltv = (loanAmount / property.purchasePrice) * 100
  const monthlyPayment = calcMonthlyPayment(loanAmount, mortgage.interestRate, mortgage.termYears)
  const totalPaid = monthlyPayment * mortgage.termYears * 12
  const totalInterest = totalPaid - loanAmount

  return { monthlyPayment, totalInterest, totalPaid, ltv, loanAmount }
}
