import { useMemo, useState } from 'preact/hooks';
import { BEAUFORT, beaufort } from '../../lib/weather';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };

export default function BeaufortTool() {
  const [unit, setUnit] = useState<'mph' | 'kmh' | 'kts' | 'ms'>('mph');
  const [speed, setSpeed] = useState('20');

  const r = useMemo(() => {
    const s = num(speed);
    if (s == null) return null;
    const mph = unit === 'mph' ? s : unit === 'kmh' ? s / 1.609344 : unit === 'kts' ? s * 1.150779 : s * 2.236936;
    return { level: beaufort(mph), mph };
  }, [speed, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Wind speed</span>
        <div class="flex gap-2 sm:w-72">
          <input type="number" step="any" min="0" value={speed} onInput={(e) => setSpeed((e.target as HTMLInputElement).value)} class={inp} />
          <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as any)} class={sel}>
            <option value="mph">mph</option><option value="kmh">km/h</option><option value="kts">knots</option><option value="ms">m/s</option>
          </select>
        </div>
      </label>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Beaufort force {r.level.force}</p>
          <p class="mt-1 text-3xl font-extrabold text-brand-800">{r.level.name}</p>
          <p class="mt-1 text-sm text-slate-600">{r.level.effect}</p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a wind speed.</p>
      )}

      <details class="mt-4 rounded-xl bg-white p-3 ring-1 ring-slate-200">
        <summary class="cursor-pointer text-sm font-semibold text-slate-700">Full Beaufort scale</summary>
        <div class="mt-2 overflow-x-auto"><table class="w-full text-sm">
          <thead><tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><th class="px-3 py-1">Force</th><th class="px-3 py-1">Description</th><th class="px-3 py-1 text-right">mph</th></tr></thead>
          <tbody>{BEAUFORT.map((b, i) => (
            <tr class={`${i % 2 ? 'bg-slate-50' : ''} ${r && r.level.force === b.force ? 'bg-brand-50/60' : ''}`}>
              <td class="px-3 py-1 font-mono">{b.force}</td><td class="px-3 py-1 text-slate-700">{b.name}</td>
              <td class="px-3 py-1 text-right font-mono text-slate-500">{b.maxMph === Infinity ? `${b.minMph}+` : `${b.minMph}–${b.maxMph}`}</td>
            </tr>
          ))}</tbody>
        </table></div>
      </details>

      <p class="mt-4 text-xs text-slate-500">The Beaufort scale (NWS/WMO) relates wind speed to observable effects on land and sea, from Force 0 (calm) to Force 12 (hurricane force, 73 mph / 64 knots and above). 🔒 In your browser.</p>
    </div>
  );
}
