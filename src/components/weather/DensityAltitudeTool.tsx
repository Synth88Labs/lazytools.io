import { useMemo, useState } from 'preact/hooks';
import { densityAltitude, fToC } from '../../lib/weather';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Math.round(x).toLocaleString();

export default function DensityAltitudeTool() {
  const [elev, setElev] = useState('2000');
  const [altimeter, setAltimeter] = useState('29.92');
  const [oat, setOat] = useState('25');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');

  const res = useMemo(() => {
    const e = num(elev), a = num(altimeter), t = num(oat);
    if (e == null || a == null || t == null) return null;
    const pa = e + (29.92 - a) * 1000;
    const oatC = tempUnit === 'F' ? fToC(t) : t;
    return { pa, da: densityAltitude(pa, oatC) };
  }, [elev, altimeter, oat, tempUnit]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Field elevation (ft)</span><input type="number" step="any" value={elev} onInput={(e) => setElev((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Altimeter setting (inHg)</span><input type="number" step="any" value={altimeter} onInput={(e) => setAltimeter((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Outside air temp</span>
          <div class="flex gap-1"><input type="number" step="any" value={oat} onInput={(e) => setOat((e.target as HTMLInputElement).value)} class={inp} />
            <select value={tempUnit} onChange={(e) => setTempUnit((e.target as HTMLSelectElement).value as 'C' | 'F')} class={sel}><option value="C">°C</option><option value="F">°F</option></select></div></label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Density altitude</p><p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(res.da)} ft</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Pressure altitude</p><p class="mt-1 font-mono text-3xl font-extrabold text-slate-800">{fmt(res.pa)} ft</p></div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the field elevation, altimeter setting and temperature.</p>}

      <p class="mt-4 text-xs text-slate-500">Density altitude is the altitude the air "feels like" to a wing or propeller — pressure altitude corrected for temperature. Pressure altitude = elevation + (29.92 − altimeter) × 1,000 ft; density altitude ≈ PA + 120 × (OAT − ISA temp), where the ISA temperature drops about 2 °C per 1,000 ft. High density altitude (hot, high, humid) reduces engine power, lift and climb. This is the standard pilot approximation — use official performance charts for flight planning. 🔒 In your browser.</p>
    </div>
  );
}
