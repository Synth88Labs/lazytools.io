import { useMemo, useState } from 'preact/hooks';
import { futureValue } from '../../lib/finance';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const money = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 0 });

const FREQ: { label: string; n: number }[] = [
  { label: 'Annually', n: 1 }, { label: 'Quarterly', n: 4 }, { label: 'Monthly', n: 12 }, { label: 'Daily', n: 365 },
];

export default function CompoundInterestTool() {
  const [P, setP] = useState('10000');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('20');
  const [freq, setFreq] = useState('12');
  const [contrib, setContrib] = useState('200');

  const r = useMemo(() => {
    const p = num(P) ?? 0, rt = num(rate), y = num(years), c = num(contrib) ?? 0;
    if (rt == null || y == null || y <= 0) return null;
    const res = futureValue(p, rt / 100, y, parseInt(freq, 10), c, 12);
    // yearly series for the chart
    const series: number[] = [];
    for (let yy = 0; yy <= y; yy++) series.push(futureValue(p, rt / 100, yy, parseInt(freq, 10), c, 12).fv);
    return { ...res, series, principal: p };
  }, [P, rate, years, freq, contrib]);

  const svg = useMemo(() => {
    if (!r || r.series.length < 2) return null;
    const W = 560, H = 180, pad = 8;
    const max = Math.max(...r.series, 1);
    const px = (i: number) => pad + (i / (r.series.length - 1)) * (W - 2 * pad);
    const py = (v: number) => H - pad - (v / max) * (H - 2 * pad);
    const line = r.series.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
    const area = `M${px(0)},${H - pad} ` + r.series.map((v, i) => `L${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ') + ` L${px(r.series.length - 1)},${H - pad} Z`;
    return { W, H, line, area };
  }, [r]);

  const inp = (val: string, set: (v: string) => void, label: string, prefix?: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <div class="flex items-center rounded-xl border border-slate-300 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200">
        {prefix && <span class="pl-3 text-sm text-slate-400">{prefix}</span>}
        <input type="number" step="any" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl bg-transparent px-3 py-2 font-mono text-sm text-slate-900 focus:outline-none" />
      </div>
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {inp(P, setP, 'Initial amount', '$')}
        {inp(rate, setRate, 'Annual return (%)')}
        {inp(years, setYears, 'Years')}
        {inp(contrib, setContrib, 'Monthly contribution', '$')}
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Compounding</span>
          <select value={freq} onChange={(e) => setFreq((e.target as HTMLSelectElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200">
            {FREQ.map((f) => <option value={f.n}>{f.label}</option>)}
          </select>
        </label>
      </div>

      {r ? (
        <>
          <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Future value</p>
            <p class="mt-1 text-4xl font-extrabold text-brand-800">${money(r.fv)}</p>
          </div>
          {svg && (
            <div class="mt-3 overflow-hidden rounded-xl bg-white p-2 ring-1 ring-slate-200">
              <svg viewBox={`0 0 ${svg.W} ${svg.H}`} class="w-full" role="img" aria-label="Growth over time">
                <path d={svg.area} fill="#c7d2fe" fill-opacity="0.5" />
                <path d={svg.line} fill="none" stroke="#4338ca" stroke-width="2.5" />
              </svg>
            </div>
          )}
          <div class="mt-3 grid gap-3 sm:grid-cols-3">
            <div class="rounded-lg bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs text-slate-500">You contributed</p><p class="mt-0.5 font-mono text-lg font-bold text-slate-800">${money(r.totalContributed)}</p></div>
            <div class="rounded-lg bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs text-slate-500">Interest earned</p><p class="mt-0.5 font-mono text-lg font-bold text-emerald-700">${money(r.totalInterest)}</p></div>
            <div class="rounded-lg bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs text-slate-500">Interest share</p><p class="mt-0.5 font-mono text-lg font-bold text-slate-800">{r.fv > 0 ? Math.round((r.totalInterest / r.fv) * 100) : 0}%</p></div>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter an amount, rate and number of years.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">FV = P(1+i)ⁿ + contributions × [((1+i)ⁿ−1)/i]. Educational estimate — not investment advice; real returns vary. 🔒 In your browser.</p>
    </div>
  );
}
