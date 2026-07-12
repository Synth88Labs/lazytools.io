import { useMemo, useState } from 'preact/hooks';
import { printInches, megapixels } from '../../lib/photography';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function PrintResolutionTool() {
  const [w, setW] = useState('6000');
  const [h, setH] = useState('4000');
  const [dpi, setDpi] = useState('300');

  const r = useMemo(() => {
    const wp = num(w), hp = num(h), d = num(dpi);
    if (wp == null || hp == null || d == null) return null;
    const inW = printInches(wp, d), inH = printInches(hp, d);
    return { mp: megapixels(wp, hp), inW, inH, cmW: inW * 2.54, cmH: inH * 2.54, quality: d >= 300 ? 'Excellent (photo)' : d >= 200 ? 'Good' : d >= 150 ? 'Acceptable at arm’s length' : 'Poster / distance viewing' };
  }, [w, h, dpi]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Image width (pixels)</span>
          <input type="number" step="any" value={w} onInput={(e) => setW((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Image height (pixels)</span>
          <input type="number" step="any" value={h} onInput={(e) => setH((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Print resolution (DPI)</span>
          <input type="number" step="any" value={dpi} onInput={(e) => setDpi((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Max print size</p><p class="mt-1 text-2xl font-extrabold text-brand-800">{fmt(r.inW)} × {fmt(r.inH)}″</p><p class="mt-1 text-xs text-slate-400">{fmt(r.cmW, 0)} × {fmt(r.cmH, 0)} cm</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Resolution</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.mp)} MP</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Print quality</p><p class="mt-1 text-lg font-extrabold text-slate-700">{r.quality}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the image pixel dimensions and target DPI.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Print size (inches) = pixels ÷ DPI. 300 DPI is the standard for sharp photo prints viewed up close; large posters seen from a distance work fine at 150 DPI or less. A 24-megapixel image (6000 × 4000) prints about 20 × 13 inches at 300 DPI. 🔒 In your browser.</p>
    </div>
  );
}
