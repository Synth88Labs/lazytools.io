import { useMemo, useState } from 'preact/hooks';
import { pendulumPeriod } from '../../lib/physics-extra';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 3) => Number(x.toPrecision(d)).toString();

const BODIES = [
  { id: 'earth', label: 'Earth (9.807)', g: 9.80665 },
  { id: 'moon', label: 'Moon (1.62)', g: 1.62 },
  { id: 'mars', label: 'Mars (3.72)', g: 3.72 },
  { id: 'jupiter', label: 'Jupiter (24.79)', g: 24.79 },
];

export default function PendulumTool() {
  const [length, setLength] = useState('1');
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [body, setBody] = useState('earth');

  const r = useMemo(() => {
    const l = num(length);
    if (l == null) return null;
    const m = unit === 'm' ? l : l * 0.3048;
    const g = BODIES.find((b) => b.id === body)!.g;
    const res = pendulumPeriod(m, g);
    return res == null ? null : res;
  }, [length, unit, body]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Pendulum length</span>
          <div class="flex gap-1"><input type="number" step="any" value={length} onInput={(e) => setLength((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'm' | 'ft')} class={sel}><option value="m">m</option><option value="ft">ft</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Gravity</span>
          <select value={body} onChange={(e) => setBody((e.target as HTMLSelectElement).value)} class={`${sel} w-full`}>{BODIES.map((b) => <option value={b.id}>{b.label}</option>)}</select></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Period (one full swing)</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.period)} <span class="text-lg text-slate-500">s</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Frequency</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.frequency)} <span class="text-lg text-slate-500">Hz</span></p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a positive pendulum length.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">A simple pendulum\'s period is T = 2π·√(L/g) — it depends only on the length and gravity, not on the mass of the bob or (for small swings) the amplitude. To double the period you need four times the length. This small-angle formula is accurate to about 1% for swings under ~20°. 🔒 In your browser.</p>
    </div>
  );
}
