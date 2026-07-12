import { useMemo, useState } from 'preact/hooks';
import { telescope } from '../../lib/astronomy';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function TelescopeTool() {
  const [scopeFL, setScopeFL] = useState('1200');
  const [aperture, setAperture] = useState('150');
  const [eyepiece, setEyepiece] = useState('10');

  const r = useMemo(() => {
    const s = num(scopeFL), a = num(aperture), e = num(eyepiece);
    if (s == null || a == null) return null;
    return telescope(s, a, e ?? 0);
  }, [scopeFL, aperture, eyepiece]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Telescope focal length (mm)</span>
          <input type="number" step="any" value={scopeFL} onInput={(e) => setScopeFL((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Aperture (mm)</span>
          <input type="number" step="any" value={aperture} onInput={(e) => setAperture((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Eyepiece focal length (mm)</span>
          <input type="number" step="any" value={eyepiece} onInput={(e) => setEyepiece((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Magnification</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{r.magnification != null ? `${fmt(r.magnification, 0)}×` : '—'}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Focal ratio</p><p class="mt-1 text-3xl font-extrabold text-slate-700">f/{r.fRatio != null ? fmt(r.fRatio) : '—'}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Exit pupil</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{r.exitPupil != null ? `${fmt(r.exitPupil, 1)} mm` : '—'}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Max useful mag</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.maxUsefulMag, 0)}×</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Dawes' limit</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.dawesArcsec != null ? `${fmt(r.dawesArcsec, 2)}″` : '—'}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Rayleigh limit</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.rayleighArcsec != null ? `${fmt(r.rayleighArcsec, 2)}″` : '—'}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the telescope's focal length and aperture.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Magnification = scope FL ÷ eyepiece FL; focal ratio = FL ÷ aperture. Resolving power: Dawes' limit (116⁄aperture-mm, empirical double-star) and Rayleigh (138⁄aperture-mm, diffraction). "Max useful" ≈ 2× aperture in mm is a rule of thumb — seeing usually caps it lower. 🔒 In your browser.</p>
    </div>
  );
}
