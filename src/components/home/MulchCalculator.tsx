import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

export default function MulchCalculator() {
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [L, setL] = useState('5');
  const [W, setW] = useState('2');
  const [depth, setDepth] = useState('7.5'); // cm (metric) or inches (imperial)
  const [bagSize, setBagSize] = useState(''); // litres (metric) or ft³ (imperial)

  const D = unit === 'm'
    ? { len: 'm', depth: 'cm', vol: 'm³', bagUnit: 'L', bagDef: 60 }
    : { len: 'ft', depth: 'in', vol: 'ft³', bagUnit: 'ft³', bagDef: 2 };

  const r = useMemo(() => {
    const l = num(L), w = num(W), dp = num(depth);
    if (l == null || w == null || dp == null) return null;
    const d = unit === 'm' ? dp / 100 : dp / 12; // cm→m, in→ft
    const vol = l * w * d; // m³ or ft³
    const yd3 = unit === 'm' ? vol / 0.764555 : vol / 27;
    const litres = unit === 'm' ? vol * 1000 : vol * 28.3168;
    const bs = num(bagSize) ?? D.bagDef;
    const bagVol = unit === 'm' ? bs / 1000 : bs; // L→m³ ; ft³→ft³
    const bags = bagVol > 0 ? Math.ceil(vol / bagVol) : null;
    return { vol, yd3, litres, bags };
  }, [L, W, depth, bagSize, unit]);

  const inp = (val: string, set: (v: string) => void, label: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input type="number" step="any" min="0" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['m', 'ft'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'm' ? 'Metric' : 'Imperial'}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {inp(L, setL, `Bed length (${D.len})`)}
        {inp(W, setW, `Bed width (${D.len})`)}
        {inp(depth, setDepth, `Depth (${D.depth})`)}
        {inp(bagSize, setBagSize, `Bag size (${D.bagUnit}, blank = ${D.bagDef})`)}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Volume</p>
            <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.vol)} <span class="text-lg text-slate-500">{D.vol}</span></p>
            <p class="mt-1 text-xs text-slate-400">{fmt(r.litres, 0)} litres</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cubic yards</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.yd3)} <span class="text-lg text-slate-500">yd³</span></p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Bags</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{r.bags ?? '—'}</p>
            <p class="mt-1 text-xs text-slate-400">bulk is cheaper &gt; ~1 {D.vol}</p>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the bed dimensions and the depth of mulch or soil.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Volume = area × depth. Mulch is usually 5–8 cm (2–3 in) deep. 🔒 In your browser.</p>
    </div>
  );
}
