interface SectionCardProps {
  title: string
  children: React.ReactNode
}

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <div className="bg-white border border-[#ede9e2] rounded-xl p-5 shadow-sm space-y-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2">
        <span className="w-0.5 h-3.5 bg-[#C9A84C] rounded-full flex-shrink-0" />
        {title}
      </h3>
      {children}
    </div>
  )
}
