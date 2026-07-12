import { useMemo, useState } from 'preact/hooks';
import { poissonSummary } from '../../lib/stats-tests';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const int = (s: string) => { const n = parseInt(s, 10); return isFinite(n) && n >= 0 ? n : null; };
const p = (v: number) => v < 0.0001 && v > 0 ? v.toExponential(2) : v.toLocaleString('en-US', { maximumFractionDigits: 5 });

export default function PoissonTool() {
  const [lambda, setLambda] = useState('3');
  const [k, setK] = useState('2');

  const r = useMemo(() => {
    const l = num(lambda), kk = int(k);
    if (l == null || kk == null) return null;
    return poissonSummary(l, kk);
  }, [lambda, k]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Average rate λ (events per interval)</span><input type="number" step="any" value={lambda} onInput={(e) => setLambda((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Number of events k</span><input type="number" step="1" min="0" value={k} onInput={(e) => setK((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">P(X = {k}) — exactly {k} events</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{p(r.pEqual)}</p></div>
          <div class="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">P(X ≤ {k})</p><p class="mt-1 text-lg font-extrabold text-slate-700">{p(r.pLessEqual)}</p></div>
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">P(X ≥ {k})</p><p class="mt-1 text-lg font-extrabold text-slate-700">{p(r.pGreaterEqual)}</p></div>
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">P(X &lt; {k})</p><p class="mt-1 text-lg font-extrabold text-slate-700">{p(r.pLess)}</p></div>
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">P(X &gt; {k})</p><p class="mt-1 text-lg font-extrabold text-slate-700">{p(r.pGreater)}</p></div>
          </div>
          <p class="mt-3 text-sm text-slate-600">For a Poisson process the mean and variance both equal λ = <strong>{r.mean}</strong>, so the standard deviation is √λ ≈ <strong>{r.sd.toFixed(3)}</strong>.</p>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a positive rate λ and a whole-number count k.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The Poisson distribution models the number of independent events in a fixed interval when they happen at a constant average rate λ — arrivals in a queue, defects per batch, calls per hour. P(X = k) = e^(−λ)·λ^k ÷ k!. Its defining feature is that the mean and variance are both λ. Use it when events are rare and independent; if the variance is much larger than the mean, a different model may fit better. 🔒 In your browser.</p>
    </div>
  );
}
