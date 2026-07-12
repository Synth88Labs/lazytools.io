import { useMemo, useState } from 'preact/hooks';
import { weakAcidPh, weakBasePh, kaToPka } from '../../lib/equilibrium';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (n: number, d = 2) => n.toLocaleString('en-US', { maximumFractionDigits: d });

// A few common weak acids/bases (Ka/Kb) as quick presets — values are textbook standards.
const ACID_PRESETS = [
  { name: 'Acetic acid (CH₃COOH)', k: 1.8e-5 },
  { name: 'Formic acid (HCOOH)', k: 1.8e-4 },
  { name: 'Hydrofluoric acid (HF)', k: 6.6e-4 },
  { name: 'Carbonic acid (H₂CO₃, Ka₁)', k: 4.3e-7 },
];
const BASE_PRESETS = [
  { name: 'Ammonia (NH₃)', k: 1.8e-5 },
  { name: 'Methylamine (CH₃NH₂)', k: 4.4e-4 },
  { name: 'Pyridine (C₅H₅N)', k: 1.7e-9 },
];

export default function WeakAcidTool() {
  const [mode, setMode] = useState<'acid' | 'base'>('acid');
  const [k, setK] = useState('1.8e-5');
  const [conc, setConc] = useState('0.1');

  const r = useMemo(() => {
    const kv = num(k), c = num(conc);
    if (kv == null || c == null) return null;
    if (mode === 'acid') {
      const res = weakAcidPh(kv, c);
      return res ? { ...res, poh: 14 - res.ph, oh: 1e-14 / res.h, pk: kaToPka(kv) } : null;
    }
    const res = weakBasePh(kv, c);
    return res ? { ph: res.ph, h: 1e-14 / res.oh, poh: res.poh, oh: res.oh, ionizationPct: res.ionizationPct, pk: kaToPka(kv) } : null;
  }, [mode, k, conc]);

  const presets = mode === 'acid' ? ACID_PRESETS : BASE_PRESETS;
  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 inline-flex rounded-xl bg-slate-200 p-1 text-sm font-semibold">
        <button onClick={() => { setMode('acid'); setK('1.8e-5'); }} class={`rounded-lg px-3 py-1 ${mode === 'acid' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Weak acid</button>
        <button onClick={() => { setMode('base'); setK('1.8e-5'); }} class={`rounded-lg px-3 py-1 ${mode === 'base' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Weak base</button>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{mode === 'acid' ? 'Ka' : 'Kb'} (acid/base constant)</span>
          <input type="text" value={k} onInput={(e) => setK((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Initial concentration (M)</span>
          <input type="number" step="any" value={conc} onInput={(e) => setConc((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>
      <div class="mt-2 flex flex-wrap gap-1.5">
        {presets.map((p) => <button onClick={() => setK(String(p.k))} class="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-600 hover:border-brand-400 hover:text-brand-700">{p.name}</button>)}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">pH</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.ph, 2)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">pOH</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.poh, 2)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">[{mode === 'acid' ? 'H⁺' : 'OH⁻'}]</p><p class="mt-1 text-lg font-extrabold text-slate-700">{(mode === 'acid' ? r.h : r.oh).toExponential(2)} M</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">% ionization</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.ionizationPct, 2)}%</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the {mode === 'acid' ? 'Ka' : 'Kb'} (e.g. 1.8e-5) and the initial concentration.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Solves the equilibrium exactly via the ICE quadratic: for a weak acid, Ka = x² ÷ (C − x) with x = [H⁺], so x² + Ka·x − Ka·C = 0. No "x is small" approximation is made, so it stays accurate even for stronger weak acids or dilute solutions. pKa = −log Ka. Assumes a monoprotic acid/base at 25 °C (pKw = 14). 🔒 In your browser.</p>
    </div>
  );
}
