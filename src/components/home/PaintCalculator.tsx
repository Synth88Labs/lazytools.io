import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

export default function PaintCalculator() {
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [L, setL] = useState('4');
  const [W, setW] = useState('3');
  const [H, setH] = useState('2.4');
  const [coats, setCoats] = useState('2');
  const [openings, setOpenings] = useState('2');
  const [ceiling, setCeiling] = useState(false);
  const [cov, setCov] = useState(''); // coverage per unit; blank = default

  const D = unit === 'm' ? { area: 'm²', vol: 'litres', covDef: 11, covUnit: 'm²/L', open: 1.9 } : { area: 'sq ft', vol: 'gallons', covDef: 375, covUnit: 'sq ft/gal', open: 20 };

  const r = useMemo(() => {
    const l = num(L), w = num(W), h = num(H), c = num(coats), op = num(openings) ?? 0;
    const coverage = num(cov) ?? D.covDef;
    if (l == null || w == null || h == null || c == null || coverage <= 0) return null;
    const wallArea = 2 * (l + w) * h;
    const ceilArea = ceiling ? l * w : 0;
    const paintable = Math.max(0, wallArea + ceilArea - op * D.open);
    const paint = (paintable * c) / coverage;
    return { paintable, paint, wallArea, ceilArea };
  }, [L, W, H, coats, openings, ceiling, cov, unit]);

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
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'm' ? 'Metric (m, L)' : 'Imperial (ft, gal)'}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        {inp(L, setL, `Room length (${unit})`)}
        {inp(W, setW, `Room width (${unit})`)}
        {inp(H, setH, `Wall height (${unit})`)}
        {inp(coats, setCoats, 'Number of coats')}
        {inp(openings, setOpenings, 'Doors + windows (count)')}
        {inp(cov, setCov, `Coverage (${D.covUnit}, blank = ${D.covDef})`)}
      </div>
      <label class="mt-2 flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={ceiling} onChange={(e) => setCeiling((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600" />
        Include the ceiling
      </label>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Paint needed</p>
            <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.paint)} <span class="text-lg text-slate-500">{D.vol}</span></p>
            <p class="mt-1 text-xs text-slate-400">for {coats} coat{num(coats) === 1 ? '' : 's'}</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Paintable area</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.paintable)} <span class="text-lg text-slate-500">{D.area}</span></p>
            <p class="mt-1 text-xs text-slate-400">walls {fmt(r.wallArea)}{r.ceilArea > 0 ? ` + ceiling ${fmt(r.ceilArea)}` : ''} − openings</p>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the room dimensions and number of coats.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Wall area = 2 × (length + width) × height, minus doors/windows, × coats ÷ coverage. Buy whole cans and keep spares. 🔒 In your browser.</p>
    </div>
  );
}
