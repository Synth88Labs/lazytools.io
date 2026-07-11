import { useMemo, useState } from 'preact/hooks';
import { bedVolume } from '../../lib/garden';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toLocaleString();

export default function RaisedBedSoilTool() {
  const [unit, setUnit] = useState<'m' | 'ft'>('ft');
  const [L, setL] = useState('8');
  const [W, setW] = useState('4');
  const [D, setD] = useState('12'); // cm or in for depth
  const [bagSize, setBagSize] = useState('50'); // litres per bag

  const r = useMemo(() => {
    const l = num(L), w = num(W), d = num(D);
    if (l == null || w == null || d == null) return null;
    const depth = unit === 'm' ? d / 100 : d / 12; // cm→m or in→ft
    const v = bedVolume(l, w, depth, unit === 'm');
    const bs = num(bagSize);
    const bags = bs ? Math.ceil(v.litres / bs) : null;
    return { ...v, bags };
  }, [L, W, D, bagSize, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const du = unit === 'm' ? 'cm' : 'in';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['m', 'ft'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'm' ? 'Metric' : 'Imperial'}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Length ({unit})</span>
          <input type="number" step="any" value={L} onInput={(e) => setL((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Width ({unit})</span>
          <input type="number" step="any" value={W} onInput={(e) => setW((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Depth ({du})</span>
          <input type="number" step="any" value={D} onInput={(e) => setD((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Bag size (litres)</span>
          <input type="number" step="any" value={bagSize} onInput={(e) => setBagSize((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Soil volume</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.litres, 0)} <span class="text-lg text-slate-500">L</span></p><p class="mt-1 text-xs text-slate-400">{fmt(r.m3, 3)} m³ · {fmt(r.ft3, 1)} ft³ · {fmt(r.yd3, 2)} yd³</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Bags needed</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{r.bags ?? '—'}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cubic yards</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.yd3, 2)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the bed's length, width and depth.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Volume = length × width × depth. Bulk soil is far cheaper than bags past about a cubic metre (≈ 1.3 yd³). A common raised-bed mix is roughly ⅓ topsoil, ⅓ compost, ⅓ aeration (e.g. perlite). 🔒 In your browser.</p>
    </div>
  );
}
