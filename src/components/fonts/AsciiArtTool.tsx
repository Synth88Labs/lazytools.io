import { useState } from 'preact/hooks';
import { FIGLET_FONTS, renderFiglet } from '../../lib/figlet';

export default function AsciiArtTool() {
  const [text, setText] = useState('Hello');
  const [font, setFont] = useState('standard');
  const [copied, setCopied] = useState(false);

  const output = renderFiglet(text || ' ', font);

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch { /* clipboard blocked */ }
  }

  function download() {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascii-art-${font}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadPng() {
    const lines = output.split('\n');
    const fs = 16;
    const lineHeight = fs; // block glyphs connect vertically when leading = font size
    const pad = 24;
    const scale = 2;
    const fontSpec = `${fs}px "Courier New", ui-monospace, monospace`;
    const measurer = document.createElement('canvas').getContext('2d')!;
    measurer.font = fontSpec;
    const textW = Math.ceil(Math.max(1, ...lines.map((l) => measurer.measureText(l).width)));
    const w = textW + pad * 2;
    const h = lines.length * lineHeight + pad * 2;
    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);
    ctx.font = fontSpec;
    ctx.fillStyle = '#34d399';
    ctx.textBaseline = 'top';
    lines.forEach((line, i) => ctx.fillText(line, pad, pad + i * lineHeight));
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ascii-art-${font}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Your text</span>
          <input
            value={text}
            onInput={(e) => setText((e.target as HTMLInputElement).value)}
            placeholder="Type a word…"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Font</span>
          <select
            value={font}
            onChange={(e) => setFont((e.target as HTMLSelectElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 sm:w-44"
          >
            {FIGLET_FONTS.map((f) => <option value={f.id}>{f.name}</option>)}
          </select>
        </label>
      </div>

      <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-900 p-4">
        <pre class="whitespace-pre font-mono text-xs leading-tight text-emerald-300 sm:text-sm">{output}</pre>
      </div>

      <div class="mt-3 flex flex-wrap justify-end gap-2">
        <button type="button" onClick={download} class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700">
          ⬇ .txt
        </button>
        <button type="button" onClick={downloadPng} class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700">
          ⬇ PNG
        </button>
        <button type="button" onClick={copy} class={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${copied ? 'bg-mint-600' : 'bg-brand-600 hover:bg-brand-700'}`}>
          {copied ? '✓ Copied' : 'Copy ASCII art'}
        </button>
      </div>

      <p class="mt-4 text-xs text-slate-500">
        Best pasted into a <strong>monospace</strong> context — a README, code comment, terminal or <code>&lt;pre&gt;</code> block — so the columns line up. All 10 fonts render in your browser; nothing is uploaded. 🔒
      </p>
    </div>
  );
}
