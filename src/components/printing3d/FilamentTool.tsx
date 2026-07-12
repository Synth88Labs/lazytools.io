import { useMemo, useState } from 'preact/hooks';
import { filamentConvert, materialByName, MATERIALS, DIAMETERS } from '../../lib/printing3d';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (n: number, d = 1) => n.toLocaleString('en-US', { maximumFractionDigits: d });

export default function FilamentTool() {
  const [mode, setMode] = useState<'weight' | 'length'>('weight');
  const [value, setValue] = useState('1000');
  const [material, setMaterial] = useState('PLA');
  const [diameter, setDiameter] = useState('1.75');

  const r = useMemo(() => {
    const v = num(value);
    const m = materialByName(material);
    const d = parseFloat(diameter);
    if (v == null || !m || !isFinite(d)) return null;
    return filamentConvert(mode === 'weight' ? { weightG: v, density: m.density, diameterMm: d } : { lengthM: v, density: m.density, diameterMm: d });
  }, [mode, value, material, diameter]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 inline-flex rounded-xl bg-slate-200 p-1 text-sm font-semibold">
        <button onClick={() => setMode('weight')} class={`rounded-lg px-3 py-1 ${mode === 'weight' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>I know the weight</button>
        <button onClick={() => setMode('length')} class={`rounded-lg px-3 py-1 ${mode === 'length' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>I know the length</button>
      </div>

      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{mode === 'weight' ? 'Weight (g)' : 'Length (m)'}</span>
          <input type="number" step="any" value={value} onInput={(e) => setValue((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Material</span>
          <select class={sel} value={material} onChange={(e) => setMaterial((e.target as HTMLSelectElement).value)}>
            {MATERIALS.map((m) => <option value={m.name}>{m.name} ({m.density} g/cm³)</option>)}
          </select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Diameter (mm)</span>
          <select class={sel} value={diameter} onChange={(e) => setDiameter((e.target as HTMLSelectElement).value)}>
            {DIAMETERS.map((d) => <option value={String(d)}>{d} mm</option>)}
          </select></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class={`rounded-xl bg-white p-4 text-center ${mode === 'length' ? 'ring-2 ring-brand-200' : 'ring-1 ring-slate-200'}`}><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Weight</p><p class="mt-1 text-2xl font-extrabold text-brand-800">{fmt(r.weightG)} g</p><p class="mt-0.5 text-xs text-slate-500">{fmt(r.weightG / 1000, 3)} kg</p></div>
          <div class={`rounded-xl bg-white p-4 text-center ${mode === 'weight' ? 'ring-2 ring-brand-200' : 'ring-1 ring-slate-200'}`}><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Length</p><p class="mt-1 text-2xl font-extrabold text-brand-800">{fmt(r.lengthM)} m</p><p class="mt-0.5 text-xs text-slate-500">{fmt(r.lengthM * 3.28084)} ft</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Volume</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.volumeCm3)} cm³</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a {mode === 'weight' ? 'weight' : 'length'}, material and diameter.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Filament is a cylinder, so weight = length × cross-section area (π·(d/2)²) × density. A 1 kg PLA (1.24 g/cm³) 1.75 mm spool is about 335 m. Densities vary a little by brand — check your spool's datasheet for precision. 🔒 In your browser.</p>
    </div>
  );
}
