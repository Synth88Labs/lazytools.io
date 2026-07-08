import { useEffect, useState } from 'preact/hooks';
import { PDFDocument, degrees } from 'pdf-lib';
import { fmtSize } from '../../lib/audio-compute';
import { renderPdfThumbs, renderFirstPageThumb, indicesToRange, THUMB_PAGE_CAP } from '../../lib/pdf-preview';

interface Props {
  mode: 'merge' | 'split' | 'images-to-pdf' | 'rotate';
}

interface FileMeta {
  thumb: string; // data-URL (pdf first page) or object URL (image)
  pages: number;
}

/** Parse "1-4, 7, 12-15" into zero-based page indices, clamped to pageCount. */
function parseRange(spec: string, pageCount: number): number[] {
  const out = new Set<number>();
  for (const part of spec.split(',').map((s) => s.trim()).filter(Boolean)) {
    const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      const a = parseInt(m[1]!, 10), b = parseInt(m[2]!, 10);
      for (let p = Math.min(a, b); p <= Math.max(a, b); p++) if (p >= 1 && p <= pageCount) out.add(p - 1);
    } else if (/^\d+$/.test(part)) {
      const p = parseInt(part, 10);
      if (p >= 1 && p <= pageCount) out.add(p - 1);
    }
  }
  return [...out].sort((x, y) => x - y);
}

