import { useState } from 'preact/hooks';

const num = (s: string): number | null => {
  const n = parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : null;
};
const round1 = (x: number) => Math.round(x * 10) / 10;
const round2 = (x: number) => Math.round(x * 100) / 100;

const SAMPLE = 'The quick brown fox jumps over the lazy dog. Good line height keeps lines of text easy to follow without crowding or drifting apart.';

export default function LineHeightCalc() {
  const [size, setSize] = useState('16');
  const [unitless, setUnitless] = useState('1.5');

  const fs = num(size);
  const lh = num(unitless);
  const px = fs && lh ? round1(fs * lh) : null;

  // Recommendation band: body text reads best around 1.4–1.6; larger type can go tighter.
  const rec = fs
    ? fs >= 32 ? { lo: 1.1, hi: 1.25, note: 'Headings / display — tighter looks intentional' }
      : fs >= 20 ? { lo: 1.25, hi: 1.4, note: 'Sub-headings — a little tighter than body' }
        : { lo: 1.4, hi: 1.6, note: 'Body text — the comfortable reading range' }
    : null;
  const inBand = lh && rec ? lh >= rec.lo && lh <= rec.hi : false;

  const field = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const label = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block">
          <span class={label}>Font size</span>
          <div class="flex items-center gap-2">
            <input type="number" min="1" step="any" value={size} onInput={(e) => setSize((e.target as HTMLInputElement).value)} class={field} />
            <span class="text-sm text-slate-500">px</span>
          </div>
        </label>
        <label class="block">
          <span class={label}>Line height (unitless)</span>
          <input type="number" min="0.5" max="3" step="0.05" value={unitless} onInput={(e) => setUnitless((e.target as HTMLInputElement).value)} class={field} />
        </label>
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Computed line height</p>
          <p class="mt-1 text-3xl font-extrabold text-brand-800">{px !== null ? `${px}px` : '—'}</p>
          <p class="mt-1 text-xs text-slate-400">{fs && lh ? `${fs}px × ${lh}` : ''}</p>
        </div>
        <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended range</p>
          <p class={`mt-1 text-3xl font-extrabold ${inBand ? 'text-mint-700' : 'text-slate-700'}`}>{rec ? `${rec.lo}–${rec.hi}` : '—'}</p>
          <p class="mt-1 text-xs text-slate-400">{rec?.note}{lh && rec ? (inBand ? ' · in range ✓' : ' · outside range') : ''}</p>
        </div>
      </div>

      {/* Live preview */}
      <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Preview</p>
        <p class="text-slate-800" style={{ fontSize: `${fs ?? 16}px`, lineHeight: String(lh ?? 1.5) }}>{SAMPLE}</p>
      </div>

      <p class="mt-4 text-xs text-slate-500">
        A <strong>unitless</strong> line-height (like <code>1.5</code>) scales with the font size and is what you almost always want — it means "1.5× the current font size", so nested elements inherit sensibly. Body text reads best around 1.4–1.6; large headings can go tighter. In CSS: <code>line-height: {round2(lh ?? 1.5)};</code> 🔒
      </p>
    </div>
  );
}
