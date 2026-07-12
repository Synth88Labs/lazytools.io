import { useMemo, useState } from 'preact/hooks';
import { rgbToHex } from '../../lib/color-compute';
import { kelvinToRgb } from '../../lib/color-advanced';

const PRESETS: [string, number][] = [['Candle', 1900], ['Incandescent', 2700], ['Halogen', 3200], ['Fluorescent', 4000], ['Daylight', 5600], ['Overcast', 6500], ['Shade / blue sky', 8000]];

export default function ColorTempTool() {
  const [k, setK] = useState(6500);

  const res = useMemo(() => {
    const rgb = kelvinToRgb(k);
    return { rgb, hex: rgbToHex(rgb) };
  }, [k]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Colour temperature: {k.toLocaleString()} K</span>
        <input type="range" min="1000" max="12000" step="50" value={k} onInput={(e) => setK(Number((e.target as HTMLInputElement).value))} class="w-full" />
      </label>
      <div class="mt-2 flex flex-wrap gap-1.5">
        {PRESETS.map(([l, v]) => <button onClick={() => setK(v)} class="rounded-lg border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-600 hover:border-brand-400">{l} ({v}K)</button>)}
      </div>

      <div class="mt-4 flex items-center gap-4">
        <div class="h-24 w-24 shrink-0 rounded-xl ring-1 ring-slate-300" style={`background:${res.hex}`}></div>
        <div class="font-mono text-sm">
          <p class="text-2xl font-extrabold text-brand-800">{res.hex}</p>
          <p class="mt-1 text-slate-600">rgb({res.rgb.r}, {res.rgb.g}, {res.rgb.b})</p>
          <p class="mt-1 text-xs text-slate-500">{k <= 3500 ? 'Warm (orange/yellow)' : k <= 5000 ? 'Neutral white' : 'Cool (blue-white)'}</p>
        </div>
      </div>

      <p class="mt-4 text-xs text-slate-500">Colour temperature describes the colour of light on the Kelvin scale: low values are warm and orange (candlelight ~1900 K), around 5000–6500 K is neutral daylight white, and higher values are cool and blue. This converts a temperature to an approximate on-screen sRGB colour using the widely-used Tanner Helland approximation — a visual guide, not a calibrated blackbody spectrum. 🔒 In your browser.</p>
    </div>
  );
}
