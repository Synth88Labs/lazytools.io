import { useMemo, useState } from 'preact/hooks';
import { parseColor, rgbToHex, type RGB } from '../../lib/color-compute';
import { rgbToOklch, oklchToRgb, fmtOklch } from '../../lib/color-advanced';

// Tailwind-style perceptual lightness targets per step (OKLCH L, 0..1)
const STEPS: { step: number; L: number }[] = [
  { step: 50, L: 0.971 }, { step: 100, L: 0.936 }, { step: 200, L: 0.885 },
  { step: 300, L: 0.808 }, { step: 400, L: 0.704 }, { step: 500, L: 0.62 },
  { step: 600, L: 0.55 }, { step: 700, L: 0.47 }, { step: 800, L: 0.4 },
  { step: 900, L: 0.33 }, { step: 950, L: 0.24 },
];
// chroma envelope — muted at the extremes, fuller in the middle
const chromaFactor = (L: number) => {
  const d = 1 - Math.abs((L - 0.62) / 0.62);
  return 0.35 + 0.65 * Math.max(0, d);
};

function luma({ r, g, b }: RGB) { return 0.299 * r + 0.587 * g + 0.114 * b; }

export default function OklchScaleTool() {
  const [raw, setRaw] = useState('#1d87f1');
  const [name, setName] = useState('brand');
  const base = useMemo(() => parseColor(raw), [raw]);

  const scale = useMemo(() => {
    if (!base) return null;
    const b = rgbToOklch(base);
    return STEPS.map(({ step, L }) => {
      const C = b.C * chromaFactor(L);
      const { rgb } = oklchToRgb({ L, C, h: b.h });
      return { step, hex: rgbToHex(rgb), oklch: fmtOklch({ L, C, h: b.h }), rgb };
    });
  }, [base]);

  const [copied, setCopied] = useState<string | null>(null);
  const copy = (label: string, text: string) => { navigator.clipboard?.writeText(text); setCopied(label); setTimeout(() => setCopied(null), 1200); };

  const themeCss = useMemo(() => {
    if (!scale) return '';
    return `@theme {\n${scale.map((s) => `  --color-${name}-${s.step}: ${s.oklch};`).join('\n')}\n}`;
  }, [scale, name]);
  const jsConfig = useMemo(() => {
    if (!scale) return '';
    return `${name}: {\n${scale.map((s) => `  ${s.step}: '${s.hex}',`).join('\n')}\n}`;
  }, [scale, name]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Base color (becomes the mid-tone)</span>
          <div class="flex items-center gap-2">
            <span class="h-9 w-9 shrink-0 rounded-lg ring-1 ring-slate-300" style={base ? `background:${rgbToHex(base)}` : 'background:#eee'} />
            <input value={raw} spellcheck={false} onInput={(e) => setRaw((e.target as HTMLInputElement).value)}
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Scale name</span>
          <input value={name} spellcheck={false} onInput={(e) => setName((e.target as HTMLInputElement).value.replace(/[^a-z0-9-]/gi, '') || 'brand')}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </label>
      </div>

      {scale ? (
        <>
          <div class="mt-4 overflow-hidden rounded-xl ring-1 ring-slate-200">
            {scale.map((s) => (
              <button onClick={() => copy(`sw-${s.step}`, s.hex)} class="flex w-full items-center justify-between px-4 py-2.5 text-left transition hover:opacity-90"
                style={`background:${s.hex};color:${luma(s.rgb) > 140 ? '#0f172a' : '#ffffff'}`}>
                <span class="font-mono text-sm font-bold">{name}-{s.step}</span>
                <span class="font-mono text-xs">{copied === `sw-${s.step}` ? 'copied ✓' : s.hex}</span>
              </button>
            ))}
          </div>

          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <div class="mb-1 flex items-center justify-between">
                <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Tailwind 4 @theme (OKLCH)</span>
                <button onClick={() => copy('theme', themeCss)} class="rounded px-2 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50">{copied === 'theme' ? '✓' : 'Copy'}</button>
              </div>
              <pre class="max-h-56 overflow-auto rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-100"><code>{themeCss}</code></pre>
            </div>
            <div>
              <div class="mb-1 flex items-center justify-between">
                <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">JS config (HEX)</span>
                <button onClick={() => copy('js', jsConfig)} class="rounded px-2 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50">{copied === 'js' ? '✓' : 'Copy'}</button>
              </div>
              <pre class="max-h-56 overflow-auto rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-100"><code>{jsConfig}</code></pre>
            </div>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a valid base color (HEX, RGB or HSL).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Perceptual OKLCH lightness ramp (even steps that look even), chroma muted at the extremes, gamut-mapped to sRGB HEX. 🔒 Computed in your browser.
      </p>
    </div>
  );
}
