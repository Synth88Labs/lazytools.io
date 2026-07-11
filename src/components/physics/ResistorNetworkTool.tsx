import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(6)).toString();

export default function ResistorNetworkTool({ kind = 'resistor' as 'resistor' | 'capacitor' }: { kind?: 'resistor' | 'capacitor' }) {
  const [mode, setMode] = useState<'series' | 'parallel'>('series');
  const [rows, setRows] = useState<string[]>(['100', '220', '330']);

  const unit = kind === 'resistor' ? 'Ω' : 'µF';
  const sym = kind === 'resistor' ? 'R' : 'C';

  const total = useMemo(() => {
    const vals = rows.map(num).filter((x): x is number => x != null && x > 0);
    if (vals.length === 0) return null;
    // resistors: series = sum, parallel = 1/Σ(1/R). capacitors are the opposite.
    const seriesRule = (vs: number[]) => vs.reduce((a, b) => a + b, 0);
    const parallelRule = (vs: number[]) => 1 / vs.reduce((a, b) => a + 1 / b, 0);
    const useSum = (kind === 'resistor') === (mode === 'series');
    return { value: useSum ? seriesRule(vals) : parallelRule(vals), count: vals.length, useSum };
  }, [rows, mode, kind]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['series', 'parallel'] as const).map((m) => (
          <button onClick={() => setMode(m)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${mode === m ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{m === 'series' ? 'Series' : 'Parallel'}</button>
        ))}
      </div>

      <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{kind === 'resistor' ? 'Resistances' : 'Capacitances'} ({unit})</p>
      <div class="space-y-2">
        {rows.map((v, i) => (
          <div class="flex items-center gap-2">
            <span class="w-10 shrink-0 font-mono text-sm text-slate-500">{sym}{i + 1}</span>
            <input type="number" step="any" value={v} onInput={(e) => setRows(rows.map((x, j) => (j === i ? (e.target as HTMLInputElement).value : x)))}
              class="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
            <button onClick={() => setRows(rows.filter((_, j) => j !== i))} class="shrink-0 rounded-lg px-2.5 py-2 text-sm text-slate-400 ring-1 ring-slate-200 hover:text-red-600 hover:ring-red-300" aria-label="Remove">✕</button>
          </div>
        ))}
      </div>
      <button onClick={() => setRows([...rows, ''])} class="mt-2 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50">+ Add {kind === 'resistor' ? 'resistor' : 'capacitor'}</button>

      {total ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total {kind === 'resistor' ? 'resistance' : 'capacitance'} ({mode})</p>
          <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(total.value)} <span class="text-lg text-slate-500">{unit}</span></p>
          <p class="mt-1 font-mono text-xs text-slate-400">{total.useSum ? `${sym}total = ${sym}1 + ${sym}2 + …` : `1/${sym}total = 1/${sym}1 + 1/${sym}2 + …`}</p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter at least one positive value.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        {kind === 'resistor'
          ? 'Series resistances add; parallel combine as 1/R_total = Σ(1/Rᵢ).'
          : 'Capacitors are the opposite of resistors: parallel add; series combine as 1/C_total = Σ(1/Cᵢ).'}
        {' '}🔒 Computed in your browser.
      </p>
    </div>
  );
}
