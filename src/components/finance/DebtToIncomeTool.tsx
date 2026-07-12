import { useMemo, useState } from 'preact/hooks';
import { debtToIncome } from '../../lib/finance-planning';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number) => Number(x.toFixed(1));

function band(back: number) {
  if (back <= 36) return { label: 'Healthy — within the 36% guideline', color: 'text-emerald-700' };
  if (back <= 43) return { label: 'Caution — above 36%, but under the 43% qualified-mortgage limit', color: 'text-amber-700' };
  return { label: 'High — above 43%, many lenders will decline', color: 'text-rose-700' };
}

export default function DebtToIncomeTool() {
  const [housing, setHousing] = useState('1500');
  const [other, setOther] = useState('500');
  const [income, setIncome] = useState('6000');

  const res = useMemo(() => {
    const h = num(housing), o = num(other), i = num(income);
    if (h == null || o == null || i == null) return null;
    return debtToIncome(h, o, i);
  }, [housing, other, income]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Monthly housing payment</span><input type="number" step="any" value={housing} onInput={(e) => setHousing((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Other monthly debt</span><input type="number" step="any" value={other} onInput={(e) => setOther((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Gross monthly income</span><input type="number" step="any" value={income} onInput={(e) => setIncome((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Back-end DTI (all debt)</p><p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(res.back)}%</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Front-end DTI (housing only)</p><p class="mt-1 font-mono text-3xl font-extrabold text-slate-800">{fmt(res.front)}%</p></div>
          </div>
          <p class={`mt-3 text-center text-sm font-semibold ${band(res.back).color}`}>{band(res.back).label}</p>
        </>
      ) : <p class="mt-4 text-sm text-slate-500">Enter your payments and gross (pre-tax) monthly income.</p>}

      <p class="mt-4 text-xs text-slate-500">Debt-to-income ratio is your monthly debt payments divided by gross monthly income. The front-end ratio counts only housing; the back-end counts all debt (housing + loans + minimum card payments). Lenders like the back-end at or below 36%, and the "qualified mortgage" rule caps it near 43%. This is educational, not lending or financial advice. 🔒 In your browser.</p>
    </div>
  );
}
