'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCalculatorStore } from '@/store/useCalculatorStore'
import { ScenarioSelector } from '@/components/inputs/ScenarioSelector'
import { PropertyInputs } from '@/components/inputs/PropertyInputs'
import { MortgageInputs } from '@/components/inputs/MortgageInputs'
import { RentalInputs } from '@/components/inputs/RentalInputs'
import { CostInputs } from '@/components/inputs/CostInputs'
import { TaxInputs } from '@/components/inputs/TaxInputs'
import { MacroInputs } from '@/components/inputs/MacroInputs'
import { ExitInputs } from '@/components/inputs/ExitInputs'
import { SummaryCards } from '@/components/results/SummaryCards'
import { CashflowChart } from '@/components/results/CashflowChart'
import { EquityChart } from '@/components/results/EquityChart'
import { ExitSummary } from '@/components/results/ExitSummary'
import { YearlyTable } from '@/components/results/YearlyTable'
import { Toggle } from '@/components/ui/Toggle'
import { formatCZK, formatPercent } from '@/utils/format'
import { SCENARIO_LABELS } from '@/constants/scenarios'

export default function Home() {
  const { params, result, setProperty, setShowInflationAdjusted, setShowAfterTax, resetToDefaults } =
    useCalculatorStore()

  const [propertyId, setPropertyId] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [supabaseToken, setSupabaseToken] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const price = sp.get('price')
    const pid = sp.get('propertyId')
    const tok = sp.get('token')
    const stok = sp.get('supabaseToken')

    if (price) setProperty({ purchasePrice: Number(price) })
    if (pid) setPropertyId(pid)
    if (tok) setToken(tok)
    if (stok) setSupabaseToken(stok)
  }, [setProperty])

  async function handleSaveToBuyFlat() {
    if (!propertyId || !token) return
    setSaving(true)

    const payload = {
      metrics: result.metrics,
      exit: result.exit,
      alternative: result.alternative,
      params: {
        purchasePrice: params.property.purchasePrice,
        interestRate: params.mortgage.interestRate,
        holdingYears: params.exit.holdingYears,
        alternativeReturnRate: params.exit.alternativeReturnRate,
        scenario: params.scenario,
      },
      savedAt: new Date().toISOString(),
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-buyflat-token': token,
    }
    if (supabaseToken) headers['x-supabase-token'] = supabaseToken

    try {
      const res = await fetch(`https://buyflat.vercel.app/api/properties/${propertyId}/calculator`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  const loanAmount = params.property.purchasePrice - params.property.equity
  const ltv = params.property.purchasePrice > 0
    ? (loanAmount / params.property.purchasePrice) * 100
    : 0

  const printParams: [string, string][] = [
    ['Cena nemovitosti', formatCZK(params.property.purchasePrice)],
    ['Vlastní kapitál', formatCZK(params.property.equity)],
    ['LTV', formatPercent(ltv, 0)],
    ['Úroková sazba', formatPercent(params.mortgage.interestRate)],
    ['Splatnost', `${params.mortgage.termYears} let`],
    ['Fixace', `${params.mortgage.fixationYears} let`],
    ['Měsíční nájem', formatCZK(params.rental.monthlyRent)],
    ['Neobsazenost', formatPercent(params.rental.vacancyRate, 0)],
    ['Růst nájmu', formatPercent(params.rental.annualRentGrowth)],
    ['Inflace', formatPercent(params.macro.inflation)],
    ['Růst ceny nem.', formatPercent(params.macro.propertyGrowthRate)],
    ['Daňový režim', params.tax.regime === 'pausal' ? 'Paušál 30 %' : 'Skutečné náklady'],
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── Print-only header ─────────────────────────────────────────────────── */}
      <div className="hidden print:block px-0 pt-0">
        {/* Accent top bar */}
        <div className="h-[4px] bg-[#2563EB] mb-5" />
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[#0F172A] font-bold text-xl tracking-tight">Rent</span>
                <span className="text-[#2563EB] font-bold text-xl tracking-tight">Scope</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Investiční kalkulačka nemovitostí</p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-500 space-y-0.5">
            <p className="font-semibold text-gray-800 text-sm">{formatCZK(params.property.purchasePrice)}</p>
            <p>{SCENARIO_LABELS[params.scenario]} scénář · {params.exit.holdingYears} let</p>
            <p className="text-gray-400">Vygenerováno: {new Date().toLocaleDateString('cs-CZ')}</p>
          </div>
        </div>

        {/* Parameters summary grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {printParams.map(([label, value]) => (
            <div key={label} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2">
              <p className="text-[9px] text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
              <p className="font-semibold text-gray-800 text-xs">{value}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-[#E2E8F0] mb-5" />
      </div>

      {/* ── Screen header ─────────────────────────────────────────────────────── */}
      <header className="bg-[#0F172A] sticky top-0 z-40 print:hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Logo + title */}
          <div className="flex items-center justify-between gap-3 min-w-0">
            <Link href="/" className="flex items-center gap-3 min-w-0">
              <div className="min-w-0">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-white text-base font-bold tracking-tight">Rent</span>
                  <span className="text-[#60A5FA] text-base font-bold tracking-tight">Scope</span>
                </div>
                <p className="text-xs text-gray-400 truncate -mt-0.5">Investiční kalkulačka nemovitostí</p>
              </div>
            </Link>
            {propertyId && (
              <button
                onClick={handleSaveToBuyFlat}
                disabled={saving || saved}
                className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  saved
                    ? 'bg-green-600 text-white'
                    : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                }`}
              >
                {saved ? '✓ Uloženo' : saving ? 'Ukládám...' : 'Uložit do BuyFlat'}
              </button>
            )}
          </div>
          {/* Toggles + PDF + reset */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <Toggle
              label="Po inflaci"
              checked={params.showInflationAdjusted}
              onChange={setShowInflationAdjusted}
              className="text-gray-400 hover:text-white"
            />
            <Toggle
              label="Po daních"
              checked={params.showAfterTax}
              onChange={setShowAfterTax}
              className="text-gray-400 hover:text-white"
            />
            <button
              onClick={() => window.print()}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-600 text-gray-400 hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
            >
              PDF
            </button>
            <button
              onClick={resetToDefaults}
              className="text-xs text-gray-600 hover:text-gray-300 underline underline-offset-2 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* ── Main layout ───────────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-6 print:px-0 print:py-0 flex flex-col lg:flex-row gap-6 items-start">
        {/* Left column — hidden in print */}
        <div className="w-full lg:w-[380px] lg:flex-shrink-0 space-y-3 print:hidden">
          <ScenarioSelector />
          <PropertyInputs />
          <MortgageInputs />
          <RentalInputs />
          <CostInputs />
          <TaxInputs />
          <MacroInputs />
          <ExitInputs />
        </div>

        {/* Right column — results */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          <div className="print-avoid-break">
            <SummaryCards />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print-avoid-break">
            <CashflowChart />
            <EquityChart />
          </div>
          <div className="print-avoid-break">
            <ExitSummary />
          </div>
          {/* YearlyTable: starts on new page in print */}
          <div className="print:break-before-page">
            <YearlyTable />
          </div>
        </div>
      </div>
    </div>
  )
}
