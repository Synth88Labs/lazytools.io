import { useState } from 'preact/hooks';
import { parseOpf, opfPathFromContainer, type EpubMeta } from '../../lib/epub';

export default function EpubMetaTool() {
  const [meta, setMeta] = useState<EpubMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (f: File | null) => {
    if (!f) return;
    setBusy(true); setError(null); setMeta(null); setFileName(f.name);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = await JSZip.loadAsync(await f.arrayBuffer());
      const container = zip.file('META-INF/container.xml');
      if (!container) throw new Error('No META-INF/container.xml — this does not look like a valid EPUB.');
      const opfPath = opfPathFromContainer(await container.async('string'));
      if (!opfPath) throw new Error('Could not find the OPF package path in container.xml.');
      const opfFile = zip.file(opfPath);
      if (!opfFile) throw new Error(`OPF file "${opfPath}" is missing from the archive.`);
      setMeta(parseOpf(await opfFile.async('string')));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read this EPUB file.');
    } finally { setBusy(false); }
  };

  const row = (label: string, value?: string | number) =>
    value === undefined || value === '' ? null : (
      <div class="grid grid-cols-[8rem_1fr] gap-2 border-b border-slate-100 py-2 sm:grid-cols-[10rem_1fr]">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
        <span class="break-all text-sm text-slate-800">{value}</span>
      </div>
    );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-8 text-center hover:border-brand-400">
        <input type="file" class="hidden" accept=".epub,application/epub+zip" onChange={(e) => onFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
        <span class="block text-2xl">📖</span>
        <span class="mt-1 block text-sm font-semibold text-slate-700">{fileName ? `📄 ${fileName}` : 'Choose an .epub file'}</span>
        <span class="mt-1 block text-xs text-slate-500">{busy ? 'Reading…' : 'Read locally — the book is never uploaded'}</span>
      </label>

      {error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">⚠️ {error}</p>}

      {meta && (
        <div class="mt-4 space-y-4">
          <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            {row('Title', meta.title)}
            {row(meta.creators.length > 1 ? 'Authors' : 'Author', meta.creators.join(', '))}
            {row('Contributors', meta.contributors.join(', '))}
            {row('Series', meta.series ? `${meta.series}${meta.seriesIndex ? ` #${meta.seriesIndex}` : ''}` : undefined)}
            {row('Publisher', meta.publisher)}
            {row('Published', meta.date)}
            {row('Language', meta.language)}
            {row('ISBN', meta.isbn)}
            {row('Identifier', meta.isbn ? undefined : meta.identifier)}
            {row('Subjects', meta.subjects.join(', '))}
            {row('EPUB version', meta.version)}
          </div>

          {meta.description && (
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Description</p>
              <p class="text-sm text-slate-700">{meta.description}</p>
            </div>
          )}

          <div class="flex flex-wrap gap-2 text-xs">
            <span class="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-600">{meta.spineItems} reading-order documents</span>
            <span class="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-600">{meta.manifestItems} manifest items</span>
            {meta.hasCover && <span class="rounded-lg bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">🖼️ has cover</span>}
            {meta.rights && <span class="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-600">© {meta.rights.slice(0, 40)}</span>}
          </div>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Drop an EPUB (.epub) to read its embedded metadata — title, author, series, publisher, publication date, language, ISBN, subjects and description — from the book’s OPF package inside the ZIP. It reads the file in your browser and never uploads it. This shows the metadata; it doesn’t change the book. 🔒 100% client-side.</p>
    </div>
  );
}
