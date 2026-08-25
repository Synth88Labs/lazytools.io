import { useState } from 'preact/hooks';

const num = (s: string): number | null => {
  const n = parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : null;
};
const round = (x: number) => Math.round(x * 1000) / 1000;

const RATIOS = [
  { id: '1.067', name: 'Minor second (1.067)' },
  { id: '1.125', name: 'Major second (1.125)' },
  { id: '1.2', name: 'Minor third (1.200)' },
  { id: '1.25', name: 'Major third (1.250)' },
  { id: '1.333', name: 'Perfect fourth (1.333)' },
  { id: '1.414', name: 'Augmented fourth (1.414)' },
  { id: '1.5', name: 'Perfect fifth (1.500)' },
  { id: '1.618', name: 'Golden ratio (1.618)' },
];

// Step labels from largest to smallest (common naming).
const STEPS = [
  { n: 5, label: 'Display' },
  { n: 4, label: 'H1' },
  { n: 3, label: 'H2' },
  { n: 2, label: 'H3' },
  { n: 1, label: 'H4' },
  { n: 0, label: 'Body' },
  { n: -1, label: 'Small' },
  { n: -2, label: 'Caption' },
];

export default function TypeScaleTool() {
  const [base, setBase] = useState('16');
  const [ratio, setRatio] = useState('1.25');
  const [root, setRoot] = useState('16');

  const b = num(base) || 16;
  const r = num(ratio) || 1.25;
  const rootPx = num(root) || 16;

  const rows = STEPS.map((s) => {
    const px = b * Math.pow(r, s.n);
    return { ...s, px: round(px), rem: round(px / rootPx) };
  });

  const css = rows.map((row) => `  --font-${row.label.toLowerCase()}: ${row.rem}rem;`).join('\n');
  const cssBlock = `:root {\n${css}\n}`;

  const field = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const label = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500';

  const [copied, setCopied] = useState(false);
  async function copyCss() {
    try { await navigator.clipboard.writeText(cssBlock); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch { /* blocked */ }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-3">
        <label class="block">
          <span class={label}>Base size (body)</span>
          <div class="flex items-center gap-2">
            <input type="number" min="1" step="any" value={base} onInput={(e) => setBase((e.target as HTMLInputElement).value)} class={field} />
            <span class="text-sm text-slate-500">px</span>
          </div>
        </label>
        <label class="block">
          <span class={label}>Scale ratio</span>
          <select value={ratio} onChange={(e) => setRatio((e.target as HTMLSelectElement).value)} class={field}>
            {RATIOS.map((x) => <option value={x.id}>{x.name}</option>)}
          </select>
        </label>
        <label class="block">
          <span class={label}>Root size (for rem)</span>
          <div class="flex items-center gap-2">
            <input type="number" min="1" step="any" value={root} onInput={(e) => setRoot((e.target as HTMLInputElement).value)} class={field} />
            <span class="text-sm text-slate-500">px</span>
          </div>
        </label>
      </div>

      {/* Preview + table */}
      <div class="mt-4 space-y-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-4" tabIndex={0} aria-label="Type scale preview">
        {rows.map((row) => (
          <div class="flex items-baseline justify-between gap-4 border-b border-slate-100 py-1.5 last:border-0">
            <span class="truncate text-slate-800" style={{ fontSize: `${Math.min(row.px, 56)}px`, lineHeight: 1.1 }}>{row.label}</span>
            <span class="shrink-0 font-mono text-xs text-slate-500">{row.px}px · {row.rem}rem</span>
          </div>
        ))}
      </div>

      {/* CSS output */}
      <div class="mt-4">
        <div class="mb-1 flex items-center justify-between">
          <span class={label}>CSS custom properties</span>
          <button type="button" onClick={copyCss} class={`rounded-lg px-3 py-1 text-xs font-semibold transition ${copied ? 'bg-mint-600 text-white' : 'bg-brand-600 text-white hover:bg-brand-700'}`}>{copied ? '✓ Copied' : 'Copy CSS'}</button>
        </div>
        <pre class="overflow-x-auto rounded-xl border border-slate-200 bg-slate-900 p-3 font-mono text-xs text-slate-100" tabIndex={0} aria-label="Generated CSS">{cssBlock}</pre>
      </div>

      <p class="mt-4 text-xs text-slate-500">
        A <strong>modular scale</strong> multiplies the base size by a fixed ratio for each step, so headings relate to body text by a consistent proportion — the typographic equivalent of a musical scale. Smaller ratios (1.125–1.25) suit dense UI; larger ones (1.333–1.618) give dramatic editorial contrast. 🔒
      </p>
    </div>
  );
}
