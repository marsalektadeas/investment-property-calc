'use client'

interface ToggleProps {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  className?: string
}

export function Toggle({ label, checked, onChange, className }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 text-sm ${className ?? 'text-gray-600 hover:text-gray-900'}`}
    >
      <div
        className={`relative w-9 h-5 rounded-full transition-colors ${
          checked ? 'bg-[#2563EB]' : 'bg-gray-200'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
      <span>{label}</span>
    </button>
  )
}
