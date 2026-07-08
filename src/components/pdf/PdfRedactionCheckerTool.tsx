import { useMemo, useState } from 'preact/hooks';

interface PageText {
  page: number;
  text: string;
}
interface Findings {
  pages: PageText[];
  totalChars: number;
  annotations: { page: number; type: string }[];
  meta: [string, string][];
  attachments: string[];
}

async function analyze(bytes: ArrayBuffer): Promise<Findings> {
  const pdfjs = await import('pdfjs-dist');
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const task = pdfjs.getDocument({ data: bytes.slice(0), useSystemFonts: true });
  const doc = await task.promise;

  const pages: PageText[] = [];
  const annotations: { page: number; type: string }[] = [];
  let totalChars = 0;
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();
    const text = tc.items.map((it: any) => it.str ?? '').join(' ').replace(/\s+/g, ' ').trim();
    totalChars += text.length;
    pages.push({ page: i, text });
    const annots = await page.getAnnotations().catch(() => []);
    for (const a of annots) if (a.subtype && a.subtype !== 'Link') annotations.push({ page: i, type: a.subtype });
  }

  const metaRaw = await doc.getMetadata().catch(() => null);
  const meta: [string, string][] = [];
  const info = (metaRaw?.info ?? {}) as Record<string, unknown>;
  for (const k of ['Title', 'Author', 'Subject', 'Keywords', 'Creator', 'Producer', 'CreationDate', 'ModDate']) {
    const v = info[k];
    if (typeof v === 'string' && v.trim()) meta.push([k, v.trim()]);
  }

  const att = await doc.getAttachments().catch(() => null);
  const attachments = att ? Object.keys(att) : [];

  await task.destroy();
  return { pages, totalChars, annotations, meta, attachments };
}

