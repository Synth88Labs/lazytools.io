import { useMemo, useState } from 'preact/hooks';
import { lcResonance, lcImpedance } from '../../lib/electronics';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const L_UNITS: [string, number][] = [['nH', 1e-9], ['µH', 1e-6], ['mH', 1e-3], ['H', 1]];
const C_UNITS: [string, number][] = [['pF', 1e-12], ['nF', 1e-9], ['µF', 1e-6], ['mF', 1e-3]];

function fmtFreq(hz: number): string {
  if (hz >= 1e9) return `${Number((hz / 1e9).toPrecision(4))} GHz`;
  if (hz >= 1e6) return `${Number((hz / 1e6).toPrecision(4))} MHz`;
  if (hz >= 1e3) return `${Number((hz / 1e3).toPrecision(4))} kHz`;
  return `${Number(hz.toPrecision(4))} Hz`;
}
function fmtOhm(o: number): string {
  if (o >= 1e6) return `${Number((o / 1e6).toPrecision(4))} MΩ`;
  if (o >= 1e3) return `${Number((o / 1e3).toPrecision(4))} kΩ`;
  return `${Number(o.toPrecision(4))} Ω`;
}

export default function LcResonanceTool() {
  const [lv, setLv] = useState('100'); const [lu, setLu] = useState(1e-6);
  const [cv, setCv] = useState('100'); const [cu, setCu] = useState(1e-12);

  const r = useMemo(() => {
    const ll = num(lv), cc = num(cv);
    if (ll == null || cc == null) return null;
    const L = ll * lu, C = cc * cu;
    return { f: lcResonance(L, C), z0: lcImpedance(L, C) };
  }, [lv, lu, cv, cu]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Inductance (L)</span>
          <div class="flex gap-1"><input type="number" step="any" value={lv} onInput={(e) => setLv((e.target as HTMLInputElement).value)} class={inp} />
            <select value={lu} onChange={(e) => setLu(+(e.target as HTMLSelectElement).value)} class={sel}>{L_UNITS.map(([l, v]) => <option value={v}>{l}</option>)}</select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Capacitance (C)</span>
          <div class="flex gap-1"><input type="number" step="any" value={cv} onInput={(e) => setCv((e.target as HTMLInputElement).value)} class={inp} />
            <select value={cu} onChange={(e) => setCu(+(e.target as HTMLSelectElement).value)} class={sel}>{C_UNITS.map(([l, v]) => <option value={v}>{l}</option>)}</select></div></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Resonant frequency</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmtFreq(r.f)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Characteristic impedance √(L/C)</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmtOhm(r.z0)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the inductance and capacitance.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">An LC tank circuit resonates where the inductive and capacitive reactances cancel, at fₒ = 1 ÷ (2π·√(L·C)). The characteristic impedance √(L/C) is the reactance of each element at resonance. This is the tuning frequency of filters, oscillators and radio front-ends; a real circuit's sharpness (Q) also depends on its resistance. 🔒 In your browser.</p>
    </div>
  );
}
