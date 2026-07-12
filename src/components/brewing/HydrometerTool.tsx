import { useMemo, useState } from 'preact/hooks';
import { hydrometerCorrect } from '../../lib/brewing';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (n: number, d = 3) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const C_TO_F = (c: number) => (c * 9) / 5 + 32;

export default function HydrometerTool() {
  const [reading, setReading] = useState('1.050');
  const [temp, setTemp] = useState('30');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [calTemp, setCalTemp] = useState('20');

  const r = useMemo(() => {
    const rd = num(reading), t = num(temp), ct = num(calTemp);
    if (rd == null || t == null || ct == null) return null;
    const tF = unit === 'C' ? C_TO_F(t) : t;
    const ctF = unit === 'C' ? C_TO_F(ct) : ct;
    const corrected = hydrometerCorrect(rd, tF, ctF);
    return corrected != null ? { corrected, delta: corrected - rd } : null;
  }, [reading, temp, unit, calTemp]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Hydrometer reading</span>
          <input type="number" step="0.001" value={reading} onInput={(e) => setReading((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sample temp (°{unit})</span>
          <div class="flex gap-2">
            <input type="number" step="any" value={temp} onInput={(e) => setTemp((e.target as HTMLInputElement).value)} class={inp} />
            <select class={sel} value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'C' | 'F')}><option value="C">°C</option><option value="F">°F</option></select>
          </div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Calibration temp (°{unit})</span>
          <input type="number" step="any" value={calTemp} onInput={(e) => setCalTemp((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Corrected gravity</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.corrected)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Correction</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.delta >= 0 ? '+' : ''}{fmt(r.delta)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the reading, the sample temperature and the hydrometer's calibration temperature.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Hydrometers are calibrated at one temperature (commonly 20 °C / 68 °F, or 15.5 °C / 60 °F). A warm sample is less dense, so the hydrometer reads low — this adds the correction back. The effect is small near calibration temperature but grows for hot wort straight off the boil. Check your hydrometer's calibration temperature (printed on the scale) and set it above. 🔒 In your browser.</p>
    </div>
  );
}
