import type { InputParams } from '@/types'

export const DEFAULT_PARAMS: InputParams = {
  property: {
    purchasePrice: 4_500_000,
    equity: 900_000,
    acquisitionCosts: 3,        // % z ceny
    renovationCosts: 200_000,
    initialReserve: 150_000,
  },
  mortgage: {
    interestRate: 5.2,
    fixationYears: 5,
    termYears: 30,
    rateAfterFixation: 5.0,
    startYear: new Date().getFullYear(),
  },
  rental: {
    monthlyRent: 18_000,
    vacancyRate: 5,
    otherIncome: 0,
    annualRentGrowth: 3,
  },
  costs: {
    repairFund: 1_500,
    insurance: 3_000,
    propertyTax: 1_500,
    managementFee: 0,
    repairs: 10_000,
    tenantChangeCost: 5_000,
    legalCosts: 2_000,
  },
  tax: {
    incomeTaxRate: 15,
    regime: 'pausal',
    depreciation: false,
  },
  macro: {
    inflation: 3,
    propertyGrowthRate: 4,
  },
  exit: {
    holdingYears: 10,
    projectionYears: 30,
    sellingCosts: 3,
    capitalGainsTax: 0,         // po 5 letech osvobozeno
    alternativeReturnRate: 7,   // % ročně (akciový trh)
  },
  scenario: 'realistic',
  showInflationAdjusted: false,
  showAfterTax: true,
}
