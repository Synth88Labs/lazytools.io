import { useMemo, useState } from 'preact/hooks';
import { titrationConc } from '../../lib/chemistry';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(5));
const RATIOS: [string, number][] = [['1:1 (HCl + NaOH)', 1], ['diprotic acid : base (2)', 2], ['acid : diprotic base (0.5)', 0.5]];

export default function TitrationTool() {
  const [cKnown, setCKnown] = useState('0.1');
  const [vKnown, setVKnown] = useState('25');
  const [vUnknown, setVUnknown] = useState('20');
  const [ratio, setRatio] = useState('1');

  const res = useMemo(() => {
    const c = num(cKnown), vk = num(vKnown), vu = num(vUnknown), r = num(ratio);
    if (c == null || vk == null || vu == null || r == null) return null;
    return titrationConc(c, vk, vu, r);
  }, [cKnown, vKnown, vUnknown, ratio]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Known concentration (M)</span><input type="number" step="any" value={cKnown} onInput={(e) => setCKnown((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Known volume (titrant used)</span><input type="number" step="any" value={vKnown} onInput={(e) => setVKnown((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Unknown volume (analyte)</span><input type="number" step="any" value={vUnknown} onInput={(e) => setVUnknown((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mole ratio (unknown : known)</span><input type="number" step="any" value={ratio} onInput={(e) => setRatio((e.target as HTMLInputElement).value)} class={inp} />
          <div class="mt-1 flex flex-wrap gap-1">{RATIOS.map(([l, v]) => <button onClick={() => setRatio(String(v))} class="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] text-slate-600 hover:border-brand-400">{l}</button>)}</div></label>
      </div>

      {res != null ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Unknown concentration</p>
          <p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(res)} M</p>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the known concentration and volumes.</p>}

      <p class="mt-4 text-xs text-slate-500">At the equivalence point of a titration, the moles of acid and base are stoichiometrically equal: C₁V₁ × (mole ratio) = C₂V₂. So the unknown concentration = known C × known V × (mole ratio) ÷ unknown V. The mole ratio is 1 for a 1:1 reaction like HCl + NaOH, 2 when the unknown supplies twice the reactive units (e.g. a diprotic acid neutralising a monoprotic base). Volumes can be in any matching unit. 🔒 In your browser.</p>
    </div>
  );
}
