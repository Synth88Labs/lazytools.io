import { useState } from 'preact/hooks';
import { parseFont, type FontInfo } from '../../lib/sfnt';

export default function FontInspectorTool() {
  const [info, setInfo] = useState<FontInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (f: File | null) => {
    if (!f) return;
    setBusy(true); setError(null); setInfo(null); setFileName(f.name);
    try {
      const bytes = new Uint8Array(await f.arrayBuffer());
      setInfo(parseFont(bytes));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read this font file.');
    } finally { setBusy(false); }
  };

  const row = (label: string, value?: string | number) =>
    value === undefined || value === '' ? null : (
      <div class="grid grid-cols-[9rem_1fr] gap-2 border-b border-slate-100 py-2 sm:grid-cols-[11rem_1fr]">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
        <span class="break-all text-sm text-slate-800">{value}</span>
      </div>
    );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-8 text-center hover:border-brand-400">
        <input type="file" class="hidden" accept=".ttf,.otf,.ttc,font/ttf,font/otf" onChange={(e) => onFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
        <span class="block text-2xl">🔤</span>
        <span class="mt-1 block text-sm font-semibold text-slate-700">{fileName ? `📄 ${fileName}` : 'Choose a .ttf / .otf / .ttc font'}</span>
        <span class="mt-1 block text-xs text-slate-500">{busy ? 'Reading…' : 'Read locally — the font is never uploaded'}</span>
      </label>

      {error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">⚠️ {error}</p>}

      {info && (
        <div class="mt-4 space-y-4">
          <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            {row('Family', info.family)}
            {row('Subfamily / style', info.subfamily)}
            {row('Full name', info.fullName)}
            {row('Version', info.version)}
            {row('Format', info.format)}
            {row('Outlines', info.outlines)}
            {row('Glyphs', info.numGlyphs?.toLocaleString())}
            {row('Units per em', info.unitsPerEm)}
            {row('Weight class', info.weightClass)}
            {row('Width class', info.widthClass)}
            {row('Created', info.created?.replace('T', ' '))}
            {row('Modified', info.modified?.replace('T', ' '))}
            {row('Embedding', info.embeddable)}
          </div>

          {info.names.length > 0 && (
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Name table</p>
              <div class="space-y-1.5">
                {info.names.map((n) => (
                  <div class="grid grid-cols-[9rem_1fr] gap-2 text-sm sm:grid-cols-[11rem_1fr]">
                    <span class="text-slate-500">{n.label}</span>
                    <span class="break-all text-slate-800">{n.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {info.tables.length > 0 && (
            <p class="text-xs text-slate-500"><span class="font-semibold">Tables ({info.numTables}):</span> <span class="font-mono">{info.tables.join(', ')}</span></p>
          )}
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Drop a TrueType (.ttf) or OpenType (.otf) font to read its embedded metadata — the family and style names, version, designer, licence, glyph count, units-per-em, weight/width class and the embedding permission stored in the font’s OS/2 table. It parses the sfnt <code class="rounded bg-slate-200 px-1">name</code> and <code class="rounded bg-slate-200 px-1">head</code> tables directly in your browser, so the font file is never uploaded. WOFF/WOFF2 web fonts are compressed and aren’t read here — convert them to TTF/OTF first. 🔒 100% client-side.</p>
    </div>
  );
}
