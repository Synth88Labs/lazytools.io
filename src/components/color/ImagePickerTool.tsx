import { useRef, useState } from 'preact/hooks';
import { rgbToHex, rgbToHsl, type RGB } from '../../lib/color-compute';

/** Median-cut palette extraction to `count` colors. */
function medianCut(pixels: RGB[], count: number): RGB[] {
  if (pixels.length === 0) return [];
  let boxes: RGB[][] = [pixels];
  while (boxes.length < count) {
    // pick the box with the largest channel range
    let bi = 0, bestRange = -1;
    boxes.forEach((box, i) => {
      const r = channelRange(box);
      if (r.range > bestRange) { bestRange = r.range; bi = i; }
    });
    const box = boxes[bi]!;
    if (box.length < 2) break;
    const { channel } = channelRange(box);
    const sorted = [...box].sort((a, b) => a[channel] - b[channel]);
    const mid = sorted.length >> 1;
    boxes.splice(bi, 1, sorted.slice(0, mid), sorted.slice(mid));
  }
  return boxes.map(avg).sort((a, b) => luma(b) - luma(a));
}
function channelRange(box: RGB[]): { channel: 'r' | 'g' | 'b'; range: number } {
  const mm = { r: [255, 0], g: [255, 0], b: [255, 0] } as Record<'r' | 'g' | 'b', number[]>;
  for (const p of box) (['r', 'g', 'b'] as const).forEach((c) => { mm[c][0] = Math.min(mm[c][0]!, p[c]); mm[c][1] = Math.max(mm[c][1]!, p[c]); });
  let channel: 'r' | 'g' | 'b' = 'r', range = -1;
  (['r', 'g', 'b'] as const).forEach((c) => { const d = mm[c][1]! - mm[c][0]!; if (d > range) { range = d; channel = c; } });
  return { channel, range };
}
function avg(box: RGB[]): RGB {
  const s = box.reduce((a, p) => ({ r: a.r + p.r, g: a.g + p.g, b: a.b + p.b }), { r: 0, g: 0, b: 0 });
  const n = box.length || 1;
  return { r: Math.round(s.r / n), g: Math.round(s.g / n), b: Math.round(s.b / n) };
}
const luma = ({ r, g, b }: RGB) => 0.299 * r + 0.587 * g + 0.114 * b;

function Swatch({ rgb }: { rgb: RGB }) {
  const hex = rgbToHex(rgb);
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard?.writeText(hex); setCopied(true); setTimeout(() => setCopied(false), 1000); }}
      class="overflow-hidden rounded-lg ring-1 ring-slate-200 transition hover:ring-brand-400">
      <span class="block h-14" style={`background:${hex}`} />
      <span class="block bg-white px-1 py-1 font-mono text-[11px] text-slate-700">{copied ? '✓' : hex}</span>
    </button>
  );
}

export default function ImagePickerTool() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [picked, setPicked] = useState<RGB | null>(null);
  const [palette, setPalette] = useState<RGB[]>([]);
  const hasEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window;

  function processImage(img: HTMLImageElement) {
    const c = canvas.current;
    if (!c) return;
    const maxW = 560;
    const scale = Math.min(1, maxW / img.width);
    const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
    c.width = w; c.height = h;
    const ctx = c.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0, w, h);
    setLoaded(true);
    // sample pixels for palette (skip transparent, stride for speed)
    const data = ctx.getImageData(0, 0, w, h).data;
    const px: RGB[] = [];
    for (let i = 0; i < data.length; i += 4 * 6) {
      if (data[i + 3]! < 125) continue;
      px.push({ r: data[i]!, g: data[i + 1]!, b: data[i + 2]! });
    }
    setPalette(medianCut(px, 6));
  }

  function onFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => processImage(img);
    img.src = URL.createObjectURL(file);
  }

  function onCanvasClick(e: MouseEvent) {
    const c = canvas.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) * (c.width / rect.width));
    const y = Math.round((e.clientY - rect.top) * (c.height / rect.height));
    const d = c.getContext('2d')!.getImageData(x, y, 1, 1).data;
    setPicked({ r: d[0]!, g: d[1]!, b: d[2]! });
  }

  async function screenPick() {
    try {
      // @ts-ignore - EyeDropper is not yet in TS lib
      const res = await new window.EyeDropper().open();
      const hex = res.sRGBHex as string;
      const m = hex.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
      if (m) setPicked({ r: parseInt(m[1]!, 16), g: parseInt(m[2]!, 16), b: parseInt(m[3]!, 16) });
    } catch { /* user cancelled */ }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-center gap-3">
        <input type="file" accept="image/*" onChange={onFile}
          class="block text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700" />
        {hasEyeDropper && (
          <button onClick={screenPick} class="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">🎯 Pick from screen</button>
        )}
      </div>

      {loaded ? (
        <div class="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div>
            <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Click the image to pick a color</p>
            <canvas ref={canvas} onClick={onCanvasClick} class="w-full cursor-crosshair rounded-lg ring-1 ring-slate-200" />
          </div>
          {picked && (
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200 lg:w-48">
              <div class="mx-auto h-20 w-20 rounded-lg ring-1 ring-slate-300" style={`background:${rgbToHex(picked)}`} />
              <p class="mt-2 font-mono text-lg font-bold text-slate-900">{rgbToHex(picked)}</p>
              <p class="font-mono text-xs text-slate-500">rgb({picked.r}, {picked.g}, {picked.b})</p>
              <p class="font-mono text-xs text-slate-500">{(() => { const { h, s, l } = rgbToHsl(picked); return `hsl(${h}, ${s}%, ${l}%)`; })()}</p>
              <button onClick={() => navigator.clipboard?.writeText(rgbToHex(picked))} class="mt-2 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700">Copy HEX</button>
            </div>
          )}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Choose an image to pick colors from it and extract its dominant palette. {hasEyeDropper ? 'Or use “Pick from screen” to sample any pixel on your display.' : ''} Nothing is uploaded.</p>
      )}

      {palette.length > 0 && (
        <div class="mt-5">
          <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Dominant palette (click a swatch to copy)</p>
          <div class="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {palette.map((c) => <Swatch rgb={c} />)}
          </div>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Colors are read from the image on a canvas with median-cut palette extraction; the EyeDropper API samples screen pixels where supported. 🔒 Images never leave your device.
      </p>
    </div>
  );
}
