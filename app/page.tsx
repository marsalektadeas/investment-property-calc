import Link from 'next/link'

const CALC_HREF = '/kalkulacka'

function Cta({ children, variant = 'primary' }: { children: React.ReactNode; variant?: 'primary' | 'light' }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-colors'
  const styles =
    variant === 'primary'
      ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm'
      : 'bg-white text-[#0F172A] hover:bg-gray-100 shadow-sm'
  return (
    <Link href={CALC_HREF} className={`${base} ${styles}`}>
      {children}
      <span aria-hidden>→</span>
    </Link>
  )
}

const STEPS = [
  {
    n: '1',
    title: 'Zadáš parametry',
    body: 'Cenu, hypotéku, nájem, náklady. Slidery s okamžitým přepočtem — žádné tabulky v Excelu.',
  },
  {
    n: '2',
    title: 'Uvidíš pravdu',
    body: 'Měsíční cashflow, výnos, equity, návratnost a DSCR. Rok po roce až do prodeje.',
  },
  {
    n: '3',
    title: 'Rozhodneš se s jistotou',
    body: 'Tři scénáře rizika, srovnání s akciemi a export do PDF. Buď koupíš dobře, nebo to poznáš včas.',
  },
]

const BENEFITS = [
  {
    title: 'Reálné výpočty, ne odhady',
    body: 'Anuitní hypotéka včetně změny sazby po fixaci, české daně (paušál i skutečné náklady), odpisy.',
  },
  {
    title: 'Celý horizont, ne jen rok 1',
    body: 'Projekce po letech: nájem, náklady, zůstatek úvěru, equity i hodnota nemovitosti.',
  },
  {
    title: 'Nemovitost vs. akcie',
    body: 'Spočítá, kolik byste měli, kdybyste stejné peníze dali do indexového fondu. Fér srovnání.',
  },
  {
    title: 'Tři scénáře rizika',
    body: 'Konzervativní, realistický, optimistický. Uvidíte, co se stane, když se nedaří.',
  },
  {
    title: 'Po inflaci i po zdanění',
    body: 'Přepínače pro reálné hodnoty a čistý příjem. Žádné iluze z nominálních čísel.',
  },
  {
    title: 'Export do PDF',
    body: 'Kompletní report jedním klikem — pro banku, partnera nebo do šuplíku k rozhodnutí.',
  },
]

