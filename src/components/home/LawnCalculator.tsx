import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function LawnCalculator() {
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [mode, setMode] = useState<'sod' | 'seed'>('sod');
  const [L, setL] = useState('20');
  const [W, setW] = useState('10');
  const [rollCov, setRollCov] = useState(''); // roll coverage in area unit
  const [rate, setRate] = useState(''); // seed rate g/m² or lb/1000sqft

  const D = unit === 'm'
    ? { len: 'm', area: 'm²', rollDef: 1, palletDef: 50, rateDef: 35, rateUnit: 'g/m²', seedOut: 'kg' }
    : { len: 'ft', area: 'sq ft', rollDef: 10, palletDef: 500, rateDef: 2, rateUnit: 'lb/1000 sq ft', seedOut: 'lb' };

  const r = useMemo(() => {
    const l = num(L), w = num(W);
    if (l == null || w == null) return null;
    const area = l * w;
    if (mode === 'sod') {
      const rc = num(rollCov) ?? D.rollDef;
      const rolls = rc > 0 ? Math.ceil((area * 1.05) / rc) : null;
      const pallets = Math.ceil((area * 1.05) / D.palletDef);
      return { mode: 'sod' as const, area, rolls, pallets };
    }
    const rt = num(rate) ?? D.rateDef;
    const seed = unit === 'm' ? (area * rt) / 1000 : (area / 1000) * rt; // metric: g→kg ; imperial: per 1000 sqft
    return { mode: 'seed' as const, area, seed };
  }, [L, W, rollCov, rate, mode, unit]);

  const inp = (val: string, set: (v: string) => void, label: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input type="number" step="any" min="0" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        {(['sod', 'seed'] as const).map((m) => (
          <button onClick={() => setMode(m)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${mode === m ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{m === 'sod' ? 'Sod / turf' : 'Grass seed'}</button>
        ))}
        <div class="ml-auto flex gap-2">
          {(['m', 'ft'] as const).map((u) => (
            <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'm' ? 'Metric' : 'Imperial'}</button>
          ))}
        </div>
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        {inp(L, setL, `Lawn length (${D.len})`)}
        {inp(W, setW, `Lawn width (${D.len})`)}
        {mode === 'sod' ? inp(rollCov, setRollCov, `Roll coverage (${D.area}, blank = ${D.rollDef})`) : inp(rate, setRate, `Seed rate (${D.rateUnit}, blank = ${D.rateDef})`)}
      </div>

      {r ? (
        r.mode === 'sod' ? (
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Sod rolls</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{r.rolls ?? '—'}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Pallets (~{D.palletDef} {D.area})</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{r.pallets}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Area</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.area)} <span class="text-lg text-slate-500">{D.area}</span></p></div>
          </div>
        ) : (
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Grass seed needed</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.seed, 2)} <span class="text-lg text-slate-500">{D.seedOut}</span></p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Area</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.area)} <span class="text-lg text-slate-500">{D.area}</span></p></div>
          </div>
        )
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your lawn dimensions.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Sod ≈ area ÷ roll (+5% trim); new-lawn seed ≈ 35 g/m² (1.5–2 lb/1000 sq ft), overseeding about half. 🔒 In your browser.</p>
    </div>
  );
}
