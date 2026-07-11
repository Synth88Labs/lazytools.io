import { useMemo, useState } from 'preact/hooks';
import { normalInv } from '../../lib/stats';

type Kind = 'proportion' | 'mean';

const fmt = (x: number) => (isFinite(x) ? Number(x.toPrecision(6)).toString() : '—');

export default function SampleSizeTool() {
  const [kind, setKind] = useState<Kind>('proportion');
  const [level, setLevel] = useState('95');
  const [moe, setMoe] = useState('5');
  const [phat, setPhat] = useState('50');
  const [sigma, setSigma] = useState('15');
  const [moeMean, setMoeMean] = useState('2');
  const [popStr, setPop] = useState('');

  const conf = parseFloat(level) / 100;
  const alpha = 1 - conf;
  const pop = parseFloat(popStr);

  const r = useMemo(() => {
    if (!(conf > 0 && conf < 1)) return null;
    const z = normalInv(1 - alpha / 2);
    let n0: number;
    if (kind === 'proportion') {
      const p = parseFloat(phat) / 100;
      const E = parseFloat(moe) / 100;
      if (!(p >= 0 && p <= 1) || !(E > 0)) return null;
      n0 = (z * z * p * (1 - p)) / (E * E);
    } else {
      const sd = parseFloat(sigma);
      const E = parseFloat(moeMean);
      if (!(sd > 0) || !(E > 0)) return null;
      n0 = Math.pow((z * sd) / E, 2);
    }
    let nFinite: number | null = null;
    if (isFinite(pop) && pop > 0) {
      nFinite = n0 / (1 + (n0 - 1) / pop);
    }
    return { z, n0: Math.ceil(n0), nFinite: nFinite !== null ? Math.ceil(nFinite) : null };
  }, [kind, conf, alpha, phat, moe, sigma, moeMean, pop]);

  const tab = (id: Kind, label: string) => (
    <button onClick={() => setKind(id)}
      class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${kind === id ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}
    >{label}</button>
  );
  const inp = (val: string, set: (v: string) => void, label: string, ph = '') => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input type="number" step="any" value={val} placeholder={ph} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap gap-2">
        {tab('proportion', 'Proportion (survey)')}
        {tab('mean', 'Mean')}
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        {inp(level, setLevel, 'Confidence level (%)')}
        {kind === 'proportion' ? (
          <>
            {inp(moe, setMoe, 'Margin of error (± %)')}
            {inp(phat, setPhat, 'Expected proportion (%)')}
          </>
        ) : (
          <>
            {inp(moeMean, setMoeMean, 'Margin of error (±)')}
            {inp(sigma, setSigma, 'Population SD (σ)')}
          </>
        )}
        {inp(popStr, setPop, 'Population size (optional)', 'e.g. 50000')}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Required sample size</p>
            <p class="mt-1 text-3xl font-extrabold text-brand-800">{r.nFinite ?? r.n0}</p>
            <p class="mt-1 text-sm text-slate-500">respondents</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{r.nFinite !== null ? 'Before population correction' : 'Critical value (z)'}</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{r.nFinite !== null ? r.n0 : fmt(r.z)}</p>
            <p class="mt-1 text-sm text-slate-500">{r.nFinite !== null ? `infinite population · z = ${fmt(r.z)}` : 'for this confidence level'}</p>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a confidence level and a positive margin of error{kind === 'mean' ? ' and standard deviation' : ''}.</p>
      )}

      <p class="mt-3 text-xs text-slate-500">
        {kind === 'proportion'
          ? 'n = z²·p(1−p) / E². Use 50% for the expected proportion if unknown — it gives the most conservative (largest) sample.'
          : 'n = (z·σ / E)². Provide the population standard deviation and desired margin in the same units as your measurement.'}
        {' '}🔒 Computed in your browser.
      </p>
    </div>
  );
}
