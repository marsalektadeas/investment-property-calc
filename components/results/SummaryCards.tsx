'use client'

import { useCalculatorStore } from '@/store/useCalculatorStore'
import { MetricCard } from '@/components/ui/MetricCard'
import { formatCZK, formatPercent, formatYears } from '@/utils/format'

export function SummaryCards() {
  const { result, params } = useCalculatorStore()
  const { metrics } = result

  const cashflowValue = params.showAfterTax ? result.monthly.netCashflow : result.monthly.cashflow

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Měsíční cashflow"
          value={formatCZK(cashflowValue)}
          sub={params.showAfterTax ? 'po daních' : 'před daněmi'}
          positive={cashflowValue >= 0}
          large
          tooltip="Čistý příjem z nájmu po odečtení všech nákladů a splátky hypotéky. Kladný cashflow znamená, že nemovitost na sebe vydělá."
        />
        <MetricCard
          label="Počáteční investice"
          value={formatCZK(metrics.initialInvestment)}
          sub="z vlastní kapsy"
          positive={null}
          tooltip="Celková částka, kterou musíte mít v hotovosti: akontace + pořizovací náklady + rekonstrukce + počáteční rezerva."
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="Hrubá výnosnost"
          value={formatPercent(metrics.grossYield)}
          sub="hrubý nájem / cena"
          positive={metrics.grossYield >= 5}
          tooltip="Roční hrubý nájem dělený cenou nemovitosti. Nejjednodušší pohled — nezohledňuje neobsazenost ani náklady. Dobré: 5 %+ v ČR."
        />
        <MetricCard
          label="Čistá výnosnost"
          value={formatPercent(metrics.capRate)}
          sub="NOI / cena"
          positive={metrics.capRate >= 4}
          tooltip="Roční čistý provozní výnos (po neobsazenosti a nákladech, bez hypotéky) dělený cenou nemovitosti. Říká, kolik % by nemovitost vydělala bez páky. Dobré: 4–6 % v ČR."
        />
        <MetricCard
          label="Cash-on-Cash"
          value={formatPercent(metrics.cashOnCash)}
          sub="cashflow / investice"
          positive={metrics.cashOnCash >= 5}
          tooltip="Roční cashflow dělený vaší počáteční investicí (vlastní kapsa). Ukazuje reálný výnos na vložený kapitál s pákou. Dobré: 5 %+."
        />
        <MetricCard
          label="DSCR"
          value={metrics.dscr.toFixed(2).replace('.', ',')}
          sub="krytí dluhu"
          positive={metrics.dscr >= 1.2}
          tooltip="Debt Service Coverage Ratio — kolikrát NOI pokryje roční splátku hypotéky. Pod 1,0 = provoz nestačí platit hypotéku. Bezpečná hranice: 1,2+."
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MetricCard
          label="NOI (roční)"
          value={formatCZK(metrics.noi)}
          sub="bez hypotéky"
          positive={metrics.noi >= 0}
          tooltip="Net Operating Income — roční příjmy z nájmu mínus provozní náklady, bez hypotéky. Základ pro výpočet Cap Rate a DSCR."
        />
        <MetricCard
          label="Break-even"
          value={formatPercent(metrics.breakEvenOccupancy, 0)}
          sub="min. obsazenost"
          positive={metrics.breakEvenOccupancy <= 80}
          tooltip="Minimální obsazenost, při které cashflow neklesne pod nulu. Čím nižší, tím odolnější investice vůči výpadkům nájemníků."
        />
        <MetricCard
          label="Návratnost"
          value={metrics.paybackYears ? formatYears(metrics.paybackYears) : '—'}
          sub="z cashflow"
          positive={metrics.paybackYears !== null && metrics.paybackYears <= 15}
          tooltip="Za kolik let kumulativní cashflow pokryje celou počáteční investici. Zobrazí se jen pokud je cashflow kladný — při záporném cashflow z nájmu se investice vrátí jen prodejem."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="LTV"
          value={formatPercent(metrics.ltv, 0)}
          sub={`úvěr ${formatCZK(metrics.loanAmount)}`}
          positive={metrics.ltv <= 80}
          tooltip="Loan-to-Value — poměr úvěru k hodnotě nemovitosti. Čím vyšší, tím větší páka, ale také vyšší riziko a splátka. Banky běžně požadují LTV pod 80–90 %."
        />
        <MetricCard
          label="Měsíční splátka"
          value={formatCZK(metrics.monthlyMortgage)}
          sub={
            metrics.monthlyMortgageAfterFixation != null
              ? `po fixaci ${formatCZK(metrics.monthlyMortgageAfterFixation)}`
              : 'hypotéka'
          }
          positive={null}
          tooltip="Anuitní měsíční splátka hypotéky (úrok + jistina). Po skončení fixace se přepočítá dle sazby po fixaci — je-li vyšší, splátka vyskočí."
        />
      </div>
    </div>
  )
}
