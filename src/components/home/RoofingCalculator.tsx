import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();
const SQFT_PER_SQUARE = 100;

export default function RoofingCalculator() {
  const [unit, setUnit] = useState<'m' | 'ft'>('ft');
  const [L, setL] = useState('12');
  const [W, setW] = useState('9');
  const [rise, setRise] = useState('4'); // rise per 12 run
  const [waste, setWaste] = useState('12');
  const [bundlesPerSq, setBPS] = useState('3');

  const D = unit === 'm' ? { len: 'm', area: 'm²', sqAreaFt: 9.2903 } : { len: 'ft', area: 'sq ft', sqAreaFt: 100 };

  const r = useMemo(() => {
    const l = num(L), w = num(W), ri = num(rise), wp = num(waste) ?? 0, bps = num(bundlesPerSq) ?? 3;
    if (l == null || w == null || ri == null) return null;
    const footprint = l * w;
    const slope = Math.sqrt(1 + (ri / 12) ** 2);
    const roofArea = footprint * slope;
    const withWaste = roofArea * (1 + wp / 100);
    // squares always in 100 sq ft; convert area to sq ft if metric
    const sqft = unit === 'm' ? withWaste * 10.7639 : withWaste;
    const squares = sqft / SQFT_PER_SQUARE;
    const bundles = Math.ceil(squares * bps);
    return { roofArea, withWaste, slope, squares, bundles };
  }, [L, W, rise, waste, bundlesPerSq, unit]);

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
        {(['ft', 'm'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'ft' ? 'Imperial' : 'Metric'}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {inp(L, setL, `Footprint length (${D.len})`)}
        {inp(W, setW, `Footprint width (${D.len})`)}
        {inp(rise, setRise, 'Pitch (rise per 12)')}
        {inp(waste, setWaste, 'Waste (%)')}
        {inp(bundlesPerSq, setBPS, 'Bundles per square')}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Shingle bundles</p>
            <p class="mt-1 text-3xl font-extrabold text-brand-800">{r.bundles}</p>
            <p class="mt-1 text-xs text-slate-400">{fmt(r.squares)} squares incl. waste</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Roof area</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.roofArea)} <span class="text-lg text-slate-500">{D.area}</span></p>
            <p class="mt-1 text-xs text-slate-400">slope factor ×{fmt(r.slope, 3)}</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">With waste</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.withWaste)} <span class="text-lg text-slate-500">{D.area}</span></p>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the roof footprint and pitch (rise per 12 of run).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Roof area = footprint × √(1 + (rise/12)²). 1 square = 100 sq ft ≈ 9.29 m², usually 3 shingle bundles. Add ~10–15% for ridges/valleys. 🔒 In your browser.</p>
    </div>
  );
}
