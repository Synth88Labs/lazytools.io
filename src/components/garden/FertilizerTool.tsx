import { useMemo, useState } from 'preact/hooks';
import { fertilizerLbs } from '../../lib/garden';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toLocaleString();

export default function FertilizerTool() {
  const [target, setTarget] = useState('1'); // lb N per 1000 sqft
  const [area, setArea] = useState('2000');
  const [nPct, setNPct] = useState('20'); // first number of N-P-K

  const r = useMemo(() => {
    const t = num(target), a = num(area), n = num(nPct);
    if (t == null || a == null || n == null || n <= 0) return null;
    const res = fertilizerLbs(t, a, n);
    if (!res) return null;
    return { ...res, kgProduct: res.lbsProduct * 0.45359237, gPerSqM: (res.lbsProduct * 453.59237) / (a / 10.7639104) };
  }, [target, area, nPct]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Target N (lb per 1,000 ft²)</span>
          <input type="number" step="any" value={target} onInput={(e) => setTarget((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Area (ft²)</span>
          <input type="number" step="any" value={area} onInput={(e) => setArea((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Fertilizer %N (first N-P-K number)</span>
          <input type="number" step="any" value={nPct} onInput={(e) => setNPct((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Fertilizer to apply</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.lbsProduct)} <span class="text-lg text-slate-500">lb</span></p><p class="mt-1 text-xs text-slate-400">{fmt(r.kgProduct)} kg</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Actual N delivered</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.lbsN)} <span class="text-lg text-slate-500">lb</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Rate</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.gPerSqM, 0)} g/m²</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the target rate, area and the fertilizer's %N.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Product needed = (target lb N per 1,000 ft² × area ÷ 1,000) ÷ (%N ÷ 100). The %N is the first number in the N-P-K analysis (e.g. 20 in 20-5-10). A typical lawn rate is about 1 lb N per 1,000 ft² per feeding — don't over-apply. 🔒 In your browser.</p>
    </div>
  );
}
