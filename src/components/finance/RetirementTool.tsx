import { useMemo, useState } from 'preact/hooks';
import { retirement } from '../../lib/finance-planning';

const n = (s: string) => { const v = parseFloat(s); return isFinite(v) ? v : 0; };
const money = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: 0 });
const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function RetirementTool() {
  const [age, setAge] = useState('35');
  const [retAge, setRetAge] = useState('65');
  const [savings, setSavings] = useState('50000');
  const [contrib, setContrib] = useState('1000');
  const [match, setMatch] = useState('200');
  const [ret, setRet] = useState('7');
  const [expenses, setExpenses] = useState('50000');
  const [wr, setWr] = useState('4');

  const r = useMemo(() => retirement({
    currentAge: n(age), retirementAge: n(retAge), currentSavings: n(savings),
    monthlyContribution: n(contrib), employerMatchMonthly: n(match),
    annualReturnPct: n(ret), annualExpensesInRetirement: n(expenses), withdrawalRatePct: n(wr),
  }), [age, retAge, savings, contrib, match, ret, expenses, wr]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Current age</span><input type="number" step="1" value={age} onInput={(e) => setAge((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Retirement age</span><input type="number" step="1" value={retAge} onInput={(e) => setRetAge((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Current savings</span><input type="number" step="any" value={savings} onInput={(e) => setSavings((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Annual return (%)</span><input type="number" step="any" value={ret} onInput={(e) => setRet((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Your contribution / mo</span><input type="number" step="any" value={contrib} onInput={(e) => setContrib((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Employer match / mo</span><input type="number" step="any" value={match} onInput={(e) => setMatch((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Annual expenses (retired)</span><input type="number" step="any" value={expenses} onInput={(e) => setExpenses((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Withdrawal rate (%)</span><input type="number" step="any" value={wr} onInput={(e) => setWr((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Projected at retirement</p><p class="mt-1 text-3xl font-extrabold text-brand-800">${money(r.projectedBalance)}</p><p class="mt-0.5 text-xs text-slate-500">in {r.years} years</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Your number (FIRE)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">${money(r.targetNumber)}</p><p class="mt-0.5 text-xs text-slate-500">{money(100 / n(wr))}× annual expenses</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">From growth</p><p class="mt-1 text-2xl font-extrabold text-slate-700">${money(r.growth)}</p><p class="mt-0.5 text-xs text-slate-500">vs ${money(r.contributed)} contributed</p></div>
          </div>
          <div class={`mt-3 rounded-xl p-4 ring-2 ${r.onTrack ? 'bg-emerald-50 ring-emerald-200' : 'bg-amber-50 ring-amber-200'}`}>
            <p class={`text-sm font-semibold ${r.onTrack ? 'text-emerald-800' : 'text-amber-800'}`}>{r.onTrack ? '✓ On track' : '⚠ Projected shortfall'}</p>
            <p class={`mt-1 text-sm ${r.onTrack ? 'text-emerald-700' : 'text-amber-700'}`}>{r.onTrack
              ? `Your projected $${money(r.projectedBalance)} meets the $${money(r.targetNumber)} needed to draw $${money(n(expenses))}/yr at ${n(wr)}%. `
              : `You're about $${money(r.shortfall)} short of the $${money(r.targetNumber)} target. Increasing contributions, working a little longer, or trimming retirement expenses closes the gap.`}</p>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your age, savings and contributions.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Projects savings and monthly contributions (plus employer match) forward at a constant assumed return — real returns vary, so treat it as an illustration. &ldquo;Your number&rdquo; uses the 4% safe-withdrawal rule (Bengen / Trinity study): annual expenses ÷ withdrawal rate, i.e. about 25× your yearly spending. It ignores inflation, tax and Social Security/pensions. Educational information, not financial advice. 🔒 In your browser.</p>
    </div>
  );
}
