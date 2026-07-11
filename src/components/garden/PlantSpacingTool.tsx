import { useMemo, useState } from 'preact/hooks';
import { plantsInArea } from '../../lib/garden';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => x.toLocaleString();

export default function PlantSpacingTool() {
  const [unit, setUnit] = useState<'m' | 'ft'>('ft');
  const [L, setL] = useState('10');
  const [W, setW] = useState('4');
  const [spacing, setSpacing] = useState('12'); // in cm or inches
  const [pattern, setPattern] = useState<'square' | 'triangular'>('square');

  const r = useMemo(() => {
    const l = num(L), w = num(W), sp = num(spacing);
    if (l == null || w == null || sp == null) return null;
    const areaSq = l * w; // in unit²
    const spacingUnit = unit === 'm' ? sp / 100 : sp / 12; // cm→m, in→ft
    const res = plantsInArea(areaSq, spacingUnit);
    if (!res) return null;
    return { ...res, areaSq };
  }, [L, W, spacing, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const spacingUnitLabel = unit === 'm' ? 'cm' : 'in';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['m', 'ft'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'm' ? 'Metric (m, cm)' : 'Imperial (ft, in)'}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Bed length ({unit})</span>
          <input type="number" step="any" value={L} onInput={(e) => setL((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Bed width ({unit})</span>
          <input type="number" step="any" value={W} onInput={(e) => setW((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Plant spacing ({spacingUnitLabel})</span>
          <input type="number" step="any" value={spacing} onInput={(e) => setSpacing((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>
      <div class="mt-3 flex gap-2">
        {([['square', 'Square grid'], ['triangular', 'Triangular (offset rows)']] as const).map(([p, lbl]) => (
          <button onClick={() => setPattern(p)} class={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${pattern === p ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{lbl}</button>
        ))}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Plants that fit ({pattern})</p>
            <p class="mt-1 text-4xl font-extrabold text-brand-800">{fmt(pattern === 'square' ? r.square : r.triangular)}</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Bed area</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(Number(r.areaSq.toFixed(1)))} <span class="text-lg text-slate-500">{unit}²</span></p>
            <p class="mt-1 text-xs text-slate-400">square {fmt(r.square)} · triangular {fmt(r.triangular)}</p>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the bed size and plant spacing.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Square grid = area ÷ spacing². Triangular (offset) rows fit about 15% more plants for the same spacing — area ÷ (spacing² × 0.866). Use the on-centre spacing from the seed packet. 🔒 In your browser.</p>
    </div>
  );
}
