import { useState } from 'preact/hooks';
import { MEAT_TEMPS, DONENESS } from '../../lib/cooking';

export default function MeatTempTool() {
  const [showDoneness, setShowDoneness] = useState(false);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="rounded-xl bg-white p-2 ring-1 ring-slate-200">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th class="px-3 py-2">Food</th><th class="px-3 py-2 text-right">Safe min</th><th class="px-3 py-2">Rest</th>
            </tr>
          </thead>
          <tbody>
            {MEAT_TEMPS.map((m, i) => (
              <tr class={i % 2 ? 'bg-slate-50' : ''}>
                <td class="px-3 py-2 text-slate-700">{m.food}</td>
                <td class="px-3 py-2 text-right font-mono font-bold text-brand-800 whitespace-nowrap">{m.f} °F / {m.c} °C</td>
                <td class="px-3 py-2 text-xs text-slate-500">{m.rest ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div class="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200">
        These are <strong>USDA/FoodSafety.gov safe minimum</strong> internal temperatures — measured with a food thermometer in the thickest part, away from bone. They are safety floors, not doneness preferences. Precooked hams repackaged in a USDA-inspected plant may be reheated to 140 °F; reheat all others to 165 °F.
      </div>

      <button onClick={() => setShowDoneness(!showDoneness)} class="mt-4 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50">
        {showDoneness ? 'Hide' : 'Show'} steak doneness guide (cook's reference)
      </button>

      {showDoneness && (
        <div class="mt-3 rounded-xl bg-white p-2 ring-1 ring-slate-200">
          <table class="w-full text-sm">
            <thead><tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><th class="px-3 py-2">Doneness</th><th class="px-3 py-2 text-right">Pull temp</th><th class="px-3 py-2">Note</th></tr></thead>
            <tbody>
              {DONENESS.map((d, i) => (
                <tr class={i % 2 ? 'bg-slate-50' : ''}>
                  <td class="px-3 py-2 font-semibold text-slate-700">{d.label}</td>
                  <td class="px-3 py-2 text-right font-mono font-bold text-slate-800 whitespace-nowrap">{d.f} °F / {d.c} °C</td>
                  <td class="px-3 py-2 text-xs text-slate-500">{d.note ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p class="px-3 py-2 text-xs text-slate-500">Doneness temperatures below 145 °F are culinary targets for whole cuts of beef and lamb, not USDA-endorsed safe minimums. Ground meat, poultry and pork should always reach their safe minimum above.</p>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Source: FoodSafety.gov (USDA/HHS). Carry-over cooking raises the temperature a few degrees after you pull it from the heat — rest before carving. 🔒 In your browser.</p>
    </div>
  );
}
