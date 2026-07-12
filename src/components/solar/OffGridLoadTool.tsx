import { useMemo, useState } from 'preact/hooks';
import { dailyLoadWh, APPLIANCE_PRESETS, type Appliance } from '../../lib/solar';

const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { maximumFractionDigits: d });

let idSeed = 0;
interface Row extends Appliance { id: number; }

export default function OffGridLoadTool() {
  const [rows, setRows] = useState<Row[]>([
    { id: idSeed++, name: 'LED lights', watts: 10, hoursPerDay: 5, qty: 4 },
    { id: idSeed++, name: 'Fridge', watts: 150, hoursPerDay: 24, qty: 1 },
    { id: idSeed++, name: 'Laptop', watts: 60, hoursPerDay: 4, qty: 1 },
  ]);

  const totalWh = useMemo(() => dailyLoadWh(rows), [rows]);

  const update = (id: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: number) => setRows((rs) => rs.filter((r) => r.id !== id));
  const add = () => setRows((rs) => [...rs, { id: idSeed++, name: 'Appliance', watts: 100, hoursPerDay: 1, qty: 1 }]);
  const addPreset = (name: string) => {
    const p = APPLIANCE_PRESETS.find((a) => a.name === name);
    if (p) setRows((rs) => [...rs, { id: idSeed++, name: p.name, watts: p.watts, hoursPerDay: 2, qty: 1 }]);
  };

  const inp = 'w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const nameInp = 'w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[560px] text-sm">
          <thead>
            <tr class="text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <th class="pb-2 pr-2">Appliance</th><th class="pb-2 px-2 w-20">Watts</th><th class="pb-2 px-2 w-16">Qty</th><th class="pb-2 px-2 w-24">Hours/day</th><th class="pb-2 px-2 w-24 text-right">Wh/day</th><th class="pb-2 pl-2 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} class="border-t border-slate-200">
                <td class="py-1.5 pr-2"><input value={r.name} onInput={(e) => update(r.id, { name: (e.target as HTMLInputElement).value })} class={nameInp} /></td>
                <td class="py-1.5 px-2"><input type="number" step="any" value={r.watts} onInput={(e) => update(r.id, { watts: parseFloat((e.target as HTMLInputElement).value) || 0 })} class={inp} /></td>
                <td class="py-1.5 px-2"><input type="number" step="1" value={r.qty} onInput={(e) => update(r.id, { qty: parseInt((e.target as HTMLInputElement).value) || 1 })} class={inp} /></td>
                <td class="py-1.5 px-2"><input type="number" step="any" value={r.hoursPerDay} onInput={(e) => update(r.id, { hoursPerDay: parseFloat((e.target as HTMLInputElement).value) || 0 })} class={inp} /></td>
                <td class="py-1.5 px-2 text-right font-mono font-semibold text-slate-700">{fmt(r.watts * r.hoursPerDay * (r.qty || 1))}</td>
                <td class="py-1.5 pl-2 text-center"><button onClick={() => remove(r.id)} class="text-slate-400 hover:text-rose-600" aria-label="Remove">✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-2">
        <button onClick={add} class="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700">+ Add row</button>
        <select onChange={(e) => { addPreset((e.target as HTMLSelectElement).value); (e.target as HTMLSelectElement).selectedIndex = 0; }} class="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700">
          <option>+ Add common appliance…</option>
          {APPLIANCE_PRESETS.map((a) => <option value={a.name}>{a.name} ({a.watts} W)</option>)}
        </select>
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total daily energy</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(totalWh)} Wh</p><p class="mt-0.5 text-sm text-slate-500">{fmt(totalWh / 1000, 2)} kWh/day</p></div>
        <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Per month · year</p><p class="mt-1 text-xl font-extrabold text-slate-700">{fmt(totalWh * 30.4368 / 1000)} · {fmt(totalWh * 365.25 / 1000)} kWh</p></div>
      </div>

      <p class="mt-4 text-xs text-slate-500">Daily energy is the sum of each appliance's watts × quantity × hours run per day. This total is the starting point for sizing an off-grid system: feed it into the battery-bank and solar-panel calculators. Preset wattages are typical starting points — real appliances vary, and motor-driven ones (fridges, pumps) cycle on and off, so use their average daily run-time. 🔒 In your browser.</p>
    </div>
  );
}
