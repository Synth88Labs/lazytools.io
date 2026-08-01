import { useMemo, useState } from 'preact/hooks';
import { wilcoxonSignedRank, type Tail } from '../../lib/stats-tests';
import { parseNumbers } from '../../lib/stats-descriptive';

const fmt = (n: number, d = 4) => n.toLocaleString('en-US', { maximumFractionDigits: d });

export default function WilcoxonTool() {
  const [rawA, setRawA] = useState('125, 130, 118, 140, 128, 135, 122');
  const [rawB, setRawB] = useState('120, 128, 119, 132, 121, 130, 120');
  const [tail, setTail] = useState<Tail>('two');
  const [alpha, setAlpha] = useState('0.05');

  const r = useMemo(() => {
    const a = parseNumbers(rawA), b = parseNumbers(rawB);
    if (a.length !== b.length || !a.length) return { err: a.length !== b.length ? 'The two columns must have the same number of values (they are paired).' : '' };
    const res = wilcoxonSignedRank(a, b, tail);
    return res ? { res } : { err: 'All paired differences are zero, or no data.' };
  }, [rawA, rawB, tail]);

  const a = parseFloat(alpha) || 0.05;
  const res = 'res' in r ? r.res : null;
  const sig = res ? res.p < a : false;
  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Condition A (before)</span><textarea rows={3} value={rawA} onInput={(e) => setRawA((e.target as HTMLTextAreaElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Condition B (after)</span><textarea rows={3} value={rawB} onInput={(e) => setRawB((e.target as HTMLTextAreaElement).value)} class={inp} /></label>
      </div>
      <p class="mt-1 text-xs text-slate-500">Enter the two measurements for each subject in the same order — value 1 in A pairs with value 1 in B.</p>
      <div class="mt-2 flex flex-wrap items-center gap-3">
        <label class="text-sm text-slate-600">Tail <select class={sel} value={tail} onChange={(e) => setTail((e.target as HTMLSelectElement).value as Tail)}><option value="two">Two-tailed (≠)</option><option value="right">Right (A &gt; B)</option><option value="left">Left (A &lt; B)</option></select></label>
        <label class="text-sm text-slate-600">α <input type="number" step="0.01" value={alpha} onInput={(e) => setAlpha((e.target as HTMLInputElement).value)} class={`${inp} inline-block w-20`} /></label>
      </div>

      {res ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">W statistic</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(res.w, 2)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">z (normal approx.)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(res.z, 3)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">p-value</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{res.p < 0.0001 ? res.p.toExponential(2) : fmt(res.p, 4)}</p></div>
          </div>
          <p class="mt-2 text-xs text-slate-500">W⁺ = {fmt(res.wPlus, 2)} · W⁻ = {fmt(res.wMinus, 2)} · n = {res.n} non-zero pairs</p>
          <div class={`mt-3 rounded-xl p-4 ring-2 ${sig ? 'bg-emerald-50 ring-emerald-200' : 'bg-slate-100 ring-slate-200'}`}>
            <p class={`text-sm font-semibold ${sig ? 'text-emerald-800' : 'text-slate-700'}`}>{sig ? `Significant difference at α = ${a}` : `No significant difference at α = ${a}`}</p>
            <p class={`mt-1 text-sm ${sig ? 'text-emerald-700' : 'text-slate-600'}`}>{sig
              ? `p = ${fmt(res.p, 4)} < ${a}, so you reject the null hypothesis that the paired differences are symmetric around zero — the two conditions differ.`
              : `p = ${fmt(res.p, 4)} ≥ ${a}, so there isn't enough evidence of a difference between the paired conditions.`}</p>
          </div>
        </>
      ) : <p class="mt-4 text-sm text-slate-500">{'err' in r && r.err ? r.err : 'Enter paired values for both conditions.'}</p>}

      <p class="mt-4 text-xs text-slate-500">The Wilcoxon signed-rank test is the non-parametric alternative to the paired t-test: it works on the ranks of the paired differences, so it doesn't assume those differences are normally distributed — good for small samples, skewed data or ordinal ratings. Zero differences are dropped; ties share average ranks. This uses the normal approximation with a tie correction (accurate for moderate-to-large n; small samples are better checked against an exact table). 🔒 In your browser.</p>
    </div>
  );
}
