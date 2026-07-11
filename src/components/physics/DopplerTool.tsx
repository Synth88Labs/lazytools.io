import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(6)).toString();

export default function DopplerTool() {
  const [f0, setF0] = useState('440');
  const [vWave, setVWave] = useState('343');
  const [vSource, setVSource] = useState('30');
  const [srcDir, setSrcDir] = useState<'toward' | 'away'>('toward');
  const [vObs, setVObs] = useState('0');
  const [obsDir, setObsDir] = useState<'toward' | 'away'>('toward');

  const r = useMemo(() => {
    const f = num(f0), v = num(vWave), vs = num(vSource), vo = num(vObs);
    if (f == null || v == null || vs == null || vo == null || v <= 0) return null;
    // f' = f (v + vo·[+1 toward]) / (v − vs·[+1 toward])
    const obsTerm = v + (obsDir === 'toward' ? vo : -vo);
    const srcTerm = v - (srcDir === 'toward' ? vs : -vs);
    if (srcTerm <= 0) return null; // source at/above wave speed
    return { fObs: (f * obsTerm) / srcTerm, higher: (f * obsTerm) / srcTerm > f };
  }, [f0, vWave, vSource, srcDir, vObs, obsDir]);

  const inp = (val: string, set: (v: string) => void, label: string, unit: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label} <span class="text-slate-400">({unit})</span></span>
      <input type="number" step="any" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );
  const dirToggle = (val: 'toward' | 'away', set: (v: 'toward' | 'away') => void) => (
    <div class="flex gap-1">
      {(['toward', 'away'] as const).map((d) => (
        <button onClick={() => set(d)} class={`flex-1 rounded-lg px-2 py-2 text-xs font-semibold transition ${val === d ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{d === 'toward' ? 'approaching' : 'receding'}</button>
      ))}
    </div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        {inp(f0, setF0, 'Source frequency f', 'Hz')}
        {inp(vWave, setVWave, 'Wave speed (sound ≈ 343)', 'm/s')}
      </div>
      <div class="mt-3 grid gap-3 sm:grid-cols-2">
        <div>{inp(vSource, setVSource, 'Source speed', 'm/s')}<div class="mt-1">{dirToggle(srcDir, setSrcDir)}</div></div>
        <div>{inp(vObs, setVObs, 'Observer speed', 'm/s')}<div class="mt-1">{dirToggle(obsDir, setObsDir)}</div></div>
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Observed frequency f′</p>
          <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.fObs)} <span class="text-lg text-slate-500">Hz</span></p>
          <p class={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${r.higher ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
            {r.higher ? 'Higher pitch (blue-shifted)' : 'Lower pitch (red-shifted)'}
          </p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a frequency and speeds. If the source reaches the wave speed, no ordinary Doppler shift applies (a shock wave forms).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        f′ = f·(v ± v_observer)/(v ∓ v_source) — signs handled by the approaching/receding toggles. 🔒 Computed in your browser.
      </p>
    </div>
  );
}
