import { useMemo, useState } from 'preact/hooks';
import { sunWindows, fmtMin } from '../../lib/astronomy-extra';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const CITIES: { name: string; lat: number; lon: number; tz: number }[] = [
  { name: 'New York', lat: 40.7128, lon: -74.006, tz: -5 },
  { name: 'London', lat: 51.5074, lon: -0.1278, tz: 0 },
  { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, tz: -8 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, tz: 11 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, tz: 9 },
  { name: 'Reykjavík', lat: 64.1466, lon: -21.9426, tz: 0 },
];

export default function GoldenHourTool() {
  const [dateStr, setDateStr] = useState(todayStr());
  const [lat, setLat] = useState('40.71');
  const [lon, setLon] = useState('-74.01');
  const [tz, setTz] = useState(String(-new Date().getTimezoneOffset() / 60));

  const w = useMemo(() => {
    const la = num(lat), lo = num(lon), t = num(tz);
    if (la == null || lo == null || t == null) return null;
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return null;
    return sunWindows(y, m, d, la, lo, t);
  }, [dateStr, lat, lon, tz]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const range = (a: [number | null, number | null]) => `${fmtMin(a[0])} – ${fmtMin(a[1])}`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-1.5">
        {CITIES.map((c) => (
          <button onClick={() => { setLat(String(c.lat)); setLon(String(c.lon)); setTz(String(c.tz)); }} class="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300">{c.name}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Date</span>
          <input type="date" value={dateStr} onInput={(e) => setDateStr((e.target as HTMLInputElement).value)} class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900" /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Latitude</span>
          <input type="number" step="any" value={lat} onInput={(e) => setLat((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Longitude (E+)</span>
          <input type="number" step="any" value={lon} onInput={(e) => setLon((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">UTC offset (h)</span>
          <input type="number" step="0.5" value={tz} onInput={(e) => setTz((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {w ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-amber-50 p-4 ring-2 ring-amber-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Morning — golden hour</p>
              <p class="mt-1 text-2xl font-extrabold text-amber-800">{range(w.goldenAm)}</p>
              <p class="mt-1 text-xs text-slate-500">Blue hour {range(w.blueAm)} · sunrise {fmtMin(w.sunrise)}</p>
            </div>
            <div class="rounded-xl bg-orange-50 p-4 ring-2 ring-orange-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-orange-700">Evening — golden hour</p>
              <p class="mt-1 text-2xl font-extrabold text-orange-800">{range(w.goldenPm)}</p>
              <p class="mt-1 text-xs text-slate-500">Sunset {fmtMin(w.sunset)} · blue hour {range(w.bluePm)}</p>
            </div>
          </div>
          <div class="mt-3 overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200">
            <table class="w-full min-w-[420px] text-sm">
              <thead><tr class="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"><th class="px-4 py-2">Twilight</th><th class="px-4 py-2 text-right">Dawn</th><th class="px-4 py-2 text-right">Dusk</th></tr></thead>
              <tbody>
                <tr class="border-b border-slate-100"><td class="px-4 py-2 text-slate-700">Civil (−6°)</td><td class="px-4 py-2 text-right font-mono">{fmtMin(w.civilDawn)}</td><td class="px-4 py-2 text-right font-mono">{fmtMin(w.civilDusk)}</td></tr>
                <tr class="border-b border-slate-100"><td class="px-4 py-2 text-slate-700">Nautical (−12°)</td><td class="px-4 py-2 text-right font-mono">{fmtMin(w.nauticalDawn)}</td><td class="px-4 py-2 text-right font-mono">{fmtMin(w.nauticalDusk)}</td></tr>
                <tr><td class="px-4 py-2 text-slate-700">Astronomical (−18°)</td><td class="px-4 py-2 text-right font-mono">{fmtMin(w.astroDawn)}</td><td class="px-4 py-2 text-right font-mono">{fmtMin(w.astroDusk)}</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Pick a city, or enter a date, latitude, longitude and UTC offset.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Times are local (24-hour), computed with the NOAA solar-position algorithm. Golden hour is when the sun sits between about −4° and +6° — warm, soft, directional light; blue hour is the −6° to −4° window of cool twilight. A dash means the sun never reaches that elevation that day (e.g. no true night in high-latitude summer). Enter east longitude as positive and your UTC offset (including DST). 🔒 In your browser.</p>
    </div>
  );
}
