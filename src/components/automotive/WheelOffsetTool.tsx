import { useMemo, useState } from 'preact/hooks';
import { wheelGeometry, offsetFromBackspacing } from '../../lib/automotive';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

type Solve = 'backspacing' | 'offset';

export default function WheelOffsetTool() {
  const [solve, setSolve] = useState<Solve>('backspacing');
  const [width, setWidth] = useState('8');
  const [offset, setOffset] = useState('45');
  const [backspacing, setBackspacing] = useState('6');

  const r = useMemo(() => {
    const w = num(width);
    if (w == null || w <= 0) return null;
    if (solve === 'backspacing') {
      const o = num(offset);
      if (o == null) return null;
      return { kind: 'bs' as const, ...wheelGeometry(w, o) };
    } else {
      const bs = num(backspacing);
      if (bs == null) return null;
      return { kind: 'off' as const, offsetMm: offsetFromBackspacing(w, bs) };
    }
  }, [solve, width, offset, backspacing]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {([['backspacing', 'Offset → backspacing'], ['offset', 'Backspacing → offset']] as const).map(([s, lbl]) => (
          <button onClick={() => setSolve(s)} class={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${solve === s ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{lbl}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Wheel width (inches)</span>
          <input type="number" step="any" value={width} onInput={(e) => setWidth((e.target as HTMLInputElement).value)} class={inp} /></label>
        {solve === 'backspacing' ? (
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Offset (mm, ET — can be negative)</span>
            <input type="number" step="any" value={offset} onInput={(e) => setOffset((e.target as HTMLInputElement).value)} class={inp} /></label>
        ) : (
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Backspacing (inches)</span>
            <input type="number" step="any" value={backspacing} onInput={(e) => setBackspacing((e.target as HTMLInputElement).value)} class={inp} /></label>
        )}
      </div>

      {r ? (
        r.kind === 'bs' ? (
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Backspacing</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.backspacingIn, 2)}″</p><p class="mt-1 text-xs text-slate-400">{fmt(r.backspacingMm)} mm</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Front spacing</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.frontSpaceMm)} mm</p></div>
          </div>
        ) : (
          <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Offset (ET)</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{r.offsetMm >= 0 ? '+' : ''}{fmt(r.offsetMm)} mm</p></div>
        )
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the wheel width and offset (or backspacing).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Backspacing = wheel width ÷ 2 + offset. Offset (ET) is the distance from the mounting face to the wheel’s centreline: positive pulls the wheel inward, negative pushes it out. A more positive offset (or greater backspacing) tucks the wheel further under the arch. 🔒 In your browser.</p>
    </div>
  );
}
