import { useMemo, useState } from 'preact/hooks';
import { abvSimple, abvAccurate, attenuation, caloriesPer12oz } from '../../lib/brewing';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (n: number, d = 1) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export default function AbvTool() {
  const [og, setOg] = useState('1.050');
  const [fg, setFg] = useState('1.010');

  const r = useMemo(() => {
    const o = num(og), f = num(fg);
    if (o == null || f == null) return null;
    const simple = abvSimple(o, f);
    if (simple == null) return null;
    return {
      simple,
      accurate: abvAccurate(o, f),
      att: attenuation(o, f),
      cal: caloriesPer12oz(o, f),
    };
  }, [og, fg]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Original gravity (OG)</span>
          <input type="number" step="0.001" value={og} onInput={(e) => setOg((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Final gravity (FG)</span>
          <input type="number" step="0.001" value={fg} onInput={(e) => setFg((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">ABV (standard)</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.simple, 2)}%</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">ABV (accurate)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.accurate != null ? `${fmt(r.accurate, 2)}%` : '—'}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Attenuation</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.att != null ? `${fmt(r.att, 0)}%` : '—'}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Calories / 12 oz</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.cal != null ? fmt(r.cal, 0) : '—'}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your original and final gravity (e.g. 1.050 and 1.010).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The standard estimate is ABV = (OG − FG) × 131.25. The "accurate" figure uses Michael Hall's formula, which is better for strong beers (above ~1.070) where the simple one reads a little low. Attenuation is how much of the sugar fermented; calories are a standard estimate per 12 oz (355 mL) serving. Gravities are specific gravity (water = 1.000). 🔒 In your browser.</p>
    </div>
  );
}
