import { useMemo, useState } from 'preact/hooks';
import { ohmsLaw } from '../../lib/electronics';

const num = (s: string): number | null => { const n = parseFloat(s); return s.trim() !== '' && isFinite(n) ? n : null; };
const fmt = (x: number): string => {
  if (!isFinite(x)) return '∞';
  const a = Math.abs(x);
  if (a !== 0 && (a < 1e-3 || a >= 1e6)) return x.toExponential(3);
  return Number(x.toPrecision(5)).toString();
};

export default function OhmsLawTool() {
  const [v, setV] = useState('12');
  const [i, setI] = useState('');
  const [r, setR] = useState('6');
  const [p, setP] = useState('');

  const res = useMemo(() => ohmsLaw(num(v), num(i), num(r), num(p)), [v, i, r, p]);
  const knownCount = [v, i, r, p].filter((s) => num(s) != null).length;

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const field = (label: string, unit: string, val: string, set: (s: string) => void) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label} ({unit})</span>
      <input type="number" step="any" value={val} placeholder="—" onInput={(e) => set((e.target as HTMLInputElement).value)} class={inp} />
    </label>
  );
  const cell = (label: string, unit: string, val: number) => (
    <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p class="mt-1 text-2xl font-extrabold text-brand-800">{fmt(val)} <span class="text-base font-semibold text-slate-500">{unit}</span></p>
    </div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <p class="mb-3 text-sm text-slate-600">Enter <strong>any two</strong> values — leave the other two blank.</p>
      <div class="grid gap-3 sm:grid-cols-4">
        {field('Voltage V', 'volts', v, setV)}
        {field('Current I', 'amps', i, setI)}
        {field('Resistance R', 'ohms', r, setR)}
        {field('Power P', 'watts', p, setP)}
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-4">
          {cell('Voltage', 'V', res.v)}
          {cell('Current', 'A', res.i)}
          {cell('Resistance', 'Ω', res.r)}
          {cell('Power', 'W', res.p)}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">{knownCount < 2 ? 'Enter exactly two values.' : knownCount > 2 ? 'Enter only two values — clear the others.' : 'That pair is unsolvable (check for zero or negative values).'}</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Ohm's law ties voltage, current and resistance together (V = I × R), and power adds a fourth (P = V × I = I²R = V²/R). Give any two and the other two are fixed. Use consistent units — volts, amps, ohms and watts. 🔒 In your browser.</p>
    </div>
  );
}
