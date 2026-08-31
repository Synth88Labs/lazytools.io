import { useState } from 'preact/hooks';

export default function PdfImpositionTool() {
  const [fileName, setFileName] = useState('');
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [n, setN] = useState<'2' | '4'>('2');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setFileName(f.name); setError('');
    const buf = await f.arrayBuffer(); setBytes(buf);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(buf);
      setPageCount(doc.getPageCount());
    } catch (err) { setError(`Could not open PDF: ${(err as Error).message}`); }
  }

  async function impose() {
    if (!bytes) return;
    setBusy(true); setError('');
    try {
      const { PDFDocument } = await import('pdf-lib');
      const src = await PDFDocument.load(bytes);
      const out = await PDFDocument.create();
      const count = src.getPageCount();
      const per = n === '2' ? 2 : 4;
      const cols = 2, rows = per === 2 ? 1 : 2;
      const { width: pw, height: ph } = src.getPage(0).getSize();
      // Output sheet: keep source page size so it prints on the same paper.
      const outW = pw, outH = ph;
      const cellW = outW / cols, cellH = outH / rows;
      for (let i = 0; i < count; i += per) {
        const sheet = out.addPage([outW, outH]);
        for (let j = 0; j < per && i + j < count; j++) {
          const emb = await out.embedPage(src.getPage(i + j));
          const scale = Math.min(cellW / pw, cellH / ph) * 0.96;
          const w = pw * scale, h = ph * scale;
          const col = j % cols, row = Math.floor(j / cols);
          const x = col * cellW + (cellW - w) / 2;
          const y = outH - (row + 1) * cellH + (cellH - h) / 2;
          sheet.drawPage(emb, { x, y, width: w, height: h });
        }
      }
      const data = await out.save();
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = (fileName.replace(/\.pdf$/i, '') || 'document') + `-${per}up.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { setError(`Could not impose: ${(err as Error).message}`); }
    setBusy(false);
  }

  const outSheets = pageCount ? Math.ceil(pageCount / (n === '2' ? 2 : 4)) : 0;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept=".pdf,application/pdf" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{fileName || 'Choose a PDF to place multiple pages per sheet'}</span>
        <span class="mt-1 block text-xs text-slate-500">Imposed on your device, never uploaded</span>
      </label>

      {pageCount > 0 && (
        <div class="mt-4 flex flex-wrap items-end gap-4">
          <label class="text-sm font-medium text-slate-700"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Pages per sheet</span>
            <select value={n} onChange={(e) => setN((e.target as HTMLSelectElement).value as '2' | '4')} class="rounded-xl border border-slate-300 bg-white px-2 py-1.5 text-sm"><option value="2">2 per sheet (2-up)</option><option value="4">4 per sheet (4-up)</option></select></label>
          <p class="text-sm text-slate-600">{pageCount} pages → <strong>{outSheets} sheet{outSheets === 1 ? '' : 's'}</strong></p>
          <button type="button" onClick={impose} disabled={busy} class={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${busy ? 'bg-slate-400' : 'bg-brand-600 hover:bg-brand-700'}`}>{busy ? 'Imposing…' : '⬇ Create & download'}</button>
        </div>
      )}

      {error && <p class="mt-3 text-sm font-medium text-red-700">✗ {error}</p>}

      <p class="mt-4 rounded-lg bg-white px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
        Places 2 or 4 of your PDF\'s pages, scaled down, onto each output sheet, handy for saving paper, printing handouts, or thumbnailing a document. Pages are embedded (not rasterised), so text stays crisp. Everything runs in your browser and the file is never uploaded. 🔒
      </p>
    </div>
  );
}
