import { useMemo, useState } from 'preact/hooks';
import { solveDilution, serialDilution } from '../../lib/biology';

type Mode = 'c1v1' | 'serial' | 'factor';
const tabCls = (a: boolean) => `rounded-lg px-3 py-2 text-sm font-semibold transition ${a ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700'}`;
const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-lg font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 font-mono';
const fmt = (x: number) => (Number.isFinite(x) ? x.toLocaleString('en-US', { maximumFractionDigits: 4 }) : '—');

export default function DilutionTool() {
  const [mode, setMode] = useState<Mode>('c1v1');
  // C1V1=C2V2 — leave exactly one blank
  const [f, setF] = useState({ c1: '10', v1: '', c2: '1', v2: '100' });
  // serial
  const [s, setS] = useState({ stock: '1000', fold: '10', tubes: '5', vol: '1' });
  // dilution factor
  const [d, setD] = useState({ sample: '1', total: '10' });

  const dil = useMemo(() => {
    const blanks = (['c1', 'v1', 'c2', 'v2'] as const).filter((k) => f[k].trim() === '');
    if (blanks.length !== 1) return { err: blanks.length === 0 ? 'Leave exactly one field blank to solve for it.' : 'Leave exactly one field blank.' };
    const g = (k: 'c1' | 'v1' | 'c2' | 'v2') => (f[k].trim() === '' ? null : parseFloat(f[k]));
    const res = solveDilution(g('c1'), g('v1'), g('c2'), g('v2'));
    return { key: blanks[0], value: res };
  }, [f]);

  const serial = useMemo(() => serialDilution(parseFloat(s.stock), parseFloat(s.fold), Math.min(20, Math.max(1, parseInt(s.tubes) || 0)), parseFloat(s.vol)), [s]);
  const dfactor = useMemo(() => parseFloat(d.total) / parseFloat(d.sample), [d]);

  const label: Record<string, string> = { c1: 'stock concentration (C₁)', v1: 'stock volume (V₁)', c2: 'final concentration (C₂)', v2: 'final volume (V₂)' };

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap gap-2">
        <button type="button" class={tabCls(mode === 'c1v1')} onClick={() => setMode('c1v1')}>C₁V₁ = C₂V₂</button>
        <button type="button" class={tabCls(mode === 'serial')} onClick={() => setMode('serial')}>Serial dilution</button>
        <button type="button" class={tabCls(mode === 'factor')} onClick={() => setMode('factor')}>Dilution factor</button>
      </div>

      {mode === 'c1v1' && (
        <>
          <p class="mt-4 text-sm text-slate-500">Enter any three — leave the one you want to solve for blank.</p>
          <div class="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(['c1', 'v1', 'c2', 'v2'] as const).map((k) => (
              <label class="block">
                <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{k.toUpperCase()} — {label[k]}</span>
                <input class={inputCls} type="number" placeholder="solve" value={f[k]} onInput={(e) => setF({ ...f, [k]: (e.target as HTMLInputElement).value })} />
              </label>
            ))}
          </div>
          <div class="mt-4 rounded-xl bg-white p-4 ring-2 ring-brand-200">
            {'err' in dil ? <p class="text-sm text-amber-700">{dil.err}</p> : (
              <div class="flex items-baseline justify-between">
                <span class="text-sm font-medium text-slate-600">{label[dil.key as string]}</span>
                <span class="text-2xl font-extrabold text-brand-800">{dil.value == null ? '—' : fmt(dil.value)}</span>
              </div>
            )}
            <p class="mt-1 font-mono text-xs text-slate-400">C₁V₁ = C₂V₂ · use the same unit for both concentrations and both volumes</p>
          </div>
        </>
      )}

      {mode === 'serial' && (
        <>
          <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Stock conc.</span><input class={inputCls} type="number" value={s.stock} onInput={(e) => setS({ ...s, stock: (e.target as HTMLInputElement).value })} /></label>
            <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Fold per step</span><input class={inputCls} type="number" value={s.fold} onInput={(e) => setS({ ...s, fold: (e.target as HTMLInputElement).value })} /></label>
            <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Number of tubes</span><input class={inputCls} type="number" value={s.tubes} onInput={(e) => setS({ ...s, tubes: (e.target as HTMLInputElement).value })} /></label>
            <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Volume per tube</span><input class={inputCls} type="number" value={s.vol} onInput={(e) => setS({ ...s, vol: (e.target as HTMLInputElement).value })} /></label>
          </div>
          <div class="mt-4 overflow-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-right text-sm">
              <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr><th class="px-3 py-2 text-left">Tube</th><th class="px-3 py-2">Concentration</th><th class="px-3 py-2">Transfer</th><th class="px-3 py-2">+ Diluent</th><th class="px-3 py-2">Cumulative</th></tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-mono">
                {serial.map((r) => (
                  <tr class="hover:bg-slate-50">
                    <td class="px-3 py-1.5 text-left text-slate-500">#{r.tube}</td>
                    <td class="px-3 py-1.5 font-semibold text-slate-800">{fmt(r.conc)}</td>
                    <td class="px-3 py-1.5 text-slate-600">{fmt(r.transfer)}</td>
                    <td class="px-3 py-1.5 text-slate-600">{fmt(r.diluent)}</td>
                    <td class="px-3 py-1.5 text-brand-700">1:{fmt(r.cumulativeFold)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p class="mt-2 text-xs text-slate-500">Each tube is diluted {s.fold}× from the previous. Transfer + diluent volumes make up the per-tube volume you set.</p>
        </>
      )}

      {mode === 'factor' && (
        <>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sample volume</span><input class={inputCls} type="number" value={d.sample} onInput={(e) => setD({ ...d, sample: (e.target as HTMLInputElement).value })} /></label>
            <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Final (total) volume</span><input class={inputCls} type="number" value={d.total} onInput={(e) => setD({ ...d, total: (e.target as HTMLInputElement).value })} /></label>
          </div>
          <div class="mt-4 rounded-xl bg-white p-4 ring-2 ring-brand-200">
            <div class="flex items-baseline justify-between">
              <span class="text-sm font-medium text-slate-600">Dilution factor</span>
              <span class="text-2xl font-extrabold text-brand-800">{fmt(dfactor)}× &nbsp;<span class="text-base font-semibold text-slate-500">(1:{fmt(dfactor)})</span></span>
            </div>
            <p class="mt-1 font-mono text-xs text-slate-400">dilution factor = final volume ÷ sample volume</p>
          </div>
        </>
      )}
    </div>
  );
}
