import { useMemo, useState } from 'preact/hooks';
import { REFRACTIVE_INDEX } from '../../lib/physics-constants';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(5)).toString();

export default function SnellsLawTool() {
  const [n1, setN1] = useState('1.00');
  const [th1, setTh1] = useState('30');
  const [n2, setN2] = useState('1.50');

  const r = useMemo(() => {
    const a = num(n1), t1 = num(th1), b = num(n2);
    if (a == null || t1 == null || b == null || a <= 0 || b <= 0 || t1 < 0 || t1 > 90) return null;
    const sinT2 = (a * Math.sin((t1 * Math.PI) / 180)) / b;
    const tir = sinT2 > 1;
    const t2 = tir ? null : (Math.asin(sinT2) * 180) / Math.PI;
    // critical angle exists when going to a less dense medium (a > b)
    const crit = a > b ? (Math.asin(b / a) * 180) / Math.PI : null;
    return { t2, tir, crit, bending: b > a ? 'toward the normal (into denser medium)' : b < a ? 'away from the normal (into rarer medium)' : 'no bending (equal indices)' };
  }, [n1, th1, n2]);

  const inp = (val: string, set: (v: string) => void, label: string, preset?: boolean) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {preset ? (
        <input list="ri" type="number" step="any" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
      ) : (
        <input type="number" step="any" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
      )}
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <datalist id="ri">{REFRACTIVE_INDEX.map((x) => <option value={x.value}>{x.label}</option>)}</datalist>
      <div class="grid gap-3 sm:grid-cols-3">
        {inp(n1, setN1, 'Index n₁ (incident medium)', true)}
        {inp(th1, setTh1, 'Angle of incidence θ₁ (°)')}
        {inp(n2, setN2, 'Index n₂ (refractive medium)', true)}
      </div>

      {r ? (
        <>
          {r.tir ? (
            <div class="mt-4 rounded-xl bg-amber-50 p-4 text-center ring-2 ring-amber-200">
              <p class="text-lg font-extrabold text-amber-800">Total internal reflection</p>
              <p class="mt-1 text-sm text-amber-700">The angle exceeds the critical angle{r.crit != null ? ` (${fmt(r.crit)}°)` : ''}, so no light refracts — it all reflects back.</p>
            </div>
          ) : (
            <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Angle of refraction θ₂</p>
              <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.t2!)}°</p>
              <p class="mt-1 text-xs text-slate-500">Ray bends {r.bending}.</p>
            </div>
          )}
          {r.crit != null && (
            <div class="mt-3 rounded-lg bg-white p-3 text-center ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Critical angle (n₁ → n₂)</p>
              <p class="mt-0.5 font-mono text-lg font-bold text-slate-700">{fmt(r.crit)}°</p>
            </div>
          )}
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter positive refractive indices and an incidence angle from 0 to 90°.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Snell’s law: n₁·sin θ₁ = n₂·sin θ₂. Critical angle θc = arcsin(n₂/n₁) when n₁ &gt; n₂. 🔒 Computed in your browser.
      </p>
    </div>
  );
}
