import { useMemo, useState } from 'preact/hooks';
import { voltageDivider, fmtOhms } from '../../lib/electronics';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 3) => Number(x.toFixed(d)).toString();

export default function VoltageDividerTool() {
  const [vin, setVin] = useState('12');
  const [r1, setR1] = useState('1000');
  const [r2, setR2] = useState('2000');

  const r = useMemo(() => {
    const v = num(vin), a = num(r1), b = num(r2);
    if (v == null || a == null || b == null || a + b === 0) return null;
    const vout = voltageDivider(v, a, b);
    const current = v / (a + b); // A if R in ohms
    return { vout, currentMa: current * 1000, powerMw: current * v * 1000, ratio: b / (a + b) };
  }, [vin, r1, r2]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Input voltage Vin (V)</span>
          <input type="number" step="any" value={vin} onInput={(e) => setVin((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">R1 — top (Ω)</span>
          <input type="number" step="any" value={r1} onInput={(e) => setR1((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">R2 — bottom (Ω)</span>
          <input type="number" step="any" value={r2} onInput={(e) => setR2((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Output voltage Vout</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.vout)} V</p><p class="mt-1 text-xs text-slate-400">{fmt(r.ratio * 100, 1)}% of Vin</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Current through divider</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.currentMa, 2)} mA</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Power dissipated</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.powerMw, 1)} mW</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter Vin, R1 and R2.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Vout = Vin × R2 ÷ (R1 + R2), measured across R2. This holds only when the load draws negligible current — for a real load, its resistance sits in parallel with R2 and lowers Vout, so use a buffer or a proper regulator for anything that draws power. 🔒 In your browser.</p>
    </div>
  );
}
