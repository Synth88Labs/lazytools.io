import { useMemo, useState } from 'preact/hooks';
import { parseColor, rgbToHex, rgbToHsl, hslToRgb, contrastRatio, type RGB } from '../../lib/color-compute';
import ColorSwatchInput from './ColorSwatchInput';

const TARGETS = [
  { key: 'aa', label: 'AA normal (4.5:1)', ratio: 4.5 },
  { key: 'aa-large', label: 'AA large (3:1)', ratio: 3 },
  { key: 'aaa', label: 'AAA normal (7:1)', ratio: 7 },
] as const;

/** Search along HSL lightness (holding H,S) toward a direction for the nearest color meeting `target`. */
function findPassing(fg: RGB, bg: RGB, target: number, dir: 'lighter' | 'darker'): RGB | null {
  const { h, s } = rgbToHsl(fg);
  const start = rgbToHsl(fg).l;
  const end = dir === 'lighter' ? 100 : 0;
  // step by 1% lightness; return first that passes
  const step = dir === 'lighter' ? 1 : -1;
  for (let l = start; dir === 'lighter' ? l <= end : l >= end; l += step) {
    const cand = hslToRgb(h, s, l);
    if (contrastRatio(cand, bg) >= target) return cand;
  }
  return null;
}

function Swatch({ label, color, bg, ratio }: { label: string; color: RGB; bg: RGB; ratio: number }) {
  const hex = rgbToHex(color);
  const [copied, setCopied] = useState(false);
  return (
    <div class="rounded-xl bg-white p-3 ring-1 ring-slate-200">
      <div class="flex h-16 items-center justify-center rounded-lg text-sm font-semibold ring-1 ring-slate-200" style={`background:${rgbToHex(bg)};color:${hex}`}>
        Sample text
      </div>
      <div class="mt-2 flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p class="font-mono text-sm font-bold text-slate-900">{hex}</p>
        </div>
        <div class="text-right">
          <p class="font-mono text-sm font-bold text-emerald-700">{ratio.toFixed(2)}:1</p>
          <button onClick={() => { navigator.clipboard?.writeText(hex); setCopied(true); setTimeout(() => setCopied(false), 1200); }}
            class="mt-0.5 rounded px-2 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50">{copied ? '✓' : 'Copy'}</button>
        </div>
      </div>
    </div>
  );
}

export default function AccessibleColorTool() {
  const [fgRaw, setFg] = useState('#7aa8d6');
  const [bgRaw, setBg] = useState('#ffffff');
  const [target, setTarget] = useState<number>(4.5);

  const fg = useMemo(() => parseColor(fgRaw), [fgRaw]);
  const bg = useMemo(() => parseColor(bgRaw), [bgRaw]);

  const result = useMemo(() => {
    if (!fg || !bg) return null;
    const current = contrastRatio(fg, bg);
    const passes = current >= target;
    const lighter = findPassing(fg, bg, target, 'lighter');
    const darker = findPassing(fg, bg, target, 'darker');
    return { current, passes, lighter, darker };
  }, [fg, bg, target]);

  const inp = (val: string, set: (v: string) => void, label: string, swatch?: RGB | null) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <div class="flex items-center gap-2">
        <ColorSwatchInput rgb={swatch ?? null} onPick={set} title={label} />
        <input value={val} spellcheck={false} onInput={(e) => set((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
      </div>
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        {inp(fgRaw, setFg, 'Foreground (text)', fg)}
        {inp(bgRaw, setBg, 'Background', bg)}
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        {TARGETS.map((t) => (
          <button onClick={() => setTarget(t.ratio)}
            class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${target === t.ratio ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}
          >{t.label}</button>
        ))}
      </div>

      {result ? (
        <>
          <div class={`mt-4 rounded-xl p-4 text-center ring-2 ${result.passes ? 'bg-emerald-50 ring-emerald-200' : 'bg-amber-50 ring-amber-200'}`}>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Current contrast</p>
            <p class={`mt-1 text-3xl font-extrabold ${result.passes ? 'text-emerald-700' : 'text-amber-700'}`}>{result.current.toFixed(2)}:1</p>
            <p class="mt-1 text-sm font-semibold">{result.passes ? '✓ Already meets your target' : '✗ Below target — nearest fixes below'}</p>
          </div>

          {!result.passes && (
            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              {result.darker && <Swatch label="Nearest darker" color={result.darker} bg={bg!} ratio={contrastRatio(result.darker, bg!)} />}
              {result.lighter && <Swatch label="Nearest lighter" color={result.lighter} bg={bg!} ratio={contrastRatio(result.lighter, bg!)} />}
              {!result.darker && !result.lighter && (
                <p class="text-sm text-slate-500 sm:col-span-2">No color at this hue reaches the target against this background — try a different background or a lower target.</p>
              )}
            </div>
          )}
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a valid foreground and background color (HEX, RGB or HSL).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Exact WCAG 2 contrast (sRGB relative luminance). The fix holds hue &amp; saturation and moves only lightness. 🔒 Computed in your browser.
      </p>
    </div>
  );
}
