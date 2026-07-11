import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function DeckCalculator() {
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [L, setL] = useState('5');
  const [W, setW] = useState('4');
  const [boardW, setBoardW] = useState('14'); // cm (metric) or in (imperial)
  const [gap, setGap] = useState('4'); // mm (metric) or (imperial uses in tenths?) keep mm/in
  const [boardLen, setBoardLen] = useState('3.6'); // m or ft
  const [joistSpace, setJoistSpace] = useState('40'); // cm or in

  const D = unit === 'm'
    ? { len: 'm', small: 'cm', gapU: 'mm', toM: (cm: number) => cm / 100, gapToM: (mm: number) => mm / 1000, jToM: (cm: number) => cm / 100 }
    : { len: 'ft', small: 'in', gapU: 'in', toM: (i: number) => i / 12, gapToM: (i: number) => i / 12, jToM: (i: number) => i / 12 };

  const r = useMemo(() => {
    const l = num(L), w = num(W), bw = num(boardW), g = num(gap) ?? 0, bl = num(boardLen), js = num(joistSpace);
    if (l == null || w == null || bw == null || bl == null || bl <= 0) return null;
    const boardWidth = D.toM(bw), gapM = D.gapToM(g);
    const pitch = boardWidth + gapM;
    if (pitch <= 0) return null;
    const rows = Math.ceil(w / pitch); // rows run along the length
    const linear = rows * l; // total linear length of decking
    const boards = Math.ceil((linear * 1.1) / bl); // +10% waste
    const joists = js && D.jToM(js) > 0 ? Math.ceil(l / D.jToM(js)) + 1 : null;
    return { rows, linear, boards, joists };
  }, [L, W, boardW, gap, boardLen, joistSpace, unit]);

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
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {inp(L, setL, `Deck length (${D.len})`)}
        {inp(W, setW, `Deck width (${D.len})`)}
        {inp(boardLen, setBoardLen, `Board length (${D.len})`)}
        {inp(boardW, setBoardW, `Board width (${D.small})`)}
        {inp(gap, setGap, `Gap between boards (${D.gapU})`)}
        {inp(joistSpace, setJoistSpace, `Joist spacing (${D.small})`)}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Deck boards</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{r.boards}</p><p class="mt-1 text-xs text-slate-400">incl. ~10% waste</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total decking</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.linear)} <span class="text-lg text-slate-500">{D.len}</span></p><p class="mt-1 text-xs text-slate-400">{r.rows} rows</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Joists</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{r.joists ?? '—'}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the deck size and board dimensions.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Rows = width ÷ (board width + gap); boards = rows × length ÷ board length, + ~10% waste. Leave a 3–5 mm gap for drainage. 🔒 In your browser.</p>
    </div>
  );
}
