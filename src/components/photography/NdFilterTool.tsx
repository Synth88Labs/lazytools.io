import { useMemo, useState } from 'preact/hooks';
import { ndShutter } from '../../lib/photography';

// Common base shutter speeds (seconds) as label→value.
const SHUTTERS: { label: string; sec: number }[] = [
  { label: '1/1000', sec: 1 / 1000 }, { label: '1/500', sec: 1 / 500 }, { label: '1/250', sec: 1 / 250 },
  { label: '1/125', sec: 1 / 125 }, { label: '1/60', sec: 1 / 60 }, { label: '1/30', sec: 1 / 30 },
  { label: '1/15', sec: 1 / 15 }, { label: '1/8', sec: 1 / 8 }, { label: '1/4', sec: 1 / 4 },
  { label: '1/2', sec: 1 / 2 }, { label: '1s', sec: 1 }, { label: '2s', sec: 2 }, { label: '4s', sec: 4 },
];
const NDS = [1, 2, 3, 4, 5, 6, 8, 9, 10, 13, 15, 16, 20];

function fmtTime(sec: number): string {
  if (sec < 1) return `1/${Math.round(1 / sec)} s`;
  if (sec < 60) return `${Number(sec.toFixed(1))} s`;
  const m = Math.floor(sec / 60), s = Math.round(sec % 60);
  return `${m} min ${s} s`;
}

export default function NdFilterTool() {
  const [baseIdx, setBaseIdx] = useState(4); // 1/60
  const [stops, setStops] = useState(10);

  const r = useMemo(() => {
    const base = SHUTTERS[baseIdx].sec;
    const t = ndShutter(base, stops);
    return t == null ? null : { t };
  }, [baseIdx, stops]);

  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Metered shutter (no filter)</span>
          <select value={baseIdx} onChange={(e) => setBaseIdx(parseInt((e.target as HTMLSelectElement).value, 10))} class={sel}>{SHUTTERS.map((s, i) => <option value={i}>{s.label}</option>)}</select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">ND filter strength (stops)</span>
          <select value={stops} onChange={(e) => setStops(parseInt((e.target as HTMLSelectElement).value, 10))} class={sel}>{NDS.map((n) => <option value={n}>{n}-stop (ND{Math.pow(2, n).toLocaleString()})</option>)}</select></label>
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-5 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">New shutter time with the ND filter</p>
          <p class="mt-1 text-4xl font-extrabold text-brand-800">{fmtTime(r.t)}</p>
          <p class="mt-1 text-xs text-slate-400">{stops} stops = ×{Math.pow(2, stops).toLocaleString()} longer</p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Pick a base shutter and ND strength.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">A neutral-density filter cuts light so you can use a longer shutter for motion blur (silky water, cloud streaks) in daylight. Each stop doubles the exposure time, so new time = metered time × 2^stops — a 10-stop ND (ND1000) turns 1/60 s into about 17 seconds. Beyond ~30 s you\'ll need bulb mode and a remote. 🔒 In your browser.</p>
    </div>
  );
}
