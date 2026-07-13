import { useMemo, useState } from 'preact/hooks';
import { SENSORS, getSensor, airyDiskUm, pixelPitchUm, diffractionApertureN } from '../../lib/photography';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

export default function DiffractionTool() {
  const [sensorId, setSensorId] = useState('ff');
  const [mp, setMp] = useState('24');
  const [fNumber, setFNumber] = useState('11');

  const r = useMemo(() => {
    const s = getSensor(sensorId);
    const megapixels = num(mp), N = num(fNumber);
    if (!s || megapixels == null || N == null) return null;
    // horizontal pixels from MP and sensor aspect ratio
    const aspect = s.width / s.height;
    const hPixels = Math.sqrt(megapixels * 1e6 * aspect);
    const pitch = pixelPitchUm(s.width, hPixels);
    if (pitch == null) return null;
    const airy = airyDiskUm(N)!;
    const dla = diffractionApertureN(pitch)!;
    return { pitch, airy, dla, limited: airy > pitch };
  }, [sensorId, mp, fNumber]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sensor</span>
          <select value={sensorId} onChange={(e) => setSensorId((e.target as HTMLSelectElement).value)} class={sel}>{SENSORS.map((s) => <option value={s.id}>{s.name}</option>)}</select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Resolution (megapixels)</span>
          <input type="number" step="any" value={mp} onInput={(e) => setMp((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Aperture (f-number)</span>
          <input type="number" step="any" value={fNumber} onInput={(e) => setFNumber((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Diffraction-limited aperture</p><p class="mt-1 text-3xl font-extrabold text-brand-800">f/{fmt(r.dla, 1)}</p><p class="mt-0.5 text-xs text-slate-400">softening begins beyond this</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Pixel pitch</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.pitch)} µm</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Airy disk at f/{fmt(num(fNumber) ?? 0, 1)}</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.airy)} µm</p></div>
          </div>
          <p class={`mt-3 rounded-lg p-3 text-sm ring-1 ${r.limited ? 'bg-amber-50 text-amber-800 ring-amber-200' : 'bg-emerald-50 text-emerald-800 ring-emerald-200'}`}>
            {r.limited ? `⚠️ At f/${fmt(num(fNumber) ?? 0, 1)} the Airy disk is larger than a pixel — you're in the diffraction-softened range. For maximum per-pixel sharpness, stay near f/${fmt(r.dla, 1)} or wider.` : `✓ At f/${fmt(num(fNumber) ?? 0, 1)} the Airy disk still fits within a pixel — diffraction isn't limiting sharpness yet.`}
          </p>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Choose a sensor, resolution and aperture.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Stopping down (higher f-number) increases depth of field but also grows the Airy disk — the blur circle from diffraction — as d = 2.44 · λ · N (λ ≈ 0.55 µm). When it exceeds the pixel pitch, fine detail softens. The diffraction-limited aperture is where the Airy disk first equals a pixel; it\'s a guide, not a hard cutoff, and stopping down a little past it is often worth it for the extra depth of field. 🔒 In your browser.</p>
    </div>
  );
}
