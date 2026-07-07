import { useState } from 'preact/hooks';

interface Check {
  level: 'pass' | 'fail' | 'warn' | 'info';
  name: string;
  detail: string;
}

const ICON = { pass: '✅', warn: '⚠️', fail: '❌', info: 'ℹ️' } as const;
const CLS = {
  pass: 'border-emerald-200 bg-emerald-50',
  warn: 'border-amber-200 bg-amber-50',
  fail: 'border-red-200 bg-red-50',
  info: 'border-slate-200 bg-white',
} as const;

/** Walk a pdf.js struct-tree node collecting roles + alt presence. */
function walkStruct(node: any, acc: { headings: Set<string>; figures: number; figuresWithAlt: number; hasTree: boolean }) {
  if (!node) return;
  acc.hasTree = true;
  const role: string = node.role ?? '';
  if (/^H[1-6]$/.test(role)) acc.headings.add(role);
  if (role === 'Figure') {
    acc.figures++;
    if (typeof node.alt === 'string' && node.alt.trim()) acc.figuresWithAlt++;
  }
  for (const child of node.children ?? []) walkStruct(child, acc);
}

async function runChecks(bytes: ArrayBuffer, onProgress: (s: string) => void): Promise<{ checks: Check[]; pages: number }> {
  const checks: Check[] = [];
  const add = (level: Check['level'], name: string, detail: string) => checks.push({ level, name, detail });

  onProgress('Loading PDF engine…');
  const pdfjs = await import('pdfjs-dist');
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  // pdf-lib for catalog-level entries pdf.js doesn't expose (/Lang, ViewerPreferences)
  const { PDFDocument, PDFName, PDFDict, PDFString, PDFHexString, PDFBool } = await import('pdf-lib');

  onProgress('Parsing document…');
  const doc = await pdfjs.getDocument({ data: bytes.slice(0), useSystemFonts: true }).promise;
  const pages = doc.numPages;

  // --- tagged? ---
  const markInfo = await doc.getMarkInfo();
  if (markInfo?.Marked) add('pass', 'Tagged PDF', 'MarkInfo declares the document as tagged — the foundation of PDF accessibility');
  else add('fail', 'Tagged PDF', 'the document is NOT marked as tagged — screen readers get no reliable structure (headings, reading order, tables). This is the first thing to fix, usually by re-exporting from the source application with accessibility enabled');

  // --- title + metadata ---
  const meta = await doc.getMetadata().catch(() => null);
  const title = (meta?.info as any)?.Title?.trim?.() ?? '';
  if (title) add('pass', 'Document title', `"${title}" present in metadata`);
  else add('fail', 'Document title', 'no Title in document metadata — screen readers announce the filename instead');

  // --- catalog entries via pdf-lib ---
  try {
    const pl = await PDFDocument.load(bytes.slice(0), { ignoreEncryption: true, updateMetadata: false });
    const catalog = pl.catalog;
    const langObj = catalog.lookupMaybe(PDFName.of('Lang'), PDFString) ?? catalog.lookupMaybe(PDFName.of('Lang'), PDFHexString);
    const lang = langObj?.decodeText?.() ?? '';
    if (lang) add('pass', 'Document language', `/Lang = "${lang}" — screen readers pick the right voice`);
    else add('fail', 'Document language', 'no /Lang entry — screen readers can\'t know which language voice/pronunciation to use');

    const vp = catalog.lookupMaybe(PDFName.of('ViewerPreferences'), PDFDict);
    const ddt = vp?.lookupMaybe(PDFName.of('DisplayDocTitle'), PDFBool);
    if (ddt?.asBoolean?.()) add('pass', 'Display document title', 'viewer preference set — the title (not filename) shows in the window bar');
    else add(title ? 'warn' : 'info', 'Display document title', 'DisplayDocTitle viewer preference not set — PDF/UA requires the title, not the filename, to be shown');

    const outlines = catalog.lookupMaybe(PDFName.of('Outlines'), PDFDict);
    if (outlines) add('pass', 'Bookmarks (outline)', 'the document has a bookmark tree for navigation');
    else add(pages > 20 ? 'warn' : 'info', 'Bookmarks (outline)', pages > 20 ? `no bookmarks in a ${pages}-page document — long documents should offer outline navigation` : 'no bookmarks — fine for short documents');
  } catch {
    add('info', 'Catalog entries', 'could not inspect /Lang and viewer preferences (unusual document structure)');
  }

  // --- text layer: sample up to 5 pages ---
  onProgress('Checking text layer…');
  const sample = Math.min(pages, 5);
  let textChars = 0;
  for (let i = 1; i <= sample; i++) {
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();
    textChars += tc.items.reduce((a: number, it: any) => a + (it.str?.length ?? 0), 0);
  }
  if (textChars > 50) add('pass', 'Extractable text', `real text layer found (~${textChars.toLocaleString('en-US')} characters in the first ${sample} page${sample > 1 ? 's' : ''})`);
  else add('fail', 'Extractable text', `almost no extractable text in the first ${sample} page${sample > 1 ? 's' : ''} — this looks like a scanned/image-only PDF, which is invisible to screen readers without OCR`);

  // --- structure tree: headings + figure alt text ---
  onProgress('Walking structure tree…');
  const acc = { headings: new Set<string>(), figures: 0, figuresWithAlt: 0, hasTree: false };
  for (let i = 1; i <= sample; i++) {
    const page = await doc.getPage(i);
    const tree = await page.getStructTree().catch(() => null);
    if (tree) walkStruct(tree, acc);
  }
  if (acc.hasTree) {
    if (acc.headings.size > 0) add('pass', 'Headings', `heading tags present (${[...acc.headings].sort().join(', ')}) in the sampled pages`);
    else add('warn', 'Headings', 'no H1–H6 tags found in the sampled pages — content may be tagged as plain paragraphs, losing document structure');
    if (acc.figures > 0) {
      if (acc.figuresWithAlt === acc.figures) add('pass', 'Image alt text', `all ${acc.figures} figure${acc.figures > 1 ? 's' : ''} in the sampled pages carry alt text`);
      else add('fail', 'Image alt text', `${acc.figures - acc.figuresWithAlt} of ${acc.figures} figures in the sampled pages have NO alt text — those images are silent for screen-reader users`);
    } else add('info', 'Image alt text', 'no tagged figures found in the sampled pages');
  } else if (markInfo?.Marked) {
    add('warn', 'Structure tree', 'document claims to be tagged but no structure tree was readable on the sampled pages');
  }

  return { checks, pages };
}

