import { useMemo, useState } from 'preact/hooks';
import { yeastCells } from '../../lib/brewing';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toLocaleString();

const RATES = [
  { rate: 0.5, label: '0.5 — ale, low (light/session)' },
  { rate: 0.75, label: '0.75 — ale, standard' },
  { rate: 1.0, label: '1.0 — ale, high gravity' },
  { rate: 1.5, label: '1.5 — lager, standard' },
  { rate: 2.0, label: '2.0 — lager, high gravity' },
];

export default function YeastPitchTool() {
  const [volume, setVolume] = useState('20');
  const [unit, setUnit] = useState<'L' | 'gal'>('L');
  const [og, setOg] = useState('1.050');
  const [rate, setRate] = useState(0.75);

  const r = useMemo(() => {
    const v = num(volume), o = num(og);
    if (v == null || o == null) return null;
    const litres = unit === 'L' ? v : v * 3.785411784;
    return yeastCells(litres, o, rate);
  }, [volume, unit, og, rate]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Batch volume</span>
          <div class="flex gap-1"><input type="number" step="any" value={volume} onInput={(e) => setVolume((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'L' | 'gal')} class={sel}><option value="L">L</option><option value="gal">gal</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Original gravity (OG)</span>
          <input type="number" step="any" value={og} onInput={(e) => setOg((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Pitch rate (M cells/mL/°P)</span>
          <select value={rate} onChange={(e) => setRate(parseFloat((e.target as HTMLSelectElement).value))} class={`${sel} w-full`}>{RATES.map((x) => <option value={x.rate}>{x.label}</option>)}</select></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cells to pitch</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.cellsBillion, 0)} <span class="text-lg text-slate-500">billion</span></p><p class="mt-0.5 text-xs text-slate-400">{fmt(r.plato)} °Plato</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Fresh liquid packs</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.liquidPacks)}</p><p class="mt-0.5 text-xs text-slate-400">~100 B cells each</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Dry yeast</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.dryGrams)} g</p><p class="mt-0.5 text-xs text-slate-400">~10 B cells/g</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your batch volume and original gravity.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Pitching the right amount of yeast matters for clean fermentation. Cells needed = pitch rate × volume (mL) × gravity (°Plato). Ales use about 0.75 million cells/mL/°P, lagers roughly double (they ferment cold). A fresh liquid pack holds ~100 billion cells but ages, so under-pitching is common without a starter; dry yeast is ~10 billion cells per gram. 🔒 In your browser.</p>
    </div>
  );
}
