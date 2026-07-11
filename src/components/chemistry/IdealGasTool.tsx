import { useMemo, useState } from 'preact/hooks';

const R = 0.082057; // L·atm·K⁻¹·mol⁻¹
type Solve = 'P' | 'V' | 'n' | 'T';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(6)).toString();

export default function IdealGasTool() {
  const [solve, setSolve] = useState<Solve>('n');
  const [P, setP] = useState('1');
  const [V, setV] = useState('22.4');
  const [n, setN] = useState('');
  const [T, setT] = useState('273.15');
  const p = num(P), v = num(V), nn = num(n), t = num(T);

  const result = useMemo(() => {
    if (solve === 'P' && v && nn != null && t != null && v > 0) return { label: 'Pressure', value: (nn * R * t) / v, unit: 'atm' };
    if (solve === 'V' && p && nn != null && t != null && p > 0) return { label: 'Volume', value: (nn * R * t) / p, unit: 'L' };
    if (solve === 'n' && p != null && v != null && t && t > 0) return { label: 'Amount', value: (p * v) / (R * t), unit: 'mol' };
    if (solve === 'T' && p != null && v != null && nn && nn > 0) return { label: 'Temperature', value: (p * v) / (nn * R), unit: 'K' };
    return null;
  }, [solve, p, v, nn, t]);

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
        {([['P', 'Pressure'], ['V', 'Volume'], ['n', 'Moles'], ['T', 'Temperature']] as [Solve, string][]).map(([k, l]) => (
          <button onClick={() => setSolve(k)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${solve === k ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>Solve {l}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        {field('P', 'Pressure (P)', P, setP, 'atm')}
        {field('V', 'Volume (V)', V, setV, 'L')}
        {field('n', 'Amount (n)', n, setN, 'mol')}
        {field('T', 'Temperature (T)', T, setT, 'K')}
      </div>

      {result ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{result.label}</p>
          <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(result.value)} <span class="text-lg font-bold text-slate-500">{result.unit}</span></p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Fill in the other three values. Temperature must be in kelvin (°C + 273.15).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">PV = nRT with R = 0.082057 L·atm·K⁻¹·mol⁻¹ — use atm, L, mol, K. 🔒 Computed in your browser.</p>
    </div>
  );
}
