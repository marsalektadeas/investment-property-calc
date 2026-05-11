'use client'

import { useEffect, useState } from 'react'
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

  return (
    <div className="min-h-screen bg-[#f9f7f4]">
      {/* Header */}
      <header className="bg-[#111111] sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Logo + title */}
          <div className="flex items-center justify-between gap-3 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              {/* Logo mark */}
              <div className="w-8 h-8 rounded-full border border-[#C9A84C] flex items-center justify-center flex-shrink-0">
                <span className="text-[#C9A84C] text-sm font-bold leading-none">A</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-white text-sm font-bold tracking-widest uppercase">Anomia</span>
                  <span className="text-[#C9A84C] text-[10px] uppercase tracking-wider hidden sm:inline">Real Estate</span>
                </div>
                <p className="text-xs text-gray-500 truncate">Kalkulačka investiční nemovitosti</p>
              </div>
            </div>
            {propertyId && (
              <button
                onClick={handleSaveToBuyFlat}
                disabled={saving || saved}
                className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  saved
                    ? 'bg-green-600 text-white'
                    : 'bg-[#C9A84C] text-[#111111] hover:bg-[#b8963e]'
                }`}
              >
                {saved ? '✓ Uloženo' : saving ? 'Ukládám...' : 'Uložit do BuyFlat'}
              </button>
            )}
          </div>
          {/* Toggles + reset */}
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
              onClick={resetToDefaults}
              className="text-xs text-gray-600 hover:text-gray-300 underline underline-offset-2 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col lg:flex-row gap-6 items-start">
        {/* Left column — inputs */}
        <div className="w-full lg:w-[380px] lg:flex-shrink-0 space-y-3">
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
          <SummaryCards />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CashflowChart />
            <EquityChart />
          </div>
          <ExitSummary />
          <YearlyTable />
        </div>
      </div>
    </div>
  )
}
