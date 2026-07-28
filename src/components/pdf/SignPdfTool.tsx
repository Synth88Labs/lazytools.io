import { useRef, useState, useEffect } from 'preact/hooks';

interface Preview { url: string; w: number; h: number; pageW: number; pageH: number; }
const PAD_W = 600, PAD_H = 200, SIG_ASPECT = PAD_H / PAD_W; // 1:3

export default function SignPdfTool() {
  const [fileName, setFileName] = useState('');
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [sigUrl, setSigUrl] = useState('');
  const [pos, setPos] = useState({ x: 40, y: 40 });   // top-left in preview px
  const [sigW, setSigW] = useState(180);               // signature width in preview px
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const padRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  // signature pad drawing
  useEffect(() => {
    const c = padRef.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.strokeStyle = '#0f172a';
    const at = (e: PointerEvent) => { const r = c.getBoundingClientRect(); return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) }; };
    const down = (e: PointerEvent) => { drawing.current = true; const p = at(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); c.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!drawing.current) return; const p = at(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
    const up = () => { if (drawing.current) { drawing.current = false; setSigUrl(c.toDataURL('image/png')); } };
    c.addEventListener('pointerdown', down); c.addEventListener('pointermove', move); c.addEventListener('pointerup', up); c.addEventListener('pointerleave', up);
    return () => { c.removeEventListener('pointerdown', down); c.removeEventListener('pointermove', move); c.removeEventListener('pointerup', up); c.removeEventListener('pointerleave', up); };
  }, []);

  function clearPad() { const c = padRef.current!; c.getContext('2d')!.clearRect(0, 0, c.width, c.height); setSigUrl(''); }

  async function renderPage(buf: ArrayBuffer, pageNum: number) {
    const pdfjs = await import('pdfjs-dist');
    const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    const doc = await pdfjs.getDocument({ data: buf.slice(0) }).promise;
    const pg = await doc.getPage(pageNum);
    const base = pg.getViewport({ scale: 1 });
    const scale = Math.min(520, base.width) / base.width;
    const vp = pg.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = vp.width; canvas.height = vp.height;
    await pg.render({ canvasContext: canvas.getContext('2d')!, viewport: vp }).promise;
    await doc.destroy?.();
    setPreview({ url: canvas.toDataURL('image/png'), w: vp.width, h: vp.height, pageW: base.width, pageH: base.height });
  }

  async function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return;
    setFileName(f.name); setError(''); setPreview(null);
    setBusy(true);
    try {
      const buf = await f.arrayBuffer(); setBytes(buf);
      const { PDFDocument } = await import('pdf-lib');
      setNumPages((await PDFDocument.load(buf)).getPageCount());
      setPage(1);
      await renderPage(buf, 1);
    } catch (err) { setError(`Could not open PDF: ${(err as Error).message}`); }
    setBusy(false);
  }

  async function changePage(p: number) {
    if (!bytes || p < 1 || p > numPages) return;
    setPage(p); setBusy(true);
    try { await renderPage(bytes, p); } catch (err) { setError((err as Error).message); }
    setBusy(false);
  }

  // dragging the signature overlay
  function startDrag(e: PointerEvent) {
    e.preventDefault();
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onDrag(e: PointerEvent) {
    if (!drag.current || !preview) return;
    const nx = Math.max(0, Math.min(preview.w - sigW, e.clientX - drag.current.dx));
    const ny = Math.max(0, Math.min(preview.h - sigW * SIG_ASPECT, e.clientY - drag.current.dy));
    setPos({ x: nx, y: ny });
  }
  function endDrag() { drag.current = null; }

  async function sign() {
    if (!bytes || !sigUrl || !preview) return;
    setBusy(true); setError('');
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(bytes);
      const png = await doc.embedPng(sigUrl);
      const pg = doc.getPage(page - 1);
      const toPdf = preview.pageW / preview.w;
      const wpt = sigW * toPdf, hpt = wpt * SIG_ASPECT;
      const sigHpx = sigW * SIG_ASPECT;
      const xpt = pos.x * toPdf;
      const ypt = (preview.h - pos.y - sigHpx) * toPdf; // flip to PDF bottom-left origin
      pg.drawImage(png, { x: xpt, y: ypt, width: wpt, height: hpt });
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

      <div class="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <div class="mb-1 flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">1. Draw your signature</span>
            <button type="button" onClick={clearPad} class="text-xs font-semibold text-brand-700 hover:underline">Clear</button>
          </div>
          <canvas ref={padRef} width={PAD_W} height={PAD_H} class="w-full touch-none rounded-xl border border-slate-300 bg-white" style="aspect-ratio:3/1" />
          {sigUrl && (
            <label class="mt-3 flex items-center gap-3 text-sm font-medium text-slate-700">
              Signature size
              <input type="range" min={80} max={preview ? preview.w : 320} value={sigW} onInput={(e) => setSigW(Number((e.target as HTMLInputElement).value))} class="flex-1 accent-brand-600" />
            </label>
          )}
        </div>

        <div>
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">2. Drag the signature onto the page</span>
          {busy && !preview && <p class="text-sm text-slate-600">Rendering page…</p>}
          {preview && (
            <div class="relative inline-block select-none rounded-lg border border-slate-200 shadow-sm" style={`width:${preview.w}px;max-width:100%`}>
              <img src={preview.url} alt={`page ${page}`} class="block w-full rounded-lg" draggable={false} />
              {sigUrl && (
                <img
                  src={sigUrl}
                  alt="signature"
                  onPointerDown={startDrag}
                  onPointerMove={onDrag}
                  onPointerUp={endDrag}
                  class="absolute cursor-move touch-none rounded ring-1 ring-brand-300/60 hover:ring-brand-500"
                  style={`left:${(pos.x / preview.w) * 100}%;top:${(pos.y / preview.h) * 100}%;width:${(sigW / preview.w) * 100}%`}
                  draggable={false}
                />
              )}
            </div>
          )}
          {numPages > 1 && (
            <div class="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <button type="button" onClick={() => changePage(page - 1)} disabled={page <= 1 || busy} class="rounded border border-slate-300 bg-white px-2 py-0.5 disabled:opacity-40">←</button>
              Page {page} of {numPages}
              <button type="button" onClick={() => changePage(page + 1)} disabled={page >= numPages || busy} class="rounded border border-slate-300 bg-white px-2 py-0.5 disabled:opacity-40">→</button>
            </div>
          )}
        </div>
      </div>

      {error && <p class="mt-3 text-sm font-medium text-red-700">✗ {error}</p>}

      {preview && (
        <div class="mt-4 flex justify-end">
          <button type="button" onClick={sign} disabled={busy || !sigUrl} class={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${busy || !sigUrl ? 'bg-slate-400' : 'bg-brand-600 hover:bg-brand-700'}`}>{busy ? 'Signing…' : !sigUrl ? 'Draw a signature first' : '⬇ Sign & download PDF'}</button>
        </div>
      )}

      <p class="mt-4 rounded-lg bg-white px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
        Draw your signature, then drag it to exactly where it should go on the live page preview and resize it — what you see is where it lands. It\'s stamped onto the PDF with pdf-lib and downloaded, all in your browser, so a private contract never leaves your device. This is a visual signature for everyday forms, not a certificate-based digital signature. 🔒
      </p>
    </div>
  );
}
