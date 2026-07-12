import { useMemo, useState } from 'preact/hooks';
import { npv, irr } from '../../lib/finance-planning';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : 0; };
const money = (x: number) => x.toLocaleString('en-US', { maximumFractionDigits: 2 });

export default function NpvIrrTool() {
  const [rate, setRate] = useState('8');
  const [flows, setFlows] = useState<string[]>(['-1000', '300', '300', '300', '300', '300']);

  const res = useMemo(() => {
    const cf = flows.map(num);
    const r = parseFloat(rate);
    return { npv: isFinite(r) ? npv(r, cf) : null, irr: irr(cf) };
  }, [flows, rate]);

  const setFlow = (i: number, v: string) => setFlows((f) => f.map((x, j) => (j === i ? v : x)));
  const addYear = () => setFlows((f) => [...f, '0']);
  const removeYear = () => setFlows((f) => (f.length > 2 ? f.slice(0, -1) : f));

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block sm:w-52"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Discount rate (%/yr)</span><input type="number" step="any" value={rate} onInput={(e) => setRate((e.target as HTMLInputElement).value)} class={inp} /></label>

      <p class="mt-4 mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Cash flows (year 0 = today, usually a negative outlay)</p>
      <div class="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {flows.map((v, i) => (
          <label class="flex items-center gap-2"><span class="w-14 shrink-0 text-xs text-slate-500">Year {i}</span><input type="number" step="any" value={v} onInput={(e) => setFlow(i, (e.target as HTMLInputElement).value)} class={inp} /></label>
        ))}
      </div>
      <div class="mt-2 flex gap-2">
        <button onClick={addYear} class="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-600 hover:border-brand-400">+ year</button>
        <button onClick={removeYear} class="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-600 hover:border-brand-400">− year</button>
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Net present value (NPV)</p><p class={`mt-1 font-mono text-3xl font-extrabold ${res.npv != null && res.npv >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{res.npv != null ? money(res.npv) : '—'}</p></div>
        <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Internal rate of return (IRR)</p><p class="mt-1 font-mono text-3xl font-extrabold text-slate-800">{res.irr != null ? `${res.irr.toFixed(2)}%` : 'n/a'}</p></div>
      </div>
      {res.npv != null && <p class="mt-2 text-center text-xs text-slate-500">{res.npv >= 0 ? 'Positive NPV — the return beats your discount rate.' : 'Negative NPV — the return falls short of your discount rate.'}</p>}

      <p class="mt-4 text-xs text-slate-500">NPV discounts every future cash flow back to today: NPV = Σ CFₜ ÷ (1 + rate)ᵗ. A positive NPV means the investment earns more than your discount rate. IRR is the discount rate at which NPV equals zero — the project's own rate of return (n/a if the cash flows never change sign). Educational, not investment advice. 🔒 In your browser.</p>
    </div>
  );
}
