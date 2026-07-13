import { useMemo, useState } from 'preact/hooks';
import { downloadSeconds, formatDuration, SIZE_DECIMAL, SIZE_BINARY, SPEED_BPS } from '../../lib/network';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };

export default function DownloadTimeTool() {
  const [size, setSize] = useState('1');
  const [sizeUnit, setSizeUnit] = useState('GB');
  const [speed, setSpeed] = useState('100');
  const [speedUnit, setSpeedUnit] = useState('Mbps');
  const [realistic, setRealistic] = useState(true);

  const SIZE_UNITS = { ...SIZE_DECIMAL, ...SIZE_BINARY };

  const r = useMemo(() => {
    const sz = num(size), sp = num(speed);
    if (sz == null || sp == null) return null;
    const bytes = sz * SIZE_UNITS[sizeUnit];
    const bps = sp * SPEED_BPS[speedUnit];
    const eff = realistic ? 0.9 : 1;
    const secs = downloadSeconds(bytes, bps, eff);
    return { secs, ideal: downloadSeconds(bytes, bps, 1) };
  }, [size, sizeUnit, speed, speedUnit, realistic]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">File size</span>
          <div class="flex gap-1"><input type="number" step="any" value={size} onInput={(e) => setSize((e.target as HTMLInputElement).value)} class={inp} />
            <select value={sizeUnit} onChange={(e) => setSizeUnit((e.target as HTMLSelectElement).value)} class={sel}>{Object.keys(SIZE_UNITS).filter((u) => u !== 'B').map((u) => <option value={u}>{u}</option>)}</select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Connection speed</span>
          <div class="flex gap-1"><input type="number" step="any" value={speed} onInput={(e) => setSpeed((e.target as HTMLInputElement).value)} class={inp} />
            <select value={speedUnit} onChange={(e) => setSpeedUnit((e.target as HTMLSelectElement).value)} class={sel}>{Object.keys(SPEED_BPS).map((u) => <option value={u}>{u}</option>)}</select></div></label>
      </div>
      <label class="mt-3 flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={realistic} onChange={(e) => setRealistic((e.target as HTMLInputElement).checked)} /> Account for ~10% real-world overhead</label>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-5 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated {realistic ? 'real-world' : 'theoretical'} download time</p>
          <p class="mt-1 text-3xl font-extrabold text-brand-800">{formatDuration(r.secs)}</p>
          {realistic && <p class="mt-1 text-xs text-slate-400">Theoretical best: {formatDuration(r.ideal)}</p>}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a file size and a connection speed.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Time = file size in bits ÷ speed in bits per second. Watch the units: speeds are quoted in <strong>bits</strong> (Mbps) but files in <strong>bytes</strong> (MB), and there are 8 bits per byte — so a 1 GB file on a 100 Mbps line takes about 80 seconds, not 10. Real transfers run ~10–20% slower than the theoretical rate because of protocol overhead and congestion. 🔒 In your browser.</p>
    </div>
  );
}
