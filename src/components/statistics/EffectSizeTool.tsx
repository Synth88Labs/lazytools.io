import { useMemo, useState } from 'preact/hooks';
import { cohensD } from '../../lib/stats-tests';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const int = (s: string) => { const n = parseInt(s, 10); return isFinite(n) ? n : null; };
const fmt = (n: number, d = 4) => n.toLocaleString('en-US', { maximumFractionDigits: d });

const TONE: Record<string, string> = { negligible: 'bg-slate-100 ring-slate-200 text-slate-700', small: 'bg-sky-50 ring-sky-200 text-sky-800', medium: 'bg-amber-50 ring-amber-200 text-amber-800', large: 'bg-emerald-50 ring-emerald-200 text-emerald-800' };

export default function EffectSizeTool() {
  const [m1, setM1] = useState('100'); const [sd1, setSd1] = useState('15'); const [n1, setN1] = useState('30');
  const [m2, setM2] = useState('90'); const [sd2, setSd2] = useState('15'); const [n2, setN2] = useState('30');

  const r = useMemo(() => {
    const a = num(m1), b = num(sd1), c = int(n1), d = num(m2), e = num(sd2), f = int(n2);
    if ([a, b, c, d, e, f].some((v) => v == null)) return null;
    return cohensD(a!, b!, c!, d!, e!, f!);
  }, [m1, sd1, n1, m2, sd2, n2]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        {[['Group 1', m1, setM1, sd1, setSd1, n1, setN1], ['Group 2', m2, setM2, sd2, setSd2, n2, setN2]].map(([title, mv, setMv, sv, setSv, nv, setNv]: any) => (
          <div class="rounded-xl bg-white p-3 ring-1 ring-slate-200">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
            <div class="grid grid-cols-3 gap-2">
              <label class="block"><span class="mb-1 block text-[11px] text-slate-400">Mean</span><input type="number" step="any" value={mv} onInput={(e) => setMv((e.target as HTMLInputElement).value)} class={inp} /></label>
              <label class="block"><span class="mb-1 block text-[11px] text-slate-400">SD</span><input type="number" step="any" value={sv} onInput={(e) => setSv((e.target as HTMLInputElement).value)} class={inp} /></label>
              <label class="block"><span class="mb-1 block text-[11px] text-slate-400">n</span><input type="number" step="1" value={nv} onInput={(e) => setNv((e.target as HTMLInputElement).value)} class={inp} /></label>
            </div>
          </div>
        ))}
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cohen's d</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.d, 3)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Pooled SD</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.pooledSd, 4)}</p></div>
          </div>
          <div class={`mt-3 rounded-xl p-4 ring-2 ${TONE[r.magnitude]}`}>
            <p class="text-sm font-semibold capitalize">{r.magnitude} effect size</p>
            <p class="mt-1 text-sm">By Cohen's conventional benchmarks (|d| ≈ 0.2 small, 0.5 medium, 0.8 large), a d of {fmt(r.d, 2)} is a <strong>{r.magnitude}</strong> effect, the group means differ by about {fmt(Math.abs(r.d), 2)} pooled standard deviations.</p>
          </div>
        </>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the mean, SD and size for each group.</p>}

      <p class="mt-4 text-xs text-slate-500">Cohen's d expresses the difference between two group means in units of their pooled standard deviation, giving the <em>magnitude</em> of an effect independent of sample size, a useful complement to a p-value, which only tells you whether an effect is detectable. The small/medium/large labels are rules of thumb, not hard cut-offs; interpret them in your field's context. 🔒 Computed in your browser.</p>
    </div>
  );
}
