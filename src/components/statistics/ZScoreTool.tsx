import { useMemo, useState } from 'preact/hooks';
import { zScore } from '../../lib/stats-descriptive';
import { normalCdf } from '../../lib/stats';

const num = (s: string) => { const n = parseFloat(s); return s.trim() !== '' && isFinite(n) ? n : null; };
const fmt = (x: number, d = 4) => Number(x.toFixed(d)).toString();

export default function ZScoreTool() {
  const [x, setX] = useState('85');
  const [mean, setMean] = useState('70');
  const [sd, setSd] = useState('10');

  const r = useMemo(() => {
    const xv = num(x), m = num(mean), s = num(sd);
    if (xv == null || m == null || s == null) return null;
    const z = zScore(xv, m, s);
    if (z == null) return null;
    const below = normalCdf(z); // proportion below x
    return { z, pctBelow: below * 100, pctAbove: (1 - below) * 100 };
  }, [x, mean, sd]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Value (x)</span>
          <input type="number" step="any" value={x} onInput={(e) => setX((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mean (μ)</span>
          <input type="number" step="any" value={mean} onInput={(e) => setMean((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Std deviation (σ)</span>
          <input type="number" step="any" value={sd} onInput={(e) => setSd((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Z-score</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.z)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Percentile (below)</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.pctBelow, 2)}%</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Above</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.pctAbove, 2)}%</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a value, mean and a positive standard deviation.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">A z-score (standard score) is how many standard deviations a value sits from the mean: z = (x − μ) ÷ σ. A positive z is above the mean, negative below. Assuming a normal distribution, the percentile is the area to the left under the bell curve — so z = 0 is the 50th percentile and z = 1.96 is about the 97.5th. 🔒 In your browser.</p>
    </div>
  );
}
