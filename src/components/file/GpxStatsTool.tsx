import { useState } from 'preact/hooks';
import { parseGpxPoints, gpxStats, type GpxStats } from '../../lib/gpx';

const SAMPLE = `<?xml version="1.0"?>
<gpx version="1.1" creator="LazyTools">
  <trk><name>Morning ride</name><trkseg>
    <trkpt lat="51.5000" lon="-0.1000"><ele>12</ele><time>2024-05-01T07:00:00Z</time></trkpt>
    <trkpt lat="51.5090" lon="-0.1000"><ele>28</ele><time>2024-05-01T07:08:00Z</time></trkpt>
    <trkpt lat="51.5140" lon="-0.0820"><ele>19</ele><time>2024-05-01T07:19:00Z</time></trkpt>
    <trkpt lat="51.5205" lon="-0.0700"><ele>34</ele><time>2024-05-01T07:33:00Z</time></trkpt>
  </trkseg></trk>
</gpx>`;

function fmtDuration(s: number): string {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.round(s % 60);
  return h ? `${h}h ${m}m` : m ? `${m}m ${sec}s` : `${sec}s`;
}
const n1 = (x: number) => x.toLocaleString('en-US', { maximumFractionDigits: 1 });
const n2 = (x: number) => x.toLocaleString('en-US', { maximumFractionDigits: 2 });

export default function GpxStatsTool() {
  const [stats, setStats] = useState<GpxStats | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const analyze = (xml: string, label: string) => {
    setError('');
    try {
      const pts = parseGpxPoints(xml);
      if (!pts.length) { setError('No track points (<trkpt>) found in this GPX file.'); setStats(null); return; }
      setStats(gpxStats(pts));
      setName(label);
    } catch (e) {
      setError((e as Error).message); setStats(null);
    }
  };

  const onFile = async (f: File | null) => {
    if (!f) return;
    analyze(await f.text(), f.name);
  };

  const paceStr = (p: number) => `${Math.floor(p)}:${String(Math.round((p % 1) * 60)).padStart(2, '0')} /km`;

  const cell = (label: string, val: string, sub?: string) => (
    <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p class="mt-1 text-2xl font-extrabold text-slate-800">{val}</p>
      {sub && <p class="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap gap-2">
        <label class="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:border-brand-400">
          <input type="file" accept=".gpx,application/gpx+xml,text/xml" class="hidden" onChange={(e) => onFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
          📂 Choose a .gpx file
        </label>
        <button type="button" onClick={() => analyze(SAMPLE, 'sample-ride.gpx')} class="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-600 hover:border-brand-400 hover:text-brand-700">Try a sample</button>
      </div>
      <p class="mt-1 text-xs text-slate-500">Your file is read locally in the browser — GPX files contain your exact locations, so nothing is uploaded.</p>

      {error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{error}</p>}

      {stats && (
        <div class="mt-4">
          <p class="mb-2 text-sm font-semibold text-slate-700">{name} · {stats.points.toLocaleString()} track points</p>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cell('Distance', `${n2(stats.distanceKm)} km`, `${n2(stats.distanceMi)} mi`)}
            {cell('Elevation gain', `${Math.round(stats.elevGain).toLocaleString()} m`, `−${Math.round(stats.elevLoss).toLocaleString()} m loss`)}
            {stats.minEle != null && stats.maxEle != null && cell('Elevation range', `${Math.round(stats.minEle)}–${Math.round(stats.maxEle)} m`)}
            {stats.durationS != null && cell('Moving time', fmtDuration(stats.durationS), 'from first to last timestamp')}
            {stats.avgSpeedKmh != null && cell('Avg speed', `${n1(stats.avgSpeedKmh)} km/h`, `${n1(stats.avgSpeedKmh / 1.609344)} mph`)}
            {stats.avgPaceMinPerKm != null && cell('Avg pace', paceStr(stats.avgPaceMinPerKm), `${paceStr(stats.avgPaceMinPerKm * 1.609344).replace('/km', '/mi')}`)}
          </div>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Distances use the haversine formula on the WGS-84 mean Earth radius (great-circle distance between consecutive track points), and elevation gain/loss sums every up/down step. Speed and pace need timestamps in the file; a device that logs points sparsely will read slightly short on distance. 🔒 Everything is computed in your browser — your track (which reveals where you live, work and train) never leaves your device.</p>
    </div>
  );
}
