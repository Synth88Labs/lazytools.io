import { useMemo, useState } from 'preact/hooks';
import { DIVISIONS, delayTimes, msToHz } from '../../lib/music';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function BpmDelayTool() {
  const [bpm, setBpm] = useState('120');

  const rows = useMemo(() => {
    const b = num(bpm);
    if (b == null) return null;
    return DIVISIONS.map((d) => ({ label: d.label, ...delayTimes(b, d.beats) }));
  }, [bpm]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tempo (BPM)</span>
        <input type="number" step="any" value={bpm} onInput={(e) => setBpm((e.target as HTMLInputElement).value)} class={`${inp} sm:w-40`} /></label>

      {rows ? (
        <div class="mt-4 overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200">
          <table class="w-full text-sm">
            <thead><tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th class="px-3 py-2">Note</th><th class="px-3 py-2 text-right">Straight</th><th class="px-3 py-2 text-right">Dotted</th><th class="px-3 py-2 text-right">Triplet</th><th class="px-3 py-2 text-right">Hz</th>
            </tr></thead>
            <tbody>{rows.map((row, i) => (
              <tr class={i % 2 ? 'bg-slate-50' : ''}>
                <td class="px-3 py-2 font-semibold text-slate-700">{row.label}</td>
                <td class="px-3 py-2 text-right font-mono font-bold text-brand-800">{fmt(row.straight)} ms</td>
                <td class="px-3 py-2 text-right font-mono text-slate-600">{fmt(row.dotted)} ms</td>
                <td class="px-3 py-2 text-right font-mono text-slate-600">{fmt(row.triplet)} ms</td>
                <td class="px-3 py-2 text-right font-mono text-slate-400">{fmt(msToHz(row.straight), 2)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a tempo in BPM.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">A quarter-note beat is 60,000 ÷ BPM milliseconds. Dotted = ×1.5, triplet = ×⅔. Use these for tempo-synced delay, echo and reverb pre-delay; the Hz column suits tempo-synced LFOs. 🔒 In your browser.</p>
    </div>
  );
}