export default function PdfTool({ mode }: Props) {
  const multi = mode === 'merge' || mode === 'images-to-pdf';
  const [files, setFiles] = useState<File[]>([]);
  const [meta, setMeta] = useState<FileMeta[]>([]); // parallel to files (multi modes)
  const [pageCount, setPageCount] = useState(0);
  const [thumbs, setThumbs] = useState<string[]>([]); // single-file modes
  const [previewBusy, setPreviewBusy] = useState(false);
  const [range, setRange] = useState('');
  const [rotation, setRotation] = useState(90);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  useEffect(() => () => { meta.forEach((m) => m.thumb.startsWith('blob:') && URL.revokeObjectURL(m.thumb)); }, []);

  async function onFiles(e: Event) {
    const list = Array.from((e.target as HTMLInputElement).files ?? []);
    if (!list.length) return;
    setError('');
    setDone('');
    if (multi) {
      const start = files.length;
      setFiles((prev) => [...prev, ...list]);
      setMeta((prev) => [...prev, ...list.map(() => ({ thumb: '', pages: 0 }))]);
      // fill previews asynchronously, one by one
      for (let k = 0; k < list.length; k++) {
        const f = list[k]!;
        try {
          const m: FileMeta =
            mode === 'images-to-pdf'
              ? { thumb: URL.createObjectURL(f), pages: 1 }
              : await renderFirstPageThumb(await f.arrayBuffer()).then((r) => ({ thumb: r.thumb, pages: r.pageCount }));
          setMeta((prev) => prev.map((x, i) => (i === start + k ? m : x)));
        } catch { /* keep placeholder */ }
      }
    } else {
      setFiles(list.slice(0, 1));
      setThumbs([]);
      try {
        const bytes = await list[0]!.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: false });
        setPageCount(doc.getPageCount());
        if (mode === 'split') setRange(`1-${doc.getPageCount()}`);
        if (mode === 'rotate') setRange('');
        setPreviewBusy(true);
        renderPdfThumbs(bytes)
          .then((r) => setThumbs(r.thumbs))
          .catch((err) => { console.error('pdf preview failed:', err); setThumbs([]); })
          .finally(() => setPreviewBusy(false));
      } catch {
        setError('Could not read this PDF — it may be password-protected or corrupted.');
        setFiles([]);
        setPageCount(0);
      }
    }
    (e.target as HTMLInputElement).value = '';
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= files.length) return;
    const swap = <T,>(arr: T[]) => { const n = [...arr]; [n[i], n[j]] = [n[j]!, n[i]!]; return n; };
    setFiles(swap);
    setMeta(swap);
  }

  function removeAt(i: number) {
    const m = meta[i];
    if (m?.thumb.startsWith('blob:')) URL.revokeObjectURL(m.thumb);
    setFiles(files.filter((_, j) => j !== i));
    setMeta(meta.filter((_, j) => j !== i));
  }

  const selected = new Set(parseRange(range, pageCount));
  const rotateAll = mode === 'rotate' && range.trim() === '';

  function togglePage(idx: number) {
    const next = new Set(selected);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setRange(indicesToRange([...next]));
  }

  async function run() {
    if (!files.length) return;
    setBusy(true);
    setError('');
    setDone('');
    try {
      let out: PDFDocument;
      let outName = 'output.pdf';

      if (mode === 'merge') {
        out = await PDFDocument.create();
        for (const f of files) {
          const src = await PDFDocument.load(await f.arrayBuffer());
          const pages = await out.copyPages(src, src.getPageIndices());
          pages.forEach((p) => out.addPage(p));
        }
        outName = 'merged.pdf';
      } else if (mode === 'images-to-pdf') {
        out = await PDFDocument.create();
        for (const f of files) {
          const bytes = await f.arrayBuffer();
          const img = f.type === 'image/png' ? await out.embedPng(bytes) : await out.embedJpg(bytes);
          const page = out.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
        outName = 'images.pdf';
      } else {
        const src = await PDFDocument.load(await files[0]!.arrayBuffer());
        if (mode === 'split') {
          const indices = parseRange(range, src.getPageCount());
          if (!indices.length) throw new Error('No valid pages in that range — use forms like 3-9 or 1, 4, 7.');
          out = await PDFDocument.create();
          const pages = await out.copyPages(src, indices);
          pages.forEach((p) => out.addPage(p));
          outName = `${files[0]!.name.replace(/\.pdf$/i, '')}-pages.pdf`;
        } else {
          // rotate in place
          const indices = range.trim() ? parseRange(range, src.getPageCount()) : src.getPageIndices();
          if (!indices.length) throw new Error('No valid pages in that range.');
          for (const i of indices) {
            const page = src.getPage(i);
            page.setRotation(degrees(((page.getRotation().angle + rotation) % 360 + 360) % 360));
          }
          out = src;
          outName = `${files[0]!.name.replace(/\.pdf$/i, '')}-rotated.pdf`;
        }
      }

      const bytes = await out.save();
      const ab = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(ab).set(bytes);
      const blob = new Blob([ab], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = outName;
      a.click();
      URL.revokeObjectURL(url);
      setDone(`✓ ${outName} (${fmtSize(blob.size)}) — download started.`);
    } catch (e) {
      setError((e as Error).message || 'Processing failed — the file may be encrypted or damaged.');
    }
    setBusy(false);
  }

  const accept = mode === 'images-to-pdf' ? 'image/jpeg,image/png' : 'application/pdf';
  const inputCls =
    'rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none';
  const rotClass = rotation === 90 ? 'rotate-90' : rotation === 180 ? 'rotate-180' : '-rotate-90';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept={accept} multiple={multi} onChange={onFiles} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">
          {multi ? `Add ${mode === 'merge' ? 'PDF files' : 'JPG / PNG images'}` : files[0] ? files[0].name : 'Choose a PDF'}
        </span>
        <span class="mt-1 block text-xs text-slate-500">
          {!multi && files[0] ? `${fmtSize(files[0].size)} · ${pageCount} pages` : 'Processed in your browser — nothing is uploaded'}
        </span>
      </label>

      {multi && files.length > 0 && (
        <ul class="mt-3 space-y-1.5">
          {files.map((f, i) => (
            <li class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <span class="w-6 text-center font-bold text-slate-400">{i + 1}</span>
              {meta[i]?.thumb ? (
                <img src={meta[i]!.thumb} alt={`First page of ${f.name}`} class="h-14 w-11 rounded border border-slate-200 bg-white object-contain" />
              ) : (
                <span class="flex h-14 w-11 items-center justify-center rounded border border-dashed border-slate-200 text-[10px] text-slate-400">…</span>
              )}
              <span class="min-w-0 flex-1 truncate font-medium text-slate-800">
                {f.name}
                {mode === 'merge' && meta[i]?.pages ? <span class="ml-1.5 text-xs font-normal text-slate-500">{meta[i]!.pages} p.</span> : null}
              </span>
              <span class="text-xs text-slate-500">{fmtSize(f.size)}</span>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} class="rounded border border-slate-300 px-1.5 text-xs text-slate-600 disabled:opacity-30" aria-label={`Move ${f.name} up`}>↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === files.length - 1} class="rounded border border-slate-300 px-1.5 text-xs text-slate-600 disabled:opacity-30" aria-label={`Move ${f.name} down`}>↓</button>
              <button type="button" onClick={() => removeAt(i)} class="rounded border border-slate-300 px-1.5 text-xs text-red-600" aria-label={`Remove ${f.name}`}>✕</button>
            </li>
          ))}
        </ul>
      )}

      {mode === 'split' && files.length > 0 && (
        <div class="mt-4">
          <label for="pt-range" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Pages to extract (of {pageCount})</label>
          <input id="pt-range" type="text" value={range} onInput={(e) => setRange((e.target as HTMLInputElement).value)} placeholder="e.g. 3-9 or 1, 4, 7-10" class={`${inputCls} w-full max-w-sm`} spellcheck={false} />
        </div>
      )}

      {mode === 'rotate' && files.length > 0 && (
        <div class="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <label for="pt-rot" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Rotation</label>
            <select id="pt-rot" value={rotation} onChange={(e) => setRotation(parseInt((e.target as HTMLSelectElement).value, 10))} class={inputCls}>
              <option value={90}>90° clockwise</option>
              <option value={180}>180° (upside down)</option>
              <option value={270}>90° counter-clockwise</option>
            </select>
          </div>
          <div>
            <label for="pt-rrange" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Pages (empty = all {pageCount})</label>
            <input id="pt-rrange" type="text" value={range} onInput={(e) => setRange((e.target as HTMLInputElement).value)} placeholder="e.g. 2, 4, 6" class={`${inputCls} w-44`} spellcheck={false} />
          </div>
        </div>
      )}

      {/* live page preview for split & rotate */}
      {!multi && files.length > 0 && (
        <div class="mt-4">
          {previewBusy && <p class="text-xs text-slate-500">Rendering page preview…</p>}
          {thumbs.length > 0 && (
            <>
              <p class="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Live preview{mode === 'split' ? ' — click pages to select' : rotateAll ? ' — all pages rotate' : ' — click pages to choose which rotate'}
              </p>
              <ul class="grid max-h-96 grid-cols-3 gap-2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 sm:grid-cols-5 lg:grid-cols-6">
                {thumbs.map((t, i) => {
                  const active = mode === 'split' ? selected.has(i) : rotateAll || selected.has(i);
                  return (
                    <li>
                      <button
                        type="button"
                        onClick={() => togglePage(i)}
                        class={`group relative flex w-full flex-col items-center rounded-lg border p-1.5 transition ${active ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200' : 'border-slate-200 bg-white opacity-70 hover:opacity-100'}`}
                        aria-pressed={active}
                        aria-label={`Page ${i + 1}${active ? ' (selected)' : ''}`}
                      >
                        <span class="flex h-28 w-full items-center justify-center overflow-hidden">
                          {t ? (
                            <img
                              src={t}
                              alt={`Page ${i + 1}`}
                              class={`max-h-28 max-w-full rounded border border-slate-100 transition-transform ${mode === 'rotate' && active ? `${rotClass} ${rotation !== 180 ? 'scale-[0.7]' : ''}` : ''}`}
                            />
                          ) : (
                            <span class="text-xs text-slate-400">page {i + 1}</span>
                          )}
                        </span>
                        <span class={`mt-1 text-xs font-semibold ${active ? 'text-brand-800' : 'text-slate-500'}`}>
                          {i + 1}{mode === 'split' && active ? ' ✓' : mode === 'rotate' && active ? ` ↻${rotation}°` : ''}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {pageCount > THUMB_PAGE_CAP && (
                <p class="mt-1.5 text-xs text-slate-500">Previewing the first {THUMB_PAGE_CAP} of {pageCount} pages — the range field still addresses every page.</p>
              )}
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={run}
        disabled={busy || files.length === 0 || (mode === 'merge' && files.length < 2)}
        class="mt-4 w-full rounded-xl bg-brand-700 px-4 py-3 text-base font-semibold text-white transition hover:bg-brand-800 disabled:opacity-40 sm:w-auto sm:px-8"
      >
        {busy ? 'Working…' : mode === 'merge' ? `🧷 Merge ${files.length || ''} PDFs` : mode === 'split' ? `✂ Extract ${selected.size || ''} page${selected.size === 1 ? '' : 's'}` : mode === 'rotate' ? '🔄 Rotate & save' : `🖼️ Create PDF from ${files.length || ''} images`}
      </button>

      <div aria-live="polite">
        {error && <p class="mt-3 text-sm font-medium text-red-700">✗ {error}</p>}
        {done && <p class="mt-3 text-sm font-medium text-mint-700">{done}</p>}
      </div>
    </div>
  );
}