const FAQ = [
  {
    q: 'Je to opravdu zdarma?',
    a: 'Ano, kompletně a bez registrace. Otevřete kalkulačku a počítáte.',
  },
  {
    q: 'Pro koho je nástroj určený?',
    a: 'Pro každého, kdo zvažuje koupi nájemní nemovitosti — od prvního bytu po pokročilé investory s portfoliem.',
  },
  {
    q: 'Jak přesné jsou výpočty?',
    a: 'Stojí na reálné metodice: měsíční amortizace hypotéky, neobsazenost, inflace nákladů, růst nájmu i české daňové režimy. Žádná zjednodušení typu „hrubý výnos = nájem ÷ cena".',
  },
  {
    q: 'Musím něco instalovat?',
    a: 'Ne. Běží v prohlížeči na počítači i mobilu.',
  },
  {
    q: 'Je to investiční doporučení?',
    a: 'Ne. Je to orientační nástroj, který vám dá čísla pro vlastní rozhodnutí. Vstupy zadáváte vy.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* ── Hero (dark) ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0F172A]">
        <div className="h-[3px] bg-[#2563EB]" />
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
          <nav className="flex items-center justify-between py-4">
            <div className="flex items-baseline gap-0.5">
              <span className="text-white text-base font-bold tracking-tight">Rent</span>
              <span className="text-[#60A5FA] text-base font-bold tracking-tight">Scope</span>
            </div>
            <Link href={CALC_HREF} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Spustit kalkulačku →
            </Link>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center pt-10 sm:pt-16 pb-16 sm:pb-24">
            {/* Copy */}
            <div>
              <p className="text-[#60A5FA] text-xs font-semibold uppercase tracking-widest mb-4">
                Investiční kalkulačka nemovitostí
              </p>
              <h1 className="text-white text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.1] tracking-tight">
                Vydělá vám ten byt — nebo ho budete každý měsíc dotovat?
              </h1>
              <p className="text-gray-300 text-base sm:text-lg mt-5 leading-relaxed">
                Za 2 minuty zjistíte reálný výnos investiční nemovitosti včetně hypotéky, daní,
                neobsazenosti a inflace. A uvidíte, jestli byste neudělali líp s penězi v akciích.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Cta>Spočítat výnos zdarma</Cta>
              </div>
              <p className="text-gray-400 text-xs mt-4">
                Bez registrace · Zdarma · Reálná česká metodika
              </p>
            </div>

            {/* Sample result preview */}
            <div className="lg:justify-self-end w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Ukázka výstupu</span>
                  <span className="text-[10px] text-[#1E40AF] bg-[#EFF6FF] px-2 py-0.5 rounded-full font-medium">Realistický scénář</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <PreviewCard label="Měsíční cashflow" value="+2 340 Kč" tone="pos" />
                  <PreviewCard label="Čistý výnos (ROI)" value="9,2 %" />
                  <PreviewCard label="Návratnost" value="11 let" />
                  <PreviewCard label="Nemovitost vs. akcie" value="+480 tis." tone="pos" />
                </div>
                <div className="mt-4 h-px bg-[#E2E8F0]" />
                <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
                  Ilustrační hodnoty. Skutečný výsledek závisí na vašich vstupech.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem / stakes ────────────────────────────────────────────────── */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center max-w-2xl mx-auto">
          Většina lidí koupí investiční byt podle pocitu
        </h2>
        <p className="text-gray-500 text-center mt-3 max-w-2xl mx-auto">
          A zjistí to až ve chvíli, kdy každý měsíc posílají vlastní peníze do cizí hypotéky.
        </p>
        <div className="grid sm:grid-cols-3 gap-5 mt-10">
          <PainCard
            title="Počítají jen hrubý výnos"
            body="Nájem děleno cenou vypadá hezky. Jenže to ignoruje hypotéku, daně, opravy i měsíce bez nájemníka."
          />
          <PainCard
            title="Podceňují náklady a rizika"
            body="Neobsazenost, růst úroků po fixaci, fond oprav, inflace. Drobnosti, které z plusu udělají minus."
          />
          <PainCard
            title="Neporovnají s alternativou"
            body="Kapitál zamrzlý v bytě mohl být v akciích. Bez srovnání nevíte, jestli se páka vůbec vyplatí."
          />
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-[#E2E8F0]">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">Jak to funguje</h2>
          <p className="text-gray-500 text-center mt-3">Tři kroky k jasnému rozhodnutí.</p>
          <div className="grid sm:grid-cols-3 gap-6 mt-12">
            {STEPS.map((s) => (
              <div key={s.n} className="relative">
                <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white text-sm font-bold flex items-center justify-center">
                  {s.n}
                </div>
                <h3 className="text-lg font-semibold mt-4">{s.title}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ────────────────────────────────────────────────────────── */}
      <section className="max-w-[1100px] mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">
          Co RentScope spočítá za vás
        </h2>
        <p className="text-gray-500 text-center mt-3 max-w-2xl mx-auto">
          Ne další zjednodušená kalkulačka. Plný investiční model nájemní nemovitosti.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center mb-3">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#2563EB]" />
              </div>
              <h3 className="font-semibold">{b.title}</h3>
              <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mid CTA band ────────────────────────────────────────────────────── */}
      <section className="bg-[#0F172A]">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 py-14 sm:py-16 text-center">
          <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">
            Zjistěte čísla dřív, než podepíšete
          </h2>
          <p className="text-gray-300 mt-3 max-w-xl mx-auto">
            Dvě minuty teď vám můžou ušetřit roky dotování špatné investice.
          </p>
          <div className="flex justify-center mt-7">
            <Cta variant="light">Spustit kalkulačku zdarma</Cta>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="max-w-[760px] mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-10">Časté otázky</h2>
        <div className="space-y-3">
          {FAQ.map((item) => (
            <details key={item.q} className="group bg-white border border-[#E2E8F0] rounded-xl px-5 py-4">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium">
                {item.q}
                <span className="text-[#2563EB] text-xl leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#E2E8F0] bg-white">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[#0F172A] text-sm font-bold tracking-tight">Rent</span>
            <span className="text-[#2563EB] text-sm font-bold tracking-tight">Scope</span>
          </div>
          <p className="text-xs text-gray-400 text-center sm:text-right max-w-md">
            Orientační nástroj, ne investiční doporučení. Výsledky závisí na zadaných vstupech.
            © {new Date().getFullYear()} RentScope
          </p>
        </div>
      </footer>
    </div>
  )
}

function PreviewCard({ label, value, tone }: { label: string; value: string; tone?: 'pos' }) {
  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3">
      <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`text-base font-bold mt-0.5 ${tone === 'pos' ? 'text-green-600' : 'text-[#0F172A]'}`}>{value}</p>
    </div>
  )
}

function PainCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
      <h3 className="font-semibold flex items-center gap-2">
        <span className="text-red-500" aria-hidden>✕</span>
        {title}
      </h3>
      <p className="text-gray-500 text-sm mt-2 leading-relaxed">{body}</p>
    </div>
  )
}
