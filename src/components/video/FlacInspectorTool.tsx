import { useState } from 'preact/hooks';
import { parseFlac, type FlacInfo } from '../../lib/flac';
import { fmtSize } from '../../lib/audio-compute';

function fmtDuration(sec: number): string {
  if (!Number.isFinite(sec)) return '—';
  const m = Math.floor(sec / 60);
  const s = Math.round(sec - m * 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function FlacInspectorTool() {
  const [info, setInfo] = useState<FlacInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (f: File | null) => {
    if (!f) return;
    setBusy(true); setError(null); setInfo(null); setFile({ name: f.name, size: f.size });
    try {
      setInfo(parseFlac(new Uint8Array(await f.arrayBuffer())));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read this FLAC file.');
    } finally { setBusy(false); }
  };

  const row = (label: string, value?: string | number) =>
    value === undefined || value === '' ? null : (
      <div class="grid grid-cols-[8rem_1fr] gap-2 border-b border-slate-100 py-1.5 text-sm sm:grid-cols-[10rem_1fr]">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
        <span class="break-all text-slate-800">{value}</span>
      </div>
    );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-8 text-center hover:border-brand-400">
        <input type="file" class="hidden" accept=".flac,audio/flac,audio/x-flac" onChange={(e) => onFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
        <span class="block text-2xl">🎼</span>
        <span class="mt-1 block text-sm font-semibold text-slate-700">{file ? `📄 ${file.name}` : 'Choose a .flac file'}</span>
        <span class="mt-1 block text-xs text-slate-500">{busy ? 'Reading…' : 'Read locally — the file is never uploaded'}</span>
      </label>

      {error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">⚠️ {error}</p>}

      {info && (
        <div class="mt-4 space-y-4">
          <div class="grid gap-2 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Sample rate</p><p class="mt-0.5 text-xl font-extrabold text-brand-800">{(info.sampleRate / 1000).toLocaleString()} kHz</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Duration</p><p class="mt-0.5 text-xl font-extrabold text-brand-800">{fmtDuration(info.durationSec)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Bit depth</p><p class="mt-0.5 text-xl font-extrabold text-brand-800">{info.bitsPerSample}-bit</p></div>
          </div>

          {info.tags.length > 0 && (
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Vorbis comment tags</p>
              <div class="space-y-1">{info.tags.map((t) => (
                <div class="grid grid-cols-[8rem_1fr] gap-2 text-sm sm:grid-cols-[10rem_1fr]"><span class="text-slate-500">{t.key}</span><span class="break-all font-medium text-slate-800">{t.value}</span></div>
              ))}</div>
            </div>
          )}

          <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            {row('Channels', info.channels === 1 ? 'Mono' : info.channels === 2 ? 'Stereo' : info.channels)}
            {row('Sample rate', `${info.sampleRate.toLocaleString()} Hz`)}
            {row('Total samples', info.totalSamples.toLocaleString())}
            {row('Cover art', info.hasPicture ? `yes (${fmtSize(info.pictureBytes)})` : 'no')}
            {row('Encoder', info.vendor)}
            {row('Audio MD5', info.md5)}
            {row('File size', file ? fmtSize(file.size) : undefined)}
          </div>

          <p class="text-xs text-slate-400"><span class="font-semibold">Metadata blocks:</span> {info.blocks.map((b) => `${b.type} (${fmtSize(b.size)})`).join(', ')}</p>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Drop a FLAC file to read its STREAMINFO (sample rate, bit depth, channels and exact duration) and its Vorbis comment tags (title, artist, album, date and more), plus the audio MD5 and whether cover art is embedded. It parses the metadata blocks in your browser — the audio is never decoded or uploaded, so it&#39;s instant even on large lossless files. 🔒 100% client-side.</p>
    </div>
  );
}
