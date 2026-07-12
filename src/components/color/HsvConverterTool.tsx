import { useMemo, useState } from 'preact/hooks';
import { parseColor, rgbToHex, rgbToHsv } from '../../lib/color-compute';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function HsvConverterTool() {
  const [input, setInput] = useState('#1d87f1');

  const res = useMemo(() => {
    const rgb = parseColor(input);
    if (!rgb) return null;
    const hsv = rgbToHsv(rgb);
    return { rgb, hex: rgbToHex(rgb), hsv };
  }, [input]);

  const row = 'flex items-center justify-between rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Color (HEX, rgb(), or a name)</span>
        <div class="flex gap-2">
          <input value={input} onInput={(e) => setInput((e.target as HTMLInputElement).value)} class={inp} />
          {res && <input type="color" value={res.hex} onInput={(e) => setInput((e.target as HTMLInputElement).value)} class="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-300" />}
        </div>
      </label>

      {res ? (
        <>
          <div class="mt-4 h-16 rounded-xl ring-1 ring-slate-200" style={`background:${res.hex}`}></div>
          <div class="mt-3 space-y-2 font-mono text-sm">
            <div class={row}><span class="font-semibold text-brand-700">HSV / HSB</span><span>{Math.round(res.hsv.h)}°, {Math.round(res.hsv.s)}%, {Math.round(res.hsv.v)}%</span></div>
            <div class={row}><span class="text-slate-500">HEX</span><span>{res.hex}</span></div>
            <div class={row}><span class="text-slate-500">RGB</span><span>{res.rgb.r}, {res.rgb.g}, {res.rgb.b}</span></div>
          </div>
        </>
      ) : <p class="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 ring-1 ring-amber-200">Enter a valid color — e.g. #1d87f1, rgb(29,135,241) or "dodgerblue".</p>}

      <p class="mt-4 text-xs text-slate-500">HSV (also called HSB) describes a color by hue (0–360° around the color wheel), saturation (0–100%, how vivid) and value/brightness (0–100%, how light). It\'s the model most colour pickers use. HSV differs from HSL: in HSV, full value with full saturation is the pure vivid hue, while HSL\'s 100% lightness is always white. 🔒 In your browser.</p>
    </div>
  );
}
