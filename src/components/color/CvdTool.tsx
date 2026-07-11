import { useMemo, useRef, useState } from 'preact/hooks';
import { parseColor, rgbToHex, type RGB } from '../../lib/color-compute';
import { simulateCvd, type CvdType } from '../../lib/color-advanced';

const TYPES: { key: CvdType; label: string }[] = [
  { key: 'deuteranopia', label: 'Deuteranopia (green)' },
  { key: 'protanopia', label: 'Protanopia (red)' },
  { key: 'tritanopia', label: 'Tritanopia (blue)' },
  { key: 'achromatopsia', label: 'Achromatopsia (mono)' },
];

const SAMPLE_PALETTE = `#12b76a\n#f04438\n#f79009\n#1d87f1\n#7a5af8\n#ee46bc`;

export default function CvdTool({ initialType = 'deuteranopia' as CvdType }: { initialType?: CvdType }) {
  const [mode, setMode] = useState<'image' | 'palette'>('image');
  const [type, setType] = useState<CvdType>(initialType);
  const [severity, setSeverity] = useState(100);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [paletteRaw, setPaletteRaw] = useState(SAMPLE_PALETTE);
  const origCanvas = useRef<HTMLCanvasElement>(null);
  const simCanvas = useRef<HTMLCanvasElement>(null);

  const sev = severity / 100;

  function drawImage(url: string) {
    const img = new Image();
    img.onload = () => {
      const maxW = 520;
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
      const oc = origCanvas.current, sc = simCanvas.current;
      if (!oc || !sc) return;
      oc.width = sc.width = w; oc.height = sc.height = h;
      const octx = oc.getContext('2d')!, sctx = sc.getContext('2d')!;
      octx.drawImage(img, 0, 0, w, h);
      const data = octx.getImageData(0, 0, w, h);
      const px = data.data;
      for (let i = 0; i < px.length; i += 4) {
        const out = simulateCvd({ r: px[i]!, g: px[i + 1]!, b: px[i + 2]! }, type, sev);
        px[i] = out.r; px[i + 1] = out.g; px[i + 2] = out.b;
      }
      sctx.putImageData(data, 0, 0);
    };
    img.src = url;
  }

  function onFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    requestAnimationFrame(() => drawImage(url));
  }

  // re-simulate when type/severity change and an image is loaded
  function reSim() { if (imgUrl) drawImage(imgUrl); }

  function download() {
    const sc = simCanvas.current;
    if (!sc) return;
    const a = document.createElement('a');
    a.download = `cvd-${type}.png`;
    a.href = sc.toDataURL('image/png');
    a.click();
  }

  const palette = useMemo(() => {
    return paletteRaw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
      .map((l) => parseColor(l)).filter((c): c is RGB => !!c);
  }, [paletteRaw]);

  const tab = (id: 'image' | 'palette', label: string) => (
    <button onClick={() => setMode(id)}
      class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${mode === id ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}
    >{label}</button>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap gap-2">{tab('image', 'Image')}{tab('palette', 'Palette')}</div>

      <div class="mt-3 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button onClick={() => { setType(t.key); requestAnimationFrame(reSim); }}
            class={`rounded-lg px-3 py-1 text-xs font-semibold transition ${type === t.key ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}
          >{t.label}</button>
        ))}
      </div>

      {type !== 'achromatopsia' && (
        <label class="mt-3 block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Severity: {severity}%</span>
          <input type="range" min="0" max="100" value={severity} class="w-full accent-brand-600"
            onInput={(e) => { setSeverity(+(e.target as HTMLInputElement).value); requestAnimationFrame(reSim); }} />
        </label>
      )}

      {mode === 'image' ? (
        <div class="mt-4">
          <input type="file" accept="image/*" onChange={onFile}
            class="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700" />
          <div class={`mt-4 grid gap-4 sm:grid-cols-2 ${imgUrl ? '' : 'hidden'}`}>
            <figure><figcaption class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Original</figcaption>
              <canvas ref={origCanvas} class="w-full rounded-lg ring-1 ring-slate-200" /></figure>
            <figure><figcaption class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Simulated</figcaption>
              <canvas ref={simCanvas} class="w-full rounded-lg ring-1 ring-slate-200" /></figure>
          </div>
          {imgUrl && <button onClick={download} class="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">Download simulated PNG</button>}
          {!imgUrl && <p class="mt-3 text-sm text-slate-500">Choose an image to see the original and simulated versions side by side. It never leaves your device.</p>}
        </div>
      ) : (
        <div class="mt-4">
          <label class="block">
            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Palette — one color per line</span>
            <textarea class="h-28 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              value={paletteRaw} spellcheck={false} onInput={(e) => setPaletteRaw((e.target as HTMLTextAreaElement).value)} />
          </label>
          {palette.length > 0 && (
            <div class="mt-4 space-y-2">
              {palette.map((c) => {
                const sim = simulateCvd(c, type, sev);
                return (
                  <div class="flex items-center gap-2">
                    <div class="flex-1 rounded-lg py-3 text-center font-mono text-xs ring-1 ring-slate-200" style={`background:${rgbToHex(c)};color:${luma(c) > 128 ? '#000' : '#fff'}`}>{rgbToHex(c)}</div>
                    <span class="text-slate-400">→</span>
                    <div class="flex-1 rounded-lg py-3 text-center font-mono text-xs ring-1 ring-slate-200" style={`background:${rgbToHex(sim)};color:${luma(sim) > 128 ? '#000' : '#fff'}`}>{rgbToHex(sim)}</div>
                  </div>
                );
              })}
              <p class="text-xs text-slate-500">Left: original. Right: as seen with {TYPES.find((t) => t.key === type)?.label.toLowerCase()}. Watch for two rows whose right side looks the same.</p>
            </div>
          )}
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Machado, Oliveira &amp; Fernandes (2009) matrices in linear-sRGB. Approximates average CVD perception. 🔒 Images processed on-device, never uploaded.
      </p>
    </div>
  );
}

const luma = ({ r, g, b }: RGB) => 0.299 * r + 0.587 * g + 0.114 * b;
