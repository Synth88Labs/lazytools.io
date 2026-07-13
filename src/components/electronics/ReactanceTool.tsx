import { useMemo, useState } from 'preact/hooks';
import { capReactance, indReactance, fmtOhms } from '../../lib/electronics';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };

const FREQ_UNITS: Record<string, number> = { Hz: 1, kHz: 1e3, MHz: 1e6 };
const CAP_UNITS: Record<string, number> = { pF: 1e-12, nF: 1e-9, 'µF': 1e-6 };
const IND_UNITS: Record<string, number> = { 'µH': 1e-6, mH: 1e-3, H: 1 };

export default function ReactanceTool() {
  const [mode, setMode] = useState<'cap' | 'ind'>('cap');
  const [freq, setFreq] = useState('1');
  const [fUnit, setFUnit] = useState('kHz');
  const [val, setVal] = useState(mode === 'cap' ? '1' : '10');
  const [vUnit, setVUnit] = useState('µF');

  const r = useMemo(() => {
    const f = num(freq), v = num(val);
    if (f == null || v == null) return null;
    const hz = f * FREQ_UNITS[fUnit];
    if (mode === 'cap') {
      const c = v * (CAP_UNITS[vUnit] ?? 1e-6);
      return { x: capReactance(hz, c) };
    }
    const l = v * (IND_UNITS[vUnit] ?? 1e-3);
    return { x: indReactance(hz, l) };
  }, [mode, freq, fUnit, val, vUnit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm';
  const tog = (on: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${on ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`;
  const compUnits = mode === 'cap' ? Object.keys(CAP_UNITS) : Object.keys(IND_UNITS);
  const compLabel = mode === 'cap' ? 'Capacitance' : 'Inductance';

  const switchMode = (m: 'cap' | 'ind') => { setMode(m); setVal(m === 'cap' ? '1' : '10'); setVUnit(m === 'cap' ? 'µF' : 'mH'); };

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        <button onClick={() => switchMode('cap')} class={tog(mode === 'cap')}>Capacitive (Xc)</button>
        <button onClick={() => switchMode('ind')} class={tog(mode === 'ind')}>Inductive (Xʟ)</button>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Frequency</span>
          <div class="flex gap-1"><input type="number" step="any" value={freq} onInput={(e) => setFreq((e.target as HTMLInputElement).value)} class={inp} />
            <select value={fUnit} onChange={(e) => setFUnit((e.target as HTMLSelectElement).value)} class={sel}>{Object.keys(FREQ_UNITS).map((u) => <option value={u}>{u}</option>)}</select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{compLabel}</span>
          <div class="flex gap-1"><input type="number" step="any" value={val} onInput={(e) => setVal((e.target as HTMLInputElement).value)} class={inp} />
            <select value={vUnit} onChange={(e) => setVUnit((e.target as HTMLSelectElement).value)} class={sel}>{compUnits.map((u) => <option value={u}>{u}</option>)}</select></div></label>
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-5 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{mode === 'cap' ? 'Capacitive reactance Xc' : 'Inductive reactance Xʟ'}</p>
          <p class="mt-1 text-4xl font-extrabold text-brand-800">{fmtOhms(r.x)}</p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a frequency and {mode === 'cap' ? 'capacitance' : 'inductance'}.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">{mode === 'cap'
        ? 'Capacitive reactance Xc = 1 ÷ (2πfC) falls as frequency rises — a capacitor passes high frequencies and blocks DC.'
        : 'Inductive reactance Xʟ = 2πfL rises with frequency — an inductor passes DC and blocks high frequencies.'} Reactance is the frequency-dependent AC "resistance" of the component, in ohms. 🔒 In your browser.</p>
    </div>
  );
}
