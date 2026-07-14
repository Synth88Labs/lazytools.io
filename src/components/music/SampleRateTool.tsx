import { useMemo, useState } from 'preact/hooks';
import { nyquistFrequency, dynamicRangeDb } from '../../lib/music';

const RATES = [8000, 16000, 22050, 32000, 44100, 48000, 88200, 96000, 176400, 192000];
const DEPTHS = [8, 12, 16, 20, 24, 32];
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toLocaleString();

export default function SampleRateTool() {
  const [rate, setRate] = useState(44100);
  const [depth, setDepth] = useState(16);

  const r = useMemo(() => ({
    nyquist: nyquistFrequency(rate),
    range: dynamicRangeDb(depth),
    dataRateMono: rate * depth,
  }), [rate, depth]);

  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sample rate</span>
          <select value={rate} onChange={(e) => setRate(parseInt((e.target as HTMLSelectElement).value, 10))} class={sel}>{RATES.map((s) => <option value={s}>{s.toLocaleString()} Hz</option>)}</select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Bit depth</span>
          <select value={depth} onChange={(e) => setDepth(parseInt((e.target as HTMLSelectElement).value, 10))} class={sel}>{DEPTHS.map((d) => <option value={d}>{d}-bit</option>)}</select></label>
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-3">
        <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Nyquist frequency</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.nyquist / 1000, 3)} <span class="text-lg text-slate-500">kHz</span></p><p class="mt-0.5 text-xs text-slate-400">highest frequency captured</p></div>
        <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Dynamic range</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.range)} dB</p><p class="mt-0.5 text-xs text-slate-400">≈ 6.02 dB per bit</p></div>
        <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Data rate (mono)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.dataRateMono / 1000, 0)} <span class="text-base text-slate-500">kbps</span></p></div>
      </div>

      <p class="mt-4 text-xs text-slate-500">The Nyquist–Shannon theorem says a sample rate can only represent frequencies up to half of it — the Nyquist frequency. So 44.1 kHz (CD) captures up to 22.05 kHz, just above human hearing. Bit depth sets the dynamic range at about 6.02 dB per bit, so 16-bit gives ~96 dB and 24-bit ~144 dB of range between the quietest and loudest sound. 🔒 In your browser.</p>
    </div>
  );
}
