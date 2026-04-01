# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server at localhost:3000
npm run build    # production build (also runs tsc)
npm run lint     # ESLint
npx tsc --noEmit # type-check only, without building
```

No test suite — verify changes with `npx tsc --noEmit` + `npm run build`.

## Architecture

**Stack:** Next.js 16 App Router · Tailwind CSS v4 · Zustand · Recharts · TypeScript

### Data flow

All calculation logic is pure TypeScript in `/lib` — no React, no side effects. The Zustand store in `/store/useCalculatorStore.ts` is the single source of truth: it holds all input params and the full `CalculationResult`. Every setter immediately calls `calculate()` which runs the full pipeline synchronously.

```
User input → setter → calculate() → store.result → components re-render
```

### Calculation pipeline (order matters)

1. `applyScenario()` — adjusts params for conservative/realistic/optimistic
2. `calcMortgage()` — loan amount, LTV, monthly payment
3. `buildAmortizationTable()` — full month-by-month amortization with rate change after fixation
4. `calcMonthlyCashflow()` — year-1 snapshot used in SummaryCards
5. `buildProjections()` — yearly projections for full holding period; costs inflate annually, rent grows annually
6. `calcMetrics()` — Cap Rate, CoC, DSCR, break-even, payback
7. `calcExit()` — projected sale price, net profit, CAGR

### Key types (`/types/index.ts`)

`InputParams` is the single input object (7 sub-sections + 2 toggles). `YearlyProjection` contains **4 cashflow variants** per year — the combination of `afterTax × real`:

| field | before tax | after tax |
|---|---|---|
| nominal | `cashflow` / `cumulativeCashflow` | `netCashflow` / `cumulativeNetCashflow` |
| real (inflation-adj.) | `realCashflow` / `cumulativeRealCashflow` | `realNetCashflow` / `cumulativeRealNetCashflow` |

Use `pickCashflow()` and `pickCumulative()` from `/utils/projectionHelpers.ts` to select the right variant based on `showAfterTax` and `showInflationAdjusted` toggles — don't access projection fields directly in components.

### Tax logic

`calcTax()` in `/lib/cashflow.ts` handles both regimes:
- **Paušál:** 30 % flat expense deduction (max 600 000 Kč/year)
- **Skutečné náklady:** `operatingCosts + interest + depreciation` deducted

Depreciation (`1.5 % × 75 % × purchasePrice`) is computed in `buildProjections` and passed into `calcTax` as part of `annualOperatingCosts` — not inside `calcTax` itself.

### Scenarios

Scenarios (`/lib/scenarios.ts`) **delta-adjust** the user's own inputs — they don't override them with fixed values. Conservative/optimistic shift rent growth, vacancy, property growth, repair costs, and rate-after-fixation relative to whatever the user set.

### managementFee

`costs.managementFee` is in **Kč/měsíc** (not % of rent). It's also inflated annually in `buildProjections` alongside other operating costs.
