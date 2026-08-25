import { useRef, useState } from 'preact/hooks';

export default function GradientTextTool() {
  const [text, setText] = useState('Gradient');
  const [c1, setC1] = useState('#7c3aed');
  const [c2, setC2] = useState('#ec4899');
  const [angle, setAngle] = useState(90);
  const [size, setSize] = useState(64);
  const [weight, setWeight] = useState(800);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLSpanElement>(null);

  const gradient = `linear-gradient(${angle}deg, ${c1}, ${c2})`;
  const css = [
    `background: ${gradient};`,
    '-webkit-background-clip: text;',
    'background-clip: text;',
    '-webkit-text-fill-color: transparent;',
    'color: transparent;',
  ].join('\n');

  async function copy() {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch { /* clipboard blocked */ }
  }

  function downloadPng() {
    const pad = 40;
    const fontSpec = `${weight} ${size}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    const measure = document.createElement('canvas').getContext('2d')!;
    measure.font = fontSpec;
    const w = Math.ceil(measure.measureText(text || ' ').width) + pad * 2;
    const h = Math.ceil(size * 1.4) + pad;
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);
    // Gradient along the chosen angle across the text box.
    const rad = (angle - 90) * (Math.PI / 180);
    const cx = w / 2, cy = h / 2, len = Math.max(w, h) / 2;
    const grad = ctx.createLinearGradient(cx - Math.cos(rad) * len, cy - Math.sin(rad) * len, cx + Math.cos(rad) * len, cy + Math.sin(rad) * len);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);
    ctx.font = fontSpec;
    ctx.fillStyle = grad;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text || ' ', w / 2, h / 2);
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gradient-text.png';
    a.click();
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Your text</span>
        <input
          value={text}
          onInput={(e) => setText((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>

      <div class="mt-4 flex flex-wrap items-end gap-4">
        <label class="text-sm font-medium text-slate-700">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Colour 1</span>
          <input type="color" value={c1} onInput={(e) => setC1((e.target as HTMLInputElement).value)} class="h-10 w-14 cursor-pointer rounded border border-slate-300" />
        </label>
        <label class="text-sm font-medium text-slate-700">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Colour 2</span>
          <input type="color" value={c2} onInput={(e) => setC2((e.target as HTMLInputElement).value)} class="h-10 w-14 cursor-pointer rounded border border-slate-300" />
        </label>
        <label class="flex-1 text-sm font-medium text-slate-700">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Angle {angle}°</span>
          <input type="range" min={0} max={360} value={angle} onInput={(e) => setAngle(Number((e.target as HTMLInputElement).value))} class="w-full accent-brand-600" />
        </label>
      </div>

      <div class="mt-3 flex flex-wrap gap-4">
        <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
          Size
          <input type="range" min={16} max={120} value={size} onInput={(e) => setSize(Number((e.target as HTMLInputElement).value))} class="accent-brand-600" />
          <span class="w-12 tabular-nums text-slate-500">{size}px</span>
        </label>
        <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
          Weight
          <select value={weight} onChange={(e) => setWeight(Number((e.target as HTMLSelectElement).value))} class="rounded-lg border border-slate-300 bg-white px-2 py-1 text-slate-900 focus:border-brand-500 focus:outline-none">
            {[400, 600, 700, 800, 900].map((w) => <option value={w}>{w}</option>)}
          </select>
        </label>
      </div>

      <div class="mt-4 rounded-xl border border-slate-200 bg-white p-6 text-center">
        <span
          ref={previewRef}
          class="break-words"
          style={`font-size:${size}px;font-weight:${weight};line-height:1.2;background:${gradient};-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent`}
        >
          {text || ' '}
        </span>
      </div>

      <div class="mt-4">
        <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">CSS</span>
        <pre class="overflow-x-auto rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800" tabIndex={0} aria-label="CSS output"><code>{css}</code></pre>
      </div>

      <div class="mt-3 flex flex-wrap justify-end gap-2">
        <button type="button" onClick={downloadPng} class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700">
          ⬇ Download PNG
        </button>
        <button type="button" onClick={copy} class={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${copied ? 'bg-mint-600' : 'bg-brand-600 hover:bg-brand-700'}`}>
          {copied ? '✓ Copied' : 'Copy CSS'}
        </button>
      </div>

      <p class="mt-4 text-xs text-slate-500">
        Gradient text uses <code>background-clip: text</code> with a transparent fill. Keep the plain text readable for accessibility — the gradient is decorative. PNG export renders in your browser; nothing is uploaded. 🔒
      </p>
    </div>
  );
}
