import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

type Solve = 'water' | 'coffee';

export default function CoffeeRatioTool() {
  const [ratio, setRatio] = useState('16'); // 1:16
  const [solve, setSolve] = useState<Solve>('water');
  const [coffee, setCoffee] = useState('30');
  const [water, setWater] = useState('500');

  const r = useMemo(() => {
    const rt = num(ratio);
    if (rt == null) return null;
    if (solve === 'water') {
      const c = num(coffee);
      if (c == null) return null;
      return { coffee: c, water: c * rt };
    } else {
      const w = num(water);
      if (w == null) return null;
      return { coffee: w / rt, water: w };
    }
  }, [ratio, solve, coffee, water]);

  const cell = 'w-32 rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  const presets: [string, string][] = [['Strong', '15'], ['Balanced', '16'], ['Standard', '17'], ['Light', '18']];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Brew ratio (1 g coffee : N g water)</span>
        <div class="flex items-center gap-2">
          <span class="font-mono text-slate-500">1 :</span>
          <input type="number" step="any" min="1" value={ratio} onInput={(e) => setRatio((e.target as HTMLInputElement).value)} class={cell} />
        </div>
      </label>
      <div class="mt-2 flex flex-wrap gap-2">
        {presets.map(([lbl, v]) => (
          <button onClick={() => setRatio(v)} class={`rounded-full px-3 py-1 text-xs font-semibold transition ${ratio === v ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{lbl} 1:{v}</button>
        ))}
      </div>

      <div class="mt-4 flex gap-2">
        {([['water', 'I know the coffee'], ['coffee', 'I know the water']] as const).map(([s, lbl]) => (
          <button onClick={() => setSolve(s)} class={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${solve === s ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{lbl}</button>
        ))}
      </div>

      <div class="mt-3">
        {solve === 'water' ? (
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Coffee (g)</span>
            <input type="number" step="any" min="0" value={coffee} onInput={(e) => setCoffee((e.target as HTMLInputElement).value)} class={cell} /></label>
        ) : (
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Water (g ≈ mL)</span>
            <input type="number" step="any" min="0" value={water} onInput={(e) => setWater((e.target as HTMLInputElement).value)} class={cell} /></label>
        )}
      </div>

      {r && (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Coffee</p>
            <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.coffee)} <span class="text-lg text-slate-500">g</span></p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Water</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.water)} <span class="text-lg text-slate-500">g / mL</span></p>
          </div>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">The "golden ratio" is about 1:15 to 1:18 (coffee:water) by weight — lower is stronger. Water is measured by weight; 1 g ≈ 1 mL. Weighing beats scooping for consistency. 🔒 In your browser.</p>
    </div>
  );
}
