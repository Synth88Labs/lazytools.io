import { useMemo, useState } from 'preact/hooks';
import { binomPmf, binomCdf } from '../../lib/stats';

/** Exact binomial coefficient C(n,k) with BigInt. */
function binomBig(n: number, k: number): bigint {
  if (k < 0 || k > n) return 0n;
  k = Math.min(k, n - k);
  let num = 1n, den = 1n;
  for (let i = 0; i < k; i++) {
    num *= BigInt(n - i);
    den *= BigInt(i + 1);
  }
  return num / den;
}

const fmtP = (p: number) => {
  if (!isFinite(p) || p < 0) return '—';
  if (p === 0) return '0';
  if (p < 1e-6) return p.toExponential(4);
  return p.toFixed(8).replace(/0+$/, '').replace(/\.$/, '');
};
const pct = (p: number) => (isFinite(p) ? (p * 100).toFixed(4).replace(/0+$/, '').replace(/\.$/, '') + '%' : '—');

export default function BinomialTool() {
  const [nStr, setN] = useState('20');
  const [kStr, setK] = useState('12');
  const [pStr, setP] = useState('0.5');

  const n = parseInt(nStr, 10);
  const k = parseInt(kStr, 10);
  const p = parseFloat(pStr);
  const valid = Number.isInteger(n) && n >= 0 && n <= 100000 && Number.isInteger(k) && k >= 0 && k <= n && isFinite(p) && p >= 0 && p <= 1;

  const r = useMemo(() => {
    if (!valid) return null;
    const exact = binomPmf(k, n, p);
    const atMost = binomCdf(k, n, p);
    const less = k > 0 ? binomCdf(k - 1, n, p) : 0;
    const atLeast = 1 - less;
    const more = 1 - atMost;
    const coef = n <= 1000 ? binomBig(n, k) : null;
    return { exact, atMost, atLeast, more, less, coef, mean: n * p, sd: Math.sqrt(n * p * (1 - p)) };
  }, [n, k, p, valid]);

  const cell = (label: string, val: number, hero = false) => (
    <div class={`rounded-xl bg-white p-4 text-center ${hero ? 'ring-2 ring-brand-200' : 'ring-1 ring-slate-200'}`}>
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p class={`mt-1 font-extrabold text-brand-800 ${hero ? 'text-3xl' : 'text-xl'}`}>{fmtP(val)}</p>
      <p class="mt-0.5 text-xs text-slate-400">{pct(val)}</p>
    </div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Trials (n)</span>
          <input type="number" min="0" value={nStr} onInput={(e) => setN((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Successes (k)</span>
          <input type="number" min="0" value={kStr} onInput={(e) => setK((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Success prob. (p)</span>
          <input type="number" step="0.01" min="0" max="1" value={pStr} onInput={(e) => setP((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            {cell(`P(X = ${k})`, r.exact, true)}
            {cell(`P(X ≤ ${k})`, r.atMost)}
            {cell(`P(X ≥ ${k})`, r.atLeast)}
          </div>
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            {cell(`P(X < ${k})`, r.less)}
            {cell(`P(X > ${k})`, r.more)}
          </div>
          <div class="mt-3 grid gap-3 sm:grid-cols-3 text-center">
            <div class="rounded-lg bg-white p-3 ring-1 ring-slate-200">
              <p class="font-mono text-lg font-bold text-slate-800">{r.mean.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}</p>
              <p class="text-xs text-slate-500">Mean (np)</p>
            </div>
            <div class="rounded-lg bg-white p-3 ring-1 ring-slate-200">
              <p class="font-mono text-lg font-bold text-slate-800">{r.sd.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}</p>
              <p class="text-xs text-slate-500">Std. dev. √(np(1−p))</p>
            </div>
            <div class="rounded-lg bg-white p-3 ring-1 ring-slate-200">
              <p class="font-mono text-sm font-bold text-slate-800 break-all">{r.coef !== null ? r.coef.toString() : 'n > 1000'}</p>
              <p class="text-xs text-slate-500">C({n},{k}) exact</p>
            </div>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a whole number of trials n, a number of successes k between 0 and n, and a probability p between 0 and 1.</p>
      )}

      <p class="mt-3 text-xs text-slate-500">
        Binomial coefficients are computed with exact BigInt arithmetic — no floating-point overflow at large n. 🔒 Computed in your browser.
      </p>
    </div>
  );
}
