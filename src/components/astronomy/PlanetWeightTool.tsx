import { useMemo, useState } from 'preact/hooks';
import { PLANETS } from '../../lib/astronomy';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => Number(x.toFixed(1)).toLocaleString();

export default function PlanetWeightTool() {
  const [unit, setUnit] = useState<'kg' | 'lb'>('lb');
  const [weight, setWeight] = useState('150');

  const rows = useMemo(() => {
    const w = num(weight);
    if (w == null) return null;
    return PLANETS.map((p) => ({ name: p.name, id: p.id, weight: w * p.gravity, gravity: p.gravity }));
  }, [weight]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['lb', 'kg'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u}</button>
        ))}
      </div>
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Your weight on Earth ({unit})</span>
        <input type="number" step="any" value={weight} onInput={(e) => setWeight((e.target as HTMLInputElement).value)} class={`${inp} sm:w-48`} /></label>

      {rows ? (
        <div class="mt-4 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
          <table class="w-full text-sm">
            <thead><tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><th class="px-4 py-2">Body</th><th class="px-4 py-2 text-right">Surface gravity</th><th class="px-4 py-2 text-right">You'd weigh</th></tr></thead>
            <tbody>{rows.map((r, i) => (
              <tr class={`${i % 2 ? 'bg-slate-50' : ''} ${r.id === 'earth' ? 'bg-brand-50/60' : ''}`}>
                <td class="px-4 py-2 font-semibold text-slate-700">{r.name}</td>
                <td class="px-4 py-2 text-right font-mono text-slate-500">{r.gravity}× Earth</td>
                <td class="px-4 py-2 text-right font-mono font-bold text-brand-800">{fmt(r.weight)} {unit}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your weight.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Your <em>mass</em> never changes, but your <em>weight</em> is mass × the local surface gravity. On the Moon you'd weigh about a sixth as much; on Jupiter over twice as much. Surface-gravity ratios from the NASA Planetary Fact Sheet. 🔒 In your browser.</p>
    </div>
  );
}
