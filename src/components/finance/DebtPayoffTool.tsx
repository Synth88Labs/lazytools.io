import { useMemo, useState } from 'preact/hooks';
import { simulateDebts, type Debt } from '../../lib/finance';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const money = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 0 });
const monthsToYM = (m: number) => `${Math.floor(m / 12)}y ${m % 12}m`;

interface Row { name: string; balance: string; apr: string; min: string }

export default function DebtPayoffTool() {
  const [rows, setRows] = useState<Row[]>([
    { name: 'Medical bill', balance: '800', apr: '0', min: '30' },
    { name: 'Store card', balance: '2000', apr: '24.5', min: '50' },
    { name: 'Credit card', balance: '5000', apr: '19', min: '110' },
    { name: 'Car loan', balance: '9000', apr: '6', min: '190' },
  ]);
  const [extra, setExtra] = useState('250');

  const debts: Debt[] = rows.map((r) => ({ name: r.name || 'Debt', balance: num(r.balance) ?? 0, apr: (num(r.apr) ?? 0) / 100, minPayment: num(r.min) ?? 0 })).filter((d) => d.balance > 0);

  const result = useMemo(() => {
    if (debts.length === 0) return null;
    const ex = num(extra) ?? 0;
    const snow = simulateDebts(debts, ex, 'snowball');
    const aval = simulateDebts(debts, ex, 'avalanche');
    if (!snow || !aval) return { error: true as const };
    return { snow, aval, saved: snow.totalInterest - aval.totalInterest, sooner: snow.months - aval.months };
  }, [rows, extra]);

  const set = (i: number, patch: Partial<Row>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const cell = 'rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table class="w-full text-sm">
          <thead><tr class="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th class="px-3 py-2">Debt</th><th class="px-3 py-2">Balance ($)</th><th class="px-3 py-2">APR (%)</th><th class="px-3 py-2">Min/mo ($)</th><th class="px-2 py-2"></th>
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr class="border-b border-slate-100 last:border-0">
                <td class="px-3 py-1.5"><input value={r.name} onInput={(e) => set(i, { name: (e.target as HTMLInputElement).value })} class={`${cell} w-full min-w-28`} /></td>
                <td class="px-3 py-1.5"><input type="number" value={r.balance} onInput={(e) => set(i, { balance: (e.target as HTMLInputElement).value })} class={`${cell} w-24`} /></td>
                <td class="px-3 py-1.5"><input type="number" value={r.apr} onInput={(e) => set(i, { apr: (e.target as HTMLInputElement).value })} class={`${cell} w-20`} /></td>
                <td class="px-3 py-1.5"><input type="number" value={r.min} onInput={(e) => set(i, { min: (e.target as HTMLInputElement).value })} class={`${cell} w-20`} /></td>
                <td class="px-2 py-1.5"><button onClick={() => setRows(rows.filter((_, j) => j !== i))} class="text-slate-300 hover:text-red-600" aria-label="Remove">✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div class="mt-2 flex flex-wrap items-center gap-3">
        <button onClick={() => setRows([...rows, { name: 'New debt', balance: '', apr: '', min: '' }])} class="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50">+ Add debt</button>
        <label class="flex items-center gap-2 text-sm text-slate-600"><span class="font-semibold">Extra $/month</span>
          <input type="number" value={extra} onInput={(e) => setExtra((e.target as HTMLInputElement).value)} class={`${cell} w-24`} /></label>
      </div>

      {result && !('error' in result) ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            {([['Avalanche', result.aval, 'highest APR first — least interest', 'ring-emerald-300'], ['Snowball', result.snow, 'smallest balance first — quick wins', 'ring-brand-200']] as const).map(([label, d, sub, ring]) => (
              <div class={`rounded-xl bg-white p-4 ring-2 ${ring}`}>
                <p class="text-sm font-bold text-slate-900">{label}</p>
                <p class="text-xs text-slate-500">{sub}</p>
                <div class="mt-2 flex items-baseline justify-between"><span class="text-xs text-slate-500">Debt-free in</span><span class="font-mono text-lg font-bold text-slate-800">{monthsToYM(d.months)}</span></div>
                <div class="mt-1 flex items-baseline justify-between"><span class="text-xs text-slate-500">Total interest</span><span class="font-mono text-lg font-bold text-slate-800">${money(d.totalInterest)}</span></div>
              </div>
            ))}
          </div>
          <div class="mt-3 rounded-xl bg-emerald-50 p-3 text-center ring-1 ring-emerald-200">
            <p class="text-sm text-emerald-800">Avalanche saves <strong>${money(Math.max(0, result.saved))}</strong> in interest{result.sooner > 0 ? ` and clears ${result.sooner} month${result.sooner === 1 ? '' : 's'} sooner` : ''} versus snowball. Snowball can be easier to stick with — the best plan is the one you’ll follow.</p>
          </div>
          <div class="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-sm">
              <thead><tr class="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><th class="px-3 py-2">Payoff order (avalanche)</th><th class="px-3 py-2 text-right">Cleared by</th><th class="px-3 py-2 text-right">Interest paid</th></tr></thead>
              <tbody>{result.aval.order.map((o) => (<tr class="border-b border-slate-100 last:border-0"><td class="px-3 py-1.5 font-medium text-slate-800">{o.name}</td><td class="px-3 py-1.5 text-right font-mono text-slate-600">month {o.payoffMonth}</td><td class="px-3 py-1.5 text-right font-mono text-slate-600">${money(o.interestPaid)}</td></tr>))}</tbody>
            </table>
          </div>
        </>
      ) : result ? (
        <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 ring-1 ring-amber-200">⚠ These payments never clear the debt — the minimums plus extra don’t cover the interest. Increase the monthly amount.</p>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Add your debts with balances, APRs and minimum payments.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Month-by-month simulation of both strategies. Educational — not financial advice. 🔒 Your debt figures never leave your browser.</p>
    </div>
  );
}
