import { useState } from 'preact/hooks';

interface Page { id: number; orig: number; thumb: string; }

export default function OrganizePdfTool() {
  const [fileName, setFileName] = useState('');
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setFileName(f.name);
    setError(''); setPages([]);
    setBusy(true);
    try {
      const buf = await f.arrayBuffer();
      setBytes(buf);
      const pdfjs = await import('pdfjs-dist');
      const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      const doc = await pdfjs.getDocument({ data: buf.slice(0) }).promise;
      const list: Page[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width; canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext('2d')!, viewport: vp }).promise;
        list.push({ id: i, orig: i - 1, thumb: canvas.toDataURL('image/jpeg', 0.7) });
      }
      await doc.destroy?.();
      setPages(list);
    } catch (err) {
      setError(`Could not open this PDF: ${(err as Error).message}`);
    }
    setBusy(false);
  }

  const move = (i: number, dir: -1 | 1) => setPages((p) => {
    const j = i + dir; if (j < 0 || j >= p.length) return p;
    const c = [...p]; [c[i], c[j]] = [c[j], c[i]]; return c;
  });
  const del = (id: number) => setPages((p) => p.filter((x) => x.id !== id));

  async function save() {
    if (!bytes || pages.length === 0) return;
    setBusy(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const src = await PDFDocument.load(bytes);
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, pages.map((p) => p.orig));
      copied.forEach((pg) => out.addPage(pg));
      const data = await out.save();
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = (fileName.replace(/\.pdf$/i, '') || 'organized') + '-organized.pdf'; a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Could not save: ${(err as Error).message}`);
    }
    setBusy(false);
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept=".pdf,application/pdf" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{fileName || 'Choose a PDF to reorder or delete pages'}</span>
        <span class="mt-1 block text-xs text-slate-500">Rearranged on your device — never uploaded</span>
      </label>

      {busy && <p class="mt-3 text-sm text-slate-600">Working…</p>}
      {error && <p class="mt-3 text-sm font-medium text-red-700">✗ {error}</p>}

      {pages.length > 0 && (
        <div class="mt-4">
          <p class="mb-2 text-sm text-slate-600">{pages.length} page{pages.length === 1 ? '' : 's'} — reorder with the arrows or remove with ✕.</p>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {pages.map((p, i) => (
              <div key={p.id} class="rounded-xl border border-slate-200 bg-white p-2">
                <img src={p.thumb} alt={`page ${p.orig + 1}`} class="mx-auto max-h-40 w-auto border border-slate-100" />
                <div class="mt-1.5 flex items-center justify-between">
                  <span class="text-xs text-slate-400">#{i + 1} <span class="text-slate-300">(orig {p.orig + 1})</span></span>
                  <span class="flex gap-0.5">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} class="rounded px-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30" title="Move left">←</button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === pages.length - 1} class="rounded px-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30" title="Move right">→</button>
                    <button type="button" onClick={() => del(p.id)} class="rounded px-1.5 text-red-500 hover:bg-red-50" title="Delete page">✕</button>
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div class="mt-4 flex justify-end">
            <button type="button" onClick={save} disabled={busy} class={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${busy ? 'bg-slate-400' : 'bg-brand-600 hover:bg-brand-700'}`}>⬇ Save organized PDF</button>
          </div>
        </div>
      )}

      <p class="mt-4 rounded-lg bg-white px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
        Rearrange, reorder or delete pages visually, then export a new PDF in the order shown. The document is opened and rewritten in your browser with pdf.js and pdf-lib — nothing is uploaded. Text, links and quality are preserved (pages are copied, not rasterised). 🔒
      </p>
    </div>
  );
}
