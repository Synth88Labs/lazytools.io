import { useState } from 'preact/hooks';
import { parseMp4, flattenBoxes, type Mp4Info } from '../../lib/mp4';
import { fmtSize } from '../../lib/audio-compute';

function fmtDuration(sec?: number): string {
  if (sec === undefined || !Number.isFinite(sec)) return '—';
  const m = Math.floor(sec / 60);
  const s = Math.round(sec - m * 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function Mp4BoxTool() {
  const [info, setInfo] = useState<Mp4Info | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (f: File | null) => {
    if (!f) return;
    setBusy(true); setError(null); setInfo(null); setFile({ name: f.name, size: f.size });
    try {
      // Only the header region is needed for the box tree; read up to 4 MB.
      const slice = f.size > 4_000_000 ? f.slice(0, 4_000_000) : f;
      setInfo(parseMp4(new Uint8Array(await slice.arrayBuffer())));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read this MP4 file.');
    } finally { setBusy(false); }
  };

  const flat = info ? flattenBoxes(info.boxes) : [];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-8 text-center hover:border-brand-400">
        <input type="file" class="hidden" accept=".mp4,.m4a,.m4v,.mov,.heic,.heif,video/mp4,audio/mp4,video/quicktime" onChange={(e) => onFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
        <span class="block text-2xl">🎬</span>
        <span class="mt-1 block text-sm font-semibold text-slate-700">{file ? `📄 ${file.name}` : 'Choose an .mp4 / .mov / .m4a file'}</span>
        <span class="mt-1 block text-xs text-slate-500">{busy ? 'Reading…' : 'Read locally, the file is never uploaded'}</span>
      </label>

      {error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">⚠️ {error}</p>}

      {info && (
        <div class="mt-4 space-y-4">
          <div class="grid gap-2 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Brand</p><p class="mt-0.5 text-lg font-extrabold text-brand-800">{info.majorBrand ?? '—'}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Duration</p><p class="mt-0.5 text-lg font-extrabold text-brand-800">{fmtDuration(info.durationSec)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Tracks</p><p class="mt-0.5 text-lg font-extrabold text-brand-800">{info.handlers.length ? info.handlers.join(' + ') : '—'}</p></div>
          </div>

          <div class="overflow-x-auto rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Box tree ({flat.length})</p>
            <table class="w-full text-left text-sm">
              <thead><tr class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400"><th class="py-1 pr-3">Box</th><th class="py-1 pr-3">Size</th><th class="py-1 pr-3">Offset</th><th class="py-1">Details</th></tr></thead>
              <tbody>
                {flat.map(({ box, depth }) => (
                  <tr class="border-b border-slate-50">
                    <td class="py-1.5 pr-3 font-mono"><span style={`padding-left:${depth * 14}px`} class="font-semibold text-slate-800">{box.children ? '▸ ' : ''}{box.type}</span></td>
                    <td class="py-1.5 pr-3 text-slate-500">{fmtSize(box.size)}</td>
                    <td class="py-1.5 pr-3 font-mono text-xs text-slate-400">{box.offset}</td>
                    <td class="py-1.5 text-slate-600">{box.info ?? (box.children ? `${box.children.length} child boxes` : '')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {info.compatibleBrands.length > 0 && (
            <p class="text-xs text-slate-400"><span class="font-semibold">Compatible brands:</span> <span class="font-mono">{info.compatibleBrands.join(', ')}</span>{file ? ` · file ${fmtSize(file.size)}` : ''}</p>
          )}
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Drop an MP4, MOV, M4A or HEIF file to see its internal box (atom) structure, the tree of ftyp, moov, trak, mdia and the rest, with each box&#39;s type, size and offset, plus the brand, duration and track types decoded from the headers. It&#39;s the quickest way to see why an MP4 won&#39;t play or where its metadata sits. Only the header region is read, in your browser, so the file is never uploaded and nothing is decoded. 🔒 100% client-side.</p>
    </div>
  );
}
