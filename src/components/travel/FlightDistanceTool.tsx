import { useMemo, useState } from 'preact/hooks';
import { haversineKm, initialBearing, compassPoint, flightTimeMinutes, hoursMinutes, KM_PER_MILE, KM_PER_NM, type Coord } from '../../lib/travel';

/** A few well-known airports/cities so people can try it without hunting coordinates. */
const PRESETS: { label: string; lat: number; lon: number }[] = [
  { label: 'New York (JFK)', lat: 40.6413, lon: -73.7781 },
  { label: 'London (LHR)', lat: 51.4700, lon: -0.4543 },
  { label: 'Los Angeles (LAX)', lat: 33.9416, lon: -118.4085 },
  { label: 'Tokyo (HND)', lat: 35.5494, lon: 139.7798 },
  { label: 'Dubai (DXB)', lat: 25.2532, lon: 55.3657 },
  { label: 'Sydney (SYD)', lat: -33.9399, lon: 151.1753 },
  { label: 'Paris (CDG)', lat: 49.0097, lon: 2.5479 },
  { label: 'Singapore (SIN)', lat: 1.3644, lon: 103.9915 },
  { label: 'São Paulo (GRU)', lat: -23.4356, lon: -46.4731 },
  { label: 'Johannesburg (JNB)', lat: -26.1392, lon: 28.2460 },
];

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { maximumFractionDigits: d });

/** Equirectangular projection to an SVG viewBox of 360×180 (lon→x, lat→y). */
const proj = (lon: number, lat: number): [number, number] => [(lon + 180) * (360 / 360), (90 - lat) * (180 / 180)];

export default function FlightDistanceTool() {
  const [a, setA] = useState<Coord>({ lat: 40.6413, lon: -73.7781 });
  const [b, setB] = useState<Coord>({ lat: 51.4700, lon: -0.4543 });

  const r = useMemo(() => {
    if ([a.lat, a.lon, b.lat, b.lon].some((v) => !isFinite(v))) return null;
    if (Math.abs(a.lat) > 90 || Math.abs(b.lat) > 90 || Math.abs(a.lon) > 180 || Math.abs(b.lon) > 180) return null;
    const km = haversineKm(a, b);
    const brg = initialBearing(a, b);
    const ft = flightTimeMinutes(km);
    return { km, mi: km / KM_PER_MILE, nm: km / KM_PER_NM, brg, compass: compassPoint(brg), ft: hoursMinutes(ft) };
  }, [a, b]);

  const setPreset = (which: 'a' | 'b', idx: number) => {
    const p = PRESETS[idx];
    if (!p) return;
    (which === 'a' ? setA : setB)({ lat: p.lat, lon: p.lon });
  };

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  const [pa, pb] = r ? [proj(a.lon, a.lat), proj(b.lon, b.lat)] : [null, null];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-2">
        {(['a', 'b'] as const).map((which) => {
          const c = which === 'a' ? a : b;
          const set = which === 'a' ? setA : setB;
          return (
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{which === 'a' ? 'From' : 'To'}</p>
              <select class={sel} onChange={(e) => setPreset(which, (e.target as HTMLSelectElement).selectedIndex - 1)}>
                <option>Pick a city…</option>
                {PRESETS.map((p) => <option>{p.label}</option>)}
              </select>
              <div class="mt-2 grid grid-cols-2 gap-2">
                <label class="block"><span class="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Latitude</span>
                  <input type="number" step="any" value={c.lat} onInput={(e) => { const v = num((e.target as HTMLInputElement).value); if (v != null) set({ ...c, lat: v }); }} class={inp} /></label>
                <label class="block"><span class="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Longitude</span>
                  <input type="number" step="any" value={c.lon} onInput={(e) => { const v = num((e.target as HTMLInputElement).value); if (v != null) set({ ...c, lon: v }); }} class={inp} /></label>
              </div>
            </div>
          );
        })}
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Great-circle distance</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.km)} km</p><p class="mt-0.5 text-sm text-slate-500">{fmt(r.mi)} mi · {fmt(r.nm)} nm</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Initial bearing</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.brg, 0)}° {r.compass}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Rough flight time</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.ft.h} h {r.ft.m} m</p></div>
          </div>

          <div class="mt-4 overflow-hidden rounded-xl bg-[#0c2f6b] ring-1 ring-slate-300">
            <svg viewBox="0 0 360 180" class="h-auto w-full" role="img" aria-label="World map with a line between the two points">
              <rect width="360" height="180" fill="#0c2f6b" />
              {/* faint graticule */}
              {[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((x) => <line x1={x} y1="0" x2={x} y2="180" stroke="#ffffff" stroke-opacity="0.06" stroke-width="0.5" />)}
              {[30, 60, 90, 120, 150].map((y) => <line x1="0" y1={y} x2="360" y2={y} stroke="#ffffff" stroke-opacity="0.06" stroke-width="0.5" />)}
              <line x1="0" y1="90" x2="360" y2="90" stroke="#ffffff" stroke-opacity="0.14" stroke-width="0.6" />
              {pa && pb && (
                <>
                  <line x1={pa[0]} y1={pa[1]} x2={pb[0]} y2={pb[1]} stroke="#7ef0c0" stroke-width="1.4" stroke-dasharray="3 2" />
                  <circle cx={pa[0]} cy={pa[1]} r="2.6" fill="#fbbf24" />
                  <circle cx={pb[0]} cy={pb[1]} r="2.6" fill="#f87171" />
                </>
              )}
            </svg>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Pick two cities, or enter valid latitudes (−90 to 90) and longitudes (−180 to 180).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">This is the <strong>great-circle (straight-line)</strong> distance — the shortest path over a spherical Earth (mean radius 6,371 km). Real flights are longer because of airways, air-traffic routing and winds, so the flight time (distance ÷ ~830 km/h cruise + ~30 min for taxi/climb/descent) is a rough estimate only. 🔒 In your browser.</p>
    </div>
  );
}
