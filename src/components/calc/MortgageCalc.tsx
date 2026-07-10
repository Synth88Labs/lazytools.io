import { useMemo, useState } from 'preact/hooks';

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-lg font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const money = (x: number) => x.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const money0 = (x: number) => x.toLocaleString('en-US', { maximumFractionDigits: 0 });

interface Row { n: number; interest: number; principal: number; balance: number; }

export default function MortgageCalc() {
  const [principal, setPrincipal] = useState('300000');
  const [rate, setRate] = useState('6');
  const [years, setYears] = useState('30');
  const [extra, setExtra] = useState('');
  const [showAll, setShowAll] = useState(false);

  const calc = useMemo(() => {
    const P = parseFloat(principal), annual = parseFloat(rate), yrs = parseFloat(years);
    const ex = parseFloat(extra) || 0;
    if (!Number.isFinite(P) || !Number.isFinite(annual) || !Number.isFinite(yrs) || P <= 0 || yrs <= 0) return null;
    const r = annual / 12 / 100;
    const nTotal = Math.round(yrs * 12);
    const basePayment = r === 0 ? P / nTotal : (P * r * Math.pow(1 + r, nTotal)) / (Math.pow(1 + r, nTotal) - 1);
    const schedule: Row[] = [];
    let balance = P, totalInterest = 0;
    for (let n = 1; n <= nTotal * 2 && balance > 0.005; n++) {
      const interest = balance * r;
      let principalPart = basePayment - interest + ex;
      if (principalPart > balance) principalPart = balance;
      balance -= principalPart;
      totalInterest += interest;
      schedule.push({ n, interest, principal: principalPart, balance: Math.max(0, balance) });
    }
    const monthsActual = schedule.length;
    return { basePayment, schedule, totalInterest, monthsActual, nTotal, P, ex };
  }, [principal, rate, years, extra]);

  function downloadCsv() {
    if (!calc) return;
    const header = 'Payment,Interest,Principal,Balance\n';
    const body = calc.schedule.map((r) => `${r.n},${r.interest.toFixed(2)},${r.principal.toFixed(2)},${r.balance.toFixed(2)}`).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'amortization-schedule.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const rowsToShow = calc ? (showAll ? calc.schedule : calc.schedule.filter((r) => r.n <= 12 || r.n % 12 === 0)) : [];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Loan amount</span>
          <input class={inputCls} type="number" value={principal} onInput={(e) => setPrincipal((e.target as HTMLInputElement).value)} />
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Interest rate (APR)</span>
          <input class={inputCls} type="number" step="0.05" value={rate} onInput={(e) => setRate((e.target as HTMLInputElement).value)} />
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Term (years)</span>
          <input class={inputCls} type="number" value={years} onInput={(e) => setYears((e.target as HTMLInputElement).value)} />
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Extra / month (optional)</span>
          <input class={inputCls} type="number" placeholder="0" value={extra} onInput={(e) => setExtra((e.target as HTMLInputElement).value)} />
        </label>
      </div>

      {!calc && <p class="mt-5 rounded-xl border border-brand-100 bg-white p-4 text-sm text-slate-500">Enter a loan amount, rate and term to see the payment and schedule.</p>}

      {calc && (
        <>
          <div class="mt-5 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-2xl font-extrabold text-brand-800">{money(calc.basePayment + (calc.ex || 0))}</p>
              <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">monthly payment{calc.ex ? ' (incl. extra)' : ''}</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class="text-2xl font-extrabold text-slate-800">{money0(calc.totalInterest)}</p>
              <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">total interest</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class="text-2xl font-extrabold text-slate-800">{money0(calc.P + calc.totalInterest)}</p>
              <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">total paid</p>
            </div>
          </div>

          {calc.ex > 0 && calc.monthsActual < calc.nTotal && (
            <p class="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              💡 The extra {money0(calc.ex)}/month pays the loan off in {Math.floor(calc.monthsActual / 12)} yr {calc.monthsActual % 12} mo — <strong>{calc.nTotal - calc.monthsActual} months early</strong>.
            </p>
          )}

          <div class="mt-4 flex items-center justify-between">
            <p class="text-sm font-semibold text-slate-700">Amortization schedule <span class="font-normal text-slate-500">({showAll ? 'every month' : 'first year + annual'})</span></p>
            <div class="flex gap-2">
              <button type="button" onClick={() => setShowAll((s) => !s)} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400">
                {showAll ? 'Show summary' : 'Show every month'}
              </button>
              <button type="button" onClick={downloadCsv} class="rounded-lg bg-brand-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-800">⬇ CSV</button>
            </div>
          </div>

          <div class="mt-2 max-h-96 overflow-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-right text-sm">
              <thead class="sticky top-0 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th class="px-3 py-2 text-left">Payment</th>
                  <th class="px-3 py-2">Interest</th>
                  <th class="px-3 py-2">Principal</th>
                  <th class="px-3 py-2">Balance</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-mono">
                {rowsToShow.map((r) => (
                  <tr class="hover:bg-slate-50">
                    <td class="px-3 py-1.5 text-left text-slate-500">{r.n}{!showAll && r.n > 12 ? ` (yr ${r.n / 12})` : ''}</td>
                    <td class="px-3 py-1.5 text-red-700">{money(r.interest)}</td>
                    <td class="px-3 py-1.5 text-emerald-700">{money(r.principal)}</td>
                    <td class="px-3 py-1.5 font-semibold text-slate-800">{money(r.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p class="mt-2 text-xs text-slate-500">
            Notice payment #1 is mostly the red interest column and payment #{calc.monthsActual} is almost all green principal — that shift is the whole story of a mortgage. Principal &amp; interest only; taxes and insurance are separate. Computed locally; your figures never leave the browser.
          </p>
        </>
      )}
    </div>
  );
}
