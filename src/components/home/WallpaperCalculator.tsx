import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

export default function WallpaperCalculator() {
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [L, setL] = useState('4');
  const [W, setW] = useState('3');
  const [H, setH] = useState('2.4');
  const [rollLen, setRollLen] = useState('');
  const [rollWid, setRollWid] = useState(''); // cm (metric) or in (imperial)
  const [repeat, setRepeat] = useState('0'); // cm or in

  const D = unit === 'm'
    ? { len: 'm', small: 'cm', rollLenDef: 10, rollWidDef: 53, trim: 0.1 }
    : { len: 'ft', small: 'in', rollLenDef: 33, rollWidDef: 21, trim: 0.33 };

  const r = useMemo(() => {
    const l = num(L), w = num(W), h = num(H), rp = num(repeat) ?? 0;
    const rollLength = num(rollLen) ?? D.rollLenDef;
    const rollWidth = (num(rollWid) ?? D.rollWidDef) / (unit === 'm' ? 100 : 12); // cm→m / in→ft
    const rep = rp / (unit === 'm' ? 100 : 12);
    if (l == null || w == null || h == null || rollWidth <= 0) return null;
    const perimeter = 2 * (l + w);
    const dropLength = h + D.trim + rep; // each strip needs height + trim + one repeat allowance
    const dropsPerRoll = Math.floor(rollLength / dropLength);
    if (dropsPerRoll < 1) return { perimeter, dropsPerRoll: 0, rolls: null, dropsNeeded: 0 };
    const dropsNeeded = Math.ceil(perimeter / rollWidth);
    const rolls = Math.ceil(dropsNeeded / dropsPerRoll);
    return { perimeter, dropsPerRoll, dropsNeeded, rolls };
  }, [L, W, H, rollLen, rollWid, repeat, unit]);

  const inp = (val: string, set: (v: string) => void, label: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input type="number" step="any" min="0" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['m', 'ft'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'm' ? 'Metric' : 'Imperial'}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        {inp(L, setL, `Room length (${D.len})`)}
        {inp(W, setW, `Room width (${D.len})`)}
        {inp(H, setH, `Wall height (${D.len})`)}
        {inp(rollLen, setRollLen, `Roll length (${D.len}, blank = ${D.rollLenDef})`)}
        {inp(rollWid, setRollWid, `Roll width (${D.small}, blank = ${D.rollWidDef})`)}
        {inp(repeat, setRepeat, `Pattern repeat (${D.small})`)}
      </div>

      {r ? (
        r.rolls == null ? (
          <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 ring-1 ring-amber-200">⚠ The roll is too short for one full-height drop — check the roll length and wall height.</p>
        ) : (
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Rolls to buy</p>
              <p class="mt-1 text-3xl font-extrabold text-brand-800">{r.rolls}</p>
              <p class="mt-1 text-xs text-slate-400">+ a spare from the same batch</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Strips (drops) needed</p>
              <p class="mt-1 text-3xl font-extrabold text-slate-700">{r.dropsNeeded}</p>
              <p class="mt-1 text-xs text-slate-400">perimeter {fmt(r.perimeter)} {D.len}</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Drops per roll</p>
              <p class="mt-1 text-3xl font-extrabold text-slate-700">{r.dropsPerRoll}</p>
            </div>
          </div>
        )
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the room dimensions; roll size defaults to a standard Euro roll.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Rolls = drops needed (perimeter ÷ roll width) ÷ drops per roll (roll length ÷ (height + trim + repeat)). 🔒 In your browser.</p>
    </div>
  );
}
