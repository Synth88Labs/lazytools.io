import { useMemo, useState } from 'preact/hooks';
import { parseColor, rgbToHex, type RGB } from '../../lib/color-compute';
import { rgbToLab, deltaE2000 } from '../../lib/color-advanced';
import { CSS_COLOR_NAMES } from '../../lib/css-color-names';
import ColorSwatchInput from './ColorSwatchInput';

// precompute Lab for the named set once
const NAMED = CSS_COLOR_NAMES.map((c) => ({ ...c, rgb: parseColor(c.hex)!, lab: rgbToLab(parseColor(c.hex)!) }));
// de-dup exact hex aliases (aqua/cyan, magenta/fuchsia) — keep both names shown when identical
function nearest(rgb: RGB, n = 5) {
  const lab = rgbToLab(rgb);
  return NAMED
    .map((c) => ({ ...c, dE: deltaE2000(lab, c.lab) }))
    .sort((a, b) => a.dE - b.dE)
    .slice(0, n);
}

export default function ColorNameTool() {
  const [raw, setRaw] = useState('#4a90d9');
  const rgb = useMemo(() => parseColor(raw), [raw]);
  const matches = useMemo(() => (rgb ? nearest(rgb, 6) : []), [rgb]);
  const best = matches[0];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Color — HEX, RGB or HSL</span>
        <div class="flex items-center gap-2">
          <ColorSwatchInput rgb={rgb} onPick={setRaw} size="lg" />
          <input value={raw} spellcheck={false} onInput={(e) => setRaw((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </div>
      </label>

      {best ? (
        <>
          <div class="mt-4 flex items-center gap-4 rounded-xl bg-white p-4 ring-2 ring-brand-200">
            <div class="h-16 w-16 shrink-0 rounded-lg ring-1 ring-slate-300" style={`background:${best.hex}`} />
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Closest CSS color name</p>
              <p class="text-2xl font-extrabold text-brand-800">{best.name}</p>
              <p class="font-mono text-xs text-slate-500">{best.hex} · ΔE {best.dE.toFixed(2)} {best.dE < 1 ? '(exact match)' : best.dE < 2.3 ? '(barely distinguishable)' : ''}</p>
            </div>
          </div>

          <p class="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Other near matches</p>
          <div class="mt-2 grid gap-2 sm:grid-cols-2">
            {matches.slice(1).map((m) => (
              <div class="flex items-center gap-3 rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200">
                <span class="h-8 w-8 shrink-0 rounded ring-1 ring-slate-300" style={`background:${m.hex}`} />
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-slate-800">{m.name}</p>
                  <p class="font-mono text-xs text-slate-400">{m.hex}</p>
                </div>
                <span class="shrink-0 font-mono text-xs text-slate-500">ΔE {m.dE.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a valid color (HEX, RGB or HSL) to find its nearest CSS color name.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Nearest of the {CSS_COLOR_NAMES.length} CSS Color 4 named colors by CIEDE2000 (ΔE00) perceptual distance — a chatbot guesses; this measures. 🔒 Computed in your browser.
      </p>
    </div>
  );
}
