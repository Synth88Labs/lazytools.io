import { useMemo, useState } from 'preact/hooks';
import { normalInv, tInv } from '../../lib/stats';

type Kind = 'mean-t' | 'mean-z' | 'proportion';

const fmt = (x: number) => (isFinite(x) ? Number(x.toPrecision(6)).toString() : '—');

export default function ConfidenceIntervalTool() {
  const [kind, setKind] = useState<Kind>('mean-t');
  const [level, setLevel] = useState('95');
  const [mean, setMean] = useState('100');
  const [sd, setSd] = useState('15');
  const [nStr, setN] = useState('30');
  const [succ, setSucc] = useState('540');

  const conf = parseFloat(level) / 100;
  const n = parseFloat(nStr);
  const x = parseFloat(mean);
  const s = parseFloat(sd);
  const successes = parseFloat(succ);
  const alpha = 1 - conf;

  const r = useMemo(() => {
    if (!(conf > 0 && conf < 1) || !(n >= 2)) return null;
    if (kind === 'proportion') {
      if (!(successes >= 0 && successes <= n)) return null;
      const phat = successes / n;
      const z = normalInv(1 - alpha / 2);
      const se = Math.sqrt((phat * (1 - phat)) / n);
      const moe = z * se;
      return { est: phat, crit: z, critLabel: 'z', se, moe, lo: Math.max(0, phat - moe), hi: Math.min(1, phat + moe), isProp: true };
    }
    if (!isFinite(x) || !(s >= 0)) return null;
    const se = s / Math.sqrt(n);
    if (kind === 'mean-z') {
      const z = normalInv(1 - alpha / 2);
      const moe = z * se;
      return { est: x, crit: z, critLabel: 'z', se, moe, lo: x - moe, hi: x + moe, isProp: false };
    }
    const df = n - 1;
    const t = tInv(1 - alpha / 2, df);
    const moe = t * se;
    return { est: x, crit: t, critLabel: `t (df=${df})`, se, moe, lo: x - moe, hi: x + moe, isProp: false };
  }, [kind, conf, n, x, s, successes, alpha]);

  const tab = (id: Kind, label: string) => (
    <button onClick={() => setKind(id)}
      class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${kind === id ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}
    >{label}</button>
  );

  const inp = (val: string, set: (v: string) => void, label: string, step = 'any') => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input type="number" step={step} value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap gap-2">
        {tab('mean-t', 'Mean (t, σ unknown)')}
        {tab('mean-z', 'Mean (z, σ known)')}
        {tab('proportion', 'Proportion')}
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        {inp(level, setLevel, 'Confidence level (%)')}
        {inp(nStr, setN, 'Sample size (n)')}
        {kind === 'proportion' ? (
          inp(succ, setSucc, 'Successes (x)')
        ) : (
          <>
            {inp(mean, setMean, 'Sample mean (x̄)')}
            {inp(sd, setSd, kind === 'mean-z' ? 'Population SD (σ)' : 'Sample SD (s)')}
          </>
        )}
      </div>

      {r ? (
        <>
          <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{level}% confidence interval</p>
            <p class="mt-1 text-2xl font-extrabold text-brand-800 sm:text-3xl">
              {r.isProp ? `${fmt(r.lo)} to ${fmt(r.hi)}` : `${fmt(r.lo)} to ${fmt(r.hi)}`}
            </p>
            <p class="mt-1 text-sm text-slate-500">{fmt(r.est)} ± {fmt(r.moe)}{r.isProp ? ` (${fmt(r.lo * 100)}% – ${fmt(r.hi * 100)}%)` : ''}</p>
          </div>
          <div class="mt-3 grid gap-3 sm:grid-cols-3 text-center">
            <div class="rounded-lg bg-white p-3 ring-1 ring-slate-200"><p class="font-mono text-lg font-bold text-slate-800">{fmt(r.crit)}</p><p class="text-xs text-slate-500">Critical {r.critLabel}</p></div>
            <div class="rounded-lg bg-white p-3 ring-1 ring-slate-200"><p class="font-mono text-lg font-bold text-slate-800">{fmt(r.se)}</p><p class="text-xs text-slate-500">Standard error</p></div>
            <div class="rounded-lg bg-white p-3 ring-1 ring-slate-200"><p class="font-mono text-lg font-bold text-slate-800">{fmt(r.moe)}</p><p class="text-xs text-slate-500">Margin of error</p></div>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a confidence level between 0 and 100, a sample size of at least 2, and the required statistics.</p>
      )}

      <p class="mt-3 text-xs text-slate-500">
        Critical values are exact — the t critical uses the inverse regularized incomplete beta function, not a rounded table. 🔒 Computed in your browser.
      </p>
    </div>
  );
}
