import { useMemo, useState } from 'preact/hooks';
import { solarTilt } from '../../lib/solar';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && Math.abs(n) <= 90 ? n : null; };
const fmt = (x: number) => `${Number(x.toFixed(1))}°`;

export default function PanelTiltTool() {
  const [lat, setLat] = useState('40');

  const r = useMemo(() => {
    const l = num(lat);
    return l == null ? null : solarTilt(l);
  }, [lat]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block sm:w-64"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Your latitude (degrees)</span>
        <input type="number" step="any" value={lat} onInput={(e) => setLat((e.target as HTMLInputElement).value)} class={inp} /></label>
      <p class="mt-1 text-xs text-slate-400">Positive for the northern hemisphere, negative for southern — the tilt is the same magnitude.</p>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Year-round (fixed)</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.yearRound)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Summer</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.summer)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Winter</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.winter)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a latitude between −90 and 90.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Tilt is measured from horizontal (0° = flat, 90° = vertical), with panels facing the equator (south in the northern hemisphere, north in the southern). A good fixed year-round angle is close to your latitude; steepen it by about 15° for winter and flatten it by 15° for summer, or adjust seasonally if your mounts allow. Local shading, snow and roof pitch matter too. 🔒 In your browser.</p>
    </div>
  );
}
