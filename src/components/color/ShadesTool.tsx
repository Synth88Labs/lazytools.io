import { useMemo, useState } from 'preact/hooks';
import { parseColor, rgbToHex, tintsAndShades } from '../../lib/color-compute';

export default function ShadesTool() {
  const [input, setInput] = useState('#1d87f1');
  const [copied, setCopied] = useState('');

  const data = useMemo(() => {
    const rgb = parseColor(input);
    if (!rgb) return null;
    const { tints, shades } = tintsAndShades(rgb, 9);
    return { base: rgbToHex(rgb), tints: tints.map(rgbToHex).reverse(), shades: shades.map(rgbToHex) };
  }, [input]);

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied(''), 1200);
    } catch { /* unavailable */ }
  }

  const Swatch = ({ hex }: { hex: string }) => (
    <button
      type="button"
      onClick={() => copy(hex)}
      title={`Copy ${hex}`}
      class="group flex h-16 flex-1 flex-col items-center justify-end rounded-lg border border-slate-200 pb-1 transition hover:scale-105"
      style={`background:${hex}`}
    >
      <span class="rounded bg-white/85 px-1 font-mono text-[10px] font-semibold text-slate-800 opacity-0 transition group-hover:opacity-100">
        {copied === hex ? '✓' : hex}
      </span>
    </button>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-end gap-4">
        <div class="min-w-56 flex-1">
          <label for="sh-input" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Base color</label>
          <input
            id="sh-input"
            type="text"
            value={input}
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <input
          type="color"
          value={data?.base ?? '#1d87f1'}
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          aria-label="Pick base color"
          class="h-13 w-16 cursor-pointer rounded-xl border border-slate-300 bg-white p-1"
        />
      </div>

      {data ? (
        <div class="mt-5 space-y-4">
          <div>
            <p class="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Tints (toward white) — hover to see, click to copy</p>
            <div class="flex gap-1.5">{data.tints.map((h) => <Swatch hex={h} />)}</div>
          </div>
          <div>
            <p class="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Base</p>
            <div class="flex gap-1.5"><Swatch hex={data.base} /></div>
          </div>
          <div>
            <p class="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Shades (toward black)</p>
            <div class="flex gap-1.5">{data.shades.map((h) => <Swatch hex={h} />)}</div>
          </div>
        </div>
      ) : (
        <p class="mt-5 text-sm text-slate-500">Enter a valid color to generate the ramp.</p>
      )}
    </div>
  );
}
