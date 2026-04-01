'use client'

import { useCalculatorStore } from '@/store/useCalculatorStore'
import { SCENARIO_LABELS } from '@/constants/scenarios'
import type { ScenarioType } from '@/types'

const SCENARIOS: ScenarioType[] = ['conservative', 'realistic', 'optimistic']

const SCENARIO_COLORS: Record<ScenarioType, string> = {
  conservative: 'border-orange-400 bg-orange-50 text-orange-700',
  realistic: 'border-blue-500 bg-blue-50 text-blue-700',
  optimistic: 'border-green-500 bg-green-50 text-green-700',
}

const SCENARIO_ACTIVE: Record<ScenarioType, string> = {
  conservative: 'bg-orange-500 text-white border-orange-500',
  realistic: 'bg-blue-600 text-white border-blue-600',
  optimistic: 'bg-green-600 text-white border-green-600',
}

export function ScenarioSelector() {
  const { params, setScenario } = useCalculatorStore()

  return (
    <div className="flex gap-2">
      {SCENARIOS.map((s) => (
        <button
          key={s}
          onClick={() => setScenario(s)}
          className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium border transition-all ${
            params.scenario === s
              ? SCENARIO_ACTIVE[s]
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}
        >
          {SCENARIO_LABELS[s]}
        </button>
      ))}
    </div>
  )
}
