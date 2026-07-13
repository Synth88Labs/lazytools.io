import { useMemo, useState } from 'preact/hooks';
import { snowLoad } from '../../lib/weather';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(4));
const SNOW: [string, number][] = [['Fresh / light (100)', 100], ['Settled (300)', 300], ['Wet / packed (400)', 400], ['Very wet (500)', 500], ['Ice (900)', 900]];

export default function SnowLoadTool() {
  const [depth, setDepth] = useState('30');
  const [depthUnit, setDepthUnit] = useState<'cm' | 'in'>('cm');
  const [density, setDensity] = useState('300');

  const res = useMemo(() => {
    const d = num(depth), rho = num(density);
    if (d == null || rho == null) return null;
    const depthM = depthUnit === 'in' ? d * 0.0254 : d / 100;
    return snowLoad(depthM, rho);
  }, [depth, depthUnit, density]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Snow depth</span>
          <div class="flex gap-1"><input type="number" step="any" value={depth} onInput={(e) => setDepth((e.target as HTMLInputElement).value)} class={inp} />
            <select value={depthUnit} onChange={(e) => setDepthUnit((e.target as HTMLSelectElement).value as 'cm' | 'in')} class={sel}><option value="cm">cm</option><option value="in">in</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Snow density (kg/m³)</span><input type="number" step="any" value={density} onInput={(e) => setDensity((e.target as HTMLInputElement).value)} class={inp} />
          <div class="mt-1 flex flex-wrap gap-1">{SNOW.map(([l, v]) => <button onClick={() => setDensity(String(v))} class="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] text-slate-600 hover:border-brand-400">{l}</button>)}</div></label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Roof load</p><p class="mt-1 font-mono text-2xl font-extrabold text-brand-800">{fmt(res.psf)} lb/ft²</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">In kPa</p><p class="mt-1 font-mono text-2xl font-bold text-slate-800">{fmt(res.kPa)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Mass per area</p><p class="mt-1 font-mono text-2xl font-bold text-slate-800">{fmt(res.massPerArea)} kg/m²</p></div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the snow depth and density.</p>}

      <p class="mt-4 text-xs text-slate-500">Snow load on a flat roof is the snow depth times its density: mass per area = depth × density, and the pressure is that times gravity. Snow density varies hugely — fresh light snow around 50–100 kg/m³, settled 200–300, wet or packed 400–500, and ice near 900 — so depth alone can\'t tell you the load. For structural decisions, use your local building code\'s design snow load (e.g. ASCE 7), which also accounts for drifting and roof shape. 🔒 In your browser.</p>
    </div>
  );
}
