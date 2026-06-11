'use client'

import { useCalculatorStore } from '@/store/useCalculatorStore'
import { SCENARIO_LABELS } from '@/constants/scenarios'
import type { ScenarioType } from '@/types'

const SCENARIOS: ScenarioType[] = ['conservative', 'realistic', 'optimistic']

const SCENARIO_ACTIVE: Record<ScenarioType, string> = {
  conservative: 'bg-orange-500 text-white border-orange-500',
  realistic: 'bg-[#2563EB] text-white border-[#2563EB]',
  optimistic: 'bg-green-600 text-white border-green-600',
}

const SCENARIO_HINTS: Record<ScenarioType, string> = {
  conservative: 'cena −2 %, nájem −1,5 %, neobs. +3 %',
  realistic: 'vaše zadané hodnoty beze změny',
  optimistic: 'cena +2 %, nájem +1,5 %, neobs. −2 %',
}

export function ScenarioSelector() {
  const { params, setScenario } = useCalculatorStore()

  return (
    <div className="flex gap-2">
      {SCENARIOS.map((s) => (
        <button
          key={s}
          onClick={() => setScenario(s)}
          className={`flex-1 py-2 px-3 rounded-xl border transition-all text-left ${
            params.scenario === s
              ? SCENARIO_ACTIVE[s]
              : 'bg-white text-gray-600 border-[#E2E8F0] hover:border-[#2563EB]'
          }`}
        >
          <div className="text-sm font-medium">{SCENARIO_LABELS[s]}</div>
          <div className={`text-xs mt-0.5 leading-tight ${params.scenario === s ? 'opacity-70' : 'text-gray-400'}`}>
            {SCENARIO_HINTS[s]}
          </div>
        </button>
      ))}
    </div>
  )
}
