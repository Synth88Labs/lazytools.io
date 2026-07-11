import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

export default function GravelCalculator() {
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [L, setL] = useState('10');
  const [W, setW] = useState('2');
  const [depth, setDepth] = useState('5'); // cm (metric) or inches (imperial)
  const [density, setDensity] = useState(''); // t/m³ (metric) or ton/yd³ (imperial)

  const D = unit === 'm'
    ? { len: 'm', small: 'cm', vol: 'm³', wt: 'tonnes', densDef: 1.5, densUnit: 't/m³' }
    : { len: 'ft', small: 'in', vol: 'ft³', wt: 'US tons', densDef: 1.4, densUnit: 'ton/yd³' };

  const r = useMemo(() => {
    const l = num(L), w = num(W), dp = num(depth);
    if (l == null || w == null || dp == null) return null;
    const d = unit === 'm' ? dp / 100 : dp / 12;
    const vol = l * w * d; // m³ or ft³
    const yd3 = unit === 'm' ? vol / 0.764555 : vol / 27;
    const dens = num(density) ?? D.densDef;
    const weight = unit === 'm' ? vol * dens : yd3 * dens; // metric: t/m³; imperial: ton/yd³
    return { vol, yd3, weight };
  }, [L, W, depth, density, unit]);

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
        {inp(L, setL, `Length (${D.len})`)}
        {inp(W, setW, `Width (${D.len})`)}
        {inp(depth, setDepth, `Depth (${D.small})`)}
        {inp(density, setDensity, `Density (${D.densUnit}, blank = ${D.densDef})`)}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Weight to order</p>
            <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.weight)} <span class="text-lg text-slate-500">{D.wt}</span></p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Volume</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.vol)} <span class="text-lg text-slate-500">{D.vol}</span></p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cubic yards</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.yd3)} <span class="text-lg text-slate-500">yd³</span></p>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the area dimensions and depth of gravel.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Weight = volume × density (gravel ≈ 1.4–1.6 t/m³). Order by the tonne or bulk bag (~0.5–0.8 m³). 🔒 In your browser.</p>
    </div>
  );
}
