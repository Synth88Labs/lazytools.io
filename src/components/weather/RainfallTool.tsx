import { useMemo, useState } from 'preact/hooks';
import { rainfallCollectionL } from '../../lib/weather';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(4)).toLocaleString('en-US', { maximumSignificantDigits: 4 });

export default function RainfallTool() {
  const [area, setArea] = useState('100');
  const [areaUnit, setAreaUnit] = useState<'m2' | 'ft2'>('m2');
  const [rain, setRain] = useState('25');
  const [rainUnit, setRainUnit] = useState<'mm' | 'in'>('mm');
  const [coeff, setCoeff] = useState('0.9');

  const res = useMemo(() => {
    const a = num(area), r = num(rain), c = num(coeff);
    if (a == null || r == null || c == null) return null;
    const areaM2 = areaUnit === 'ft2' ? a * 0.09290304 : a;
    const rainMm = rainUnit === 'in' ? r * 25.4 : r;
    const litres = rainfallCollectionL(areaM2, rainMm, c);
    return { litres, gallons: litres * 0.264172 };
  }, [area, areaUnit, rain, rainUnit, coeff]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Roof footprint area</span>
          <div class="flex gap-1"><input type="number" step="any" value={area} onInput={(e) => setArea((e.target as HTMLInputElement).value)} class={inp} />
            <select value={areaUnit} onChange={(e) => setAreaUnit((e.target as HTMLSelectElement).value as 'm2' | 'ft2')} class={sel}><option value="m2">m²</option><option value="ft2">ft²</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Rainfall</span>
          <div class="flex gap-1"><input type="number" step="any" value={rain} onInput={(e) => setRain((e.target as HTMLInputElement).value)} class={inp} />
            <select value={rainUnit} onChange={(e) => setRainUnit((e.target as HTMLSelectElement).value as 'mm' | 'in')} class={sel}><option value="mm">mm</option><option value="in">in</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Runoff coefficient</span><input type="number" step="0.05" value={coeff} onInput={(e) => setCoeff((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Harvestable water</p><p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(res.litres)} L</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">In US gallons</p><p class="mt-1 font-mono text-3xl font-extrabold text-slate-800">{fmt(res.gallons)} gal</p></div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter your roof area, the rainfall and a runoff coefficient.</p>}

      <p class="mt-4 text-xs text-slate-500">Rainwater harvested = roof footprint area × rainfall depth × runoff coefficient. One millimetre of rain on one square metre is exactly one litre; one inch on one square foot is about 0.623 gallons. Use the horizontal footprint (not the sloped surface), and a runoff coefficient around 0.8–0.9 for a typical roof to account for splash, evaporation and first-flush losses. 🔒 In your browser.</p>
    </div>
  );
}
