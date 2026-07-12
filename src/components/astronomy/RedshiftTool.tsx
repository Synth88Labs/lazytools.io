import { useMemo, useState } from 'preact/hooks';
import { velocityFromRedshift, redshiftFromVelocity, observedWavelength, hubbleDistanceMpc, C_KMS } from '../../lib/astronomy-extra';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const pos = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (n: number, d = 2) => n.toLocaleString('en-US', { maximumFractionDigits: d });

export default function RedshiftTool() {
  const [from, setFrom] = useState<'z' | 'v'>('z');
  const [z, setZ] = useState('0.1');
  const [v, setV] = useState('30000');
  const [rel, setRel] = useState(true);
  const [rest, setRest] = useState('656.3'); // Hα, nm
  const [h0, setH0] = useState('70');

  const r = useMemo(() => {
    const H0 = pos(h0);
    let zVal: number | null, vVal: number | null;
    if (from === 'z') {
      zVal = num(z);
      if (zVal == null) return null;
      vVal = velocityFromRedshift(zVal, rel);
    } else {
      vVal = num(v);
      if (vVal == null) return null;
      zVal = redshiftFromVelocity(vVal, rel);
    }
    if (zVal == null || vVal == null) return null;
    const rw = num(rest);
    return {
      z: zVal, v: vVal,
      frac: vVal / C_KMS,
      obs: rw != null ? observedWavelength(rw, zVal) : null,
      dist: H0 != null ? hubbleDistanceMpc(vVal, H0) : null,
    };
  }, [from, z, v, rel, rest, h0]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 inline-flex rounded-xl bg-slate-200 p-1 text-sm font-semibold">
        <button onClick={() => setFrom('z')} class={`rounded-lg px-3 py-1 ${from === 'z' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>From redshift z</button>
        <button onClick={() => setFrom('v')} class={`rounded-lg px-3 py-1 ${from === 'v' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>From velocity</button>
      </div>

      <div class="grid gap-3 sm:grid-cols-3">
        {from === 'z' ? (
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Redshift z</span><input type="number" step="any" value={z} onInput={(e) => setZ((e.target as HTMLInputElement).value)} class={inp} /></label>
        ) : (
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Recession velocity (km/s)</span><input type="number" step="any" value={v} onInput={(e) => setV((e.target as HTMLInputElement).value)} class={inp} /></label>
        )}
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Rest wavelength (nm)</span><input type="number" step="any" value={rest} onInput={(e) => setRest((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Hubble constant H₀ (km/s/Mpc)</span><input type="number" step="any" value={h0} onInput={(e) => setH0((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>
      <label class="mt-2 flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={rel} onChange={(e) => setRel((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600" /> Relativistic (use for z ≳ 0.1)</label>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Redshift z</p><p class="mt-1 text-2xl font-extrabold text-brand-800">{fmt(r.z, 4)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Recession velocity</p><p class="mt-1 text-xl font-extrabold text-slate-700">{fmt(r.v, 0)} km/s</p><p class="mt-0.5 text-xs text-slate-500">{fmt(r.frac, 3)}c</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Observed wavelength</p><p class="mt-1 text-xl font-extrabold text-slate-700">{r.obs != null ? `${fmt(r.obs, 1)} nm` : '—'}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Hubble distance</p><p class="mt-1 text-xl font-extrabold text-slate-700">{r.dist != null ? `${fmt(r.dist, 0)} Mpc` : '—'}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a redshift or a recession velocity.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Cosmological redshift z stretches light to longer (redder) wavelengths as the universe expands: λ_observed = λ_rest × (1 + z). At small z the recession velocity is v ≈ cz; near light speed the relativistic relation 1 + z = √((1+β)/(1−β)) applies — tick the box for z ≳ 0.1. The Hubble distance v ÷ H₀ is a rough estimate (H₀ ≈ 70 km/s/Mpc); precise cosmological distances need a full model. 🔒 In your browser.</p>
    </div>
  );
}
