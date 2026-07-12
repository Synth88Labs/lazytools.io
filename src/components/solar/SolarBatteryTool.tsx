import { useMemo, useState } from 'preact/hooks';
import { batteryBank, DOD_PRESETS } from '../../lib/solar';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { maximumFractionDigits: d });

export default function SolarBatteryTool() {
  const [load, setLoad] = useState('3000');
  const [days, setDays] = useState('1');
  const [chem, setChem] = useState(DOD_PRESETS[2].name);
  const [voltage, setVoltage] = useState('24');

  const preset = DOD_PRESETS.find((d) => d.name === chem)!;

  const r = useMemo(() => {
    const l = num(load), d = num(days), v = num(voltage);
    if (l == null || d == null || v == null || d === 0 || v === 0) return null;
    return batteryBank(l, d, preset.dod, v);
  }, [load, days, chem, voltage]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Daily load (Wh)</span>
          <input type="number" step="any" value={load} onInput={(e) => setLoad((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Days of autonomy</span>
          <input type="number" step="any" value={days} onInput={(e) => setDays((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Battery type</span>
          <select class={sel} value={chem} onChange={(e) => setChem((e.target as HTMLSelectElement).value)}>
            {DOD_PRESETS.map((d) => <option value={d.name}>{d.name} ({d.dod * 100}% DoD)</option>)}
          </select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">System voltage (V)</span>
          <select class={sel} value={voltage} onChange={(e) => setVoltage((e.target as HTMLSelectElement).value)}>
            <option value="12">12 V</option><option value="24">24 V</option><option value="48">48 V</option>
          </select></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Battery bank size</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.ampHours)} Ah</p><p class="mt-0.5 text-sm text-slate-500">at {voltage} V</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Nominal capacity</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.nominalWh / 1000, 2)} kWh</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Usable energy</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.usableWh / 1000, 2)} kWh</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your daily load, days of autonomy, battery type and system voltage.</p>
      )}

      <p class="mt-2 text-xs text-slate-600"><strong>{preset.name}:</strong> {preset.note}</p>
      <p class="mt-3 text-xs text-slate-500">Bank size = daily load × days of autonomy ÷ depth of discharge, then ÷ system voltage for Amp-hours. Depth of discharge protects battery life — ~50% for lead-acid, ~80% for lithium (LiFePO4). "Days of autonomy" is how long the bank runs with no charging (cloudy days); 1–3 is common. Note: lead-acid loses usable capacity in the cold (only ~80% near 0°C), and lithium must not be charged below freezing — size up in cold climates. 🔒 In your browser.</p>
    </div>
  );
}
