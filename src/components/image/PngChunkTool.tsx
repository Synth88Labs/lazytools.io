import { useState } from 'preact/hooks';
import { parsePng, type PngInfo } from '../../lib/png';
import { fmtSize } from '../../lib/audio-compute';

export default function PngChunkTool() {
  const [info, setInfo] = useState<PngInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (f: File | null) => {
    if (!f) return;
    setBusy(true); setError(null); setInfo(null); setFile({ name: f.name, size: f.size });
    try {
      setInfo(parsePng(new Uint8Array(await f.arrayBuffer())));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read this PNG file.');
    } finally { setBusy(false); }
  };

  const allOk = info?.chunks.every((c) => c.crcOk) ?? false;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-8 text-center hover:border-brand-400">
        <input type="file" class="hidden" accept=".png,image/png" onChange={(e) => onFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
        <span class="block text-2xl">🖼️</span>
        <span class="mt-1 block text-sm font-semibold text-slate-700">{file ? `📄 ${file.name}` : 'Choose a .png file'}</span>
        <span class="mt-1 block text-xs text-slate-500">{busy ? 'Reading…' : 'Read locally, the image is never uploaded'}</span>
      </label>

      {error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">⚠️ {error}</p>}

      {info && (
        <div class="mt-4 space-y-4">
          <div class="grid gap-2 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Dimensions</p><p class="mt-0.5 text-lg font-extrabold text-brand-800">{info.width}×{info.height}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Color</p><p class="mt-0.5 text-sm font-bold text-slate-800">{info.bitDepth}-bit {info.colorType}</p></div>
            <div class={`rounded-xl p-4 text-center ring-1 ${allOk ? 'bg-emerald-50 ring-emerald-200' : 'bg-rose-50 ring-rose-200'}`}><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">CRC integrity</p><p class={`mt-0.5 text-sm font-bold ${allOk ? 'text-emerald-700' : 'text-rose-700'}`}>{allOk ? '✅ all chunks valid' : '⛔ corruption found'}</p></div>
          </div>

          <div class="overflow-x-auto rounded-xl bg-white p-4 ring-1 ring-slate-200" tabIndex={0} aria-label="PNG chunks table">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Chunks ({info.chunks.length})</p>
            <table class="w-full text-left text-sm">
              <thead><tr class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                <th class="py-1 pr-3">Type</th><th class="py-1 pr-3">Size</th><th class="py-1 pr-3">CRC</th><th class="py-1">Details</th>
              </tr></thead>
              <tbody>
                {info.chunks.map((c) => (
                  <tr class="border-b border-slate-50">
                    <td class="py-1.5 pr-3 font-mono font-semibold text-slate-800">{c.type}{!c.critical && <span class="ml-1 text-[10px] font-normal text-slate-400">anc</span>}</td>
                    <td class="py-1.5 pr-3 text-slate-500">{fmtSize(c.length)}</td>
                    <td class="py-1.5 pr-3">{c.crcOk ? <span class="text-emerald-600">✓</span> : <span class="font-semibold text-rose-600">✗ bad</span>}</td>
                    <td class="py-1.5 text-slate-600">{c.info ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {info.text.length > 0 && (
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Text metadata</p>
              <div class="space-y-1">{info.text.map((t) => (
                <div class="grid grid-cols-[7rem_1fr] gap-2 text-sm"><span class="text-slate-500">{t.keyword}</span><span class="break-all text-slate-800">{t.value}</span></div>
              ))}</div>
            </div>
          )}

          <p class="text-xs text-slate-400">Image data (IDAT): {fmtSize(info.totalIdatBytes)}{file ? ` · file ${fmtSize(file.size)}` : ''}{info.dpi ? ` · ${info.dpi} DPI` : ''}</p>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Drop a PNG to inspect its internal chunk structure, the IHDR header (dimensions, bit depth, color type), physical resolution (pHYs), any embedded text metadata (tEXt/iTXt), and every other chunk, and verify each chunk&#39;s stored CRC-32 against a freshly computed one to catch corruption or hidden edits. It parses the file in your browser, so the image is never uploaded. 🔒 100% client-side.</p>
    </div>
  );
}
