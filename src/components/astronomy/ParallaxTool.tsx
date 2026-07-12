import { useMemo, useState } from 'preact/hooks';
import { parallaxDistancePc, PARSEC_LY, PARSEC_KM } from '../../lib/astronomy';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 4) => Number(x.toPrecision(d)).toLocaleString();

type Mode = 'p2d' | 'd2p';

export default function ParallaxTool() {
  const [mode, setMode] = useState<Mode>('p2d');
  const [parallax, setParallax] = useState('0.1');
  const [distPc, setDistPc] = useState('10');

  const r = useMemo(() => {
    if (mode === 'p2d') {
      const p = num(parallax);
      if (p == null) return null;
      const pc = parallaxDistancePc(p);
      if (pc == null) return null;
      return { pc, ly: pc * PARSEC_LY, km: pc * PARSEC_KM };
    } else {
      const pc = num(distPc);
      if (pc == null) return null;
      return { pc, ly: pc * PARSEC_LY, km: pc * PARSEC_KM, parallax: 1 / pc };
    }
  }, [mode, parallax, distPc]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {([['p2d', 'Parallax → distance'], ['d2p', 'Distance → parallax']] as const).map(([m, lbl]) => (
          <button onClick={() => setMode(m)} class={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${mode === m ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{lbl}</button>
        ))}
      </div>
      {mode === 'p2d' ? (
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Parallax angle (arcseconds)</span>
          <input type="number" step="any" value={parallax} onInput={(e) => setParallax((e.target as HTMLInputElement).value)} class={`${inp} sm:w-48`} /></label>
      ) : (
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Distance (parsecs)</span>
          <input type="number" step="any" value={distPc} onInput={(e) => setDistPc((e.target as HTMLInputElement).value)} class={`${inp} sm:w-48`} /></label>
      )}

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          {mode === 'd2p' && r.parallax != null ? (
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Parallax</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.parallax)}″</p></div>
          ) : (
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Distance</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.pc)} <span class="text-lg text-slate-500">pc</span></p></div>
          )}
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Light-years</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.ly)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Parsecs</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.pc)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the parallax angle or the distance.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">As Earth orbits the Sun, nearby stars appear to shift against distant ones. Half that shift is the parallax angle, and distance (parsecs) = 1 ÷ parallax (arcseconds) — that\'s the very definition of a parsec. 1 parsec ≈ 3.26 light-years. Proxima Centauri\'s parallax of 0.77″ puts it 1.30 pc (4.24 ly) away. 🔒 In your browser.</p>
    </div>
  );
}
