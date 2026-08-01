import { useMemo, useState } from 'preact/hooks';
import { mannWhitneyU, type Tail } from '../../lib/stats-tests';
import { parseNumbers } from '../../lib/stats-descriptive';

const fmt = (n: number, d = 4) => n.toLocaleString('en-US', { maximumFractionDigits: d });

export default function MannWhitneyTool() {
  const [rawA, setRawA] = useState('12, 15, 14, 10, 13, 16');
  const [rawB, setRawB] = useState('18, 20, 17, 19, 22, 21');
  const [tail, setTail] = useState<Tail>('two');
  const [alpha, setAlpha] = useState('0.05');

  const r = useMemo(() => {
    const a = parseNumbers(rawA), b = parseNumbers(rawB);
    if (!a.length || !b.length) return null;
    return mannWhitneyU(a, b, tail);
  }, [rawA, rawB, tail]);

  const a = parseFloat(alpha) || 0.05;
  const sig = r ? r.p < a : false;
  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Group A</span><textarea rows={3} value={rawA} onInput={(e) => setRawA((e.target as HTMLTextAreaElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Group B</span><textarea rows={3} value={rawB} onInput={(e) => setRawB((e.target as HTMLTextAreaElement).value)} class={inp} /></label>
      </div>
      <div class="mt-2 flex flex-wrap items-center gap-3">
        <label class="text-sm text-slate-600">Tail <select class={sel} value={tail} onChange={(e) => setTail((e.target as HTMLSelectElement).value as Tail)}><option value="two">Two-tailed (≠)</option><option value="right">Right (A &gt; B)</option><option value="left">Left (A &lt; B)</option></select></label>
        <label class="text-sm text-slate-600">α <input type="number" step="0.01" value={alpha} onInput={(e) => setAlpha((e.target as HTMLInputElement).value)} class={`${inp} inline-block w-20`} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">U statistic</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.u, 2)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">z (normal approx.)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.z, 3)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">p-value</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.p < 0.0001 ? r.p.toExponential(2) : fmt(r.p, 4)}</p></div>
          </div>
          <p class="mt-2 text-xs text-slate-500">U₁ = {fmt(r.u1, 2)} · U₂ = {fmt(r.u2, 2)} · n₁ = {r.n1}, n₂ = {r.n2}</p>
          <div class={`mt-3 rounded-xl p-4 ring-2 ${sig ? 'bg-emerald-50 ring-emerald-200' : 'bg-slate-100 ring-slate-200'}`}>
            <p class={`text-sm font-semibold ${sig ? 'text-emerald-800' : 'text-slate-700'}`}>{sig ? `Distributions differ significantly at α = ${a}` : `No significant difference at α = ${a}`}</p>
            <p class={`mt-1 text-sm ${sig ? 'text-emerald-700' : 'text-slate-600'}`}>{sig
              ? `p = ${fmt(r.p, 4)} < ${a}, so you reject the null hypothesis that the two groups come from the same distribution.`
              : `p = ${fmt(r.p, 4)} ≥ ${a}, so there isn't enough evidence that the two groups' distributions differ.`}</p>
          </div>
        </>
      ) : <p class="mt-4 text-sm text-slate-500">Enter numbers for both groups (comma or space separated).</p>}

      <p class="mt-4 text-xs text-slate-500">The Mann-Whitney U test (Wilcoxon rank-sum) is the non-parametric alternative to the two-sample t-test: it compares two independent groups by ranking all values together, so it doesn't assume the data are normally distributed — useful for ordinal data, skewed data or outliers. This tool uses the normal approximation with a tie correction, which is accurate for moderate-to-large samples; for very small samples an exact table is more precise. 🔒 Computed in your browser.</p>
    </div>
  );
}
