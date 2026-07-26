import { useState } from 'preact/hooks';

function round(n: number, dp = 4): number {
  return Math.round(n * 10 ** dp) / 10 ** dp;
}

export default function ClampTool() {
  const [root, setRoot] = useState(16);
  const [minFont, setMinFont] = useState(16);
  const [maxFont, setMaxFont] = useState(32);
  const [minVw, setMinVw] = useState(320);
  const [maxVw, setMaxVw] = useState(1280);
  const [previewVw, setPreviewVw] = useState(768);
  const [copied, setCopied] = useState(false);

  // Linear interpolation between (minVw, minFont) and (maxVw, maxFont).
  // font(px) = slope * vw(px) + intercept ; expressed in CSS as vw + rem.
  const valid = maxVw > minVw;
  const slope = valid ? (maxFont - minFont) / (maxVw - minVw) : 0;
  const slopeVw = round(slope * 100); // coefficient on 1vw (=viewport/100 px)
  const interceptPx = minFont - slope * minVw;
  const interceptRem = round(interceptPx / root);
  const minRem = round(minFont / root);
  const maxRem = round(maxFont / root);

  const preferred = `${slopeVw}vw + ${interceptRem}rem`;
  const css = `font-size: clamp(${minRem}rem, ${preferred}, ${maxRem}rem);`;

  // Live preview: clamp the computed px at the chosen preview viewport width.
  const rawPx = slope * previewVw + interceptPx;
  const shownPx = round(Math.min(Math.max(rawPx, minFont), maxFont), 1);

  async function copy() {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch { /* clipboard blocked */ }
  }

  const numField = (label: string, val: number, set: (n: number) => void, suffix: string, min = 0) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <div class="flex items-center rounded-xl border border-slate-300 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200">
        <input
          type="number"
          value={val}
          min={min}
          onInput={(e) => set(Number((e.target as HTMLInputElement).value))}
          class="w-full rounded-xl bg-transparent px-3 py-2 text-base text-slate-900 focus:outline-none"
        />
        <span class="px-3 text-sm text-slate-400">{suffix}</span>
      </div>
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-2">
        {numField('Min font size', minFont, setMinFont, 'px', 1)}
        {numField('Max font size', maxFont, setMaxFont, 'px', 1)}
        {numField('Min viewport', minVw, setMinVw, 'px', 1)}
        {numField('Max viewport', maxVw, setMaxVw, 'px', 1)}
      </div>

      <label class="mt-3 flex items-center gap-3 text-sm font-medium text-slate-700">
        <span class="whitespace-nowrap">Root font size</span>
        <input type="number" value={root} min={1} onInput={(e) => setRoot(Number((e.target as HTMLInputElement).value))} class="w-20 rounded-lg border border-slate-300 bg-white px-2 py-1 text-slate-900 focus:border-brand-500 focus:outline-none" />
        <span class="text-slate-400">px = 1rem</span>
      </label>

      {!valid && <p class="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Max viewport must be larger than min viewport.</p>}

      <div class="mt-4">
        <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">CSS output</span>
        <div class="flex items-stretch gap-2">
          <pre class="flex-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800"><code>{css}</code></pre>
          <button
            type="button"
            onClick={copy}
            class={`shrink-0 rounded-lg px-4 text-sm font-semibold text-white transition ${copied ? 'bg-mint-600' : 'bg-brand-600 hover:bg-brand-700'}`}
          >
            {copied ? '✓' : 'Copy'}
          </button>
        </div>
      </div>

      <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <label class="flex items-center gap-3 text-sm font-medium text-slate-700">
          <span class="whitespace-nowrap">Preview at</span>
          <input type="range" min={minVw} max={maxVw} value={Math.min(Math.max(previewVw, minVw), maxVw)} onInput={(e) => setPreviewVw(Number((e.target as HTMLInputElement).value))} class="min-w-[100px] flex-1 accent-brand-600" />
          <span class="w-24 text-right tabular-nums text-slate-500">{previewVw}px vw</span>
        </label>
        <p class="mt-3 leading-tight text-slate-900" style={`font-size:${shownPx}px`}>The quick brown fox</p>
        <p class="mt-1 text-xs text-slate-400">Renders at {shownPx}px</p>
      </div>

      <p class="mt-4 text-xs text-slate-500">
        <strong>clamp(min, preferred, max)</strong> grows the font smoothly with the viewport, then locks at the limits. The preferred value uses <code>vw</code> so it scales, plus a <code>rem</code> offset so it still respects the user's zoom. 🔒 Runs in your browser.
      </p>
    </div>
  );
}
