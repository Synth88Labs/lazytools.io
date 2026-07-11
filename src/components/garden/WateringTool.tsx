import { useMemo, useState } from 'preact/hooks';
import { waterNeeded } from '../../lib/garden';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toLocaleString();

export default function WateringTool() {
  const [unit, setUnit] = useState<'m' | 'ft'>('ft');
  const [L, setL] = useState('10');
  const [W, setW] = useState('4');
  const [depth, setDepth] = useState('1'); // inches or mm

  const r = useMemo(() => {
    const l = num(L), w = num(W), d = num(depth);
    if (l == null || w == null || d == null) return null;
    const areaSq = unit === 'm' ? l * w : l * w; // m² or ft²
    return waterNeeded(areaSq, d, unit === 'm');
  }, [L, W, depth, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const du = unit === 'm' ? 'mm' : 'in';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['m', 'ft'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'm' ? 'Metric (m²·mm)' : 'Imperial (ft²·in)'}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Bed length ({unit})</span>
          <input type="number" step="any" value={L} onInput={(e) => setL((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Bed width ({unit})</span>
          <input type="number" step="any" value={W} onInput={(e) => setW((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Water depth ({du})</span>
          <input type="number" step="any" value={depth} onInput={(e) => setDepth((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Water needed</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.litres, 0)} <span class="text-lg text-slate-500">litres</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">US gallons</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.usGal)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the bed size and the depth of water to apply.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">1 inch of water over 1 ft² ≈ 0.623 US gallons; metrically, 1 mm over 1 m² = 1 litre. Most vegetable gardens want about 1 inch (25 mm) of water per week, from rain plus irrigation. Water deeply and less often to encourage deep roots. 🔒 In your browser.</p>
    </div>
  );
}
