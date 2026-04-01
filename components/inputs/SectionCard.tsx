interface SectionCardProps {
  title: string
  children: React.ReactNode
}

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  )
}
