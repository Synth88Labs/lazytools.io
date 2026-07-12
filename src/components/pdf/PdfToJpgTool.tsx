import { useState } from 'preact/hooks';

let pdfjsPromise: Promise<any> | null = null;
async function getPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const pdfjs = await import('pdfjs-dist');
      const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      return pdfjs;
    })();
  }
  return pdfjsPromise;
}

const MAX_PAGES = 100;
const QUALITY: { label: string; scale: number }[] = [
  { label: 'Screen (72 dpi)', scale: 1 },
  { label: 'Good (144 dpi)', scale: 2 },
  { label: 'High (216 dpi)', scale: 3 },
];

interface PageImg { n: number; url: string; w: number; h: number; }

export default function PdfToJpgTool() {
  const [fileName, setFileName] = useState('');
  const [format, setFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [quality, setQuality] = useState(2); // scale
  const [jpgQ, setJpgQ] = useState(0.9);
  const [pages, setPages] = useState<PageImg[]>([]);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [truncated, setTruncated] = useState(0);

  const base = fileName.replace(/\.pdf$/i, '') || 'page';
  const ext = format === 'jpeg' ? 'jpg' : 'png';

  async function convert(buf: ArrayBuffer) {
    setError(''); setPages([]); setTruncated(0);
    try {
      const pdfjs = await getPdfjs();
      const doc = await pdfjs.getDocument({ data: buf.slice(0), useSystemFonts: true }).promise;
      const total = doc.numPages;
      const limit = Math.min(total, MAX_PAGES);
      if (total > MAX_PAGES) setTruncated(total - MAX_PAGES);
      const out: PageImg[] = [];
      for (let i = 1; i <= limit; i++) {
        setBusy(`Rendering page ${i} of ${limit}…`);
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale: quality });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(vp.width);
        canvas.height = Math.ceil(vp.height);
        const ctx = canvas.getContext('2d')!;
        if (format === 'jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        await page.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
        const url = canvas.toDataURL(format === 'jpeg' ? 'image/jpeg' : 'image/png', format === 'jpeg' ? jpgQ : undefined);
        out.push({ n: i, url, w: canvas.width, h: canvas.height });
        setPages([...out]);
      }
      setBusy('');
    } catch (e) {
      setError('Could not read that PDF — it may be encrypted or damaged.');
      setBusy('');
    }
  }

  function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => convert(reader.result as ArrayBuffer);
    reader.readAsArrayBuffer(f);
  }

  function download(p: PageImg) {
    const a = document.createElement('a');
    a.href = p.url; a.download = `${base}-${String(p.n).padStart(2, '0')}.${ext}`;
    document.body.appendChild(a); a.click(); a.remove();
  }
  async function downloadAll() {
    for (const p of pages) { download(p); await new Promise((r) => setTimeout(r, 150)); }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-center gap-3">
        <label class="cursor-pointer rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          Choose PDF<input type="file" accept="application/pdf,.pdf" onChange={onFile} class="hidden" />
        </label>
        {fileName && <span class="text-sm text-slate-600">{fileName}</span>}
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <label>Format
          <select value={format} onChange={(e) => setFormat((e.target as HTMLSelectElement).value as 'jpeg' | 'png')} class="ml-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm">
            <option value="jpeg">JPG</option><option value="png">PNG (lossless)</option>
          </select>
        </label>
        <label>Resolution
          <select value={String(quality)} onChange={(e) => setQuality(Number((e.target as HTMLSelectElement).value))} class="ml-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm">
            {QUALITY.map((q) => <option value={String(q.scale)}>{q.label}</option>)}
          </select>
        </label>
        {format === 'jpeg' && (
          <label>JPG quality
            <input type="range" min="0.5" max="1" step="0.05" value={jpgQ} onInput={(e) => setJpgQ(Number((e.target as HTMLInputElement).value))} class="ml-2 align-middle" /> <span class="font-mono">{Math.round(jpgQ * 100)}%</span>
          </label>
        )}
        {fileName && <button onClick={() => { const inp = document.querySelector<HTMLInputElement>('input[type=file]'); inp?.files?.[0] && inp.files[0].arrayBuffer().then(convert); }} class="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 hover:border-brand-400">Re-render</button>}
      </div>

      {busy && <p class="mt-3 text-sm text-brand-700">{busy}</p>}
      {error && <p class="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 ring-1 ring-rose-200">{error}</p>}

      {pages.length > 0 && (
        <>
          <div class="mt-4 flex items-center justify-between">
            <p class="text-sm font-semibold text-slate-700">{pages.length} page{pages.length === 1 ? '' : 's'} ready</p>
            <button onClick={downloadAll} class="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700">Download all</button>
          </div>
          {truncated > 0 && <p class="mt-1 text-xs text-amber-700">Only the first {MAX_PAGES} pages were converted ({truncated} more skipped) to stay responsive.</p>}
          <div class="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {pages.map((p) => (
              <div key={p.n} class="rounded-xl bg-white p-2 ring-1 ring-slate-200">
                <img src={p.url} alt={`Page ${p.n}`} class="h-auto w-full rounded border border-slate-200" loading="lazy" />
                <div class="mt-1.5 flex items-center justify-between">
                  <span class="text-xs text-slate-500">Page {p.n}</span>
                  <button onClick={() => download(p)} class="rounded bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white hover:bg-brand-700">Save</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <p class="mt-4 text-xs text-slate-500">Renders each PDF page to an image with pdf.js and lets you save them as JPG or PNG — the whole conversion happens in your browser, so the PDF is never uploaded. Higher resolution gives sharper images but larger files; JPG is smaller, PNG is lossless (best for text and line art). For a scanned document, "High" resolution keeps the text readable. 🔒 In your browser.</p>
    </div>
  );
}
