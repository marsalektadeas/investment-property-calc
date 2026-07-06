'use client'

import { useState } from 'react'

interface InfoTooltipProps {
  text: string
  align?: 'left' | 'right'
}

export function InfoTooltip({ text, align = 'right' }: InfoTooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow((v) => !v)}
        className="text-gray-300 hover:text-[#2563EB] transition-colors"
        aria-label="Vysvětlivka"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-.25 3.5h.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V8.5a.5.5 0 0 1 .5-.5h-.5z" />
        </svg>
      </button>
      {show && (
        <span
          className={`absolute bottom-5 z-30 w-60 bg-[#0F172A] text-white text-xs font-normal normal-case tracking-normal rounded-lg p-3 leading-relaxed shadow-lg ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {text}
          <span
            className={`absolute bottom-[-5px] w-2.5 h-2.5 bg-[#0F172A] rotate-45 ${
              align === 'right' ? 'right-1' : 'left-1'
            }`}
          />
        </span>
      )}
    </span>
  )
}
