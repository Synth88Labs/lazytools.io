import { useState, useMemo } from 'preact/hooks';
import { pressureSolve } from '../../lib/physics-extra';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const n = (s: string) => { const v = parseFloat(s); return isFinite(v) ? v : null; };
const fmt = (x: number) => Number(x.toPrecision(6)).toLocaleString('en-US', { maximumSignificantDigits: 6 });

export default function PressureTool() {
  const [F, setF] = useState('100');
  const [A, setA] = useState('0.5');
  const [P, setP] = useState('');

  const res = useMemo(() => pressureSolve(n(F), n(A), n(P)), [F, A, P]);
  const label = { P: 'Pressure', F: 'Force', A: 'Area' };

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <p class="mb-3 text-xs text-slate-500">Fill any two of the three; leave the one you want blank. P = F ÷ A.</p>
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Force (N)</span><input type="number" step="any" value={F} onInput={(e) => setF((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Area (m²)</span><input type="number" step="any" value={A} onInput={(e) => setA((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Pressure (Pa)</span><input type="number" step="any" value={P} onInput={(e) => setP((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label[res.solved]}</p>
          <p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(res.value)} {res.unit}</p>
          {res.solved === 'P' && <p class="mt-1 text-xs text-slate-500">= {fmt(res.value / 1000)} kPa · {fmt(res.value / 6894.757)} psi · {fmt(res.value / 1e5)} bar</p>}
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter two values to solve the third.</p>}

      <p class="mt-4 text-xs text-slate-500">Pressure is force spread over area: P = F ÷ A, measured in pascals (1 Pa = 1 N/m²). The same force over a smaller area gives higher pressure — why a sharp knife or a stiletto heel presses so hard. 🔒 In your browser.</p>
    </div>
  );
}
