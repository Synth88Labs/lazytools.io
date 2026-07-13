import { useMemo, useState } from 'preact/hooks';
import { describe, parseNumbers } from '../../lib/stats-descriptive';

const fmt = (x: number, d = 4) => {
  if (!Number.isFinite(x)) return '—';
  return Number(x.toPrecision(d)).toLocaleString(undefined, { maximumFractionDigits: 6 });
};

export default function DescriptiveStatsTool() {
  const [raw, setRaw] = useState('2, 4, 4, 4, 5, 5, 7, 9');

  const d = useMemo(() => describe(parseNumbers(raw)), [raw]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const cell = (label: string, val: string) => (
    <div class="rounded-lg bg-white p-3 ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p class="mt-0.5 font-mono text-lg font-bold text-slate-800">{val}</p></div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Data set (comma, space or newline separated)</span>
        <textarea rows={3} value={raw} onInput={(e) => setRaw((e.target as HTMLTextAreaElement).value)} class={inp} /></label>

      {d ? (
        <>
          <div class="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {cell('Count (n)', String(d.count))}
            {cell('Sum', fmt(d.sum))}
            {cell('Mean', fmt(d.mean))}
            {cell('Median', fmt(d.median))}
            {cell('Mode', d.mode.length ? d.mode.map((m) => fmt(m)).join(', ') : 'none')}
            {cell('Min', fmt(d.min))}
            {cell('Max', fmt(d.max))}
            {cell('Range', fmt(d.range))}
            {cell('Q1 (25%)', fmt(d.q1))}
            {cell('Q3 (75%)', fmt(d.q3))}
            {cell('IQR', fmt(d.iqr))}
            {cell('Std dev (sample)', fmt(d.stdDevSample))}
            {cell('Std dev (pop.)', fmt(d.stdDevPop))}
            {cell('Variance (sample)', fmt(d.varianceSample))}
            {cell('Variance (pop.)', fmt(d.variancePop))}
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter some numbers to summarise.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Sample statistics (dividing by n − 1) estimate a population from a sample and are the usual default; population statistics (dividing by n) apply when your data is the whole population. Quartiles use linear interpolation (the inclusive method, matching Excel\'s QUARTILE.INC). Mode shows every most-frequent value, or "none" when all values are unique. 🔒 In your browser.</p>
    </div>
  );
}
