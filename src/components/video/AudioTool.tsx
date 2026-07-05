import { useState } from 'preact/hooks';
import { decodeAudio, renderAudio, encodeWav, fmtDuration, fmtSize } from '../../lib/audio-compute';

interface Props {
  mode: 'trim' | 'speed' | 'volume' | 'wav';
}

export default function AudioTool({ mode }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [peak, setPeak] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [rate, setRate] = useState(1.5);
  const [gainDb, setGainDb] = useState(6);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [resultInfo, setResultInfo] = useState('');

  async function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setFile(f);
    setError('');
    setResultUrl('');
    setResultInfo('');
    setBusy(true);
    try {
      const buf = await decodeAudio(await f.arrayBuffer());
      setBuffer(buf);
      setStart(0);
      setEnd(Math.round(buf.duration * 10) / 10);
      if (mode === 'volume') {
        let p = 0;
        for (let c = 0; c < buf.numberOfChannels; c++) {
          const d = buf.getChannelData(c);
          for (let i = 0; i < d.length; i += 100) p = Math.max(p, Math.abs(d[i]!)); // sampled peak scan
        }
        setPeak(p);
      }
    } catch {
      setError('Your browser could not decode this file — MP3, WAV, OGG, M4A and FLAC usually work.');
      setBuffer(null);
    }
    setBusy(false);
  }

  async function run() {
    if (!buffer || !file) return;
    setBusy(true);
    setError('');
    try {
      const gain = mode === 'volume' ? Math.pow(10, gainDb / 20) : 1;
      const rendered = await renderAudio(buffer, {
        startSec: mode === 'trim' ? start : 0,
        endSec: mode === 'trim' ? end : buffer.duration,
        rate: mode === 'speed' ? rate : 1,
        gain,
      });
      const blob = encodeWav(rendered);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultInfo(`${fmtDuration(rendered.duration)} · ${fmtSize(blob.size)} WAV`);
    } catch (e) {
      setError((e as Error).message || 'Processing failed.');
    }
    setBusy(false);
  }

  function download() {
    if (!resultUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${file.name.replace(/\.[^.]+$/, '')}-${mode === 'wav' ? 'converted' : mode}.wav`;
    a.click();
  }

  const maxCleanDb = peak > 0 ? Math.floor(20 * Math.log10(1 / peak) * 10) / 10 : 0;
  const willClip = mode === 'volume' && gainDb > maxCleanDb;
  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept="audio/*,.flac,.m4a" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{file ? file.name : 'Choose an audio file'}</span>
        <span class="mt-1 block text-xs text-slate-500">
          {buffer ? `${fmtDuration(buffer.duration)} · ${buffer.numberOfChannels === 2 ? 'stereo' : 'mono'} · ${(buffer.sampleRate / 1000).toFixed(1)} kHz` : 'MP3, WAV, OGG, M4A, FLAC — decoded locally'}
        </span>
      </label>

      {error && <p class="mt-3 text-sm font-medium text-red-700" aria-live="polite">✗ {error}</p>}
      {busy && !buffer && <p class="mt-3 text-sm text-slate-600">Decoding…</p>}

      {buffer && (
        <div class="mt-4">
          {mode === 'trim' && (
            <div class="flex flex-wrap items-end gap-3">
              <div>
                <label for="at-start" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Start (seconds)</label>
                <input id="at-start" type="number" min={0} max={buffer.duration} step={0.1} value={start} onInput={(e) => setStart(parseFloat((e.target as HTMLInputElement).value) || 0)} class={`${inputCls} w-32`} />
              </div>
              <div>
                <label for="at-end" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">End (seconds)</label>
                <input id="at-end" type="number" min={0} max={Math.ceil(buffer.duration)} step={0.1} value={end} onInput={(e) => setEnd(parseFloat((e.target as HTMLInputElement).value) || 0)} class={`${inputCls} w-32`} />
              </div>
              <p class="pb-3 text-sm text-slate-600">→ keeps {fmtDuration(Math.max(0, Math.min(end, buffer.duration) - start))}</p>
            </div>
          )}

          {mode === 'speed' && (
            <div>
              <label for="at-rate" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Speed: {rate.toFixed(2)}× (pitch shifts with speed)</label>
              <input id="at-rate" type="range" min={0.5} max={3} step={0.05} value={rate} onInput={(e) => setRate(parseFloat((e.target as HTMLInputElement).value))} class="w-full max-w-md accent-brand-600" />
              <p class="mt-1 text-sm text-slate-600">{fmtDuration(buffer.duration)} → {fmtDuration(buffer.duration / rate)}</p>
            </div>
          )}

          {mode === 'volume' && (
            <div>
              <label for="at-gain" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Gain: {gainDb > 0 ? '+' : ''}{gainDb} dB (×{Math.pow(10, gainDb / 20).toFixed(2)})
              </label>
              <input id="at-gain" type="range" min={-20} max={20} step={0.5} value={gainDb} onInput={(e) => setGainDb(parseFloat((e.target as HTMLInputElement).value))} class="w-full max-w-md accent-brand-600" />
              <p class={`mt-1 text-sm font-medium ${willClip ? 'text-amber-700' : 'text-slate-600'}`}>
                {willClip
                  ? `⚠ Peaks will clip — this file's maximum clean boost is about +${maxCleanDb} dB.`
                  : `Measured headroom: up to about +${maxCleanDb} dB stays clean.`}
              </p>
            </div>
          )}

          {mode === 'wav' && <p class="text-sm text-slate-600">Ready — converts to 16-bit PCM WAV at {(buffer.sampleRate / 1000).toFixed(1)} kHz (≈{fmtSize(buffer.duration * buffer.sampleRate * buffer.numberOfChannels * 2)}).</p>}

          <button type="button" onClick={run} disabled={busy} class="mt-4 rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-40">
            {busy ? 'Rendering…' : mode === 'trim' ? '✂ Trim' : mode === 'speed' ? '⏩ Apply speed' : mode === 'volume' ? '🔊 Apply gain' : '🎚️ Convert to WAV'}
          </button>

          {resultUrl && (
            <div class="mt-4 rounded-xl border border-brand-100 bg-white p-4" aria-live="polite">
              <p class="text-sm font-semibold text-slate-900">Result — {resultInfo}</p>
              <audio controls src={resultUrl} class="mt-2 w-full" />
              <button type="button" onClick={download} class="mt-3 rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800">
                ⬇ Download WAV
              </button>
            </div>
          )}
        </div>
      )}
      <p class="mt-3 text-xs text-slate-500">Decoded, processed and encoded in your browser — recordings never touch a server.</p>
    </div>
  );
}
