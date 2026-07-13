import { useMemo, useState } from 'preact/hooks';
import { rampLength } from '../../lib/home';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toLocaleString();

const SLOPES = [
  { ratio: 12, label: '1:12 — ADA (public, unassisted)' },
  { ratio: 10, label: '1:10 — occupied, assisted' },
  { ratio: 8, label: '1:8 — unoccupied only (steep)' },
  { ratio: 15, label: '1:15 — gentle / long ramp' },
  { ratio: 20, label: '1:20 — no handrail needed' },
];

export default function RampTool() {
  const [rise, setRise] = useState('30');
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [ratio, setRatio] = useState(12);

  const r = useMemo(() => rampLength(num(rise) ?? 0, ratio), [rise, ratio]);
  const toFtIn = (inches: number) => `${Math.floor(inches / 12)} ft ${Math.round(inches % 12)} in`;

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Vertical rise (height to climb)</span>
          <div class="flex gap-1"><input type="number" step="any" value={rise} onInput={(e) => setRise((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'in' | 'cm')} class={sel}><option value="in">in</option><option value="cm">cm</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Slope</span>
          <select value={ratio} onChange={(e) => setRatio(parseInt((e.target as HTMLSelectElement).value, 10))} class={`${sel} w-full`}>{SLOPES.map((s) => <option value={s.ratio}>{s.label}</option>)}</select></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Ramp length</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.length)} {unit}</p>{unit === 'in' && <p class="mt-0.5 text-xs text-slate-400">{toFtIn(r.length)}</p>}</div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Horizontal run</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.run)} {unit}</p>{unit === 'in' && <p class="mt-0.5 text-xs text-slate-400">{toFtIn(r.run)}</p>}</div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Incline angle</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.angleDeg, 1)}°</p></div>
          </div>
          <p class={`mt-3 rounded-lg p-3 text-sm ring-1 ${r.adaCompliant ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' : 'bg-amber-50 text-amber-800 ring-amber-200'}`}>
            {r.adaCompliant ? '✓ Meets the ADA 1:12 maximum slope for public wheelchair ramps.' : '⚠️ Steeper than the ADA 1:12 maximum — not compliant for public unassisted use. Use a longer run for a gentler slope.'}
          </p>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the vertical rise the ramp must climb.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">A ramp\'s run is the rise times the slope ratio (1:12 means 12 units of run per 1 of rise), and the sloped ramp length is √(rise² + run²). The ADA limit for public ramps is 1:12 (≈4.8°), with a maximum 30-inch rise before a level landing. Check your local building code — requirements vary. 🔒 In your browser.</p>
    </div>
  );
}
