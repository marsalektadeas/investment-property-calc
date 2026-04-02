// ─── Input Parameters ─────────────────────────────────────────────────────────

export interface PropertyParams {
  purchasePrice: number
  equity: number
  acquisitionCosts: number      // % z ceny
  renovationCosts: number
  initialReserve: number
}

export interface MortgageParams {
  interestRate: number          // %
  fixationYears: number
  termYears: number
  rateAfterFixation: number     // %
  startYear: number
}

export interface RentalParams {
  monthlyRent: number
  vacancyRate: number           // % (5 = 5 %)
  otherIncome: number           // měsíčně
  annualRentGrowth: number      // %
}

export interface CostParams {
  repairFund: number            // Kč/měsíc
  insurance: number             // Kč/rok
  propertyTax: number           // Kč/rok
  managementFee: number         // Kč/měsíc
  repairs: number               // Kč/rok
  tenantChangeCost: number      // Kč/rok (amortizováno)
  legalCosts: number            // Kč/rok
}

export interface TaxParams {
  incomeTaxRate: number         // %
  regime: 'skutecne' | 'pausal'
  depreciation: boolean
}

export interface MacroParams {
  inflation: number             // %
  propertyGrowthRate: number    // % ročně
}

export interface ExitParams {
  holdingYears: number
  sellingCosts: number          // % z prodejní ceny
  capitalGainsTax: number       // % ze zisku
  alternativeReturnRate: number // % ročně (alternativní investice)
}

export type ScenarioType = 'conservative' | 'realistic' | 'optimistic'

export interface InputParams {
  property: PropertyParams
  mortgage: MortgageParams
  rental: RentalParams
  costs: CostParams
  tax: TaxParams
  macro: MacroParams
  exit: ExitParams
  scenario: ScenarioType
  showInflationAdjusted: boolean
  showAfterTax: boolean
}

// ─── Calculation Results ──────────────────────────────────────────────────────

export interface MortgageResult {
  monthlyPayment: number
  totalInterest: number
  totalPaid: number
  ltv: number
  loanAmount: number
}

export interface MonthlyCashflow {
  grossRent: number
  effectiveRent: number         // po neobsazenosti
  operatingCosts: number
  mortgagePayment: number
  noi: number                   // Net Operating Income (bez hypotéky)
  cashflow: number              // po hypotéce
  taxableIncome: number
  tax: number
  netCashflow: number           // po daních
}

export interface YearlyProjection {
  year: number
  rent: number
  effectiveRent: number
  operatingCosts: number
  noi: number
  mortgagePayment: number
  interest: number
  principal: number
  loanBalance: number
  cashflow: number              // před daněmi, nominální
  netCashflow: number           // po daních, nominální
  realCashflow: number          // před daněmi, reálný (po inflaci)
  realNetCashflow: number       // po daních, reálný (po inflaci)
  cumulativeCashflow: number    // před daněmi, nominální
  cumulativeNetCashflow: number // po daních, nominální
  cumulativeRealCashflow: number       // před daněmi, reálný
  cumulativeRealNetCashflow: number    // po daních, reálný
  propertyValue: number
  equity: number
  tax: number
}

export interface KeyMetrics {
  initialInvestment: number     // vlastní kapitál + náklady
  monthlyMortgage: number
  monthlyCashflow: number
  annualCashflow: number
  noi: number
  capRate: number               // %
  cashOnCash: number            // %
  roi: number                   // %
  dscr: number
  breakEvenOccupancy: number    // % obsazenosti nutné pro BE
  paybackYears: number | null   // null = nikdy v daném horizontu
  loanAmount: number
  ltv: number
}

export interface ExitResult {
  projectedValue: number
  remainingLoan: number
  grossSaleProfit: number       // cena - loan
  sellingCosts: number
  capitalGainsTax: number
  netSaleProfit: number
  totalCashflow: number         // kumulovaný cashflow za dobu držení
  totalReturn: number           // čistý zisk z prodeje + cashflow
  totalROI: number              // % z počáteční investice
  annualizedROI: number         // % ročně (CAGR)
}

export interface AlternativeResult {
  finalPortfolio: number        // hodnota portfolia na konci
  totalReturn: number           // zisk oproti počáteční investici
  totalROI: number              // % z počáteční investice
  annualizedROI: number         // % ročně (CAGR)
  advantage: number             // nemovitost − alternativa (kladné = nem. vyhrává)
}

export interface CalculationResult {
  mortgage: MortgageResult
  monthly: MonthlyCashflow
  metrics: KeyMetrics
  projections: YearlyProjection[]
  exit: ExitResult
  alternative: AlternativeResult
}