export default function PdfRedactionCheckerTool() {
  const [fileName, setFileName] = useState('');
  const [findings, setFindings] = useState<Findings | null>(null);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setFileName(f.name);
    setError('');
    setFindings(null);
    setQuery('');
    setBusy(true);
    try {
      setFindings(await analyze(await f.arrayBuffer()));
    } catch (err) {
      setError(`Could not analyse this PDF: ${(err as Error).message}`);
    }
    setBusy(false);
  }

  const hits = useMemo(() => {
    if (!findings || query.trim().length < 2) return null;
    const q = query.trim().toLowerCase();
    return findings.pages
      .map((p) => {
        const idx = p.text.toLowerCase().indexOf(q);
        if (idx === -1) return null;
        const from = Math.max(0, idx - 60);
        return { page: p.page, snippet: (from > 0 ? '…' : '') + p.text.slice(from, idx + q.length + 60) + '…' };
      })
      .filter(Boolean) as { page: number; snippet: string }[];
  }, [findings, query]);

  const overlayAnnots = findings?.annotations.filter((a) => ['Square', 'Highlight', 'Ink', 'FreeText'].includes(a.type)) ?? [];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept=".pdf,application/pdf" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{fileName || 'Choose the "redacted" PDF to test'}</span>
        <span class="mt-1 block text-xs text-slate-500">Analysed on your device — the document is never uploaded</span>
      </label>

      {busy && <p class="mt-3 text-sm text-slate-600">Extracting everything a copy-paste can still read…</p>}
      {error && <p class="mt-3 text-sm font-medium text-red-700" aria-live="polite">✗ {error}</p>}

      {findings && (
        <div class="mt-4 space-y-4" aria-live="polite">
          <div class={`rounded-xl border px-4 py-3 ${findings.totalChars > 0 ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
            <p class="text-sm font-bold text-slate-900">
              {findings.totalChars > 0
                ? `⚠ ${findings.totalChars.toLocaleString('en-US')} characters of machine-readable text remain in this file.`
                : '✅ No extractable text found — the pages are image-only.'}
            </p>
            <p class="mt-1 text-xs text-slate-600">
              {findings.totalChars > 0
                ? 'Everything below can be copied out of the file regardless of what the pages look like. Search it for the content you meant to remove.'
                : 'If the redaction was done by flattening to images, that is the expected result. Metadata and attachments are still checked below.'}
            </p>
          </div>

          {findings.totalChars > 0 && (
            <div>
              <label class="block max-w-md">
                <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Search the hidden layer — try the name/number you redacted</span>
                <input
                  class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-500 focus:outline-none"
                  value={query}
                  onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
                  placeholder="e.g. the redacted name, IBAN, address…"
                />
              </label>
              {hits && (
                <div class={`mt-2 rounded-lg border px-3 py-2 text-sm ${hits.length ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}`}>
                  {hits.length ? (
                    <>
                      <p class="font-bold text-red-900">❌ Found on {hits.length} page{hits.length > 1 ? 's' : ''} — the redaction is cosmetic, not real:</p>
                      <ul class="mt-1 space-y-1">
                        {hits.slice(0, 5).map((h) => (
                          <li class="text-red-800"><strong>p. {h.page}:</strong> <span class="font-mono text-xs">{h.snippet}</span></li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p class="font-semibold text-emerald-900">✓ Not present in the extractable text.</p>
                  )}
                </div>
              )}
            </div>
          )}

          <div class="grid gap-3 sm:grid-cols-3">
            <div class={`rounded-xl border p-3 text-sm ${overlayAnnots.length ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'}`}>
              <p class="font-bold text-slate-900">Overlay annotations</p>
              <p class="mt-1 text-slate-600">
                {overlayAnnots.length
                  ? `${overlayAnnots.length} drawing/markup annotation${overlayAnnots.length > 1 ? 's' : ''} (${[...new Set(overlayAnnots.map((a) => a.type))].join(', ')}) — black boxes drawn as annotations can be deleted by any PDF editor, revealing what's underneath.`
                  : 'none found — no removable markup boxes.'}
              </p>
            </div>
            <div class={`rounded-xl border p-3 text-sm ${findings.meta.length ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'}`}>
              <p class="font-bold text-slate-900">Metadata</p>
              {findings.meta.length ? (
                <ul class="mt-1 space-y-0.5 text-slate-600">
                  {findings.meta.map(([k, v]) => (
                    <li><strong>{k}:</strong> <span class="break-all">{v.length > 60 ? v.slice(0, 60) + '…' : v}</span></li>
                  ))}
                </ul>
              ) : (
                <p class="mt-1 text-slate-600">no identifying document metadata found.</p>
              )}
            </div>
            <div class={`rounded-xl border p-3 text-sm ${findings.attachments.length ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'}`}>
              <p class="font-bold text-slate-900">Embedded files</p>
              <p class="mt-1 text-slate-600">
                {findings.attachments.length ? `${findings.attachments.length} attachment(s): ${findings.attachments.join(', ')} — attachments travel with the PDF unredacted.` : 'none.'}
              </p>
            </div>
          </div>

          {findings.totalChars > 0 && (
            <details class="rounded-xl border border-slate-200 bg-white p-3">
              <summary class="cursor-pointer text-sm font-semibold text-slate-700">Show all extractable text ({findings.totalChars.toLocaleString('en-US')} characters)</summary>
              <div class="mt-2 max-h-80 space-y-2 overflow-y-auto">
                {findings.pages.filter((p) => p.text).map((p) => (
                  <p class="text-xs text-slate-600"><strong class="text-slate-800">p. {p.page}:</strong> <span class="font-mono">{p.text}</span></p>
                ))}
              </div>
            </details>
          )}
        </div>
      )}

      <p class="mt-4 rounded-lg bg-white px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
        This checks the classic redaction failures — text hidden under drawn boxes, removable annotations, metadata and attachments. It cannot prove a negative (e.g. content encoded in images still needs human review). To redact for real, use the <a href="/pdf/redact-pdf/" class="font-semibold text-brand-700 underline decoration-slate-300 underline-offset-2">rasterizing redactor</a>. Nothing you load here leaves your browser.
      </p>
    </div>
  );
}
