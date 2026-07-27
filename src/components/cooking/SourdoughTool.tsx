import { useMemo, useState } from 'preact/hooks';
import { sourdoughFeed } from '../../lib/cooking';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => Math.round(x).toLocaleString('en-US');

export default function SourdoughTool() {
  const [starter, setStarter] = useState('30');
  const [flourR, setFlourR] = useState('2');
  const [waterR, setWaterR] = useState('2');

  const res = useMemo(() => {
    const s = num(starter), f = num(flourR), w = num(waterR);
    if (s == null || f == null || w == null) return null;
    return sourdoughFeed(s, f, w);
  }, [starter, flourR, waterR]);

  const field = (label: string, v: string, set: (s: string) => void) => (
    <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input type="number" step="any" value={v} onInput={(e) => set((e.target as HTMLInputElement).value)} class={inp} /></label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        {field('Starter you\'re keeping (g)', starter, setStarter)}
        {field('Flour ratio (× starter)', flourR, setFlourR)}
        {field('Water ratio (× starter)', waterR, setWaterR)}
      </div>
      <p class="mt-2 text-xs text-slate-500">Ratio is starter : flour : water = 1 : {num(flourR) ?? '?'} : {num(waterR) ?? '?'}. Equal flour and water = 100% hydration.</p>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="font-mono text-2xl font-extrabold text-brand-800">{fmt(res.flour)} g</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Flour to add</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="font-mono text-2xl font-extrabold text-brand-800">{fmt(res.water)} g</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Water to add</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="font-mono text-2xl font-extrabold text-slate-800">{fmt(res.total)} g</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Total starter after feed</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="font-mono text-2xl font-extrabold text-slate-800">{fmt(res.hydration)}%</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Hydration</p></div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter how much starter you\'re keeping and your feed ratio.</p>}

      <p class="mt-4 text-xs text-slate-500">
        A feed ratio of 1:2:2 means for every 1 g of starter you keep, add 2 g flour and 2 g water — a common maintenance feed. Higher ratios (1:5:5, 1:10:10) dilute the starter more, so it takes longer to peak but can go longer between feeds; lower ratios peak faster. Discard the rest before feeding, or use it in discard recipes. 🔒 In your browser.
      </p>
    </div>
  );
}
