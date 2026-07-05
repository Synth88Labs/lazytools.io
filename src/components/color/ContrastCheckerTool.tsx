import { useMemo, useState } from 'preact/hooks';
import { parseColor, rgbToHex, contrastRatio } from '../../lib/color-compute';

export default function ContrastCheckerTool() {
  const [fg, setFg] = useState('#1a4d8d');
  const [bg, setBg] = useState('#eef9ff');

  const result = useMemo(() => {
    const a = parseColor(fg), b = parseColor(bg);
    if (!a || !b) return null;
    const ratio = contrastRatio(a, b);
    return {
      ratio,
      fgHex: rgbToHex(a),
      bgHex: rgbToHex(b),
      aaNormal: ratio >= 4.5,
      aaLarge: ratio >= 3,
      aaaNormal: ratio >= 7,
      aaaLarge: ratio >= 4.5,
    };
  }, [fg, bg]);

  const Badge = ({ pass, label }: { pass: boolean; label: string }) => (
    <div class={`rounded-lg px-3 py-2 text-center ${pass ? 'bg-mint-500/15 text-mint-700' : 'bg-red-50 text-red-600'}`}>
      <p class="text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p class="text-lg font-bold">{pass ? '✓ Pass' : '✗ Fail'}</p>
    </div>
  );

  const field = (label: string, value: string, set: (v: string) => void) => (
    <div class="flex-1">
      <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      <div class="flex gap-2">
        <input
          type="text"
          value={value}
          onInput={(e) => set((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-mono text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        <input
          type="color"
          value={parseColor(value) ? rgbToHex(parseColor(value)!) : '#000000'}
          onInput={(e) => set((e.target as HTMLInputElement).value)}
          aria-label={`Pick ${label} visually`}
          class="h-13 w-14 shrink-0 cursor-pointer rounded-xl border border-slate-300 bg-white p-1"
        />
      </div>
    </div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap gap-4">
        {field('Text color', fg, setFg)}
        {field('Background color', bg, setBg)}
      </div>

      {result ? (
        <div class="mt-5 rounded-xl border border-brand-100 bg-white p-4">
          <div class="flex flex-wrap items-center gap-5">
            <div class="rounded-xl border border-slate-200 px-6 py-5" style={`background:${result.bgHex};color:${result.fgHex}`}>
              <p class="text-2xl font-bold">Sample text</p>
              <p class="text-sm">The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Contrast ratio</p>
              <p class={`text-4xl font-extrabold ${result.aaNormal ? 'text-mint-700' : 'text-red-600'}`}>
                {result.ratio.toFixed(2)}:1
              </p>
              <p class="text-xs text-slate-500">1:1 identical · 21:1 black-on-white</p>
            </div>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Badge pass={result.aaNormal} label="AA normal (4.5:1)" />
            <Badge pass={result.aaLarge} label="AA large (3:1)" />
            <Badge pass={result.aaaNormal} label="AAA normal (7:1)" />
            <Badge pass={result.aaaLarge} label="AAA large (4.5:1)" />
          </div>
        </div>
      ) : (
        <p class="mt-5 text-sm text-slate-500">Enter two valid colors to compute the WCAG ratio.</p>
      )}
    </div>
  );
}
