import { useMemo, useState } from 'preact/hooks';
import { normalCdf, tCdf, chiSqCdf, fCdf } from '../../lib/stats';

type Dist = 'z' | 't' | 'chi2' | 'f';
type Tail = 'two' | 'right' | 'left';

const fmtP = (p: number) => {
  if (!isFinite(p) || p < 0) return '—';
  if (p === 0) return '< 1e-16';
  if (p < 1e-4) return p.toExponential(4);
  return p.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
};

export default function PValueTool() {
  const [dist, setDist] = useState<Dist>('z');
  const [tail, setTail] = useState<Tail>('two');
  const [statStr, setStat] = useState('1.96');
  const [df1, setDf1] = useState('10');
  const [df2, setDf2] = useState('20');
  const [alphaStr, setAlpha] = useState('0.05');

  const stat = parseFloat(statStr);
  const d1 = parseFloat(df1);
  const d2 = parseFloat(df2);
  const alpha = parseFloat(alphaStr);

  const r = useMemo(() => {
    if (!isFinite(stat)) return null;
    let p: number | null = null;
    if (dist === 'z') {
      const right = 1 - normalCdf(stat);
      p = tail === 'two' ? 2 * (1 - normalCdf(Math.abs(stat))) : tail === 'right' ? right : normalCdf(stat);
    } else if (dist === 't') {
      if (!(d1 > 0)) return null;
      const cdf = tCdf(stat, d1);
      p = tail === 'two' ? 2 * (1 - tCdf(Math.abs(stat), d1)) : tail === 'right' ? 1 - cdf : cdf;
    } else if (dist === 'chi2') {
      if (!(d1 > 0) || stat < 0) return null;
      p = 1 - chiSqCdf(stat, d1); // right-tailed
    } else if (dist === 'f') {
      if (!(d1 > 0) || !(d2 > 0) || stat < 0) return null;
      p = 1 - fCdf(stat, d1, d2); // right-tailed
    }
    if (p === null) return null;
    p = Math.min(1, Math.max(0, p));
    return { p, sig: isFinite(alpha) && alpha > 0 ? p <= alpha : null };
  }, [dist, tail, stat, d1, d2, alpha]);

  const tabBtn = (id: Dist, label: string) => (
    <button onClick={() => setDist(id)}
      class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${dist === id ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}
    >{label}</button>
  );
  const inp = (val: string, set: (v: string) => void, label: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input type="number" step="any" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );
  const tailable = dist === 'z' || dist === 't';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap gap-2">
        {tabBtn('z', 'z (normal)')}
        {tabBtn('t', 't')}
        {tabBtn('chi2', 'χ² (chi-square)')}
        {tabBtn('f', 'F')}
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        {inp(statStr, setStat, `${dist === 'z' ? 'z' : dist === 't' ? 't' : dist === 'chi2' ? 'χ²' : 'F'} statistic`)}
        {inp(alphaStr, setAlpha, 'Significance level (α)')}
        {dist === 't' && inp(df1, setDf1, 'Degrees of freedom (df)')}
        {dist === 'chi2' && inp(df1, setDf1, 'Degrees of freedom (df)')}
        {dist === 'f' && (
          <>
            {inp(df1, setDf1, 'Numerator df₁')}
            {inp(df2, setDf2, 'Denominator df₂')}
          </>
        )}
      </div>

      {tailable && (
        <div class="mt-3 flex flex-wrap gap-2">
          {(['two', 'right', 'left'] as Tail[]).map((t) => (
            <button onClick={() => setTail(t)}
              class={`rounded-lg px-3 py-1 text-xs font-semibold transition ${tail === t ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}
            >{t === 'two' ? 'Two-tailed' : t === 'right' ? 'Right-tailed' : 'Left-tailed'}</button>
          ))}
        </div>
      )}
      {!tailable && <p class="mt-3 text-xs text-slate-500">{dist === 'chi2' ? 'χ²' : 'F'} tests are right-tailed.</p>}

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">p-value</p>
          <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmtP(r.p)}</p>
          {r.sig !== null && (
            <p class={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${r.sig ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
              {r.sig ? `p ≤ α — statistically significant, reject H₀` : `p > α — not significant, fail to reject H₀`}
            </p>
          )}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a test statistic and the required degrees of freedom.</p>
      )}

      <p class="mt-3 text-xs text-slate-500">
        Exact p-values from the cumulative distribution functions (erf, regularized incomplete gamma &amp; beta). 🔒 Computed in your browser.
      </p>
    </div>
  );
}
