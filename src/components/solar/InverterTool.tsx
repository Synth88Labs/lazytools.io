import { useMemo, useState } from 'preact/hooks';
import { inverterSize } from '../../lib/solar';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { maximumFractionDigits: d });

export default function InverterTool() {
  const [running, setRunning] = useState('1500');
  const [surge, setSurge] = useState('3500');
  const [headroom, setHeadroom] = useState('25');

  const r = useMemo(() => {
    const rn = num(running), sg = num(surge), h = num(headroom);
    if (rn == null || sg == null || h == null) return null;
    return inverterSize(rn, sg, 1 + h / 100);
  }, [running, surge, headroom]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Total running watts</span>
          <input type="number" step="any" value={running} onInput={(e) => setRunning((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Largest surge watts</span>
          <input type="number" step="any" value={surge} onInput={(e) => setSurge((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Headroom (%)</span>
          <input type="number" step="any" value={headroom} onInput={(e) => setHeadroom((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Minimum continuous rating</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.continuous)} W</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Minimum surge rating</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.surge)} W</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your total running watts and the biggest startup surge.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The inverter's continuous rating must cover all loads running at once, plus headroom (~25%) so it isn't maxed out; its surge (peak) rating must cover the brief startup spike of your largest motor. Motors — fridges, pumps, power tools — draw roughly 2–3× their running watts for a moment on startup (some compressors more), so check that figure on the nameplate. Add up only what runs simultaneously, not everything you own. 🔒 In your browser.</p>
    </div>
  );
}
