import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toLocaleString('en-US');

export default function TrimCalculator() {
  const [unit, setUnit] = useState<'ft' | 'm'>('ft');
  const [L, setL] = useState('12');
  const [W, setW] = useState('10');
  const [doors, setDoors] = useState('1'); // openings to subtract (baseboard) — door width each
  const [doorW, setDoorW] = useState(''); // door width in small unit
  const [stock, setStock] = useState(''); // stock piece length in big unit
  const [waste, setWaste] = useState('10');

  const D = unit === 'ft'
    ? { len: 'ft', small: 'in', toSmall: 12, doorDef: 32, stockDef: 12 } // 32in door, 12ft sticks
    : { len: 'm', small: 'cm', toSmall: 100, doorDef: 80, stockDef: 2.4 }; // 80cm door, 2.4m sticks

  const r = useMemo(() => {
    const l = num(L), w = num(W);
    if (l == null || w == null || l <= 0 || w <= 0) return null;
    const perim = 2 * (l + w);
    const nDoors = num(doors) ?? 0;
    const dw = (num(doorW) ?? D.doorDef) / D.toSmall; // door width in big unit
    const openings = nDoors * dw;
    const net = Math.max(0, perim - openings); // baseboard length (crown ignores doors → use perimeter)
    const wastePct = num(waste) ?? 0;
    const withWaste = net * (1 + wastePct / 100);
    const crownWithWaste = perim * (1 + wastePct / 100);
    const stk = num(stock) ?? D.stockDef;
    const pieces = stk > 0 ? Math.ceil(withWaste / stk) : null;
    const crownPieces = stk > 0 ? Math.ceil(crownWithWaste / stk) : null;
    return { perim, net, withWaste, crownWithWaste, pieces, crownPieces };
  }, [L, W, doors, doorW, stock, waste, unit]);

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
        <div class="ml-auto flex gap-2">
          {(['ft', 'm'] as const).map((u) => (
            <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'ft' ? 'Imperial' : 'Metric'}</button>
          ))}
        </div>
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        {inp(L, setL, `Room length (${D.len})`)}
        {inp(W, setW, `Room width (${D.len})`)}
        {inp(doors, setDoors, 'Door openings (count)')}
        {inp(doorW, setDoorW, `Door width (${D.small}, blank = ${D.doorDef})`)}
        {inp(stock, setStock, `Stock length (${D.len}, blank = ${D.stockDef})`)}
        {inp(waste, setWaste, 'Waste allowance (%)')}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Baseboard length (+waste)</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.withWaste)} <span class="text-lg text-slate-500">{D.len}</span></p><p class="mt-1 text-xs text-slate-400">{r.pieces != null ? `${r.pieces} × ${fmt(num(stock) ?? D.stockDef)} ${D.len} pieces` : ''}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Crown / ceiling trim (+waste)</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.crownWithWaste)} <span class="text-lg text-slate-500">{D.len}</span></p><p class="mt-1 text-xs text-slate-400">{r.crownPieces != null ? `${r.crownPieces} pieces · full perimeter` : ''}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200 sm:col-span-2"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Room perimeter</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.perim)} <span class="text-lg text-slate-500">{D.len}</span></p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the room dimensions.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Baseboard = perimeter − door openings; crown/picture rail uses the full perimeter (it runs over doors). Add 10% for mitre cuts and mistakes, and round up to whole sticks. 🔒 In your browser.</p>
    </div>
  );
}
