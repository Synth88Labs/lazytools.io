import { useMemo, useState } from 'preact/hooks';
import { timer555Astable, timer555Monostable } from '../../lib/electronics';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const R_UNITS: [string, number][] = [['Ω', 1], ['kΩ', 1e3], ['MΩ', 1e6]];
const C_UNITS: [string, number][] = [['pF', 1e-12], ['nF', 1e-9], ['µF', 1e-6]];
function fmtFreq(hz: number): string {
  if (hz >= 1e6) return `${Number((hz / 1e6).toPrecision(4))} MHz`;
  if (hz >= 1e3) return `${Number((hz / 1e3).toPrecision(4))} kHz`;
  return `${Number(hz.toPrecision(4))} Hz`;
}
function fmtTime(s: number): string {
  if (s >= 1) return `${Number(s.toPrecision(4))} s`;
  if (s >= 1e-3) return `${Number((s * 1e3).toPrecision(4))} ms`;
  return `${Number((s * 1e6).toPrecision(4))} µs`;
}

export default function Timer555Tool() {
  const [mode, setMode] = useState<'astable' | 'monostable'>('astable');
  const [r1v, setR1v] = useState('1'); const [r1u, setR1u] = useState(1e3);
  const [r2v, setR2v] = useState('10'); const [r2u, setR2u] = useState(1e3);
  const [cv, setCv] = useState('10'); const [cu, setCu] = useState(1e-6);

  const r = useMemo(() => {
    const R1 = (num(r1v) ?? 0) * r1u, R2 = (num(r2v) ?? 0) * r2u, C = (num(cv) ?? 0) * cu;
    if (R1 <= 0 || C <= 0) return null;
    if (mode === 'astable') {
      if (R2 <= 0) return null;
      return { kind: 'a' as const, ...timer555Astable(R1, R2, C) };
    }
    return { kind: 'm' as const, t: timer555Monostable(R1, C) };
  }, [mode, r1v, r1u, r2v, r2u, cv, cu]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
  const RCInput = (label: string, v: string, setV: (s: string) => void, u: number, setU: (n: number) => void, units: [string, number][]) => (
    <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <div class="flex gap-1"><input type="number" step="any" value={v} onInput={(e) => setV((e.target as HTMLInputElement).value)} class={inp} />
        <select value={u} onChange={(e) => setU(+(e.target as HTMLSelectElement).value)} class={sel}>{units.map(([l, val]) => <option value={val}>{l}</option>)}</select></div></label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {([['astable', 'Astable (oscillator)'], ['monostable', 'Monostable (one-shot)']] as const).map(([m, lbl]) => (
          <button onClick={() => setMode(m)} class={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${mode === m ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{lbl}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        {RCInput(mode === 'astable' ? 'R1' : 'R', r1v, setR1v, r1u, setR1u, R_UNITS)}
        {mode === 'astable' && RCInput('R2', r2v, setR2v, r2u, setR2u, R_UNITS)}
        {RCInput('Capacitor C', cv, setCv, cu, setCu, C_UNITS)}
      </div>

      {r ? (
        r.kind === 'a' ? (
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Frequency</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmtFreq(r.freq)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Duty cycle</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{Number((r.duty * 100).toFixed(1))}%</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">High / low time</p><p class="mt-1 text-base font-extrabold text-slate-700">{fmtTime(r.tHigh)} / {fmtTime(r.tLow)}</p></div>
          </div>
        ) : (
          <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Output pulse width</p><p class="mt-1 text-4xl font-extrabold text-brand-800">{fmtTime(r.t)}</p></div>
        )
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the resistor(s) and capacitor.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        {mode === 'astable'
          ? 'Astable: f = 1.44 ⁄ ((R1 + 2·R2)·C); duty = (R1 + R2) ⁄ (R1 + 2·R2). The standard 555 duty is always above 50% — add a diode across R2 for a symmetric square wave.'
          : 'Monostable one-shot: a trigger pulse produces one output pulse of width t = 1.1 · R · C.'} 🔒 In your browser.
      </p>
    </div>
  );
}
