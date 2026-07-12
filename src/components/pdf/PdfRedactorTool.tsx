import { useRef, useState } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';
import { keepRenderingWhenHidden } from '../../lib/pdf-preview';

interface Box {
  page: number; // zero-based
  x: number; y: number; w: number; h: number; // fractions of page width/height (0..1)
}

const RENDER_SCALE = 2; // export DPI ≈ 144; display scaled to fit

let pdfjsPromise: Promise<any> | null = null;
async function getPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      keepRenderingWhenHidden();
      const pdfjs = await import('pdfjs-dist');
      const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      return pdfjs;
    })();
  }
  return pdfjsPromise;
}

export default function PdfRedactorTool() {
  const [fileName, setFileName] = useState('');
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageNo, setPageNo] = useState(0); // zero-based current page
  const [pageImg, setPageImg] = useState(''); // data-URL of current page render
  const [pageDims, setPageDims] = useState<{ w: number; h: number }[]>([]); // page sizes in pt
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [drag, setDrag] = useState<{ x: number; y: number; cx: number; cy: number } | null>(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState('');
  const frameRef = useRef<HTMLDivElement>(null);

  async function renderPage(buf: ArrayBuffer, idx: number) {
    setBusy('Rendering page…');
    try {
      const pdfjs = await getPdfjs();
      const task = pdfjs.getDocument({ data: buf.slice(0), useSystemFonts: true });
      const doc = await task.promise;
      const page = await doc.getPage(idx + 1);
      const vp = page.getViewport({ scale: RENDER_SCALE });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(vp.width);
      canvas.height = Math.ceil(vp.height);
      const ctx = canvas.getContext('2d')!;
      await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
      setPageImg(canvas.toDataURL('image/jpeg', 0.85));
      await task.destroy();
    } catch (e) {
      setError(`Could not render page ${idx + 1}: ${(e as Error).message}`);
    }
    setBusy('');
  }

  async function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setError('');
    setDone('');
    setBoxes([]);
    setPageNo(0);
    setPageImg('');
    try {
      const buf = await f.arrayBuffer();
      const pdfjs = await getPdfjs();
      const task = pdfjs.getDocument({ data: buf.slice(0), useSystemFonts: true });
      const doc = await task.promise;
      const dims: { w: number; h: number }[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const p = await doc.getPage(i);
        const vp = p.getViewport({ scale: 1 });
        dims.push({ w: vp.width, h: vp.height });
      }
      setPageCount(doc.numPages);
      setPageDims(dims);
      await task.destroy();
      setFileName(f.name);
      setBytes(buf);
      await renderPage(buf, 0);
    } catch (err) {
      setError('Could not read this PDF — it may be password-protected or corrupted.');
    }
    (e.target as HTMLInputElement).value = '';
  }

  async function goto(idx: number) {
    if (!bytes || idx < 0 || idx >= pageCount) return;
    setPageNo(idx);
    setPageImg('');
    await renderPage(bytes, idx);
  }

  function frac(e: PointerEvent): { x: number; y: number } {
    const r = frameRef.current!.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    };
  }
  function down(e: PointerEvent) {
    if (!pageImg) return;
    e.preventDefault();
    const p = frac(e);
    setDrag({ x: p.x, y: p.y, cx: p.x, cy: p.y });
  }
  function moveP(e: PointerEvent) {
    if (!drag) return;
    e.preventDefault();
    const p = frac(e);
    setDrag({ ...drag, cx: p.x, cy: p.y });
  }
  function up() {
    if (!drag) return;
    const x = Math.min(drag.x, drag.cx), y = Math.min(drag.y, drag.cy);
    const w = Math.abs(drag.cx - drag.x), h = Math.abs(drag.cy - drag.y);
    if (w > 0.005 && h > 0.005) setBoxes((b) => [...b, { page: pageNo, x, y, w, h }]);
    setDrag(null);
  }

  const pageBoxes = boxes.filter((b) => b.page === pageNo);

  async function redact() {
    if (!bytes) return;
    setBusy('Flattening pages…');
    setError('');
    setDone('');
    try {
      const pdfjs = await getPdfjs();
      const { PDFDocument } = await import('pdf-lib');
      const task = pdfjs.getDocument({ data: bytes.slice(0), useSystemFonts: true });
      const src = await task.promise;
      const out = await PDFDocument.create();
      for (let i = 0; i < pageCount; i++) {
        setBusy(`Flattening page ${i + 1} of ${pageCount}…`);
        const page = await src.getPage(i + 1);
        const vp = page.getViewport({ scale: RENDER_SCALE });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(vp.width);
        canvas.height = Math.ceil(vp.height);
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
        ctx.fillStyle = '#000000';
        for (const b of boxes.filter((x) => x.page === i)) {
          ctx.fillRect(b.x * canvas.width, b.y * canvas.height, b.w * canvas.width, b.h * canvas.height);
        }
        const jpg = await out.embedJpg(await (await fetch(canvas.toDataURL('image/jpeg', 0.92))).arrayBuffer());
        const dims = pageDims[i]!;
        const p = out.addPage([dims.w, dims.h]);
        p.drawImage(jpg, { x: 0, y: 0, width: dims.w, height: dims.h });
      }
      await task.destroy();
      const outBytes = await out.save();
      const ab = new ArrayBuffer(outBytes.byteLength);
      new Uint8Array(ab).set(outBytes);
      const blob = new Blob([ab], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.replace(/\.pdf$/i, '') + '-redacted.pdf';
      a.click();
      URL.revokeObjectURL(url);
      setDone(`✓ ${fileName.replace(/\.pdf$/i, '')}-redacted.pdf (${fmtSize(blob.size)}) — every page flattened to an image; no text layer, no metadata, no attachments survive. Verify it with the redaction checker.`);
    } catch (e) {
      setError(`Redaction failed: ${(e as Error).message}`);
    }
    setBusy('');
  }

  const dragRect = drag
    ? { left: `${Math.min(drag.x, drag.cx) * 100}%`, top: `${Math.min(drag.y, drag.cy) * 100}%`, width: `${Math.abs(drag.cx - drag.x) * 100}%`, height: `${Math.abs(drag.cy - drag.y) * 100}%` }
    : null;

  const btn = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400 disabled:opacity-40';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept=".pdf,application/pdf" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{fileName || 'Choose a PDF to redact'}</span>
        <span class="mt-1 block text-xs text-slate-500">Drawn boxes are burned in and pages flattened to images — locally, nothing uploaded</span>
      </label>

      {bytes && (
        <>
          <div class="mt-4 flex flex-wrap items-center gap-2">
            <button type="button" class={btn} disabled={pageNo === 0} onClick={() => goto(pageNo - 1)}>← Prev</button>
            <span class="text-sm font-semibold text-slate-700">Page {pageNo + 1} / {pageCount}</span>
            <button type="button" class={btn} disabled={pageNo >= pageCount - 1} onClick={() => goto(pageNo + 1)}>Next →</button>
            <span class="mx-1 h-5 w-px bg-slate-200" />
            <span class="text-sm text-slate-600">{boxes.length} box{boxes.length === 1 ? '' : 'es'} total · {pageBoxes.length} on this page</span>
            <button type="button" class={btn} disabled={!boxes.length} onClick={() => setBoxes((b) => b.slice(0, -1))}>↶ Undo box</button>
            <button type="button" class={`${btn} !text-red-600`} disabled={!boxes.length} onClick={() => setBoxes([])}>Clear all</button>
          </div>

          <div class="mt-3 overflow-auto rounded-xl border border-slate-200 bg-white p-2">
            <div
              ref={frameRef}
              class="relative mx-auto max-w-2xl touch-none select-none"
              style="cursor:crosshair"
              onPointerDown={(e) => down(e as unknown as PointerEvent)}
              onPointerMove={(e) => moveP(e as unknown as PointerEvent)}
              onPointerUp={up}
              onPointerLeave={up}
            >
              {pageImg ? (
                <img src={pageImg} alt={`Page ${pageNo + 1}`} class="pointer-events-none w-full rounded border border-slate-100" draggable={false} />
              ) : (
                <div class="flex h-64 items-center justify-center text-sm text-slate-500">{busy || 'Rendering…'}</div>
              )}
              {pageBoxes.map((b) => (
                <span class="absolute bg-black" style={`left:${b.x * 100}%;top:${b.y * 100}%;width:${b.w * 100}%;height:${b.h * 100}%`} />
              ))}
              {dragRect && <span class="absolute border-2 border-red-500 bg-black/70" style={dragRect} />}
            </div>
          </div>
          <p class="mt-1.5 text-xs text-slate-500">Click and drag on the page to draw a black box over anything to remove. Boxes apply per page.</p>

          <button
            type="button"
            onClick={redact}
            disabled={!!busy || boxes.length === 0}
            class="mt-4 w-full rounded-xl bg-brand-700 px-4 py-3 text-base font-semibold text-white transition hover:bg-brand-800 disabled:opacity-40 sm:w-auto sm:px-8"
          >
            {busy || `⬛ Redact & download (flatten ${pageCount} page${pageCount > 1 ? 's' : ''})`}
          </button>
        </>
      )}

      <div aria-live="polite">
        {error && <p class="mt-3 text-sm font-medium text-red-700">✗ {error}</p>}
        {done && <p class="mt-3 text-sm font-medium text-mint-700">{done}</p>}
      </div>

      <p class="mt-4 rounded-lg bg-white px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
        <strong class="text-slate-700">Safe by construction:</strong> instead of hiding text under boxes (the failure mode behind most redaction scandals), every page is re-rendered as a flat image with the boxes burned in — the underlying text, fonts, metadata and attachments simply don't exist in the output. Trade-off: the result is no longer searchable or selectable (like a scan), and it needs OCR to become accessible again. Verify any redaction with the <a href="/pdf/redaction-checker/" class="font-semibold text-brand-700 underline decoration-slate-300 underline-offset-2">redaction checker</a>.
      </p>
    </div>
  );
}
