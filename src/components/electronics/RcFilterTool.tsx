import { useMemo, useState } from 'preact/hooks';
import { rcTau, rcCutoff } from '../../lib/electronics';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const R_UNITS: [string, number][] = [['Ω', 1], ['kΩ', 1e3], ['MΩ', 1e6]];
const C_UNITS: [string, number][] = [['pF', 1e-12], ['nF', 1e-9], ['µF', 1e-6], ['mF', 1e-3]];

function fmtTime(s: number): string {
  if (s >= 1) return `${Number(s.toPrecision(4))} s`;
  if (s >= 1e-3) return `${Number((s * 1e3).toPrecision(4))} ms`;
  if (s >= 1e-6) return `${Number((s * 1e6).toPrecision(4))} µs`;
  return `${Number((s * 1e9).toPrecision(4))} ns`;
}
function fmtFreq(hz: number): string {
  if (hz >= 1e6) return `${Number((hz / 1e6).toPrecision(4))} MHz`;
  if (hz >= 1e3) return `${Number((hz / 1e3).toPrecision(4))} kHz`;
  return `${Number(hz.toPrecision(4))} Hz`;
}

export default function RcFilterTool() {
  const [rv, setRv] = useState('10'); const [ru, setRu] = useState(1e3);
  const [cv, setCv] = useState('100'); const [cu, setCu] = useState(1e-9);

  const r = useMemo(() => {
    const rr = num(rv), cc = num(cv);
    if (rr == null || cc == null) return null;
    const R = rr * ru, C = cc * cu;
    return { tau: rcTau(R, C), fc: rcCutoff(R, C) };
  }, [rv, ru, cv, cu]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Resistance</span>
          <div class="flex gap-1"><input type="number" step="any" value={rv} onInput={(e) => setRv((e.target as HTMLInputElement).value)} class={inp} />
            <select value={ru} onChange={(e) => setRu(+(e.target as HTMLSelectElement).value)} class={sel}>{R_UNITS.map(([l, v]) => <option value={v}>{l}</option>)}</select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Capacitance</span>
          <div class="flex gap-1"><input type="number" step="any" value={cv} onInput={(e) => setCv((e.target as HTMLInputElement).value)} class={inp} />
            <select value={cu} onChange={(e) => setCu(+(e.target as HTMLSelectElement).value)} class={sel}>{C_UNITS.map(([l, v]) => <option value={v}>{l}</option>)}</select></div></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cutoff frequency (−3 dB)</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmtFreq(r.fc)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Time constant τ</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmtTime(r.tau)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the resistance and capacitance.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Time constant τ = R × C (the capacitor reaches ~63% of its final voltage in one τ, and is essentially fully charged after 5τ). The −3 dB cutoff of an RC filter is fₒ = 1 ÷ (2π·R·C) — below it a low-pass passes signals, above it an RC high-pass does. 🔒 In your browser.</p>
    </div>
  );
}
