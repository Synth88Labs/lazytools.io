import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(5)).toString();

export default function LensMirrorTool() {
  const [f, setF] = useState('10');
  const [dObj, setDObj] = useState('15');

  const r = useMemo(() => {
    const focal = num(f), so = num(dObj);
    if (focal == null || so == null || focal === 0 || so === 0) return null;
    // 1/f = 1/so + 1/si  ->  1/si = 1/f − 1/so
    const invSi = 1 / focal - 1 / so;
    if (invSi === 0) return { si: Infinity, m: Infinity, real: false, upright: true, mag: Infinity, atInfinity: true };
    const si = 1 / invSi;
    const m = -si / so;
    const real = si > 0; // positive image distance = real (same side as outgoing light)
    const upright = m > 0;
    return { si, m, real, upright, mag: Math.abs(m), atInfinity: false };
  }, [f, dObj]);

  const inp = (val: string, set: (v: string) => void, label: string, hint: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input type="number" step="any" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
      <span class="mt-1 block text-xs text-slate-400">{hint}</span>
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        {inp(f, setF, 'Focal length f', 'positive for converging lens / concave mirror; negative for diverging / convex')}
        {inp(dObj, setDObj, 'Object distance dₒ', 'distance from lens/mirror to the object (positive)')}
      </div>

      {r ? (
        r.atInfinity ? (
          <div class="mt-4 rounded-xl bg-amber-50 p-4 text-center ring-2 ring-amber-200">
            <p class="font-bold text-amber-800">Object at the focal point — image forms at infinity (rays emerge parallel).</p>
          </div>
        ) : (
          <>
            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Image distance dᵢ</p>
                <p class="mt-1 text-2xl font-extrabold text-brand-800">{fmt(r.si)}</p>
              </div>
              <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Magnification m</p>
                <p class="mt-1 text-2xl font-extrabold text-brand-800">{fmt(r.m)}×</p>
              </div>
            </div>
            <div class="mt-3 flex flex-wrap justify-center gap-2">
              <span class={`rounded-full px-3 py-1 text-sm font-semibold ${r.real ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>{r.real ? 'Real image' : 'Virtual image'}</span>
              <span class={`rounded-full px-3 py-1 text-sm font-semibold ${r.upright ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{r.upright ? 'Upright' : 'Inverted'}</span>
              <span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{r.mag > 1 ? 'Magnified' : r.mag < 1 ? 'Reduced' : 'Same size'}</span>
            </div>
          </>
        )
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a non-zero focal length and object distance.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Thin-lens / mirror equation: 1/f = 1/dₒ + 1/dᵢ; magnification m = −dᵢ/dₒ. Positive dᵢ = real image; positive m = upright. 🔒 In your browser.
      </p>
    </div>
  );
}
