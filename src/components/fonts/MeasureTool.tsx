import { useState } from 'preact/hooks';

// Average character advance ≈ 0.5× font size for common proportional fonts.
// (1ch is the width of "0"; for body fonts the mean glyph is a bit narrower.)
const CH_RATIO = 0.5;

function round(n: number, dp = 0): number {
  return Math.round(n * 10 ** dp) / 10 ** dp;
}

export default function MeasureTool() {
  const [fontSize, setFontSize] = useState(18);
  const [cpl, setCpl] = useState(66);

  const chPx = fontSize * CH_RATIO;
  const widthPx = round(cpl * chPx);
  const widthRem = round(widthPx / 16, 2);
  const widthEm = round(cpl * CH_RATIO, 1); // in em, independent of font size

  // Recommended band: 45–75 CPL for body text (Bringhurst / Baymard).
  const inBand = cpl >= 45 && cpl <= 75;
  const verdict = cpl < 45 ? 'Too narrow' : cpl > 75 ? 'Too wide' : 'Comfortable';
  const verdictClass = inBand ? 'text-mint-700 bg-mint-50 border-mint-200' : 'text-amber-800 bg-amber-50 border-amber-200';

  const sample =
    'Good line length keeps the reader\'s eye from getting lost between the end of one line and the start of the next. Around sixty to seventy-five characters per line is the sweet spot for sustained reading on screens and in print alike.';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Body font size</span>
          <div class="flex items-center rounded-xl border border-slate-300 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200">
            <input type="number" min={8} value={fontSize} onInput={(e) => setFontSize(Number((e.target as HTMLInputElement).value))} class="w-full rounded-xl bg-transparent px-3 py-2 text-base text-slate-900 focus:outline-none" />
            <span class="px-3 text-sm text-slate-400">px</span>
          </div>
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Target characters / line</span>
          <div class="flex items-center gap-3">
            <input type="range" min={30} max={100} value={cpl} onInput={(e) => setCpl(Number((e.target as HTMLInputElement).value))} class="flex-1 accent-brand-600" />
            <span class="w-10 text-right tabular-nums font-semibold text-slate-700">{cpl}</span>
          </div>
        </label>
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-3">
        <div class="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Ideal width</p>
          <p class="mt-1 text-2xl font-bold text-slate-900">{widthPx}px</p>
          <p class="text-sm text-slate-500">{widthRem}rem</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">CSS max-width</p>
          <p class="mt-1 text-lg font-bold text-slate-900">{widthEm}em</p>
          <p class="text-xs text-slate-500">or {cpl}ch (≈)</p>
        </div>
        <div class={`rounded-xl border p-4 text-center ${verdictClass}`}>
          <p class="text-xs font-semibold uppercase tracking-wide opacity-70">Readability</p>
          <p class="mt-1 text-lg font-bold">{verdict}</p>
          <p class="text-xs opacity-70">ideal 45–75</p>
        </div>
      </div>

      <div class="mt-4">
        <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Live preview at this width</span>
        <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4">
          <p class="text-slate-800" style={`font-size:${fontSize}px;line-height:1.6;max-width:${widthPx}px`}>{sample}</p>
        </div>
      </div>

      <p class="mt-4 text-xs text-slate-500">
        Long-standing typographic guidance (Bringhurst; usability research) puts comfortable reading at <strong>45–75 characters per line</strong>, ~66 being ideal. Set your text container to the width above (using <code>max-width</code> in em/ch keeps it correct if the font size changes). 🔒 Runs in your browser.
      </p>
    </div>
  );
}
