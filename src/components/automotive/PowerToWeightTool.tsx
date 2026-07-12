import { useMemo, useState } from 'preact/hooks';
import { powerToWeight } from '../../lib/automotive';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(4)).toString();

export default function PowerToWeightTool() {
  const [power, setPower] = useState('300');
  const [powerUnit, setPowerUnit] = useState<'hp' | 'kw'>('hp');
  const [weight, setWeight] = useState('1500');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');

  const res = useMemo(() => {
    const p = num(power), w = num(weight);
    if (p == null || w == null) return null;
    const hp = powerUnit === 'kw' ? p / 0.7456998715822702 : p;
    const kg = weightUnit === 'lb' ? w / 2.2046226218487757 : w;
    return powerToWeight(hp, kg);
  }, [power, powerUnit, weight, weightUnit]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Power</span>
          <div class="flex gap-1"><input type="number" step="any" value={power} onInput={(e) => setPower((e.target as HTMLInputElement).value)} class={inp} />
            <select value={powerUnit} onChange={(e) => setPowerUnit((e.target as HTMLSelectElement).value as 'hp' | 'kw')} class={sel}><option value="hp">hp</option><option value="kw">kW</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Weight (kerb)</span>
          <div class="flex gap-1"><input type="number" step="any" value={weight} onInput={(e) => setWeight((e.target as HTMLInputElement).value)} class={inp} />
            <select value={weightUnit} onChange={(e) => setWeightUnit((e.target as HTMLSelectElement).value as 'kg' | 'lb')} class={sel}><option value="kg">kg</option><option value="lb">lb</option></select></div></label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {([['hp/tonne', res.hpPerTonne], ['W/kg', res.wPerKg], ['hp/lb', res.hpPerLb], ['kW/tonne', res.kwPerTonne]] as [string, number][]).map(([l, v], i) => (
            <div class={`rounded-xl bg-white p-4 text-center ${i === 0 ? 'ring-2 ring-brand-200' : 'ring-1 ring-slate-200'}`}><p class={`font-mono text-2xl font-extrabold ${i === 0 ? 'text-brand-800' : 'text-slate-800'}`}>{fmt(v)}</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{l}</p></div>
          ))}
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the power and weight.</p>}

      <p class="mt-4 text-xs text-slate-500">Power-to-weight ratio is how much power moves each unit of mass — the best single predictor of acceleration. It's shown here as hp per tonne, watts per kilogram, hp per pound and kW per tonne. A hot hatch is around 150 hp/tonne; a supercar 400+; and cycling power is compared in W/kg. 🔒 In your browser.</p>
    </div>
  );
}
