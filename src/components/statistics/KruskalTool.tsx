import { useMemo, useState } from 'preact/hooks';
import { kruskalWallis } from '../../lib/stats-tests';
import { parseNumbers } from '../../lib/stats-descriptive';

const fmt = (n: number, d = 4) => n.toLocaleString('en-US', { maximumFractionDigits: d });

export default function KruskalTool() {
  const [raw, setRaw] = useState('7, 8, 6, 9, 7\n10, 11, 9, 12, 10\n6, 5, 7, 6, 8');
  const [alpha, setAlpha] = useState('0.05');

  const r = useMemo(() => {
    const groups = raw.split('\n').map((line) => parseNumbers(line)).filter((g) => g.length > 0);
    return kruskalWallis(groups);
  }, [raw]);

  const a = parseFloat(alpha) || 0.05;
  const sig = r ? r.p < a : false;
  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Groups — one group per line (comma or space separated)</span>
        <textarea rows={5} value={raw} onInput={(e) => setRaw((e.target as HTMLTextAreaElement).value)} class={inp} />
      </label>
      <label class="mt-2 inline-block text-sm text-slate-600">Significance α <input type="number" step="0.01" value={alpha} onInput={(e) => setAlpha((e.target as HTMLInputElement).value)} class={`${inp} inline-block w-20`} /></label>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">H statistic</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.h, 3)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Degrees of freedom</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.df}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">p-value</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.p < 0.0001 ? r.p.toExponential(2) : fmt(r.p, 4)}</p></div>
          </div>
          <p class="mt-2 text-xs text-slate-500">Rank sums: {r.rankSums.map((s) => fmt(s, 1)).join(' · ')} · N = {r.nTotal}, {r.k} groups</p>
          <div class={`mt-3 rounded-xl p-4 ring-2 ${sig ? 'bg-emerald-50 ring-emerald-200' : 'bg-slate-100 ring-slate-200'}`}>
            <p class={`text-sm font-semibold ${sig ? 'text-emerald-800' : 'text-slate-700'}`}>{sig ? `At least one group differs (significant at α = ${a})` : `No significant difference between groups at α = ${a}`}</p>
            <p class={`mt-1 text-sm ${sig ? 'text-emerald-700' : 'text-slate-600'}`}>{sig
              ? `p = ${fmt(r.p, 4)} < ${a}, so you reject the null hypothesis that all ${r.k} groups have the same distribution. Like ANOVA, it doesn't say which groups differ — use a post-hoc test (e.g. Dunn's test).`
              : `p = ${fmt(r.p, 4)} ≥ ${a}, so there isn't enough evidence that the ${r.k} groups differ.`}</p>
          </div>
        </>
      ) : <p class="mt-4 text-sm text-slate-500">Enter at least two groups (one per line), each with one or more numbers.</p>}

      <p class="mt-4 text-xs text-slate-500">The Kruskal-Wallis H test is the non-parametric alternative to one-way ANOVA: it compares three or more groups by ranking all values together, so it doesn't assume the data are normally distributed — useful for skewed data, ordinal ratings or outliers. The H statistic is compared to a chi-square distribution (with a tie correction). A significant result means the groups aren't all alike but not which ones differ. 🔒 In your browser.</p>
    </div>
  );
}