export default function PdfAccessibilityTool() {
  const [fileName, setFileName] = useState('');
  const [pages, setPages] = useState(0);
  const [checks, setChecks] = useState<Check[] | null>(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  async function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setFileName(f.name);
    setError('');
    setChecks(null);
    try {
      const result = await runChecks(await f.arrayBuffer(), setBusy);
      setChecks(result.checks);
      setPages(result.pages);
    } catch (err) {
      setError(`Could not analyse this PDF: ${(err as Error).message}`);
    }
    setBusy('');
  }

  const fails = checks?.filter((c) => c.level === 'fail').length ?? 0;
  const warns = checks?.filter((c) => c.level === 'warn').length ?? 0;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept=".pdf,application/pdf" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{fileName || 'Choose a PDF to check'}</span>
        <span class="mt-1 block text-xs text-slate-500">Analysed entirely on your device — the document is never uploaded</span>
      </label>

      {busy && <p class="mt-3 text-sm text-slate-600">{busy}</p>}
      {error && <p class="mt-3 text-sm font-medium text-red-700" aria-live="polite">✗ {error}</p>}

      {checks && (
        <div class="mt-4" aria-live="polite">
          <p class={`rounded-xl border px-4 py-3 text-sm font-semibold ${fails ? 'border-red-200 bg-red-50 text-red-900' : warns ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
            {fails ? `${fails} accessibility problem${fails > 1 ? 's' : ''} found` : warns ? 'No hard failures — with items worth reviewing' : 'All quick checks passed'}
            {' · '}{pages} page{pages > 1 ? 's' : ''} · {checks.length} checks
          </p>
          <ul class="mt-3 space-y-2">
            {checks.map((c) => (
              <li class={`rounded-lg border px-3 py-2 text-sm ${CLS[c.level]}`}>
                <span class="mr-1.5">{ICON[c.level]}</span>
                <strong class="text-slate-900">{c.name}:</strong> <span class="text-slate-700">{c.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p class="mt-4 rounded-lg bg-white px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
        <strong class="text-slate-700">Quick check, not certification.</strong> This verifies the machine-checkable foundations (tagging, language, title, text layer, alt text, headings — structure sampled from the first 5 pages). Full PDF/UA conformance also needs human judgment — logical reading order, meaningful alt text, correct table structure — via tools like PAC and manual review. Nothing you load here leaves your browser.
      </p>
    </div>
  );
}
