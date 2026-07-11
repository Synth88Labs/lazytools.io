import { useMemo, useState } from 'preact/hooks';
import { solveSuvat, type Suvat } from '../../lib/physics';

const VARS: { key: keyof Suvat; label: string; unit: string; desc: string }[] = [
  { key: 'u', label: 'u', unit: 'm/s', desc: 'initial velocity' },
  { key: 'v', label: 'v', unit: 'm/s', desc: 'final velocity' },
  { key: 'a', label: 'a', unit: 'm/s²', desc: 'acceleration' },
  { key: 's', label: 's', unit: 'm', desc: 'displacement' },
  { key: 't', label: 't', unit: 's', desc: 'time' },
];
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(6)).toString();

export default function SuvatTool() {
  const [vals, setVals] = useState<Record<string, string>>({ u: '0', v: '', a: '9.8', s: '', t: '3' });

  const { input, count } = useMemo(() => {
    const inp: Suvat = {};
    let c = 0;
    for (const { key } of VARS) { const n = num(vals[key] ?? ''); if (n != null) { inp[key] = n; c++; } }
    return { input: inp, count: c };
  }, [vals]);

  const result = useMemo(() => (count >= 3 ? solveSuvat(input) : null), [input, count]);
  const knownKeys = new Set(Object.keys(input));

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Enter any three of the five — leave two blank</p>
      <div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {VARS.map((V) => (
          <label class="block">
            <span class="mb-1 block text-xs font-semibold text-slate-600"><span class="font-mono text-brand-700">{V.label}</span> — {V.desc} <span class="text-slate-400">({V.unit})</span></span>
            <input type="number" step="any" value={vals[V.key] ?? ''} onInput={(e) => setVals({ ...vals, [V.key]: (e.target as HTMLInputElement).value })}
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </label>
        ))}
      </div>

      {count > 3 && <p class="mt-3 text-sm text-amber-700">Enter exactly three values (you have {count}). Clear {count - 3} to solve.</p>}
      {count === 3 && !result && <p class="mt-3 text-sm text-amber-700">These three values have no real solution (check signs — e.g. a negative under the square root).</p>}

      {result && count === 3 && (
        <>
          <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {VARS.map((V) => (
              <div class={`rounded-xl p-3 text-center ${knownKeys.has(V.key) ? 'bg-white ring-1 ring-slate-200' : 'bg-white ring-2 ring-brand-200'}`}>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{V.label} {knownKeys.has(V.key) ? '(given)' : ''}</p>
                <p class={`mt-1 font-mono text-lg font-bold ${knownKeys.has(V.key) ? 'text-slate-700' : 'text-brand-800'}`}>{fmt(result[V.key])}</p>
                <p class="text-xs text-slate-400">{V.unit}</p>
              </div>
            ))}
          </div>
          {result.note && <p class="mt-2 text-xs text-slate-500">Note: {result.note} (a negative velocity of the same magnitude is also a valid solution depending on direction).</p>}
        </>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Solves the five kinematic (SUVAT) equations: v = u+at · s = ½(u+v)t · v² = u²+2as · s = ut+½at² · s = vt−½at². Constant acceleration. 🔒 In your browser.
      </p>
    </div>
  );
}
