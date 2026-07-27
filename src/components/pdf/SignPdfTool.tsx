import { useRef, useState, useEffect } from 'preact/hooks';

export default function SignPdfTool() {
  const [fileName, setFileName] = useState('');
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [corner, setCorner] = useState<'br' | 'bl' | 'tr' | 'tl'>('br');
  const [size, setSize] = useState(160);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [hasInk, setHasInk] = useState(false);
  const padRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const c = padRef.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.strokeStyle = '#0f172a';
    const pos = (e: PointerEvent) => { const r = c.getBoundingClientRect(); return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) }; };
    const down = (e: PointerEvent) => { drawing.current = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); c.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!drawing.current) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); setHasInk(true); };
    const up = () => { drawing.current = false; };
    c.addEventListener('pointerdown', down); c.addEventListener('pointermove', move); c.addEventListener('pointerup', up); c.addEventListener('pointerleave', up);
    return () => { c.removeEventListener('pointerdown', down); c.removeEventListener('pointermove', move); c.removeEventListener('pointerup', up); c.removeEventListener('pointerleave', up); };
  }, []);

  function clearPad() { const c = padRef.current!; c.getContext('2d')!.clearRect(0, 0, c.width, c.height); setHasInk(false); }

  async function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setFileName(f.name); setError('');
    const buf = await f.arrayBuffer(); setBytes(buf);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(buf);
      setNumPages(doc.getPageCount()); setPage(1);
    } catch (err) { setError(`Could not open PDF: ${(err as Error).message}`); }
  }

  async function sign() {
    if (!bytes || !hasInk) return;
    setBusy(true); setError('');
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(bytes);
      const pngUrl = padRef.current!.toDataURL('image/png');
      const png = await doc.embedPng(pngUrl);
      const pg = doc.getPage(Math.min(Math.max(1, page), doc.getPageCount()) - 1);
      const { width, height } = pg.getSize();
      const w = size, h = size * (padRef.current!.height / padRef.current!.width);
      const m = 24;
      const x = corner === 'br' || corner === 'tr' ? width - w - m : m;
      const y = corner === 'br' || corner === 'bl' ? m : height - h - m;
      pg.drawImage(png, { x, y, width: w, height: h });
      const out = await doc.save();
      const blob = new Blob([out], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = (fileName.replace(/\.pdf$/i, '') || 'document') + '-signed.pdf'; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { setError(`Could not sign: ${(err as Error).message}`); }
    setBusy(false);
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept=".pdf,application/pdf" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{fileName || 'Choose the PDF to sign'}</span>
        <span class="mt-1 block text-xs text-slate-500">Signed on your device — the document is never uploaded</span>
      </label>

      <div class="mt-4">
        <div class="mb-1 flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Draw your signature</span>
          <button type="button" onClick={clearPad} class="text-xs font-semibold text-brand-700 hover:underline">Clear</button>
        </div>
        <canvas ref={padRef} width={600} height={200} class="w-full touch-none rounded-xl border border-slate-300 bg-white" style="aspect-ratio:3/1" />
      </div>

      {numPages > 0 && (
        <div class="mt-4 flex flex-wrap items-end gap-4">
          <label class="text-sm font-medium text-slate-700"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Page</span>
            <input type="number" min={1} max={numPages} value={page} onInput={(e) => setPage(Number((e.target as HTMLInputElement).value))} class="w-20 rounded-xl border border-slate-300 bg-white px-2 py-1.5" /> <span class="text-xs text-slate-400">of {numPages}</span></label>
          <label class="text-sm font-medium text-slate-700"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Position</span>
            <select value={corner} onChange={(e) => setCorner((e.target as HTMLSelectElement).value as any)} class="rounded-xl border border-slate-300 bg-white px-2 py-1.5 text-sm"><option value="br">Bottom-right</option><option value="bl">Bottom-left</option><option value="tr">Top-right</option><option value="tl">Top-left</option></select></label>
          <label class="text-sm font-medium text-slate-700"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Width (pt)</span>
            <input type="number" min={40} max={400} value={size} onInput={(e) => setSize(Number((e.target as HTMLInputElement).value))} class="w-24 rounded-xl border border-slate-300 bg-white px-2 py-1.5" /></label>
          <button type="button" onClick={sign} disabled={busy || !hasInk} class={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${busy || !hasInk ? 'bg-slate-400' : 'bg-brand-600 hover:bg-brand-700'}`}>{busy ? 'Signing…' : '⬇ Sign & download PDF'}</button>
        </div>
      )}

      {error && <p class="mt-3 text-sm font-medium text-red-700">✗ {error}</p>}

      <p class="mt-4 rounded-lg bg-white px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
        Draw your signature, pick the page and corner, and it\'s stamped onto the PDF with pdf-lib and downloaded — all in your browser. Signing a contract or form means handling a private document, so nothing is ever uploaded. The signature is flattened onto the page as an image. 🔒
      </p>
    </div>
  );
}
