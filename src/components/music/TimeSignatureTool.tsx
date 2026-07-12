import { useMemo, useState } from 'preact/hooks';
import { barSeconds, beatMs } from '../../lib/music';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();
function clock(sec: number): string {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${s.toFixed(1).padStart(4, '0')}`;
}

export default function TimeSignatureTool() {
  const [bpm, setBpm] = useState('120');
  const [numer, setNumer] = useState(4);
  const [denom, setDenom] = useState(4);
  const [bars, setBars] = useState('16');

  const r = useMemo(() => {
    const b = num(bpm), nb = num(bars);
    if (b == null) return null;
    const bar = barSeconds(b, numer, denom);
    const beat = beatMs(b) / 1000; // quarter-note beat in seconds
    return { bar, beat, total: nb != null ? bar * nb : null, barsForMin: bar > 0 ? 60 / bar : 0 };
  }, [bpm, numer, denom, bars]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tempo (BPM)</span>
          <input type="number" step="any" value={bpm} onInput={(e) => setBpm((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Time signature</span>
          <div class="flex items-center gap-2">
            <select value={numer} onChange={(e) => setNumer(+(e.target as HTMLSelectElement).value)} class={sel}>{[2, 3, 4, 5, 6, 7, 9, 12].map((x) => <option value={x}>{x}</option>)}</select>
            <span class="text-slate-400">/</span>
            <select value={denom} onChange={(e) => setDenom(+(e.target as HTMLSelectElement).value)} class={sel}>{[2, 4, 8, 16].map((x) => <option value={x}>{x}</option>)}</select>
          </div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Number of bars</span>
          <input type="number" step="any" value={bars} onInput={(e) => setBars((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">One bar</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.bar)} <span class="text-lg text-slate-500">s</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{num(bars) ?? '—'} bars</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{r.total != null ? clock(r.total) : '—'}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Bars per minute</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.barsForMin, 1)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the tempo and time signature.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">One bar lasts beats-per-bar × (4 ÷ denominator) × (60 ÷ BPM) seconds. BPM counts quarter-notes, so a bar of 4/4 at 120 BPM is 2 seconds; 6/8 at 120 is 1.5 seconds. Handy for arranging song sections to a target length. 🔒 In your browser.</p>
    </div>
  );
}
