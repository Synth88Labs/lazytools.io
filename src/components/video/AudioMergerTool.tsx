import { useState } from 'preact/hooks';
import { decodeAudio, encodeWav, fmtDuration, fmtSize } from '../../lib/audio-compute';

interface Track {
  id: number;
  name: string;
  buffer: AudioBuffer;
}

async function mergeBuffers(buffers: AudioBuffer[]): Promise<AudioBuffer> {
  const rate = Math.max(...buffers.map((b) => b.sampleRate));
  const channels = Math.max(...buffers.map((b) => b.numberOfChannels));
  const totalDur = buffers.reduce((s, b) => s + b.duration, 0);
  const ctx = new OfflineAudioContext(channels, Math.max(1, Math.ceil(totalDur * rate)), rate);
  let t = 0;
  for (const b of buffers) {
    const src = ctx.createBufferSource();
    src.buffer = b;
    src.connect(ctx.destination);
    src.start(t);
    t += b.duration;
  }
  return ctx.startRendering();
}

let nextId = 1;

export default function AudioMergerTool() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onFiles(e: Event) {
    const files = [...((e.target as HTMLInputElement).files ?? [])];
    if (!files.length) return;
    setError('');
    setBusy(true);
    try {
      const added: Track[] = [];
      for (const f of files) {
        const buffer = await decodeAudio(await f.arrayBuffer());
        added.push({ id: nextId++, name: f.name, buffer });
      }
      setTracks((t) => [...t, ...added]);
    } catch (err) {
      setError(`Could not decode an audio file: ${(err as Error).message}`);
    }
    setBusy(false);
    (e.target as HTMLInputElement).value = '';
  }

  const move = (i: number, dir: -1 | 1) => setTracks((t) => {
    const j = i + dir;
    if (j < 0 || j >= t.length) return t;
    const copy = [...t];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    return copy;
  });
  const remove = (id: number) => setTracks((t) => t.filter((x) => x.id !== id));

  const totalDur = tracks.reduce((s, t) => s + t.buffer.duration, 0);

  async function mergeDownload() {
    if (tracks.length < 2) return;
    setBusy(true);
    setError('');
    try {
      const merged = await mergeBuffers(tracks.map((t) => t.buffer));
      const blob = encodeWav(merged);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged-audio.wav';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Merge failed: ${(err as Error).message}`);
    }
    setBusy(false);
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept="audio/*" multiple onChange={onFiles} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{tracks.length ? 'Add more audio files' : 'Choose audio files to merge'}</span>
        <span class="mt-1 block text-xs text-slate-500">MP3, WAV, OGG, M4A, FLAC — decoded locally, never uploaded</span>
      </label>

      {busy && <p class="mt-3 text-sm text-slate-600">Working…</p>}
      {error && <p class="mt-3 text-sm font-medium text-red-700">✗ {error}</p>}

      {tracks.length > 0 && (
        <div class="mt-4">
          <ul class="space-y-2">
            {tracks.map((t, i) => (
              <li key={t.id} class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5">
                <span class="w-6 text-center text-sm font-bold text-slate-400">{i + 1}</span>
                <span class="min-w-0 flex-1 truncate text-sm text-slate-800">{t.name}</span>
                <span class="shrink-0 text-xs text-slate-500">{fmtDuration(t.buffer.duration)}</span>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} class="rounded px-2 py-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30" title="Move up">↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === tracks.length - 1} class="rounded px-2 py-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30" title="Move down">↓</button>
                <button type="button" onClick={() => remove(t.id)} class="rounded px-2 py-1 text-red-500 hover:bg-red-50" title="Remove">✕</button>
              </li>
            ))}
          </ul>
          <p class="mt-3 text-sm text-slate-600">
            {tracks.length} track{tracks.length === 1 ? '' : 's'} · total {fmtDuration(totalDur)} · output ≈ {fmtSize(totalDur * Math.max(...tracks.map((t) => t.buffer.sampleRate)) * Math.max(...tracks.map((t) => t.buffer.numberOfChannels)) * 2)} WAV
          </p>
          <div class="mt-3 flex justify-end">
            <button type="button" onClick={mergeDownload} disabled={busy || tracks.length < 2} class={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${busy || tracks.length < 2 ? 'bg-slate-400' : 'bg-brand-600 hover:bg-brand-700'}`}>
              {tracks.length < 2 ? 'Add at least 2 files' : busy ? 'Merging…' : '⬇ Merge & download WAV'}
            </button>
          </div>
        </div>
      )}

      <p class="mt-4 rounded-lg bg-white px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
        Joins your audio files end to end in the order shown and exports a single 16-bit WAV. Files of different sample rates are resampled to match. Everything decodes and renders in your browser with the Web Audio API — nothing is uploaded. 🔒
      </p>
    </div>
  );
}
