import { useMemo, useState } from 'preact/hooks';
import { sunny16Shutter } from '../../lib/photography';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
function fmtShutter(sec: number): string {
  if (sec >= 1) return `${Number(sec.toFixed(1))} s`;
  return `1/${Math.round(1 / sec)} s`;
}
// EV adjustment relative to bright sun (Sunny 16) for each condition
const CONDITIONS: { id: string; label: string; ev: number; aperture: number }[] = [
  { id: 'snow', label: 'Snow / bright sand', ev: -1, aperture: 22 },
  { id: 'sunny', label: 'Bright sun (Sunny 16)', ev: 0, aperture: 16 },
  { id: 'hazy', label: 'Hazy / soft shadows', ev: 1, aperture: 11 },
  { id: 'cloudy-bright', label: 'Cloudy bright', ev: 2, aperture: 8 },
  { id: 'overcast', label: 'Overcast / open shade', ev: 3, aperture: 5.6 },
  { id: 'heavy-overcast', label: 'Heavy overcast / sunset', ev: 4, aperture: 4 },
];

export default function Sunny16Tool() {
  const [iso, setIso] = useState('100');
  const [aperture, setAperture] = useState('16');

  const r = useMemo(() => {
    const i = num(iso), a = num(aperture);
    if (i == null || a == null) return null;
    return CONDITIONS.map((c) => ({ ...c, shutter: sunny16Shutter(i, a, c.ev) }));
  }, [iso, aperture]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">ISO</span>
          <input type="number" step="any" value={iso} onInput={(e) => setIso((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Your aperture (f/)</span>
          <input type="number" step="any" value={aperture} onInput={(e) => setAperture((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200">
          <table class="w-full text-sm">
            <thead><tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><th class="px-4 py-2">Light condition</th><th class="px-4 py-2">Rule aperture</th><th class="px-4 py-2 text-right">Shutter at f/{Number(aperture)}</th></tr></thead>
            <tbody>{r.map((c, i) => (
              <tr class={`${i % 2 ? 'bg-slate-50' : ''} ${c.id === 'sunny' ? 'bg-brand-50/60' : ''}`}>
                <td class="px-4 py-1.5 font-semibold text-slate-700">{c.label}</td>
                <td class="px-4 py-1.5 font-mono text-slate-500">f/{c.aperture}</td>
                <td class="px-4 py-1.5 text-right font-mono font-bold text-brand-800">{fmtShutter(c.shutter)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your ISO and aperture.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The Sunny 16 rule: in bright sun at f/16, the shutter is about 1⁄ISO seconds (ISO 100 → 1/100 s). The table adjusts that for softer light and your chosen aperture — a handy way to nail exposure without a meter. It measures incident light, so it\'s a starting point, not a substitute for metering. 🔒 In your browser.</p>
    </div>
  );
}
