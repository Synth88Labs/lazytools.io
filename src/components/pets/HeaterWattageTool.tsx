import { useMemo, useState } from 'preact/hooks';
import { heaterWatts } from '../../lib/pets';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };

// Round up to the nearest common heater size.
const COMMON = [25, 50, 75, 100, 150, 200, 250, 300];
const nextSize = (w: number) => COMMON.find((c) => c >= w) ?? Math.ceil(w / 50) * 50;

export default function HeaterWattageTool() {
  const [gallons, setGallons] = useState('20');
  const [unit, setUnit] = useState<'gal' | 'L'>('gal');
  const [room, setRoom] = useState('68');
  const [target, setTarget] = useState('78');
  const [tempUnit, setTempUnit] = useState<'F' | 'C'>('F');

  const r = useMemo(() => {
    const g = num(gallons), rt = num(room), tg = num(target);
    if (g == null || rt == null || tg == null) return null;
    const gal = unit === 'gal' ? g : g * 0.264172;
    const riseF = tempUnit === 'F' ? tg - rt : (tg - rt) * 9 / 5;
    if (riseF < 0) return null;
    const watts = heaterWatts(gal, riseF);
    if (watts == null) return null;
    return { watts, riseF, suggested: nextSize(watts) };
  }, [gallons, unit, room, target, tempUnit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tank volume</span>
          <div class="flex gap-1"><input type="number" step="any" value={gallons} onInput={(e) => setGallons((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'gal' | 'L')} class={sel}><option value="gal">gal</option><option value="L">L</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Room temp (°{tempUnit})</span>
          <div class="flex gap-1"><input type="number" step="any" value={room} onInput={(e) => setRoom((e.target as HTMLInputElement).value)} class={inp} />
            <select value={tempUnit} onChange={(e) => setTempUnit((e.target as HTMLSelectElement).value as 'F' | 'C')} class={sel}><option value="F">°F</option><option value="C">°C</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Target temp (°{tempUnit})</span>
          <input type="number" step="any" value={target} onInput={(e) => setTarget((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Suggested heater</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{r.suggested} <span class="text-lg text-slate-500">W</span></p><p class="mt-1 text-xs text-slate-400">calc ≈ {Math.round(r.watts)} W, rounded to a stock size</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Temperature rise</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{Math.round(r.riseF)} °F above room</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the tank volume and temperatures (target must be above room temp).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">A common rule of thumb is 2.5–5 watts per gallon, scaled by how far above room temperature you need to heat: about 2.5 W/gal for a small rise, 5 W/gal for a large one in a cold room. For tanks over ~40 gallons, two smaller heaters give more even heat and a safety margin if one fails. Always use a separate thermometer to confirm. 🔒 In your browser.</p>
    </div>
  );
}
