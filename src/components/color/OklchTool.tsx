import { useMemo, useState } from 'preact/hooks';
import { parseColor, rgbToHex, rgbToHsl, type RGB } from '../../lib/color-compute';
import {
  rgbToOklch, rgbToOklab, rgbToLab, labToLch, rgbToHwb,
  oklchToRgb, oklabToRgb,
  fmtOklch, fmtOklab, fmtLab, fmtLch,
} from '../../lib/color-advanced';

type Dir = 'hex-to-oklch' | 'oklch-to-hex' | 'rgb-to-oklch';

function Row({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div class="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200">
      <span class="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <code class="flex-1 truncate text-right font-mono text-sm text-slate-900">{value}</code>
      <button
        onClick={() => { navigator.clipboard?.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1200); }}
        class="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200 transition hover:bg-brand-50"
      >{copied ? '✓' : 'Copy'}</button>
    </div>
  );
}

export default function OklchTool({ dir = 'hex-to-oklch' as Dir }: { dir?: Dir }) {
  const initial = dir === 'oklch-to-hex' ? 'oklch(62.8% 0.2577 29.2)' : dir === 'rgb-to-oklch' ? 'rgb(29, 135, 241)' : '#1d87f1';
  const [raw, setRaw] = useState(initial);

  const parsed = useMemo(() => parseOklchOrColor(raw), [raw]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Color — HEX, RGB, HSL or oklch()
        </span>
        <input
          value={raw} spellcheck={false}
          onInput={(e) => setRaw((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>

      {parsed ? (
        <>
          <div class="mt-4 flex items-center gap-4">
            <div class="h-20 w-32 shrink-0 rounded-xl ring-1 ring-slate-300" style={`background:${rgbToHex(parsed.rgb)}`} />
            <div>
              <p class="font-mono text-lg font-bold text-slate-900">{rgbToHex(parsed.rgb)}</p>
              {!parsed.inGamut && (
                <p class="mt-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                  ⚠ Out of sRGB gamut — chroma reduced for this HEX fallback
                </p>
              )}
            </div>
          </div>

          <div class="mt-4 space-y-2">
            <Row label="OKLCH" value={fmtOklch(rgbToOklch(parsed.rgb))} />
            <Row label="OKLAB" value={fmtOklab(rgbToOklab(parsed.rgb))} />
            <Row label="LAB" value={fmtLab(rgbToLab(parsed.rgb))} />
            <Row label="LCH" value={fmtLch(labToLch(rgbToLab(parsed.rgb)))} />
            <Row label="HWB" value={hwbStr(parsed.rgb)} />
            <Row label="HEX" value={rgbToHex(parsed.rgb)} />
            <Row label="RGB" value={`rgb(${parsed.rgb.r}, ${parsed.rgb.g}, ${parsed.rgb.b})`} />
            <Row label="HSL" value={hslStr(parsed.rgb)} />
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">
          Enter a color as HEX (#1d87f1), rgb(…), hsl(…) or oklch(L% C H) — e.g. <code class="font-mono">oklch(62.8% 0.2577 29.2)</code>.
        </p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Exact OKLab matrices (Björn Ottosson) + CIE XYZ/LAB (D65). Out-of-gamut OKLCH colors are chroma-mapped along constant L and H. 🔒 Computed in your browser.
      </p>
    </div>
  );
}

function hslStr(rgb: RGB): string {
  const { h, s, l } = rgbToHsl(rgb);
  return `hsl(${h}, ${s}%, ${l}%)`;
}
function hwbStr(rgb: RGB): string {
  const { h, w, b } = rgbToHwb(rgb);
  return `hwb(${h} ${w}% ${b}%)`;
}

/** Parse either a standard color OR an oklch()/oklab() string; return sRGB + gamut flag. */
function parseOklchOrColor(input: string): { rgb: RGB; inGamut: boolean } | null {
  const s = input.trim().toLowerCase();
  const ok = s.match(/^oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)/);
  if (ok) {
    let L = parseFloat(ok[1]!);
    if (s.includes('%')) L /= 100;
    else if (L > 1.5) L /= 100; // tolerate "62.8 …" without %
    const C = parseFloat(ok[2]!), h = parseFloat(ok[3]!);
    return oklchToRgb({ L, C, h });
  }
  const olab = s.match(/^oklab\(\s*([\d.]+)%?\s+(-?[\d.]+)\s+(-?[\d.]+)/);
  if (olab) {
    let L = parseFloat(olab[1]!);
    if (s.includes('%')) L /= 100;
    else if (L > 1.5) L /= 100;
    return oklabToRgb({ L, a: parseFloat(olab[2]!), b: parseFloat(olab[3]!) });
  }
  const rgb = parseColor(input);
  return rgb ? { rgb, inGamut: true } : null;
}
