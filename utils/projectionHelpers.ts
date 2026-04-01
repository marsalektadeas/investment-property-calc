import type { YearlyProjection } from '@/types'

/**
 * Vybere správnou cashflow hodnotu pro daný rok dle přepínačů.
 * Kombinuje oba přepínače nezávisle.
 */
export function pickCashflow(
  p: YearlyProjection,
  afterTax: boolean,
  real: boolean,
): number {
  if (real && afterTax) return p.realNetCashflow
  if (real && !afterTax) return p.realCashflow
  if (!real && afterTax) return p.netCashflow
  return p.cashflow
}

export function pickCumulative(
  p: YearlyProjection,
  afterTax: boolean,
  real: boolean,
): number {
  if (real && afterTax) return p.cumulativeRealNetCashflow
  if (real && !afterTax) return p.cumulativeRealCashflow
  if (!real && afterTax) return p.cumulativeNetCashflow
  return p.cumulativeCashflow
}
