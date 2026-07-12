import { useMemo, useState } from 'preact/hooks';
import { dewPointC, cToF, fToC } from '../../lib/weather';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toFixed(1)).toString();

function comfort(tdC: number): string {
  if (tdC < 10) return 'Dry — very comfortable';
  if (tdC < 13) return 'Comfortable';
  if (tdC < 16) return 'Pleasant';
  if (tdC < 18) return 'Slightly humid';
  if (tdC < 21) return 'Humid — sticky';
  if (tdC < 24) return 'Very humid — oppressive';
  return 'Extremely humid — dangerous';
}

export default function DewPointTool() {
  const [unit, setUnit] = useState<'C' | 'F'>('F');
  const [temp, setTemp] = useState('75');
  const [rh, setRh] = useState('60');

  const r = useMemo(() => {
    const t = num(temp), h = num(rh);
    if (t == null || h == null || h <= 0 || h > 100) return null;
    const tC = unit === 'C' ? t : fToC(t);
    const tdC = dewPointC(tC, h);
    return { tdC, tdF: cToF(tdC), comfort: comfort(tdC) };
  }, [temp, rh, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['F', 'C'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>°{u}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Air temperature (°{unit})</span>
          <input type="number" step="any" value={temp} onInput={(e) => setTemp((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Relative humidity (%)</span>
          <input type="number" step="any" min="1" max="100" value={rh} onInput={(e) => setRh((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Dew point</p>
            <p class="mt-1 text-4xl font-extrabold text-brand-800">{fmt(unit === 'F' ? r.tdF : r.tdC)}°{unit}</p>
            <p class="mt-1 text-xs text-slate-400">{fmt(unit === 'F' ? r.tdC : r.tdF)}°{unit === 'F' ? 'C' : 'F'}</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">How it feels</p>
            <p class="mt-1 text-xl font-extrabold text-slate-700">{r.comfort}</p>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the temperature and humidity (1–100%).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The dew point is the temperature at which air becomes saturated and dew forms — a better measure of "muggy" than humidity alone. Computed with the Magnus formula (Alduchov–Eskridge coefficients). Above about 18°C (65°F) it starts to feel sticky; above 24°C (75°F) is oppressive. 🔒 In your browser.</p>
    </div>
  );
}
