import { useMemo, useState } from 'preact/hooks';
import { jetLagDays } from '../../lib/travel';

export default function JetLagTool() {
  const [zones, setZones] = useState('6');
  const [dir, setDir] = useState<'east' | 'west'>('east');

  const r = useMemo(() => {
    const z = parseInt(zones, 10);
    if (!isFinite(z) || z < 0) return null;
    if (z === 0) return { zero: true } as const;
    return { zero: false, ...jetLagDays(z, dir) } as const;
  }, [zones, dir]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Time zones crossed</span>
          <input type="number" step="1" min="0" value={zones} onInput={(e) => setZones((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Direction of travel</span>
          <select class={sel} value={dir} onChange={(e) => setDir((e.target as HTMLSelectElement).value as 'east' | 'west')}>
            <option value="east">Eastward (e.g. US → Europe)</option>
            <option value="west">Westward (e.g. Europe → US)</option>
          </select></label>
      </div>

      {r ? (
        r.zero ? <p class="mt-4 text-sm text-slate-600">No time zones crossed — no jet lag expected.</p> : (
          <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated time to adjust</p>
            <p class="mt-1 text-3xl font-extrabold text-brand-800">≈ {r.days} {r.days === 1 ? 'day' : 'days'}</p>
            <p class="mt-2 text-sm text-slate-600">Rule of thumb: about {r.rate === 1.5 ? '1½ days' : '1 day'} per time zone travelling {dir === 'east' ? 'eastward — which shortens your day and is usually harder' : 'westward — which lengthens your day and is usually easier'}.</p>
          </div>
        )
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the number of time zones you'll cross.</p>
      )}

      <div class="mt-4 rounded-xl bg-slate-100 p-3 text-xs text-slate-600">
        <p class="font-semibold text-slate-700">Easing it:</p>
        <ul class="mt-1 list-disc space-y-0.5 pl-4">
          <li>Shift your sleep schedule an hour a day toward the destination before you leave.</li>
          <li>Get bright daylight at the right time — morning light helps after eastward flights, evening light after westward.</li>
          <li>Adopt local meal and sleep times on arrival; stay hydrated and go easy on alcohol and late caffeine.</li>
        </ul>
      </div>

      <p class="mt-3 text-xs text-slate-500">General guidance, not medical advice. The "about a day per time zone" rule and the eastward-is-harder pattern are widely cited (Cleveland Clinic, Sleep Foundation, Better Health Channel); individuals vary, and roughly a quarter of people find the opposite direction harder. 🔒 In your browser.</p>
    </div>
  );
}
