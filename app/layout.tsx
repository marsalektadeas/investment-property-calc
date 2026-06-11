import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RentScope — Investiční kalkulačka nemovitostí',
  description: 'Spočítejte výnosnost investice do nemovitosti — cashflow, ROI, equity a srovnání s alternativní investicí.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className={`${inter.className} bg-[#F8FAFC] text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  )
}
