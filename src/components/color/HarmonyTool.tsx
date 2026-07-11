import { useMemo, useState } from 'preact/hooks';
import { parseColor, rgbToHex, rgbToHsl, hslToRgb, type RGB } from '../../lib/color-compute';
import { rgbToOklch, fmtOklch } from '../../lib/color-advanced';
import ColorSwatchInput from './ColorSwatchInput';

type Preset = 'all' | 'complementary' | 'triadic' | 'analogous';

interface Scheme { name: string; offsets: number[] }
const SCHEMES: Scheme[] = [
  { name: 'Complementary', offsets: [0, 180] },
  { name: 'Split-complementary', offsets: [0, 150, 210] },
  { name: 'Triadic', offsets: [0, 120, 240] },
  { name: 'Tetradic (square)', offsets: [0, 90, 180, 270] },
  { name: 'Analogous', offsets: [-60, -30, 0, 30, 60] },
];

const luma = ({ r, g, b }: RGB) => 0.299 * r + 0.587 * g + 0.114 * b;

function rotate(base: RGB, deg: number): RGB {
  const { h, s, l } = rgbToHsl(base);
  return hslToRgb((((h + deg) % 360) + 360) % 360, s, l);
}

function Chip({ color }: { color: RGB }) {
  const hex = rgbToHex(color);
  const { h, s, l } = rgbToHsl(color);
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (v: string) => { navigator.clipboard?.writeText(v); setCopied(v); setTimeout(() => setCopied(null), 1000); };
  const codes = [hex, `hsl(${h}, ${s}%, ${l}%)`, fmtOklch(rgbToOklch(color))];
  return (
    <div class="overflow-hidden rounded-xl ring-1 ring-slate-200">
      <div class="flex h-20 items-end justify-end p-2" style={`background:${hex}`}>
        <span class="rounded px-1.5 py-0.5 text-[10px] font-bold" style={`background:${luma(color) > 128 ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.2)'};color:${luma(color) > 128 ? '#000' : '#fff'}`}>{hex}</span>
      </div>
      <div class="space-y-1 bg-white p-2">
        {codes.map((c) => (
          <button onClick={() => copy(c)} class="block w-full truncate rounded px-1.5 py-1 text-left font-mono text-[11px] text-slate-700 transition hover:bg-brand-50" title="Copy">
            {copied === c ? '✓ copied' : c}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function HarmonyTool({ preset = 'all' as Preset }: { preset?: Preset }) {
  const [raw, setRaw] = useState('#1d87f1');
  const base = useMemo(() => parseColor(raw), [raw]);

  const shown = preset === 'all'
    ? SCHEMES
    : SCHEMES.filter((s) => s.name.toLowerCase().startsWith(preset));

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Base color — HEX, RGB or HSL</span>
        <div class="flex items-center gap-2">
          <ColorSwatchInput rgb={base} onPick={setRaw} size="lg" />
          <input value={raw} spellcheck={false} onInput={(e) => setRaw((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </div>
      </label>

      {base ? (
        <div class="mt-4 space-y-5">
          {shown.map((s) => (
            <section>
              <h3 class="text-sm font-bold text-slate-800">{s.name}</h3>
              <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {s.offsets.map((o) => <Chip color={rotate(base, o)} />)}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a valid base color (HEX, RGB or HSL).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Exact hue rotations on the color wheel, with HEX, HSL and OKLCH codes. 🔒 Computed in your browser.
      </p>
    </div>
  );
}
