import { useMemo, useState } from 'preact/hooks';
import { mcu, srmFromMcu, srmToEbc } from '../../lib/brewing';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

interface Grain { color: string; weight: string; }

// Approximate SRM → sRGB for the swatch (standard beer-colour gradient).
function srmToHex(srm: number): string {
  const table: [number, string][] = [
    [2, '#F3F993'], [4, '#F5F75C'], [6, '#F6F513'], [8, '#EAE615'], [10, '#E0D01B'],
    [13, '#D5BC26'], [17, '#BF923B'], [20, '#BB7A33'], [24, '#A9611E'], [29, '#8E4C0F'],
    [35, '#6B3005'], [40, '#5B2103'], [60, '#361F1B'], [80, '#100806'],
  ];
  for (const [max, hex] of table) if (srm <= max) return hex;
  return '#080607';
}

export default function BeerColorTool() {
  const [grains, setGrains] = useState<Grain[]>([{ color: '10', weight: '9' }, { color: '40', weight: '1' }]);
  const [volume, setVolume] = useState('5');
  const [vUnit, setVUnit] = useState<'gal' | 'L'>('gal');

  const r = useMemo(() => {
    const v = num(volume);
    if (v == null || v <= 0) return null;
    const gal = vUnit === 'gal' ? v : v * 0.264172;
    let total = 0;
    for (const g of grains) {
      const c = num(g.color), w = num(g.weight);
      if (c == null || w == null) continue;
      const m = mcu(c, w, gal);
      if (m != null) total += m;
    }
    if (total <= 0) return null;
    const srm = srmFromMcu(total);
    return { srm, ebc: srmToEbc(srm), mcu: total };
  }, [grains, volume, vUnit]);

  const setGrain = (i: number, k: keyof Grain, val: string) => setGrains((gs) => gs.map((g, j) => j === i ? { ...g, [k]: val } : g));
  const addGrain = () => setGrains((gs) => [...gs, { color: '', weight: '' }]);
  const delGrain = (i: number) => setGrains((gs) => gs.length > 1 ? gs.filter((_, j) => j !== i) : gs);

  const inp = 'w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none';
  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-2 grid grid-cols-[1fr_1fr_auto] gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span>Malt colour (°Lovibond)</span><span>Weight (lb)</span><span></span>
      </div>
      {grains.map((g, i) => (
        <div class="mb-2 grid grid-cols-[1fr_1fr_auto] gap-2">
          <input type="number" step="any" value={g.color} onInput={(e) => setGrain(i, 'color', (e.target as HTMLInputElement).value)} class={inp} />
          <input type="number" step="any" value={g.weight} onInput={(e) => setGrain(i, 'weight', (e.target as HTMLInputElement).value)} class={inp} />
          <button onClick={() => delGrain(i)} class="rounded-lg px-2 text-slate-400 hover:text-rose-600" aria-label="Remove">✕</button>
        </div>
      ))}
      <div class="mb-3 flex items-center gap-3">
        <button onClick={addGrain} class="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-slate-200 hover:ring-brand-300">+ Add malt</button>
        <label class="ml-auto flex items-center gap-2 text-sm text-slate-600">Batch volume
          <input type="number" step="any" value={volume} onInput={(e) => setVolume((e.target as HTMLInputElement).value)} class="w-20 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-center font-mono text-sm" />
          <select value={vUnit} onChange={(e) => setVUnit((e.target as HTMLSelectElement).value as 'gal' | 'L')} class={sel}><option value="gal">gal</option><option value="L">L</option></select>
        </label>
      </div>

      {r ? (
        <div class="mt-2 flex items-center gap-4 rounded-xl bg-white p-4 ring-2 ring-brand-200">
          <div class="h-16 w-16 shrink-0 rounded-lg ring-1 ring-slate-300" style={`background:${srmToHex(r.srm)}`}></div>
          <div class="grid flex-1 grid-cols-2 gap-3 text-center">
            <div><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Colour (SRM)</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.srm)}</p></div>
            <div><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">EBC</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.ebc)}</p></div>
          </div>
        </div>
      ) : (
        <p class="mt-2 text-sm text-slate-500">Enter at least one malt and a batch volume.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Beer colour uses the Morey equation: first the malt colour units MCU = Σ(malt °Lovibond × lb) ÷ volume in gallons, then SRM = 1.4922 × MCU^0.6859. EBC is the European scale (SRM × 1.97). The swatch is an approximation — actual colour also depends on boil, pH and oxidation. Add a row per malt in your grain bill. 🔒 In your browser.</p>
    </div>
  );
}
