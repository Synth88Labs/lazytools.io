import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 3) => Number(x.toFixed(d)).toString();

export default function ConcreteCalculator() {
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [L, setL] = useState('3');
  const [W, setW] = useState('2');
  const [T, setT] = useState('10'); // thickness in cm (metric) or inches (imperial)
  const [bagYield, setBagYield] = useState(''); // volume per bag in the working unit

  const D = unit === 'm'
    ? { len: 'm', thick: 'cm', vol: 'm³', bagDef: 0.01, bagLabel: '20 kg bag ≈ 0.01 m³' }
    : { len: 'ft', thick: 'in', vol: 'ft³', bagDef: 0.6, bagLabel: '80 lb bag ≈ 0.6 ft³' };

  const r = useMemo(() => {
    const l = num(L), w = num(W), t = num(T);
    if (l == null || w == null || t == null) return null;
    const thick = unit === 'm' ? t / 100 : t / 12; // cm→m, in→ft
    const vol = l * w * thick;
    const yd3 = unit === 'm' ? vol / 0.764555 : vol / 27; // m³→yd³, ft³→yd³
    const by = num(bagYield) ?? D.bagDef;
    const bags = by > 0 ? Math.ceil((vol * 1.07) / by) : null; // +7% for settle/spill
    return { vol, yd3, bags };
  }, [L, W, T, bagYield, unit]);

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
        {inp(T, setT, `Thickness (${D.thick})`)}
        {inp(bagYield, setBagYield, `Bag yield (${D.vol}, blank = ${D.bagDef})`)}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Concrete volume</p>
            <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.vol)} <span class="text-lg text-slate-500">{D.vol}</span></p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cubic yards</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.yd3, 2)} <span class="text-lg text-slate-500">yd³</span></p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Pre-mix bags</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{r.bags ?? '—'}</p>
            <p class="mt-1 text-xs text-slate-400">incl. ~7% extra</p>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the slab length, width and thickness.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Volume = length × width × thickness. Bags from yield ({D.bagLabel}); over-order slightly for structural pours. 🔒 In your browser.</p>
    </div>
  );
}
