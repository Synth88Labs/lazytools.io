import { useMemo, useState } from 'preact/hooks';
import { voltageDrop } from '../../lib/solar';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };

// Common AWG cross-section areas (mm²) for the selector.
const WIRE_GAUGES: { label: string; mm2: number }[] = [
  { label: '14 AWG (2.08 mm²)', mm2: 2.08 },
  { label: '12 AWG (3.31 mm²)', mm2: 3.31 },
  { label: '10 AWG (5.26 mm²)', mm2: 5.26 },
  { label: '8 AWG (8.37 mm²)', mm2: 8.37 },
  { label: '6 AWG (13.3 mm²)', mm2: 13.3 },
  { label: '4 AWG (21.2 mm²)', mm2: 21.2 },
  { label: '2 AWG (33.6 mm²)', mm2: 33.6 },
  { label: '1/0 AWG (53.5 mm²)', mm2: 53.5 },
  { label: '2/0 AWG (67.4 mm²)', mm2: 67.4 },
];

export default function VoltageDropTool() {
  const [length, setLength] = useState('5');
  const [current, setCurrent] = useState('20');
  const [gauge, setGauge] = useState('5.26');
  const [voltage, setVoltage] = useState('12');

  const r = useMemo(() => {
    const l = num(length), c = num(current), a = num(gauge), v = num(voltage);
    if (l == null || c == null || a == null || v == null) return null;
    return voltageDrop(l, c, a, v);
  }, [length, current, gauge, voltage]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  const status = r ? (r.percent <= 2 ? { c: 'emerald', t: 'Excellent — under the 2% solar best-practice target.' } : r.percent <= 3 ? { c: 'amber', t: 'Acceptable — within NEC 3%, but solar best practice is ≤2%.' } : { c: 'rose', t: 'Too high — over 3%. Use thicker wire, a shorter run, or a higher system voltage.' }) : null;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">One-way length (m)</span>
          <input type="number" step="any" value={length} onInput={(e) => setLength((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Current (A)</span>
          <input type="number" step="any" value={current} onInput={(e) => setCurrent((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Wire gauge</span>
          <select class={sel} value={gauge} onChange={(e) => setGauge((e.target as HTMLSelectElement).value)}>
            {WIRE_GAUGES.map((w) => <option value={String(w.mm2)}>{w.label}</option>)}
          </select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">System voltage (V)</span>
          <select class={sel} value={voltage} onChange={(e) => setVoltage((e.target as HTMLSelectElement).value)}>
            <option value="12">12 V</option><option value="24">24 V</option><option value="48">48 V</option>
          </select></label>
      </div>

      {r && status ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class={`rounded-xl p-4 text-center ring-2 ${status.c === 'emerald' ? 'bg-emerald-50 ring-emerald-200' : status.c === 'amber' ? 'bg-amber-50 ring-amber-200' : 'bg-rose-50 ring-rose-200'}`}><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Voltage drop</p><p class={`mt-1 text-3xl font-extrabold ${status.c === 'emerald' ? 'text-emerald-700' : status.c === 'amber' ? 'text-amber-700' : 'text-rose-700'}`}>{r.percent.toFixed(1)}%</p><p class="mt-0.5 text-sm text-slate-500">{r.drop.toFixed(2)} V</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Voltage at the load</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.endVoltage.toFixed(2)} V</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Power lost in wire</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{(r.drop * num(current)!).toFixed(1)} W</p></div>
          </div>
          <p class={`mt-2 text-sm font-medium ${status.c === 'emerald' ? 'text-emerald-700' : status.c === 'amber' ? 'text-amber-700' : 'text-rose-700'}`}>{status.t}</p>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the one-way run length, the current, the wire gauge and the system voltage.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Drop = 2 × length × current × copper resistivity ÷ wire area (the 2 is the round trip out and back). Low-voltage DC is very sensitive to drop, which is why thick wire and short runs matter — and why higher system voltages (24/48 V) cut the current and the loss. NEC allows up to 3%; solar best practice targets ≤2% on the main run to preserve harvest. Assumes copper at ~room temperature. 🔒 In your browser.</p>
    </div>
  );
}
