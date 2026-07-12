import { useMemo, useState } from 'preact/hooks';
import { brixToSg, sgToBrix } from '../../lib/brewing';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (n: number, d = 3) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export default function BrixSgTool() {
  const [mode, setMode] = useState<'brix' | 'sg'>('brix');
  const [value, setValue] = useState('12');

  const r = useMemo(() => {
    const v = num(value);
    if (v == null) return null;
    if (mode === 'brix') {
      const sg = brixToSg(v);
      return sg != null ? { sg, brix: v } : null;
    }
    const brix = sgToBrix(v);
    return brix != null ? { sg: v, brix } : null;
  }, [mode, value]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 inline-flex rounded-xl bg-slate-200 p-1 text-sm font-semibold">
        <button onClick={() => { setMode('brix'); setValue('12'); }} class={`rounded-lg px-3 py-1 ${mode === 'brix' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Brix → SG</button>
        <button onClick={() => { setMode('sg'); setValue('1.048'); }} class={`rounded-lg px-3 py-1 ${mode === 'sg' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>SG → Brix</button>
      </div>

      <label class="block max-w-xs"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{mode === 'brix' ? '°Brix' : 'Specific gravity'}</span>
        <input type="number" step={mode === 'brix' ? '0.1' : '0.001'} value={value} onInput={(e) => setValue((e.target as HTMLInputElement).value)} class={inp} /></label>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class={`rounded-xl bg-white p-4 text-center ${mode === 'brix' ? 'ring-2 ring-brand-200' : 'ring-1 ring-slate-200'}`}><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Specific gravity</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.sg)}</p></div>
          <div class={`rounded-xl bg-white p-4 text-center ${mode === 'sg' ? 'ring-2 ring-brand-200' : 'ring-1 ring-slate-200'}`}><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">°Brix (≈ °Plato)</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.brix, 1)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a {mode === 'brix' ? 'Brix' : 'gravity'} value.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">°Brix (and the near-identical °Plato) measures dissolved sugar as a percentage by weight; specific gravity measures density relative to water. Refractometers read in Brix, hydrometers in gravity — this converts between them using the standard cubic formulas. Note: on <em>fermenting</em> or finished beer, alcohol skews refractometer Brix, so use the refractometer correction tool for final gravity. 🔒 In your browser.</p>
    </div>
  );
}
