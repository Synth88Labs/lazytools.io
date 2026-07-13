import { useMemo, useState } from 'preact/hooks';
import { dbFromPowerRatio, dbFromAmplitudeRatio, powerRatioFromDb, amplitudeRatioFromDb } from '../../lib/electronics';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number, d = 3) => Number(x.toPrecision(d + 3)).toString();

type Kind = 'power' | 'amplitude';
type Dir = 'toDb' | 'fromDb';

export default function DecibelTool() {
  const [kind, setKind] = useState<Kind>('power');
  const [dir, setDir] = useState<Dir>('toDb');
  const [ratio, setRatio] = useState('2');
  const [db, setDb] = useState('3');

  const r = useMemo(() => {
    if (dir === 'toDb') {
      const v = num(ratio);
      if (v == null || v <= 0) return null;
      const out = kind === 'power' ? dbFromPowerRatio(v) : dbFromAmplitudeRatio(v);
      return out == null ? null : { label: 'Decibels', value: `${fmt(out, 2)} dB` };
    }
    const d = num(db);
    if (d == null) return null;
    const out = kind === 'power' ? powerRatioFromDb(d) : amplitudeRatioFromDb(d);
    return { label: `${kind === 'power' ? 'Power' : 'Amplitude'} ratio`, value: `${fmt(out, 4)}×` };
  }, [kind, dir, ratio, db]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const tog = (on: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${on ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        <button onClick={() => setKind('power')} class={tog(kind === 'power')}>Power (10·log)</button>
        <button onClick={() => setKind('amplitude')} class={tog(kind === 'amplitude')}>Amplitude / voltage (20·log)</button>
        <span class="mx-1 self-center text-slate-300">|</span>
        <button onClick={() => setDir('toDb')} class={tog(dir === 'toDb')}>Ratio → dB</button>
        <button onClick={() => setDir('fromDb')} class={tog(dir === 'fromDb')}>dB → ratio</button>
      </div>

      <label class="block sm:w-64"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{dir === 'toDb' ? `${kind === 'power' ? 'Power' : 'Amplitude'} ratio (out ÷ in)` : 'Decibels (dB)'}</span>
        {dir === 'toDb'
          ? <input type="number" step="any" value={ratio} onInput={(e) => setRatio((e.target as HTMLInputElement).value)} class={inp} />
          : <input type="number" step="any" value={db} onInput={(e) => setDb((e.target as HTMLInputElement).value)} class={inp} />}
      </label>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-5 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{r.label}</p>
          <p class="mt-1 text-4xl font-extrabold text-brand-800">{r.value}</p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a {dir === 'toDb' ? 'positive ratio' : 'decibel value'}.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Decibels express a ratio on a log scale. For <strong>power</strong>, dB = 10·log₁₀(P₂/P₁), so ×2 power ≈ +3 dB and ×10 = +10 dB. For <strong>amplitude</strong> (voltage, current, sound pressure), dB = 20·log₁₀(A₂/A₁), so ×2 voltage ≈ +6 dB and ×10 = +20 dB. 0 dB means the two are equal. 🔒 In your browser.</p>
    </div>
  );
}
