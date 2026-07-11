import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

export default function BoardFootCalculator() {
  const [T, setT] = useState('1');
  const [W, setW] = useState('6');
  const [L, setL] = useState('8'); // length in feet
  const [qty, setQty] = useState('10');
  const [price, setPrice] = useState('');

  const r = useMemo(() => {
    const t = num(T), w = num(W), l = num(L), q = num(qty) ?? 1;
    if (t == null || w == null || l == null) return null;
    const bfEach = (t * w * l) / 12; // thickness(in) × width(in) × length(ft) / 12
    const total = bfEach * q;
    const p = num(price);
    const cost = p != null ? total * p : null;
    return { bfEach, total, cost };
  }, [T, W, L, qty, price]);

  const inp = (val: string, set: (v: string) => void, label: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input type="number" step="any" min="0" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {inp(T, setT, 'Thickness (in)')}
        {inp(W, setW, 'Width (in)')}
        {inp(L, setL, 'Length (ft)')}
        {inp(qty, setQty, 'Quantity')}
        {inp(price, setPrice, 'Price / board ft (optional)')}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total board feet</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.total)} <span class="text-lg text-slate-500">bf</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Per board</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.bfEach)} <span class="text-lg text-slate-500">bf</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total cost</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{r.cost != null ? fmt(r.cost) : '—'}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the board thickness, width and length.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Board feet = thickness(in) × width(in) × length(ft) ÷ 12. A board foot is 144 in³ of wood. 🔒 In your browser.</p>
    </div>
  );
}
