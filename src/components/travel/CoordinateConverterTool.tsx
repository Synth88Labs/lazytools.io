import { useMemo, useState } from 'preact/hooks';
import { parseCoord, toDMS, toDDM, llToUtm, utmToMgrs, utmString, geohashEncode, geohashDecode } from '../../lib/coords';

type Mode = 'latlon' | 'geohash';

export default function CoordinateConverterTool() {
  const [mode, setMode] = useState<Mode>('latlon');
  const [latStr, setLatStr] = useState('51.5074');
  const [lonStr, setLonStr] = useState('-0.1278');
  const [geohashStr, setGeohashStr] = useState('gcpvj0duq');

  const { lat, lon, error } = useMemo(() => {
    try {
      if (mode === 'geohash') {
        const g = geohashStr.trim();
        if (!g) return { lat: null, lon: null, error: '' };
        const d = geohashDecode(g);
        return { lat: d.lat, lon: d.lon, error: '' };
      }
      const la = parseCoord(latStr), lo = parseCoord(lonStr);
      if (la == null || lo == null) return { lat: null, lon: null, error: '' };
      if (la < -90 || la > 90) return { lat: null, lon: null, error: 'Latitude must be between −90° and 90°.' };
      if (lo < -180 || lo > 180) return { lat: null, lon: null, error: 'Longitude must be between −180° and 180°.' };
      return { lat: la, lon: lo, error: '' };
    } catch (e) { return { lat: null, lon: null, error: (e as Error).message }; }
  }, [mode, latStr, lonStr, geohashStr]);

  const out = useMemo(() => {
    if (lat == null || lon == null) return null;
    try {
      const dd = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
      const dms = `${toDMS(lat, true)} ${toDMS(lon, false)}`;
      const ddm = `${toDDM(lat, true)} ${toDDM(lon, false)}`;
      let utm = '—', mgrs = '—';
      if (lat >= -80 && lat <= 84) {
        const u = llToUtm(lat, lon);
        utm = utmString(u);
        mgrs = utmToMgrs(u);
      }
      const gh = geohashEncode(lat, lon, 11);
      return { dd, dms, ddm, utm, mgrs, gh };
    } catch { return null; }
  }, [lat, lon]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const copy = (v: string) => navigator.clipboard?.writeText(v);
  const row = (label: string, value: string) => (
    <div class="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 first:border-t-0">
      <div class="min-w-0">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p class="mt-0.5 break-all font-mono text-sm text-slate-800">{value}</p>
      </div>
      <button onClick={() => copy(value)} class="shrink-0 rounded-lg bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300">Copy</button>
    </div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 inline-flex rounded-xl bg-slate-200 p-1 text-sm font-semibold">
        <button onClick={() => setMode('latlon')} class={`rounded-lg px-3 py-1 ${mode === 'latlon' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Lat / Lon</button>
        <button onClick={() => setMode('geohash')} class={`rounded-lg px-3 py-1 ${mode === 'geohash' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Geohash</button>
      </div>

      {mode === 'latlon' ? (
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Latitude (DD, DMS or DDM)</span><input class={inp} value={latStr} onInput={(e) => setLatStr((e.target as HTMLInputElement).value)} placeholder={`51.5074 or 51°30'26"N`} /></label>
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Longitude</span><input class={inp} value={lonStr} onInput={(e) => setLonStr((e.target as HTMLInputElement).value)} placeholder={`-0.1278 or 0°7'40"W`} /></label>
        </div>
      ) : (
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Geohash</span><input class={inp} value={geohashStr} onInput={(e) => setGeohashStr((e.target as HTMLInputElement).value)} placeholder="gcpvj0duq" /></label>
      )}

      {error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{error}</p>}

      {out && (
        <div class="mt-4 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
          {row('Decimal degrees (DD)', out.dd)}
          {row('Degrees minutes seconds (DMS)', out.dms)}
          {row('Degrees decimal minutes (DDM)', out.ddm)}
          {row('UTM', out.utm)}
          {row('MGRS', out.mgrs)}
          {row('Geohash', out.gh)}
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Converts a WGS-84 location between decimal degrees, DMS, DDM, UTM, MGRS and geohash. UTM/MGRS use the Karney Transverse Mercator series (sub-millimetre) and are defined between 80°S and 84°N; geohash length 11 pins a spot to about a metre. Paste coordinates in any degree format (51.5074, 51°30′26″N, or 51 30 26 N) or switch to geohash to decode one. 🔒 All math runs in your browser, your location is never sent anywhere.</p>
    </div>
  );
}
