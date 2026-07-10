import { useMemo, useState } from 'preact/hooks';
import { cleanSeq, ssMolecularWeight, dsMolecularWeight, ngToPmol, molesToCopies, concFromA260 } from '../../lib/biology';

type Mode = 'sequence' | 'a260';
const tabCls = (a: boolean) => `rounded-lg px-3 py-2 text-sm font-semibold transition ${a ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700'}`;
const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-lg font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 font-mono';
const fmt = (x: number, d = 2) => (!Number.isFinite(x) ? '—' : Math.abs(x) >= 1e6 || (x !== 0 && Math.abs(x) < 1e-2) ? x.toExponential(3) : x.toLocaleString('en-US', { maximumFractionDigits: d }));

export default function MolWeightTool() {
  const [mode, setMode] = useState<Mode>('sequence');
  const [raw, setRaw] = useState('ATGGCCTTCAGCGACTAAGGATCC');
  const [type, setType] = useState<'ssDNA' | 'dsDNA' | 'ssRNA'>('dsDNA');
  const [ng, setNg] = useState('1000');
  // A260 tab
  const [a260, setA260] = useState('1.0');
  const [a260type, setA260type] = useState('50');
  const [dilution, setDilution] = useState('1');

  const seq = useMemo(() => cleanSeq(raw), [raw]);
  const mw = useMemo(() => {
    if (type === 'dsDNA') return dsMolecularWeight(seq);
    if (type === 'ssRNA') return ssMolecularWeight(seq, true);
    return ssMolecularWeight(seq);
  }, [seq, type]);
  const pmol = useMemo(() => ngToPmol(parseFloat(ng) || 0, mw), [ng, mw]);
  const copies = useMemo(() => molesToCopies((pmol || 0) * 1e-12), [pmol]);
  const conc = useMemo(() => concFromA260(parseFloat(a260) || 0, parseFloat(a260type), parseFloat(dilution) || 1), [a260, a260type, dilution]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap gap-2">
        <button type="button" class={tabCls(mode === 'sequence')} onClick={() => setMode('sequence')}>MW & ng ↔ pmol</button>
        <button type="button" class={tabCls(mode === 'a260')} onClick={() => setMode('a260')}>Concentration from A₂₆₀</button>
      </div>

      {mode === 'sequence' ? (
        <>
          <label class="mt-4 block">
            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">DNA / RNA sequence</span>
            <textarea class="h-20 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" value={raw} spellcheck={false} onInput={(e) => setRaw((e.target as HTMLTextAreaElement).value)} />
          </label>
          <div class="mt-3 flex flex-wrap gap-2">
            {(['dsDNA', 'ssDNA', 'ssRNA'] as const).map((t) => (
              <button type="button" onClick={() => setType(t)} class={`rounded-md px-3 py-1.5 text-sm ${type === t ? 'bg-brand-100 font-semibold text-brand-800' : 'bg-white ring-1 ring-slate-200 text-slate-600'}`}>{t}</button>
            ))}
          </div>

          <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-2xl font-extrabold text-brand-800">{fmt(mw, 1)} g/mol</p>
            <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{type} molecular weight · {seq.length} nt</p>
          </div>

          <label class="mt-4 block">
            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Amount (ng)</span>
            <input class={inputCls} type="number" value={ng} onInput={(e) => setNg((e.target as HTMLInputElement).value)} />
          </label>
          <div class="mt-3 grid gap-2 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-3 ring-1 ring-slate-200"><p class="text-xs text-slate-500">Moles</p><p class="font-mono text-lg font-bold text-slate-800">{fmt(pmol)} pmol</p></div>
            <div class="rounded-xl bg-white p-3 ring-1 ring-slate-200"><p class="text-xs text-slate-500">Molecule copies</p><p class="font-mono text-lg font-bold text-slate-800">{fmt(copies)}</p></div>
          </div>
          <p class="mt-2 text-xs text-slate-500">pmol = ng × 1000 ÷ MW · copies = mol × 6.022×10²³. 🔒 Computed in your browser.</p>
        </>
      ) : (
        <>
          <div class="mt-4 grid gap-4 sm:grid-cols-3">
            <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">A₂₆₀ reading</span><input class={inputCls} type="number" value={a260} onInput={(e) => setA260((e.target as HTMLInputElement).value)} /></label>
            <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Nucleic acid</span>
              <select class={inputCls} value={a260type} onChange={(e) => setA260type((e.target as HTMLSelectElement).value)}>
                <option value="50">dsDNA (50)</option><option value="33">ssDNA (33)</option><option value="40">RNA (40)</option>
              </select>
            </label>
            <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Dilution factor</span><input class={inputCls} type="number" value={dilution} onInput={(e) => setDilution((e.target as HTMLInputElement).value)} /></label>
          </div>
          <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-2xl font-extrabold text-brand-800">{fmt(conc, 1)} ng/µL</p>
            <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">concentration</p>
            <p class="mt-1 font-mono text-xs text-slate-400">A₂₆₀ × {a260type} × dilution</p>
          </div>
          <p class="mt-2 text-xs text-slate-500">Conversion factors: dsDNA 1 A₂₆₀ = 50 ng/µL · ssDNA = 33 · RNA = 40 (stable published constants). A₂₆₀/A₂₈₀ ≈ 1.8 (DNA) or 2.0 (RNA) indicates good purity.</p>
        </>
      )}
    </div>
  );
}
