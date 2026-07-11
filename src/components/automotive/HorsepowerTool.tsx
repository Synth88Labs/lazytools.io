import { useMemo, useState } from 'preact/hooks';
import { hpFromTorque, torqueFromHp, KW_PER_HP } from '../../lib/automotive';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

type Solve = 'hp' | 'torque';

export default function HorsepowerTool() {
  const [solve, setSolve] = useState<Solve>('hp');
  const [torque, setTorque] = useState('300');
  const [hp, setHp] = useState('250');
  const [rpm, setRpm] = useState('5000');

  const r = useMemo(() => {
    const rp = num(rpm);
    if (rp == null) return null;
    if (solve === 'hp') {
      const t = num(torque);
      if (t == null) return null;
      const power = hpFromTorque(t, rp);
      return { hp: power, kw: power * KW_PER_HP };
    } else {
      const p = num(hp);
      if (p == null) return null;
      return { torque: torqueFromHp(p, rp), kw: p * KW_PER_HP };
    }
  }, [solve, torque, hp, rpm]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {([['hp', 'Torque → horsepower'], ['torque', 'Horsepower → torque']] as const).map(([s, lbl]) => (
          <button onClick={() => setSolve(s)} class={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${solve === s ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{lbl}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        {solve === 'hp' ? (
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Torque (lb-ft)</span>
            <input type="number" step="any" value={torque} onInput={(e) => setTorque((e.target as HTMLInputElement).value)} class={inp} /></label>
        ) : (
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Horsepower (hp)</span>
            <input type="number" step="any" value={hp} onInput={(e) => setHp((e.target as HTMLInputElement).value)} class={inp} /></label>
        )}
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Engine speed (RPM)</span>
          <input type="number" step="any" value={rpm} onInput={(e) => setRpm((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          {solve === 'hp' ? (
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Horsepower</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.hp!)} <span class="text-lg text-slate-500">hp</span></p><p class="mt-1 text-xs text-slate-400">{fmt(r.kw)} kW</p></div>
          ) : (
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Torque</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.torque!)} <span class="text-lg text-slate-500">lb-ft</span></p><p class="mt-1 text-xs text-slate-400">{fmt(r.torque! * 1.355818)} N·m</p></div>
          )}
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{solve === 'hp' ? 'Power in kW' : 'Metric torque'}</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{solve === 'hp' ? `${fmt(r.kw)} kW` : `${fmt(r.torque! * 1.355818)} N·m`}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the torque (or power) and engine speed.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Horsepower = torque (lb-ft) × RPM ÷ 5252 — the constant 5252 is where the torque and power curves always cross on a dyno. 1 hp = 0.7457 kW; 1 lb-ft = 1.356 N·m. 🔒 In your browser.</p>
    </div>
  );
}
