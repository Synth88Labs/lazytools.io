import { useMemo, useState } from 'preact/hooks';
import { oneWayAnova } from '../../lib/stats-tests';
import { parseNumbers } from '../../lib/stats-descriptive';

const fmt = (n: number, d = 4) => n.toLocaleString('en-US', { maximumFractionDigits: d });

export default function AnovaTool() {
  const [raw, setRaw] = useState('7, 8, 6, 9, 7\n10, 11, 9, 12, 10\n6, 5, 7, 6, 8');
  const [alpha, setAlpha] = useState('0.05');

  const r = useMemo(() => {
    const groups = raw.split('\n').map((line) => parseNumbers(line)).filter((g) => g.length > 0);
    return oneWayAnova(groups);
  }, [raw]);

  const a = parseFloat(alpha) || 0.05;
  const sig = r ? r.p < a : false;
  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Groups, one group per line (comma or space separated)</span>
        <textarea rows={5} value={raw} onInput={(e) => setRaw((e.target as HTMLTextAreaElement).value)} class={inp} />
      </label>
      <label class="mt-2 inline-block text-sm text-slate-600">Significance α <input type="number" step="0.01" value={alpha} onInput={(e) => setAlpha((e.target as HTMLInputElement).value)} class={`${inp} inline-block w-20`} /></label>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">F statistic</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.f, 3)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">df (between, within)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.dfBetween}, {r.dfWithin}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">p-value</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.p < 0.0001 ? r.p.toExponential(2) : fmt(r.p, 4)}</p></div>
          </div>
          <div class="mt-3 overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200">
            <table class="w-full text-left text-sm">
              <thead><tr class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><th class="px-3 py-2">Source</th><th class="px-3 py-2">SS</th><th class="px-3 py-2">df</th><th class="px-3 py-2">MS</th></tr></thead>
              <tbody class="font-mono text-slate-700">
                <tr class="border-b border-slate-100"><td class="px-3 py-2">Between groups</td><td class="px-3 py-2">{fmt(r.ssBetween, 3)}</td><td class="px-3 py-2">{r.dfBetween}</td><td class="px-3 py-2">{fmt(r.msBetween, 3)}</td></tr>
                <tr class="border-b border-slate-100"><td class="px-3 py-2">Within groups</td><td class="px-3 py-2">{fmt(r.ssWithin, 3)}</td><td class="px-3 py-2">{r.dfWithin}</td><td class="px-3 py-2">{fmt(r.msWithin, 3)}</td></tr>
                <tr><td class="px-3 py-2 font-semibold">Total</td><td class="px-3 py-2">{fmt(r.ssBetween + r.ssWithin, 3)}</td><td class="px-3 py-2">{r.nTotal - 1}</td><td class="px-3 py-2">—</td></tr>
              </tbody>
            </table>
          </div>
          <div class={`mt-3 rounded-xl p-4 ring-2 ${sig ? 'bg-emerald-50 ring-emerald-200' : 'bg-slate-100 ring-slate-200'}`}>
            <p class={`text-sm font-semibold ${sig ? 'text-emerald-800' : 'text-slate-700'}`}>{sig ? `At least one group mean differs (significant at α = ${a})` : `No significant difference between group means at α = ${a}`}</p>
            <p class={`mt-1 text-sm ${sig ? 'text-emerald-700' : 'text-slate-600'}`}>{sig
              ? `p = ${fmt(r.p, 4)} < ${a}, so you reject the null hypothesis that all ${r.k} group means are equal. ANOVA doesn't say which groups differ, follow up with a post-hoc test (e.g. Tukey's HSD).`
              : `p = ${fmt(r.p, 4)} ≥ ${a}, so there isn't enough evidence that the ${r.k} group means differ.`}</p>
          </div>
        </>
      ) : <p class="mt-4 text-sm text-slate-500">Enter at least two groups (one per line), each with one or more numbers, and some within-group variation.</p>}

      <p class="mt-4 text-xs text-slate-500">One-way ANOVA tests whether the means of three or more groups are all equal, by comparing the variance between group means to the variance within groups (the F ratio). p-values use the exact F-distribution. A significant result tells you the groups aren't all equal but not which ones, use a post-hoc test to locate the differences. It assumes roughly normal groups with similar variances. 🔒 In your browser.</p>
    </div>
  );
}
