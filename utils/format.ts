const CZK = new Intl.NumberFormat('cs-CZ', {
  style: 'currency',
  currency: 'CZK',
  maximumFractionDigits: 0,
})

const CZK_DECIMAL = new Intl.NumberFormat('cs-CZ', {
  style: 'currency',
  currency: 'CZK',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

const NUM = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 })

export function formatCZK(value: number): string {
  return CZK.format(value)
}

export function formatCZKDecimal(value: number): string {
  return CZK_DECIMAL.format(value)
}

export function formatNumber(value: number): string {
  return NUM.format(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals).replace('.', ',')} %`
}

export function formatMultiplier(value: number): string {
  return `${value.toFixed(2).replace('.', ',')}×`
}

export function formatYears(value: number): string {
  if (value === 1) return '1 rok'
  if (value >= 2 && value <= 4) return `${value} roky`
  return `${value} let`
}

export function formatMonths(value: number): string {
  const rounded = Math.round(value)
  if (rounded === 1) return '1 měsíc'
  if (rounded >= 2 && rounded <= 4) return `${rounded} měsíce`
  return `${rounded} měsíců`
}

/** Zkrácené CZK pro grafy (1 250 000 → 1,25 mil.) */
export function formatCZKShort(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2).replace('.', ',')} mil. Kč`
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(0)} tis. Kč`
  }
  return `${value.toFixed(0)} Kč`
}
