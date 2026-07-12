import { useMemo, useState } from 'preact/hooks';
import { PLANETS } from '../../lib/astronomy';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };

export default function PlanetAgeTool() {
  const [mode, setMode] = useState<'years' | 'date'>('years');
  const [age, setAge] = useState('30');
  const [birth, setBirth] = useState('');

  const earthYears = useMemo(() => {
    if (mode === 'years') return num(age);
    if (!birth) return null;
    const d = new Date(birth + 'T00:00:00');
    if (isNaN(d.getTime())) return null;
    return (Date.now() - d.getTime()) / (365.25 * 86400000);
  }, [mode, age, birth]);

  const rows = useMemo(() => {
    if (earthYears == null) return null;
    return PLANETS.filter((p) => !isNaN(p.orbitYears)).map((p) => ({
      name: p.name, id: p.id, years: earthYears / p.orbitYears,
      nextBday: (Math.ceil(earthYears / p.orbitYears) * p.orbitYears - earthYears),
    }));
  }, [earthYears]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {([['years', 'Enter age'], ['date', 'Enter birthday']] as const).map(([m, lbl]) => (
          <button onClick={() => setMode(m)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${mode === m ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{lbl}</button>
        ))}
      </div>
      {mode === 'years' ? (
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Your age (Earth years)</span>
          <input type="number" step="any" value={age} onInput={(e) => setAge((e.target as HTMLInputElement).value)} class={`${inp} sm:w-40 font-mono`} /></label>
      ) : (
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Your birthday</span>
          <input type="date" value={birth} onInput={(e) => setBirth((e.target as HTMLInputElement).value)} class={`${inp} sm:w-56`} /></label>
      )}

      {rows ? (
        <div class="mt-4 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
          <table class="w-full text-sm">
            <thead><tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><th class="px-4 py-2">Planet</th><th class="px-4 py-2 text-right">Your age there</th><th class="px-4 py-2 text-right">Next birthday in</th></tr></thead>
            <tbody>{rows.map((r, i) => (
              <tr class={`${i % 2 ? 'bg-slate-50' : ''} ${r.id === 'earth' ? 'bg-brand-50/60' : ''}`}>
                <td class="px-4 py-2 font-semibold text-slate-700">{r.name}</td>
                <td class="px-4 py-2 text-right font-mono font-bold text-brand-800">{r.years.toFixed(2)} yr</td>
                <td class="px-4 py-2 text-right font-mono text-slate-500">{(r.nextBday * 365.25).toFixed(0)} Earth-days</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your age or birthday.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">A "year" is one orbit of the Sun, and every planet takes a different time — so your age varies wildly. On fast-orbiting Mercury you're nearly 4× older; on Neptune you haven't finished one year unless you're over 164. Orbital periods from NASA. 🔒 In your browser.</p>
    </div>
  );
}
