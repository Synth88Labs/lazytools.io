import { useState } from 'preact/hooks';
import { parseAudio, formatDuration, type AudioMeta } from '../../lib/audio-meta';
import { fmtSize } from '../../lib/audio-compute';

export default function AudioInspectorTool() {
  const [meta, setMeta] = useState<AudioMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (f: File | null) => {
    if (!f) return;
    setBusy(true); setError(null); setMeta(null); setFile({ name: f.name, size: f.size });
    try {
      setMeta(parseAudio(new Uint8Array(await f.arrayBuffer())));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read this audio file.');
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
        <input type="file" class="hidden" accept=".wav,.aif,.aiff,.aifc,audio/wav,audio/aiff,audio/x-aiff" onChange={(e) => onFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
        <span class="block text-2xl">🎧</span>
        <span class="mt-1 block text-sm font-semibold text-slate-700">{file ? `📄 ${file.name}` : 'Choose a .wav / .aiff file'}</span>
        <span class="mt-1 block text-xs text-slate-500">{busy ? 'Reading…' : 'Read locally, the file is never uploaded'}</span>
      </label>

      {error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">⚠️ {error}</p>}

      {meta && (
        <div class="mt-4 space-y-4">
          <div class="grid gap-2 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Sample rate</p>
              <p class="mt-0.5 text-xl font-extrabold text-brand-800">{(meta.sampleRate / 1000).toLocaleString()} kHz</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Duration</p>
              <p class="mt-0.5 text-xl font-extrabold text-brand-800">{meta.durationSec !== undefined ? formatDuration(meta.durationSec) : '—'}</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Channels</p>
              <p class="mt-0.5 text-xl font-extrabold text-brand-800">{meta.channels === 1 ? 'Mono' : meta.channels === 2 ? 'Stereo' : meta.channels}</p>
            </div>
          </div>

          <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            {row('Container', meta.container)}
            {row('Codec', meta.codec)}
            {row('Bit depth', meta.bitsPerSample ? `${meta.bitsPerSample}-bit` : undefined)}
            {row('Sample rate', `${meta.sampleRate.toLocaleString()} Hz`)}
            {row('Channels', meta.channels)}
            {row('Duration', meta.durationSec !== undefined ? `${meta.durationSec.toFixed(3)} s` : undefined)}
            {row('Bitrate', meta.bitrate ? `${Math.round(meta.bitrate / 1000).toLocaleString()} kbps` : undefined)}
            {row('Audio data', meta.dataBytes !== undefined ? fmtSize(meta.dataBytes) : undefined)}
            {row('File size', file ? fmtSize(file.size) : undefined)}
          </div>

          {meta.tags.length > 0 && (
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Embedded tags</p>
              <div class="space-y-1.5">
                {meta.tags.map((t) => (
                  <div class="grid grid-cols-[9rem_1fr] gap-2 text-sm sm:grid-cols-[11rem_1fr]">
                    <span class="text-slate-500">{t.label}</span>
                    <span class="break-all text-slate-800">{t.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {meta.chunks.length > 0 && (
            <p class="text-xs text-slate-500"><span class="font-semibold">Chunks:</span> <span class="font-mono">{meta.chunks.join(', ')}</span></p>
          )}
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Drop a WAV (.wav) or AIFF (.aif/.aiff) file to read its sample rate, bit depth, channel count, codec and exact duration straight from the header chunks, no re-encoding. It parses the RIFF/AIFF structure in your browser, so the audio is never uploaded. It reads the header only, not the samples, so it works instantly even on large files. 🔒 100% client-side.</p>
    </div>
  );
}
