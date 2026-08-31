import { useMemo, useState } from 'preact/hooks';
import { twoProportionZTest, type Tail } from '../../lib/stats-tests';

const int = (s: string) => { const n = parseInt(s, 10); return isFinite(n) ? n : null; };
const fmt = (n: number, d = 4) => n.toLocaleString('en-US', { maximumFractionDigits: d });
const pct = (n: number) => `${fmt(n * 100, 2)}%`;

export default function TwoPropTool() {
  const [tail, setTail] = useState<Tail>('two');
  const [alpha, setAlpha] = useState('0.05');
  const [x1, setX1] = useState('40'); const [nn1, setNn1] = useState('200');
  const [x2, setX2] = useState('60'); const [nn2, setNn2] = useState('200');

  const r = useMemo(() => {
    const a = int(x1), b = int(nn1), c = int(x2), d = int(nn2);
    if ([a, b, c, d].some((v) => v == null)) return null;
    return twoProportionZTest(a!, b!, c!, d!, tail);
  }, [x1, nn1, x2, nn2, tail]);

  const a = parseFloat(alpha) || 0.05;
  const sig = r ? r.p < a : false;
  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        {[['Variant A', x1, setX1, nn1, setNn1], ['Variant B', x2, setX2, nn2, setNn2]].map(([title, xv, setXv, nv, setNv]: any) => (
          <div class="rounded-xl bg-white p-3 ring-1 ring-slate-200">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
            <div class="grid grid-cols-2 gap-2">
              <label class="block"><span class="mb-1 block text-[11px] text-slate-400">Conversions</span><input type="number" step="1" value={xv} onInput={(e) => setXv((e.target as HTMLInputElement).value)} class={inp} /></label>
              <label class="block"><span class="mb-1 block text-[11px] text-slate-400">Total (visitors)</span><input type="number" step="1" value={nv} onInput={(e) => setNv((e.target as HTMLInputElement).value)} class={inp} /></label>
            </div>
          </div>
        ))}
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-3">
        <label class="text-sm text-slate-600">Tail <select class={sel} value={tail} onChange={(e) => setTail((e.target as HTMLSelectElement).value as Tail)}><option value="two">Two-tailed (≠)</option><option value="right">Right (A &gt; B)</option><option value="left">Left (A &lt; B)</option></select></label>
        <label class="text-sm text-slate-600">α <input type="number" step="0.01" value={alpha} onInput={(e) => setAlpha((e.target as HTMLInputElement).value)} class={`${inp} inline-block w-20`} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-4">
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Rate A</p><p class="mt-1 text-xl font-extrabold text-slate-700">{pct(r.p1)}</p></div>
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Rate B</p><p class="mt-1 text-xl font-extrabold text-slate-700">{pct(r.p2)}</p></div>
            <div class="rounded-xl bg-white p-3 text-center ring-2 ring-brand-200"><p class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">z statistic</p><p class="mt-1 text-xl font-extrabold text-brand-800">{fmt(r.z, 3)}</p></div>
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">p-value</p><p class="mt-1 text-xl font-extrabold text-slate-700">{r.p < 0.0001 ? r.p.toExponential(2) : fmt(r.p, 4)}</p></div>
          </div>
          <div class={`mt-3 rounded-xl p-4 ring-2 ${sig ? 'bg-emerald-50 ring-emerald-200' : 'bg-slate-100 ring-slate-200'}`}>
            <p class={`text-sm font-semibold ${sig ? 'text-emerald-800' : 'text-slate-700'}`}>{sig ? `Significant difference at α = ${a}` : `No significant difference at α = ${a}`}</p>
            <p class={`mt-1 text-sm ${sig ? 'text-emerald-700' : 'text-slate-600'}`}>{sig
              ? `The ${fmt(Math.abs(r.diff) * 100, 2)} percentage-point difference is statistically significant (p = ${fmt(r.p, 4)} < ${a}), variant ${r.diff > 0 ? 'A' : 'B'} converts higher.`
              : `The ${fmt(Math.abs(r.diff) * 100, 2)} percentage-point difference could plausibly be chance (p = ${fmt(r.p, 4)} ≥ ${a}), collect more data before calling a winner.`}</p>
          </div>
        </>
      ) : <p class="mt-4 text-sm text-slate-500">Enter conversions and totals for each variant.</p>}

      <p class="mt-4 text-xs text-slate-500">The two-proportion z-test compares two conversion rates (the standard A/B-test significance test), using a pooled proportion for the standard error. It assumes independent visitors and enough conversions per group (a common rule: at least ~5-10 in each cell). Statistical significance isn't the same as a meaningful business effect. 🔒 Computed in your browser.</p>
    </div>
  );
}
