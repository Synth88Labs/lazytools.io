import { useMemo, useState } from 'preact/hooks';
import { strideFromHeight, stepsDistance } from '../../lib/fitness';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

export default function StepsDistanceTool() {
  const [steps, setSteps] = useState('10000');
  const [mode, setMode] = useState<'height' | 'stride'>('height');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>('cm');
  const [height, setHeight] = useState('175');
  const [stride, setStride] = useState('0.75'); // metres

  const r = useMemo(() => {
    const n = num(steps);
    if (n == null) return null;
    let strideM: number | null;
    if (mode === 'height') {
      const h = num(height);
      if (h == null) return null;
      const cm = heightUnit === 'cm' ? h : h * 2.54;
      strideM = strideFromHeight(cm);
    } else {
      strideM = num(stride);
    }
    if (strideM == null || strideM <= 0) return null;
    const d = stepsDistance(n, strideM);
    return { ...d, strideM };
  }, [steps, mode, height, heightUnit, stride]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Number of steps</span>
        <input type="number" step="1" value={steps} onInput={(e) => setSteps((e.target as HTMLInputElement).value)} class={`${inp} sm:w-48`} /></label>

      <div class="mt-3 flex gap-2">
        {([['height', 'Estimate from height'], ['stride', 'I know my stride']] as const).map(([m, lbl]) => (
          <button onClick={() => setMode(m)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${mode === m ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{lbl}</button>
        ))}
      </div>

      <div class="mt-3">
        {mode === 'height' ? (
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Height</span>
            <div class="flex gap-1 sm:w-64">
              <input type="number" step="any" value={height} onInput={(e) => setHeight((e.target as HTMLInputElement).value)} class={inp} />
              <select value={heightUnit} onChange={(e) => setHeightUnit((e.target as HTMLSelectElement).value as any)} class="rounded-xl border border-slate-300 bg-white px-2 text-sm"><option value="cm">cm</option><option value="in">in</option></select>
            </div>
          </label>
        ) : (
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Stride length (metres)</span>
            <input type="number" step="any" value={stride} onInput={(e) => setStride((e.target as HTMLInputElement).value)} class={`${inp} sm:w-48`} /></label>
        )}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Distance</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.km)} <span class="text-lg text-slate-500">km</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">In miles</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.miles)} mi</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Stride used</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.strideM)} m</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your steps and either your height or stride length.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Distance = steps × stride length. Stride is estimated as about 0.414 × your height (a walking average) — your real stride varies with pace and terrain, so enter it directly if you know it. 🔒 In your browser.</p>
    </div>
  );
}
