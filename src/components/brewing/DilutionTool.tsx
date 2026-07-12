import { useMemo, useState } from 'preact/hooks';
import { diluteToGravity } from '../../lib/brewing';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (n: number, d = 2) => n.toLocaleString('en-US', { maximumFractionDigits: d });

export default function DilutionTool() {
  const [vol, setVol] = useState('20');
  const [current, setCurrent] = useState('1.060');
  const [target, setTarget] = useState('1.050');

  const r = useMemo(() => {
    const v = num(vol), c = num(current), t = num(target);
    if (v == null || c == null || t == null) return null;
    return diluteToGravity(v, c, t);
  }, [vol, current, target]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Current volume (L)</span>
          <input type="number" step="any" value={vol} onInput={(e) => setVol((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Current gravity</span>
          <input type="number" step="0.001" value={current} onInput={(e) => setCurrent((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Target gravity</span>
          <input type="number" step="0.001" value={target} onInput={(e) => setTarget((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Water to add</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.waterToAddL)} L</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Final volume</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.finalVolL)} L</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your current volume and gravity, and a target gravity lower than the current one.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">If your wort came out stronger than planned, adding water dilutes it. This uses gravity points (the last two digits of the SG): points × volume is conserved, so water to add = current volume × (current points ÷ target points − 1). Add water gradually and re-measure — and remember diluting also lowers the bitterness and colour, not just the gravity. 🔒 In your browser.</p>
    </div>
  );
}
