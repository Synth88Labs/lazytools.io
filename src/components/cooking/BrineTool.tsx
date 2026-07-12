import { useMemo, useState } from 'preact/hooks';
import { brine } from '../../lib/cooking';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(4));
const STRENGTH: [string, number][] = [['Light (3%)', 3], ['Standard (5%)', 5], ['Strong (8%)', 8]];

export default function BrineTool() {
  const [water, setWater] = useState('1000');
  const [salt, setSalt] = useState('5');
  const [sugar, setSugar] = useState('0');

  const res = useMemo(() => {
    const w = num(water), s = num(salt), su = num(sugar);
    if (w == null || s == null || su == null) return null;
    return brine(w, s, su);
  }, [water, salt, sugar]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Water (g or mL)</span><input type="number" step="any" value={water} onInput={(e) => setWater((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Salt strength (%)</span><input type="number" step="any" value={salt} onInput={(e) => setSalt((e.target as HTMLInputElement).value)} class={inp} />
          <div class="mt-1 flex flex-wrap gap-1">{STRENGTH.map(([l, v]) => <button onClick={() => setSalt(String(v))} class="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] text-slate-600 hover:border-brand-400">{l}</button>)}</div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sugar (%, optional)</span><input type="number" step="any" value={sugar} onInput={(e) => setSugar((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Salt to add</p><p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(res.saltG)} g</p><p class="text-xs text-slate-500">≈ {fmt(res.saltG / 28.35)} oz</p></div>
          {res.sugarG > 0 && <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Sugar to add</p><p class="mt-1 font-mono text-3xl font-extrabold text-slate-800">{fmt(res.sugarG)} g</p></div>}
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the water amount and salt percentage.</p>}

      <p class="mt-4 text-xs text-slate-500">A wet brine dissolves salt (and optionally sugar) in water by weight: salt = water weight × the salt percentage. A 5% brine is a common all-purpose strength for poultry and pork; lighter (3%) for a quick brine, stronger (8%+) for a short soak. Since 1 mL of water weighs 1 g, you can use millilitres for the water amount. For a dry brine, use about 1% salt of the meat\'s weight instead. 🔒 In your browser.</p>
    </div>
  );
}
