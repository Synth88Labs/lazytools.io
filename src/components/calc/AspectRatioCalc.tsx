import { useState } from 'preact/hooks';

/** Greatest common divisor for reducing a ratio to lowest terms. */
function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

const num = (s: string): number | null => {
  const n = parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : null;
};
const round = (x: number) => (Math.abs(x - Math.round(x)) < 1e-9 ? Math.round(x) : Number(x.toFixed(2)));

const PRESETS: { label: string; w: number; h: number; note: string }[] = [
  { label: '16:9', w: 16, h: 9, note: 'HD / widescreen video, most displays' },
  { label: '4:3', w: 4, h: 3, note: 'Older TVs, many photos, slides' },
  { label: '1:1', w: 1, h: 1, note: 'Square — Instagram, avatars' },
  { label: '3:2', w: 3, h: 2, note: '35mm & most DSLR photos' },
  { label: '21:9', w: 21, h: 9, note: 'Ultrawide / cinematic' },
  { label: '9:16', w: 9, h: 16, note: 'Vertical — Reels, TikTok, Stories' },
  { label: '2:3', w: 2, h: 3, note: 'Portrait photo / Pinterest pins' },
  { label: '5:4', w: 5, h: 4, note: 'Print (8×10)' },
];

export default function AspectRatioCalc() {
  // The ratio is the source of truth; W2/H2 are derived unless the user edits them.
  const [rw, setRw] = useState('16');
  const [rh, setRh] = useState('9');
  const [w2, setW2] = useState('1920');
  const [h2, setH2] = useState('1080');
  const [lock, setLock] = useState(true);

  const ratioW = num(rw), ratioH = num(rh);
  const ratio = ratioW && ratioH ? ratioW / ratioH : null;

  // Recompute the counterpart dimension from the ratio when a dimension changes.
  function onW2(v: string) {
    setW2(v);
    const w = num(v);
    if (lock && ratio && w) setH2(String(round(w / ratio)));
  }
  function onH2(v: string) {
    setH2(v);
    const h = num(v);
    if (lock && ratio && h) setW2(String(round(h * ratio)));
  }
  // Editing the ratio re-derives H2 from the current W2.
  function onRatio(which: 'w' | 'h', v: string) {
    which === 'w' ? setRw(v) : setRh(v);
    const nrw = which === 'w' ? num(v) : ratioW;
    const nrh = which === 'h' ? num(v) : ratioH;
    const w = num(w2);
    if (lock && nrw && nrh && w) setH2(String(round(w / (nrw / nrh))));
  }
  function applyPreset(p: { w: number; h: number }) {
    setRw(String(p.w));
    setRh(String(p.h));
    const w = num(w2);
    if (w) setH2(String(round(w / (p.w / p.h))));
  }
  // Set the ratio FROM the current W2×H2 (reduce to lowest terms).
  function ratioFromDims() {
    const w = num(w2), h = num(h2);
    if (!w || !h || !Number.isInteger(w) || !Number.isInteger(h)) return;
    const g = gcd(w, h);
    setRw(String(w / g));
    setRh(String(h / g));
  }

  const wv = num(w2), hv = num(h2);
  const currentRatio = wv && hv ? wv / hv : null;
  const decimal = currentRatio ? currentRatio.toFixed(4).replace(/0+$/, '').replace(/\.$/, '') : '—';
  // Reduced integer ratio of the actual W2×H2 (if both are whole numbers).
  let reduced = '—';
  if (wv && hv && Number.isInteger(wv) && Number.isInteger(hv)) {
    const g = gcd(wv, hv);
    reduced = `${wv / g} : ${hv / g}`;
  } else if (ratioW && ratioH) {
    const g = gcd(Math.round(ratioW), Math.round(ratioH));
    reduced = `${Math.round(ratioW) / g} : ${Math.round(ratioH) / g}`;
  }

  const field = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const label = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      {/* Ratio presets */}
      <p class={label}>Common ratios</p>
      <div class="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button type="button" title={p.note} onClick={() => applyPreset(p)}
            class={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${rw === String(p.w) && rh === String(p.h) ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-slate-300 bg-white text-slate-600 hover:border-brand-400'}`}>
            {p.label}
          </button>
        ))}
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        {/* Ratio */}
        <div class="rounded-xl border border-slate-200 bg-white p-3">
          <p class="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Aspect ratio</p>
          <div class="flex items-end gap-2">
            <label class="flex-1">
              <span class={label}>Width</span>
              <input type="number" min="0" step="any" value={rw} onInput={(e) => onRatio('w', (e.target as HTMLInputElement).value)} class={field} />
            </label>
            <span class="pb-2 text-lg font-bold text-slate-400">:</span>
            <label class="flex-1">
              <span class={label}>Height</span>
              <input type="number" min="0" step="any" value={rh} onInput={(e) => onRatio('h', (e.target as HTMLInputElement).value)} class={field} />
            </label>
          </div>
        </div>

        {/* Pixel dimensions */}
        <div class="rounded-xl border border-slate-200 bg-white p-3">
          <p class="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Pixel dimensions</p>
          <div class="flex items-end gap-2">
            <label class="flex-1">
              <span class={label}>Width (px)</span>
              <input type="number" min="0" step="any" value={w2} onInput={(e) => onW2((e.target as HTMLInputElement).value)} class={field} />
            </label>
            <span class="pb-2 text-lg font-bold text-slate-400">×</span>
            <label class="flex-1">
              <span class={label}>Height (px)</span>
              <input type="number" min="0" step="any" value={h2} onInput={(e) => onH2((e.target as HTMLInputElement).value)} class={field} />
            </label>
          </div>
        </div>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <label class="flex items-center gap-2 text-sm font-medium text-slate-600">
          <input type="checkbox" checked={lock} onChange={(e) => setLock((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600" />
          Lock to the ratio
        </label>
        <button type="button" onClick={ratioFromDims} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-brand-400">
          ↑ Get ratio from these dimensions
        </button>
      </div>

      {/* Results */}
      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Simplified ratio</p>
          <p class="mt-1 text-3xl font-extrabold text-brand-800">{reduced}</p>
        </div>
        <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">As a decimal (W ÷ H)</p>
          <p class="mt-1 text-3xl font-extrabold text-slate-700">{decimal}</p>
        </div>
      </div>

      <p class="mt-4 text-xs text-slate-500">
        Pick a ratio (or type your own), then enter one pixel dimension — with the lock on, the other follows automatically so the image or video keeps its shape. 🔒 Runs entirely in your browser.
      </p>
    </div>
  );
}
