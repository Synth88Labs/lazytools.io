import { useState } from 'preact/hooks';
import { parseMp3, type Mp3Info } from '../../lib/id3';
import { fmtSize } from '../../lib/audio-compute';

function formatDuration(sec: number): string {
  if (!Number.isFinite(sec)) return '—';
  const m = Math.floor(sec / 60);
  const s = Math.round(sec - m * 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function Id3TagTool() {
  const [info, setInfo] = useState<Mp3Info | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (f: File | null) => {
    if (!f) return;
    setBusy(true); setError(null); setInfo(null); setFile({ name: f.name, size: f.size });
    try {
      setInfo(parseMp3(new Uint8Array(await f.arrayBuffer())));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read this MP3 file.');
    } finally { setBusy(false); }
  };

  const audio: [string, string | undefined][] = info ? [
    ['MPEG version', info.mpegVersion],
    ['Layer', info.layer],
    ['Bitrate', info.bitrate ? `${info.bitrate} kbps${info.vbr ? ' (VBR)' : ''}` : undefined],
    ['Sample rate', info.sampleRate ? `${info.sampleRate.toLocaleString()} Hz` : undefined],
    ['Channels', info.channelMode],
    ['Duration', info.durationSec !== undefined ? formatDuration(info.durationSec) : undefined],
  ] : [];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-8 text-center hover:border-brand-400">
        <input type="file" class="hidden" accept=".mp3,audio/mpeg" onChange={(e) => onFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
        <span class="block text-2xl">🎵</span>
        <span class="mt-1 block text-sm font-semibold text-slate-700">{file ? `📄 ${file.name}` : 'Choose an .mp3 file'}</span>
        <span class="mt-1 block text-xs text-slate-500">{busy ? 'Reading…' : 'Read locally, the file is never uploaded'}</span>
      </label>

      {error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">⚠️ {error}</p>}

      {info && (
        <div class="mt-4 space-y-4">
          {info.tags.length > 0 ? (
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <div class="mb-2 flex items-center justify-between">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Tags</p>
                {info.id3Version && <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-600">{info.id3Version}</span>}
              </div>
              <div class="space-y-1.5">
                {info.tags.map((t) => (
                  <div class="grid grid-cols-[7rem_1fr] gap-2 text-sm sm:grid-cols-[9rem_1fr]">
                    <span class="text-slate-500">{t.label}</span>
                    <span class="break-all font-medium text-slate-800">{t.value}</span>
                  </div>
                ))}
                {info.hasCover && (
                  <div class="grid grid-cols-[7rem_1fr] gap-2 text-sm sm:grid-cols-[9rem_1fr]">
                    <span class="text-slate-500">Cover art</span>
                    <span class="text-slate-800">🖼️ embedded{info.coverBytes ? ` (${fmtSize(info.coverBytes)})` : ''}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p class="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 ring-1 ring-amber-200">No ID3 tags found. This MP3 has no embedded title/artist metadata.</p>
          )}

          {audio.some(([, v]) => v) && (
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Audio</p>
              {audio.filter(([, v]) => v).map(([label, value]) => (
                <div class="grid grid-cols-[7rem_1fr] gap-2 border-b border-slate-100 py-1.5 text-sm last:border-0 sm:grid-cols-[9rem_1fr]">
                  <span class="text-slate-500">{label}</span>
                  <span class="text-slate-800">{value}</span>
                </div>
              ))}
              {file && (
                <div class="grid grid-cols-[7rem_1fr] gap-2 py-1.5 text-sm sm:grid-cols-[9rem_1fr]">
                  <span class="text-slate-500">File size</span>
                  <span class="text-slate-800">{fmtSize(file.size)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Drop an MP3 to read its ID3 tags (title, artist, album, year, genre, track and more) and its MPEG audio details, bitrate, sample rate, channel mode and duration, parsed from the file’s ID3v2/ID3v1 and MPEG frame headers. Everything is read in your browser, so the file is never uploaded. It reads tags, it doesn’t change them. 🔒 100% client-side.</p>
    </div>
  );
}
