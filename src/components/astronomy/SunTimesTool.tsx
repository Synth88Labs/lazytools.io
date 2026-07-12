import { useMemo, useState } from 'preact/hooks';
import { sunTimes } from '../../lib/astronomy';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function hm(min: number | null): string {
  if (min == null) return '—';
  let m = ((min % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60), mm = Math.round(m % 60);
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
const CITIES: { name: string; lat: number; lon: number; tz: number }[] = [
  { name: 'New York', lat: 40.7128, lon: -74.006, tz: -5 },
  { name: 'London', lat: 51.5074, lon: -0.1278, tz: 0 },
  { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, tz: -8 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, tz: 11 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, tz: 9 },
  { name: 'Delhi', lat: 28.6139, lon: 77.209, tz: 5.5 },
];

export default function SunTimesTool() {
  const [dateStr, setDateStr] = useState(todayStr());
  const [lat, setLat] = useState('40.71');
  const [lon, setLon] = useState('-74.01');
  const [tz, setTz] = useState(String(-new Date().getTimezoneOffset() / 60));

  const r = useMemo(() => {
    const la = num(lat), lo = num(lon), t = num(tz);
    if (la == null || lo == null || t == null) return null;
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return null;
    return sunTimes(y, m, d, la, lo, t);
  }, [dateStr, lat, lon, tz]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

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

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-4">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">🌅 Sunrise</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{hm(r.sunriseMin)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">☀️ Solar noon</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{hm(r.solarNoonMin)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">🌇 Sunset</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{hm(r.sunsetMin)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Day length</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.dayLengthMin != null ? `${Math.floor(r.dayLengthMin / 60)}h ${Math.round(r.dayLengthMin % 60)}m` : '—'}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a date, latitude, longitude and UTC offset.</p>
      )}
      {r && (r.sunriseMin == null) && <p class="mt-2 text-center text-sm text-amber-600">Polar day or night — the sun doesn't rise or set at this latitude on this date.</p>}

      <p class="mt-4 text-xs text-slate-500">Times are local clock time, from the NOAA solar-position algorithm (using a 90.833° zenith to account for refraction and the sun's radius). Longitude is positive for east. Set the UTC offset for the date (remember daylight saving). Accurate to about a minute. 🔒 In your browser.</p>
    </div>
  );
}
