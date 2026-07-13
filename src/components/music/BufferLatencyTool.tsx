import { useMemo, useState } from 'preact/hooks';
import { bufferLatencyMs } from '../../lib/music';

const BUFFERS = [16, 32, 64, 128, 256, 512, 1024, 2048];
const RATES = [44100, 48000, 88200, 96000, 192000];
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

export default function BufferLatencyTool() {
  const [buf, setBuf] = useState(256);
  const [rate, setRate] = useState(48000);

  const r = useMemo(() => {
    const one = bufferLatencyMs(buf, rate);
    return { one, roundTrip: one * 2 };
  }, [buf, rate]);

  const sel = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Buffer size (samples)</span>
          <select value={buf} onChange={(e) => setBuf(parseInt((e.target as HTMLSelectElement).value, 10))} class={`${sel} w-full`}>
            {BUFFERS.map((b) => <option value={b}>{b}</option>)}
          </select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sample rate (Hz)</span>
          <select value={rate} onChange={(e) => setRate(parseInt((e.target as HTMLSelectElement).value, 10))} class={`${sel} w-full`}>
            {RATES.map((s) => <option value={s}>{s.toLocaleString()}</option>)}
          </select></label>
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">One-way (buffer) latency</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.one)} <span class="text-lg text-slate-500">ms</span></p></div>
        <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Round-trip (in + out)</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.roundTrip)} <span class="text-lg text-slate-500">ms</span></p></div>
      </div>

      <p class="mt-4 text-xs text-slate-500">Latency of one buffer = buffer size ÷ sample rate. A 256-sample buffer at 48 kHz is 5.33 ms one way. Round-trip (recording monitoring) is roughly double, plus a few ms of converter and driver overhead your interface adds. Smaller buffers feel tighter for live playing but cost more CPU and risk audio dropouts. 🔒 In your browser.</p>
    </div>
  );
}
