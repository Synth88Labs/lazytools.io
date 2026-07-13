import { useMemo, useState } from 'preact/hooks';
import { seriesResistance, parallelResistance, fmtOhms } from '../../lib/electronics';

const parse = (s: string): number[] =>
  s.split(/[\s,;\n]+/).map((t) => parseFloat(t)).filter((n) => isFinite(n) && n > 0);

export default function SeriesParallelResistanceTool() {
  const [raw, setRaw] = useState('100, 220, 330');

  const r = useMemo(() => {
    const vals = parse(raw);
    if (vals.length < 2) return null;
    return { vals, series: seriesResistance(vals), parallel: parallelResistance(vals) };
  }, [raw]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Resistor values in ohms (comma, space or newline separated)</span>
        <textarea rows={2} value={raw} onInput={(e) => setRaw((e.target as HTMLTextAreaElement).value)} class={inp} />
      </label>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">In series (end to end)</p>
              <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmtOhms(r.series)}</p>
              <p class="mt-1 text-xs text-slate-400">R₁ + R₂ + … (adds up)</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">In parallel (side by side)</p>
              <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmtOhms(r.parallel)}</p>
              <p class="mt-1 text-xs text-slate-400">always less than the smallest</p>
            </div>
          </div>
          <p class="mt-3 text-center text-xs text-slate-500">{r.vals.length} resistors: {r.vals.map((v) => fmtOhms(v)).join(', ')}</p>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter two or more positive resistance values.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Resistors in series add up (R = R₁ + R₂ + …). In parallel the reciprocals add: 1/R = 1/R₁ + 1/R₂ + …, so the total is always smaller than the lowest single resistor. Two equal resistors in parallel give exactly half their value. 🔒 In your browser.</p>
    </div>
  );
}
