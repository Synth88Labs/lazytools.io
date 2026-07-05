import { useMemo, useState } from 'preact/hooks';
import { parseColor, rgbToHex, rgbToHsl, rgbToCmyk } from '../../lib/color-compute';

export default function ColorConverterTool({ preset = 'hex' }: { preset?: 'hex' | 'rgb' }) {
  const [input, setInput] = useState(preset === 'rgb' ? '29, 135, 241' : '#1d87f1');
  const [copied, setCopied] = useState('');

  const rgb = useMemo(() => parseColor(input), [input]);
  const rows = useMemo(() => {
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb);
    const cmyk = rgbToCmyk(rgb);
    return [
      ['HEX', rgbToHex(rgb)],
      ['RGB', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`],
      ['HSL', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`],
      ['CMYK', `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`],
    ] as const;
  }, [rgb]);

  async function copy(v: string) {
    try {
      await navigator.clipboard.writeText(v);
      setCopied(v);
      setTimeout(() => setCopied(''), 1200);
    } catch { /* unavailable */ }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-end gap-4">
        <div class="min-w-56 flex-1">
          <label for="cc-input" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Color ({preset === 'rgb' ? 'RGB values' : 'HEX, RGB or HSL'})
          </label>
          <input
            id="cc-input"
            type="text"
            value={input}
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            placeholder={preset === 'rgb' ? '29, 135, 241' : '#1d87f1 or rgb(29,135,241)'}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <input
          type="color"
          value={rgb ? rgbToHex(rgb) : '#1d87f1'}
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          aria-label="Pick a color visually"
          class="h-13 w-16 cursor-pointer rounded-xl border border-slate-300 bg-white p-1"
        />
      </div>

      <div class="mt-5 rounded-xl border border-brand-100 bg-white p-4">
        {rgb && rows ? (
          <div class="flex flex-wrap items-stretch gap-4">
            <div class="h-28 w-28 shrink-0 rounded-xl border border-slate-200" style={`background:${rgbToHex(rgb)}`} aria-label="Color swatch" />
            <div class="grid flex-1 gap-2 sm:grid-cols-2">
              {rows.map(([label, value]) => (
                <button
                  type="button"
                  onClick={() => copy(value)}
                  class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:border-brand-400"
                  title="Click to copy"
                >
                  <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
                  <span class="font-mono text-sm font-semibold text-slate-900">{copied === value ? '✓ copied' : value}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p class="py-2 text-sm text-slate-500">Enter a color like <code>#1d87f1</code>, <code>rgb(29,135,241)</code> or <code>hsl(210,88%,53%)</code>.</p>
        )}
      </div>
    </div>
  );
}
