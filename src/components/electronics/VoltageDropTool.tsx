import { useMemo, useState } from 'preact/hooks';
import { voltageDrop } from '../../lib/electronics';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'w-full rounded-xl border border-slate-300 bg-white px-2 py-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

// AWG value n (1/0 = 0, 2/0 = -1, 3/0 = -2, 4/0 = -3)
const GAUGES: { n: number; label: string }[] = [
  { n: 14, label: '14 AWG' }, { n: 12, label: '12 AWG' }, { n: 10, label: '10 AWG' },
  { n: 8, label: '8 AWG' }, { n: 6, label: '6 AWG' }, { n: 4, label: '4 AWG' },
  { n: 2, label: '2 AWG' }, { n: 1, label: '1 AWG' }, { n: 0, label: '1/0 AWG' },
  { n: -1, label: '2/0 AWG' }, { n: -2, label: '3/0 AWG' }, { n: -3, label: '4/0 AWG' },
];

export default function VoltageDropTool() {
  const [gauge, setGauge] = useState('12');
  const [length, setLength] = useState('30');
  const [lenUnit, setLenUnit] = useState<'m' | 'ft'>('m');
  const [current, setCurrent] = useState('15');
  const [material, setMaterial] = useState<'cu' | 'al'>('cu');
  const [phase, setPhase] = useState<'1' | '3'>('1');
  const [volts, setVolts] = useState('120');

  const res = useMemo(() => {
    const L = num(length), I = num(current), V = num(volts);
    if (L == null || I == null || V == null) return null;
    const Lm = lenUnit === 'ft' ? L * 0.3048 : L;
    return voltageDrop(parseInt(gauge, 10), Lm, I, material, phase, V);
  }, [gauge, length, lenUnit, current, material, phase, volts]);

  const bad = res && res.pct > 3;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Wire gauge</span>
          <select value={gauge} onChange={(e) => setGauge((e.target as HTMLSelectElement).value)} class={sel}>{GAUGES.map((g) => <option value={String(g.n)}>{g.label}</option>)}</select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">One-way length</span>
          <div class="flex gap-1"><input type="number" step="any" value={length} onInput={(e) => setLength((e.target as HTMLInputElement).value)} class={inp} />
            <select value={lenUnit} onChange={(e) => setLenUnit((e.target as HTMLSelectElement).value as 'm' | 'ft')} class="rounded-xl border border-slate-300 bg-white px-2 text-sm"><option value="m">m</option><option value="ft">ft</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Current (A)</span>
          <input type="number" step="any" value={current} onInput={(e) => setCurrent((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Conductor</span>
          <select value={material} onChange={(e) => setMaterial((e.target as HTMLSelectElement).value as 'cu' | 'al')} class={sel}><option value="cu">Copper</option><option value="al">Aluminium</option></select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">System</span>
          <select value={phase} onChange={(e) => setPhase((e.target as HTMLSelectElement).value as '1' | '3')} class={sel}><option value="1">DC / single-phase</option><option value="3">Three-phase</option></select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">System voltage (V)</span>
          <input type="number" step="any" value={volts} onInput={(e) => setVolts((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res ? (
        <div class="mt-4 space-y-3">
          <div class="grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="font-mono text-2xl font-extrabold text-brand-800">{fmt(res.drop)} V</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Voltage drop</p></div>
            <div class={`rounded-xl bg-white p-4 text-center ring-1 ${bad ? 'ring-amber-300' : 'ring-slate-200'}`}><p class={`font-mono text-2xl font-extrabold ${bad ? 'text-amber-700' : 'text-slate-800'}`}>{fmt(res.pct, 2)}%</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Percent drop</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="font-mono text-2xl font-extrabold text-slate-800">{fmt(res.atLoad)} V</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Voltage at load</p></div>
          </div>
          <div class={`rounded-xl px-4 py-2.5 text-center text-sm font-bold ring-1 ${bad ? 'text-amber-800 bg-amber-50 ring-amber-200' : 'text-emerald-700 bg-emerald-50 ring-emerald-200'}`}>
            {bad ? 'Over the recommended 3% — consider a thicker (lower-gauge) wire or shorter run.' : 'Within the recommended 3% limit.'}
          </div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the wire gauge, length, current and voltage.</p>}

      <p class="mt-4 text-xs text-slate-500">
        Voltage drop is the voltage lost to wire resistance over the run: drop = 2 × current × resistance-per-metre × one-way length (√3 instead of 2 for three-phase). The US National Electrical Code recommends keeping it under 3% on a branch circuit (5% total). Aluminium has about 1.6× the resistance of copper for the same gauge. Use for DC, solar and mains runs — but follow local electrical code and a licensed electrician for real installations. 🔒 In your browser.
      </p>
    </div>
  );
}
