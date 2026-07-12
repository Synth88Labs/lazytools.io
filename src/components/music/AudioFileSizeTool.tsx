import { useMemo, useState } from 'preact/hooks';
import { audioBytes, audioBitrate } from '../../lib/music';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmtBytes = (b: number) => {
  if (b >= 1e9) return `${(b / 1e9).toFixed(2)} GB`;
  if (b >= 1e6) return `${(b / 1e6).toFixed(2)} MB`;
  if (b >= 1e3) return `${(b / 1e3).toFixed(1)} KB`;
  return `${Math.round(b)} B`;
};

const RATES = [8000, 22050, 44100, 48000, 88200, 96000, 192000];
const DEPTHS = [8, 16, 24, 32];

export default function AudioFileSizeTool() {
  const [rate, setRate] = useState(44100);
  const [depth, setDepth] = useState(16);
  const [channels, setChannels] = useState(2);
  const [minutes, setMinutes] = useState('3');

  const r = useMemo(() => {
    const min = num(minutes);
    if (min == null) return null;
    const seconds = min * 60;
    return { bytes: audioBytes(rate, depth, channels, seconds), bitrate: audioBitrate(rate, depth, channels) };
  }, [rate, depth, channels, minutes]);

  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sample rate (Hz)</span>
          <select value={rate} onChange={(e) => setRate(+(e.target as HTMLSelectElement).value)} class={sel}>{RATES.map((x) => <option value={x}>{x.toLocaleString()}</option>)}</select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Bit depth</span>
          <select value={depth} onChange={(e) => setDepth(+(e.target as HTMLSelectElement).value)} class={sel}>{DEPTHS.map((x) => <option value={x}>{x}-bit</option>)}</select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Channels</span>
          <select value={channels} onChange={(e) => setChannels(+(e.target as HTMLSelectElement).value)} class={sel}><option value={1}>Mono (1)</option><option value={2}>Stereo (2)</option><option value={6}>5.1 (6)</option></select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Duration (minutes)</span>
          <input type="number" step="any" value={minutes} onInput={(e) => setMinutes((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Uncompressed file size</p><p class="mt-1 text-4xl font-extrabold text-brand-800">{fmtBytes(r.bytes)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Data rate</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{(r.bitrate / 1000).toFixed(0)} <span class="text-lg text-slate-500">kbps</span></p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a duration.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Size = sample rate × (bit depth ÷ 8) × channels × seconds — this is raw PCM (WAV/AIFF). CD quality is 44,100 Hz / 16-bit / stereo ≈ 10 MB per minute. Lossy formats (MP3, AAC) are far smaller. 🔒 In your browser.</p>
    </div>
  );
}
