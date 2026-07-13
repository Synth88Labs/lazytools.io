import { useMemo, useState } from 'preact/hooks';
import { seriesCapacitance, parallelCapacitance, fmtCapacitance } from '../../lib/electronics';

const parse = (s: string): number[] =>
  s.split(/[\s,;\n]+/).map((t) => parseFloat(t)).filter((n) => isFinite(n) && n > 0);

export default function SeriesParallelCapacitanceTool() {
  const [raw, setRaw] = useState('1, 2, 3');

  const r = useMemo(() => {
    const uf = parse(raw);
    if (uf.length < 2) return null;
    const pf = uf.map((v) => v * 1e6); // µF → pF for the shared formatter
    return { uf, series: seriesCapacitance(pf), parallel: parallelCapacitance(pf) };
  }, [raw]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Capacitor values in microfarads µF (comma, space or newline separated)</span>
        <textarea rows={2} value={raw} onInput={(e) => setRaw((e.target as HTMLTextAreaElement).value)} class={inp} />
      </label>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">In parallel (side by side)</p>
              <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmtCapacitance(r.parallel)}</p>
              <p class="mt-1 text-xs text-slate-400">C₁ + C₂ + … (adds up)</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">In series (end to end)</p>
              <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmtCapacitance(r.series)}</p>
              <p class="mt-1 text-xs text-slate-400">always less than the smallest</p>
            </div>
          </div>
          <p class="mt-3 text-center text-xs text-slate-500">{r.uf.length} capacitors: {r.uf.map((v) => `${v} µF`).join(', ')}</p>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter two or more positive capacitance values in µF.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Capacitors are the opposite of resistors: in <strong>parallel</strong> they add (C = C₁ + C₂ + …), while in <strong>series</strong> the reciprocals add (1/C = 1/C₁ + 1/C₂ + …), giving a total smaller than the smallest capacitor. Two equal capacitors in series give half the value. 🔒 In your browser.</p>
    </div>
  );
}
