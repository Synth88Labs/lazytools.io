import { useState } from 'preact/hooks';

interface PageText {
  page: number;
  text: string;
}

async function extract(bytes: ArrayBuffer): Promise<PageText[]> {
  const pdfjs = await import('pdfjs-dist');
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const doc = await pdfjs.getDocument({ data: bytes.slice(0), useSystemFonts: true }).promise;
  const pages: PageText[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();
    const lines: string[] = [];
    let line = '';
    let lastY: number | null = null;
    for (const it of tc.items as any[]) {
      if (typeof it.str !== 'string') continue;
      const y = it.transform?.[5] ?? 0;
      if (lastY === null) {
        line = it.str;
      } else if (Math.abs(y - lastY) > 3) {
        lines.push(line);
        line = it.str;
      } else {
        line += it.str;
      }
      if (it.hasEOL) { lines.push(line); line = ''; lastY = null; continue; }
      lastY = y;
    }
    if (line) lines.push(line);
    const text = lines.join('\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    pages.push({ page: i, text });
  }
  await doc.destroy?.();
  return pages;
}

export default function PdfToTextTool() {
  const [fileName, setFileName] = useState('');
  const [pages, setPages] = useState<PageText[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [perPage, setPerPage] = useState(false);

  async function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setFileName(f.name);
    setError('');
    setPages(null);
    setBusy(true);
    try {
      setPages(await extract(await f.arrayBuffer()));
    } catch (err) {
      setError(`Could not read this PDF: ${(err as Error).message}`);
    }
    setBusy(false);
  }

  const combined = pages
    ? perPage
      ? pages.map((p) => `--- Page ${p.page} ---\n${p.text}`).join('\n\n')
      : pages.map((p) => p.text).filter(Boolean).join('\n\n')
    : '';
  const totalChars = combined.length;
  const empty = pages && totalChars === 0;

  async function copy() {
    try {
      await navigator.clipboard.writeText(combined);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch { /* clipboard blocked */ }
  }

  function download() {
    const blob = new Blob([combined], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (fileName.replace(/\.pdf$/i, '') || 'extracted') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept=".pdf,application/pdf" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{fileName || 'Choose a PDF to extract text from'}</span>
        <span class="mt-1 block text-xs text-slate-500">Read on your device, the document is never uploaded</span>
      </label>

      {busy && <p class="mt-3 text-sm text-slate-600">Extracting the text layer…</p>}
      {error && <p class="mt-3 text-sm font-medium text-red-700" aria-live="polite">✗ {error}</p>}

      {empty && (
        <div class="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          No selectable text found. This PDF is likely <strong>scanned or image-only</strong>, the pages are pictures, not text. Extracting words from images needs OCR, which this tool doesn't do.
        </div>
      )}

      {pages && totalChars > 0 && (
        <div class="mt-4">
          <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span class="text-xs text-slate-500">{pages.length} page{pages.length === 1 ? '' : 's'} · {totalChars.toLocaleString('en-US')} characters</span>
            <label class="flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={perPage} onChange={(e) => setPerPage((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200" />
              Mark page breaks
            </label>
          </div>
          <textarea
            readonly
            rows={16}
            value={combined}
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-800"
          />
          <div class="mt-3 flex flex-wrap justify-end gap-2">
            <button type="button" onClick={download} class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700">⬇ Download .txt</button>
            <button type="button" onClick={copy} class={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${copied ? 'bg-mint-600' : 'bg-brand-600 hover:bg-brand-700'}`}>{copied ? '✓ Copied' : 'Copy text'}</button>
          </div>
        </div>
      )}

      <p class="mt-4 rounded-lg bg-white px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
        Extracts the embedded text layer from digital PDFs, preserving line breaks as closely as the file allows. It doesn't OCR scanned pages (image-only PDFs return no text). Everything runs in your browser, the file never leaves your device. 🔒
      </p>
    </div>
  );
}
