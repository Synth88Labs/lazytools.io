import { useMemo, useState } from 'preact/hooks';
import { resinCost, RESIN_DENSITY } from '../../lib/printing3d';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const pos = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const money = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt = (n: number, d = 1) => n.toLocaleString('en-US', { maximumFractionDigits: d });

export default function ResinTool() {
  const [volume, setVolume] = useState('30');
  const [price, setPrice] = useState('50');
  const [density, setDensity] = useState(String(RESIN_DENSITY));
  const [waste, setWaste] = useState('10');

  const r = useMemo(() => {
    const v = num(volume), p = num(price), d = pos(density), w = num(waste);
    if (v == null || p == null || d == null || w == null) return null;
    return resinCost(v, p, d, w);
  }, [volume, price, density, waste]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Resin used (mL)</span>
          <input type="number" step="any" value={volume} onInput={(e) => setVolume((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Resin price (per litre)</span>
          <input type="number" step="any" value={price} onInput={(e) => setPrice((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Density (g/mL)</span>
          <input type="number" step="any" value={density} onInput={(e) => setDensity((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Waste allowance (%)</span>
          <input type="number" step="any" value={waste} onInput={(e) => setWaste((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Resin cost</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{money(r.cost)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Resin volume (with waste)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.volumeMl)} mL</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Resin weight</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.weightG)} g</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the resin volume your slicer reports and the resin's price per litre.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Cost = volume (with waste) ÷ 1000 × price per litre. Your MSLA slicer reports the resin volume a print needs; the waste allowance covers what clings to the build plate, supports and vat. Standard photopolymer is about 1.10 g/mL (Formlabs standard ~1.08) — override for specialty resins. Amounts are in whatever currency you enter. 🔒 In your browser.</p>
    </div>
  );
}
