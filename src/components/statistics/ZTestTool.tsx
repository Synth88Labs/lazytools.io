import { useMemo, useState } from 'preact/hooks';
import { zTestOneSample, zTestTwoSample, type Tail } from '../../lib/stats-tests';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const int = (s: string) => { const n = parseInt(s, 10); return isFinite(n) ? n : null; };
const fmt = (n: number, d = 4) => n.toLocaleString('en-US', { maximumFractionDigits: d });

export default function ZTestTool() {
  const [mode, setMode] = useState<'one' | 'two'>('one');
  const [tail, setTail] = useState<Tail>('two');
  const [alpha, setAlpha] = useState('0.05');
  const [mean, setMean] = useState('105'); const [sigma, setSigma] = useState('15'); const [nn, setNn] = useState('25'); const [mu0, setMu0] = useState('100');
  const [m1, setM1] = useState('100'); const [s1, setS1] = useState('10'); const [n1, setN1] = useState('50');
  const [m2, setM2] = useState('95'); const [s2, setS2] = useState('12'); const [n2, setN2] = useState('50');

  const r = useMemo(() => {
    if (mode === 'two') {
      const a = num(m1), b = num(s1), c = int(n1), d = num(m2), e = num(s2), f = int(n2);
      if ([a, b, c, d, e, f].some((v) => v == null)) return null;
      return zTestTwoSample(a!, b!, c!, d!, e!, f!, tail);
    }
    const mv = num(mean), s = num(sigma), n = int(nn), u = num(mu0);
    if (mv == null || s == null || n == null || u == null) return null;
    return zTestOneSample(mv, s, n, u, tail);
  }, [mode, tail, mean, sigma, nn, mu0, m1, s1, n1, m2, s2, n2]);

  const a = num(alpha) ?? 0.05;
  const sig = r ? r.p < a : false;
  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 inline-flex rounded-xl bg-slate-200 p-1 text-sm font-semibold">
        {(['one', 'two'] as const).map((mm) => (
          <button onClick={() => setMode(mm)} class={`rounded-lg px-3 py-1 ${mode === mm ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>{mm === 'one' ? 'One-sample' : 'Two-sample'}</button>
        ))}
      </div>

      {mode === 'two' ? (
        <div class="grid gap-3 sm:grid-cols-2">
          {[['Sample 1', m1, setM1, s1, setS1, n1, setN1], ['Sample 2', m2, setM2, s2, setS2, n2, setN2]].map(([title, mv, setMv, sv, setSv, nv, setNv]: any) => (
            <div class="rounded-xl bg-white p-3 ring-1 ring-slate-200">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
              <div class="grid grid-cols-3 gap-2">
                <label class="block"><span class="mb-1 block text-[11px] text-slate-400">Mean</span><input type="number" step="any" value={mv} onInput={(e) => setMv((e.target as HTMLInputElement).value)} class={inp} /></label>
                <label class="block"><span class="mb-1 block text-[11px] text-slate-400">σ (known)</span><input type="number" step="any" value={sv} onInput={(e) => setSv((e.target as HTMLInputElement).value)} class={inp} /></label>
                <label class="block"><span class="mb-1 block text-[11px] text-slate-400">n</span><input type="number" step="1" value={nv} onInput={(e) => setNv((e.target as HTMLInputElement).value)} class={inp} /></label>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div class="grid gap-3 sm:grid-cols-4">
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sample mean</span><input type="number" step="any" value={mean} onInput={(e) => setMean((e.target as HTMLInputElement).value)} class={inp} /></label>
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Population σ (known)</span><input type="number" step="any" value={sigma} onInput={(e) => setSigma((e.target as HTMLInputElement).value)} class={inp} /></label>
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sample size n</span><input type="number" step="1" value={nn} onInput={(e) => setNn((e.target as HTMLInputElement).value)} class={inp} /></label>
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Hypothesized μ₀</span><input type="number" step="any" value={mu0} onInput={(e) => setMu0((e.target as HTMLInputElement).value)} class={inp} /></label>
        </div>
      )}

      <div class="mt-3 flex flex-wrap items-center gap-3">
        <label class="text-sm text-slate-600">Tail <select class={sel} value={tail} onChange={(e) => setTail((e.target as HTMLSelectElement).value as Tail)}><option value="two">Two-tailed (≠)</option><option value="right">Right (&gt;)</option><option value="left">Left (&lt;)</option></select></label>
        <label class="text-sm text-slate-600">α <input type="number" step="0.01" value={alpha} onInput={(e) => setAlpha((e.target as HTMLInputElement).value)} class={`${inp} inline-block w-20`} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">z statistic</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.z, 3)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Standard error</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.se, 4)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">p-value</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.p < 0.0001 ? r.p.toExponential(2) : fmt(r.p, 4)}</p></div>
          </div>
          <div class={`mt-3 rounded-xl p-4 ring-2 ${sig ? 'bg-emerald-50 ring-emerald-200' : 'bg-slate-100 ring-slate-200'}`}>
            <p class={`text-sm font-semibold ${sig ? 'text-emerald-800' : 'text-slate-700'}`}>{sig ? `Statistically significant at α = ${a}` : `Not significant at α = ${a}`}</p>
            <p class={`mt-1 text-sm ${sig ? 'text-emerald-700' : 'text-slate-600'}`}>{sig
              ? `p = ${fmt(r.p, 4)} < ${a}, so you reject the null hypothesis, the difference is unlikely to be chance alone.`
              : `p = ${fmt(r.p, 4)} ≥ ${a}, so you fail to reject the null hypothesis, not enough evidence of a real difference at this level.`}</p>
          </div>
        </>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the sample statistics and the known population σ.</p>}

      <p class="mt-4 text-xs text-slate-500">The z-test assumes the population standard deviation (σ) is known and uses the standard normal distribution. Use it when σ is known or the sample is large; when σ is estimated from the sample, prefer the t-test instead. p-values use an exact normal CDF. 🔒 Computed in your browser.</p>
    </div>
  );
}
