import { useMemo, useState } from 'preact/hooks';
import { geometricMean, harmonicMean, parseNumbers } from '../../lib/stats-descriptive';

const fmt = (x: number) => Number(x.toPrecision(8)).toLocaleString(undefined, { maximumFractionDigits: 6 });

export default function MeansTool() {
  const [raw, setRaw] = useState('2, 4, 8');

  const r = useMemo(() => {
    const data = parseNumbers(raw);
    if (data.length === 0) return null;
    const arithmetic = data.reduce((s, x) => s + x, 0) / data.length;
    return { n: data.length, arithmetic, geometric: geometricMean(data), harmonic: harmonicMean(data) };
  }, [raw]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const cell = (label: string, val: string, hi = false) => (
    <div class={`rounded-xl bg-white p-4 text-center ${hi ? 'ring-2 ring-brand-200' : 'ring-1 ring-slate-200'}`}><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p class={`mt-1 text-2xl font-extrabold ${hi ? 'text-brand-800' : 'text-slate-700'}`}>{val}</p></div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Data set (comma, space or newline separated)</span>
        <textarea rows={2} value={raw} onInput={(e) => setRaw((e.target as HTMLTextAreaElement).value)} class={inp} /></label>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            {cell('Geometric mean', r.geometric != null ? fmt(r.geometric) : '—', true)}
            {cell('Harmonic mean', r.harmonic != null ? fmt(r.harmonic) : '—')}
            {cell('Arithmetic mean', fmt(r.arithmetic))}
          </div>
          {r.geometric == null && <p class="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200">The geometric and harmonic means need all values to be positive (greater than zero).</p>}
          {r.geometric != null && r.harmonic != null && <p class="mt-3 text-center text-xs text-slate-500">For positive data, arithmetic ≥ geometric ≥ harmonic mean.</p>}
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter some numbers.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The <strong>geometric mean</strong> is the nth root of the product — the right average for growth rates, ratios and things that multiply (like investment returns). The <strong>harmonic mean</strong> is n divided by the sum of reciprocals — the right average for rates over a fixed distance (like average speed) and for ratios such as P/E. The arithmetic mean is shown for comparison. 🔒 In your browser.</p>
    </div>
  );
}
