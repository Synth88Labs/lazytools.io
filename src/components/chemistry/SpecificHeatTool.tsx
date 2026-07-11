import { useMemo, useState } from 'preact/hooks';

type Solve = 'q' | 'm' | 'c' | 'dT';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(6)).toString();

export default function SpecificHeatTool() {
  const [solve, setSolve] = useState<Solve>('q');
  const [q, setQ] = useState('');
  const [m, setM] = useState('100');
  const [c, setC] = useState('4.184');
  const [dT, setDT] = useState('25');
  const Q = num(q), M = num(m), C = num(c), DT = num(dT);

  const result = useMemo(() => {
    if (solve === 'q' && M != null && C != null && DT != null) return { label: 'Heat energy', value: M * C * DT, unit: 'J' };
    if (solve === 'm' && Q != null && C && DT && C * DT !== 0) return { label: 'Mass', value: Q / (C * DT), unit: 'g' };
    if (solve === 'c' && Q != null && M && DT && M * DT !== 0) return { label: 'Specific heat', value: Q / (M * DT), unit: 'J/(g·°C)' };
    if (solve === 'dT' && Q != null && M && C && M * C !== 0) return { label: 'Temperature change', value: Q / (M * C), unit: '°C' };
    return null;
  }, [solve, Q, M, C, DT]);

  const field = (key: Solve, label: string, val: string, set: (v: string) => void, unit: string) => (
    solve === key ? null : (
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label} <span class="text-slate-400">({unit})</span></span>
        <input type="number" step="any" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
      </label>
    )
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        {([['q', 'Heat (q)'], ['m', 'Mass'], ['c', 'Specific heat'], ['dT', 'ΔT']] as [Solve, string][]).map(([k, l]) => (
          <button onClick={() => setSolve(k)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${solve === k ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>Solve {l}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        {field('q', 'Heat energy (q)', q, setQ, 'J')}
        {field('m', 'Mass (m)', m, setM, 'g')}
        {field('c', 'Specific heat (c)', c, setC, 'J/(g·°C)')}
        {field('dT', 'Temp change (ΔT)', dT, setDT, '°C')}
      </div>

      {result ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{result.label}</p>
          <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(result.value)} <span class="text-lg font-bold text-slate-500">{result.unit}</span></p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Fill in the other three values. Water’s specific heat is 4.184 J/(g·°C).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">q = mcΔT — with c in J/(g·°C), use grams and °C, giving q in joules. 🔒 Computed in your browser.</p>
    </div>
  );
}
