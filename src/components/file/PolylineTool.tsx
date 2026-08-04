import { useMemo, useState } from 'preact/hooks';
import { encodePolyline, decodePolyline, polylineToGeoJSON, type LatLng } from '../../lib/polyline';

export default function PolylineTool() {
  const [mode, setMode] = useState<'decode' | 'encode'>('decode');
  const [precision, setPrecision] = useState<5 | 6>(5);
  const [enc, setEnc] = useState('_p~iF~ps|U_ulLnnqC_mqNvxq`@');
  const [coordsText, setCoordsText] = useState('38.5, -120.2\n40.7, -120.95\n43.252, -126.453');

  const decoded = useMemo(() => {
    if (mode !== 'decode' || !enc.trim()) return null;
    try {
      const pts = decodePolyline(enc.trim(), precision);
      const list = pts.map(([lat, lng]) => `${lat}, ${lng}`).join('\n');
      const geojson = JSON.stringify(polylineToGeoJSON(pts), null, 2);
      return { list, geojson, count: pts.length, error: null as string | null };
    } catch (e) { return { list: '', geojson: '', count: 0, error: e instanceof Error ? e.message : 'Could not decode' }; }
  }, [mode, enc, precision]);

  const encoded = useMemo(() => {
    if (mode !== 'encode' || !coordsText.trim()) return null;
    try {
      const pts: LatLng[] = coordsText.trim().split(/\r?\n/).filter((l) => l.trim()).map((line, i) => {
        const parts = line.split(/[,\s]+/).map(Number).filter((n) => !Number.isNaN(n));
        if (parts.length < 2) throw new Error(`Line ${i + 1}: expected "lat, lng".`);
        return [parts[0]!, parts[1]!] as LatLng;
      });
      return { str: encodePolyline(pts, precision), count: pts.length, error: null as string | null };
    } catch (e) { return { str: '', count: 0, error: e instanceof Error ? e.message : 'Could not encode' }; }
  }, [mode, coordsText, precision]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const copy = (v: string) => navigator.clipboard?.writeText(v);
  const err = decoded?.error || encoded?.error;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap items-center gap-3">
        <div class="inline-flex rounded-xl bg-slate-200 p-1 text-sm font-semibold">
          <button onClick={() => setMode('decode')} class={`rounded-lg px-3 py-1 ${mode === 'decode' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Decode</button>
          <button onClick={() => setMode('encode')} class={`rounded-lg px-3 py-1 ${mode === 'encode' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Encode</button>
        </div>
        <label class="text-sm text-slate-600">Precision
          <select class="ml-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" value={String(precision)} onChange={(e) => setPrecision(Number((e.target as HTMLSelectElement).value) as 5 | 6)}>
            <option value="5">5 (Google default)</option>
            <option value="6">6 (high precision)</option>
          </select>
        </label>
      </div>

      {mode === 'decode' ? (
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Encoded polyline</span>
          <textarea rows={2} class={inp} value={enc} onInput={(e) => setEnc((e.target as HTMLTextAreaElement).value)} placeholder="_p~iF~ps|U…" />
        </label>
      ) : (
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Coordinates (one "lat, lng" per line)</span>
          <textarea rows={5} class={inp} value={coordsText} onInput={(e) => setCoordsText((e.target as HTMLTextAreaElement).value)} placeholder={'38.5, -120.2\n40.7, -120.95'} />
        </label>
      )}

      {err && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">⚠️ {err}</p>}

      {mode === 'decode' && decoded && !decoded.error && (
        <div class="mt-4 space-y-3">
          <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <div class="mb-1 flex items-center justify-between"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{decoded.count} points (lat, lng)</p><button onClick={() => copy(decoded.list)} class="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300">Copy</button></div>
            <pre class="max-h-52 overflow-auto whitespace-pre-wrap break-all font-mono text-xs text-slate-800">{decoded.list}</pre>
          </div>
          <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <div class="mb-1 flex items-center justify-between"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">GeoJSON LineString</p><button onClick={() => copy(decoded.geojson)} class="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300">Copy</button></div>
            <pre class="max-h-52 overflow-auto font-mono text-xs text-slate-800">{decoded.geojson}</pre>
          </div>
        </div>
      )}

      {mode === 'encode' && encoded && !encoded.error && (
        <div class="mt-4 rounded-xl bg-white p-4 ring-1 ring-slate-200">
          <div class="mb-1 flex items-center justify-between"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Encoded polyline ({encoded.count} points)</p><button onClick={() => copy(encoded.str)} class="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300">Copy</button></div>
          <p class="break-all font-mono text-sm text-brand-800">{encoded.str}</p>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Encode a list of latitude/longitude points into a Google-encoded polyline string, or decode one back into coordinates (and GeoJSON). It&#39;s the compact format the Google Maps Directions API returns for routes. Remember polyline order is latitude, longitude — the reverse of GeoJSON&#39;s. Use precision 6 for the higher-precision variant some services use. Everything runs in your browser. 🔒</p>
    </div>
  );
}
