import { useMemo, useState } from 'preact/hooks';
import { tTestOneSample, tTestPaired, tTestTwoSample, type Tail } from '../../lib/stats-tests';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const int = (s: string) => { const n = parseInt(s, 10); return isFinite(n) ? n : null; };
const fmt = (n: number, d = 4) => n.toLocaleString('en-US', { maximumFractionDigits: d });

type Mode = 'one' | 'two' | 'paired';

export default function TTestTool() {
  const [mode, setMode] = useState<Mode>('two');
  const [tail, setTail] = useState<Tail>('two');
  const [alpha, setAlpha] = useState('0.05');
  const [pooled, setPooled] = useState(false);
  // one-sample / paired
  const [mean, setMean] = useState('105');
  const [sd, setSd] = useState('15');
  const [nn, setNn] = useState('25');
  const [mu0, setMu0] = useState('100');
  // two-sample
  const [m1, setM1] = useState('10'); const [sd1, setSd1] = useState('2'); const [n1, setN1] = useState('30');
  const [m2, setM2] = useState('12'); const [sd2, setSd2] = useState('3'); const [n2, setN2] = useState('30');

  const r = useMemo(() => {
    if (mode === 'two') {
      const a = num(m1), b = num(sd1), c = int(n1), d = num(m2), e = num(sd2), f = int(n2);
      if ([a, b, c, d, e, f].some((v) => v == null)) return null;
      return tTestTwoSample(a!, b!, c!, d!, e!, f!, { pooled, tail });
    }
    const mv = num(mean), s = num(sd), n = int(nn);
    if (mv == null || s == null || n == null) return null;
    if (mode === 'paired') return tTestPaired(mv, s, n, tail);
    const u = num(mu0);
    if (u == null) return null;
    return tTestOneSample(mv, s, n, u, tail);
  }, [mode, tail, pooled, mean, sd, nn, mu0, m1, sd1, n1, m2, sd2, n2]);

  const a = num(alpha) ?? 0.05;
  const sig = r ? r.p < a : false;

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 inline-flex rounded-xl bg-slate-200 p-1 text-sm font-semibold">
        {(['one', 'two', 'paired'] as const).map((mm) => (
          <button onClick={() => setMode(mm)} class={`rounded-lg px-3 py-1 ${mode === mm ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>{mm === 'one' ? 'One-sample' : mm === 'two' ? 'Two-sample' : 'Paired'}</button>
        ))}
      </div>

      {mode === 'two' ? (
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-3 ring-1 ring-slate-200">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Sample 1</p>
            <div class="grid grid-cols-3 gap-2">
              <label class="block"><span class="mb-1 block text-[11px] text-slate-400">Mean</span><input type="number" step="any" value={m1} onInput={(e) => setM1((e.target as HTMLInputElement).value)} class={inp} /></label>
              <label class="block"><span class="mb-1 block text-[11px] text-slate-400">SD</span><input type="number" step="any" value={sd1} onInput={(e) => setSd1((e.target as HTMLInputElement).value)} class={inp} /></label>
              <label class="block"><span class="mb-1 block text-[11px] text-slate-400">n</span><input type="number" step="1" value={n1} onInput={(e) => setN1((e.target as HTMLInputElement).value)} class={inp} /></label>
            </div>
          </div>
          <div class="rounded-xl bg-white p-3 ring-1 ring-slate-200">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Sample 2</p>
            <div class="grid grid-cols-3 gap-2">
              <label class="block"><span class="mb-1 block text-[11px] text-slate-400">Mean</span><input type="number" step="any" value={m2} onInput={(e) => setM2((e.target as HTMLInputElement).value)} class={inp} /></label>
              <label class="block"><span class="mb-1 block text-[11px] text-slate-400">SD</span><input type="number" step="any" value={sd2} onInput={(e) => setSd2((e.target as HTMLInputElement).value)} class={inp} /></label>
              <label class="block"><span class="mb-1 block text-[11px] text-slate-400">n</span><input type="number" step="1" value={n2} onInput={(e) => setN2((e.target as HTMLInputElement).value)} class={inp} /></label>
            </div>
          </div>
        </div>
      ) : (
        <div class="grid gap-3 sm:grid-cols-4">
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{mode === 'paired' ? 'Mean difference' : 'Sample mean'}</span><input type="number" step="any" value={mean} onInput={(e) => setMean((e.target as HTMLInputElement).value)} class={inp} /></label>
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{mode === 'paired' ? 'SD of differences' : 'Sample SD'}</span><input type="number" step="any" value={sd} onInput={(e) => setSd((e.target as HTMLInputElement).value)} class={inp} /></label>
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sample size n</span><input type="number" step="1" value={nn} onInput={(e) => setNn((e.target as HTMLInputElement).value)} class={inp} /></label>
          {mode === 'one' && <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Hypothesized μ₀</span><input type="number" step="any" value={mu0} onInput={(e) => setMu0((e.target as HTMLInputElement).value)} class={inp} /></label>}
        </div>
      )}

      <div class="mt-3 flex flex-wrap items-center gap-3">
        <label class="text-sm text-slate-600">Tail <select class={sel} value={tail} onChange={(e) => setTail((e.target as HTMLSelectElement).value as Tail)}><option value="two">Two-tailed (≠)</option><option value="right">Right (&gt;)</option><option value="left">Left (&lt;)</option></select></label>
        <label class="text-sm text-slate-600">α <input type="number" step="0.01" value={alpha} onInput={(e) => setAlpha((e.target as HTMLInputElement).value)} class={`${inp} inline-block w-20`} /></label>
        {mode === 'two' && <label class="flex items-center gap-1.5 text-sm text-slate-600"><input type="checkbox" checked={pooled} onChange={(e) => setPooled((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600" /> Equal variances (pooled)</label>}
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">t statistic</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.t, 3)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Degrees of freedom</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.df, 2)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">p-value</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.p < 0.0001 ? r.p.toExponential(2) : fmt(r.p, 4)}</p></div>
          </div>
          <div class={`mt-3 rounded-xl p-4 ring-2 ${sig ? 'bg-emerald-50 ring-emerald-200' : 'bg-slate-100 ring-slate-200'}`}>
            <p class={`text-sm font-semibold ${sig ? 'text-emerald-800' : 'text-slate-700'}`}>{sig ? `Statistically significant at α = ${a}` : `Not significant at α = ${a}`}</p>
            <p class={`mt-1 text-sm ${sig ? 'text-emerald-700' : 'text-slate-600'}`}>{sig
              ? `p = ${fmt(r.p, 4)} < ${a}, so you reject the null hypothesis — the observed difference is unlikely to be due to chance alone.`
              : `p = ${fmt(r.p, 4)} ≥ ${a}, so you fail to reject the null hypothesis — there isn't enough evidence of a real difference at this level.`}</p>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the sample statistics (means, standard deviations and sizes).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Uses Student's t-test with exact t-distribution p-values. The two-sample test defaults to Welch's (unequal-variance) form, which is safer when the group sizes or spreads differ; tick "equal variances" for the classic pooled test. Enter summary statistics (mean, SD, n) — for a paired test, use the mean and SD of the paired differences. "Fail to reject" is not proof of no effect, only insufficient evidence. 🔒 In your browser.</p>
    </div>
  );
}
