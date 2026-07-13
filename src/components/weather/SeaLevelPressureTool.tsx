import { useMemo, useState } from 'preact/hooks';
import { seaLevelPressure, fToC } from '../../lib/weather';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function SeaLevelPressureTool() {
  const [pressure, setPressure] = useState('1000');
  const [pUnit, setPUnit] = useState<'hPa' | 'inHg'>('hPa');
  const [alt, setAlt] = useState('500');
  const [aUnit, setAUnit] = useState<'m' | 'ft'>('m');
  const [temp, setTemp] = useState('15');
  const [tUnit, setTUnit] = useState<'C' | 'F'>('C');

  const r = useMemo(() => {
    const p = num(pressure), a = num(alt), t = num(temp);
    if (p == null || a == null || t == null) return null;
    const hpa = pUnit === 'hPa' ? p : p * 33.8638866667;
    const m = aUnit === 'm' ? a : a * 0.3048;
    const c = tUnit === 'C' ? t : fToC(t);
    const sea = seaLevelPressure(hpa, m, c);
    if (sea == null) return null;
    return { hpa: sea, inHg: sea / 33.8638866667, diff: sea - hpa };
  }, [pressure, pUnit, alt, aUnit, temp, tUnit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Station pressure</span>
          <div class="flex gap-1"><input type="number" step="any" value={pressure} onInput={(e) => setPressure((e.target as HTMLInputElement).value)} class={inp} />
            <select value={pUnit} onChange={(e) => setPUnit((e.target as HTMLSelectElement).value as 'hPa' | 'inHg')} class={sel}><option value="hPa">hPa</option><option value="inHg">inHg</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Altitude</span>
          <div class="flex gap-1"><input type="number" step="any" value={alt} onInput={(e) => setAlt((e.target as HTMLInputElement).value)} class={inp} />
            <select value={aUnit} onChange={(e) => setAUnit((e.target as HTMLSelectElement).value as 'm' | 'ft')} class={sel}><option value="m">m</option><option value="ft">ft</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Temperature</span>
          <div class="flex gap-1"><input type="number" step="any" value={temp} onInput={(e) => setTemp((e.target as HTMLInputElement).value)} class={inp} />
            <select value={tUnit} onChange={(e) => setTUnit((e.target as HTMLSelectElement).value as 'C' | 'F')} class={sel}><option value="C">°C</option><option value="F">°F</option></select></div></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Sea-level pressure</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.hpa)} <span class="text-lg text-slate-500">hPa</span></p><p class="mt-1 text-xs text-slate-400">{fmt(r.inHg, 2)} inHg · {r.diff >= 0 ? '+' : ''}{fmt(r.diff)} hPa correction</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Reading</p><p class="mt-1 text-lg font-bold text-slate-700">{r.hpa >= 1013.25 ? 'Higher than standard (fair)' : 'Lower than standard (unsettled)'}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter station pressure, altitude and temperature.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Barometers read the actual (station) pressure, which is lower at altitude. To compare readings between places, weather services reduce them to sea level: P₀ = P × (1 − 0.0065·h / (T + 0.0065·h + 273.15))⁻⁵·²⁵⁷. Standard sea-level pressure is 1013.25 hPa (29.92 inHg). 🔒 In your browser.</p>
    </div>
  );
}
