import { useMemo, useState } from 'preact/hooks';
import { reverbRT60 } from '../../lib/music';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

// Representative average absorption coefficients (broadband, mid frequencies).
const ROOMS = [
  { label: 'Bare / hard room (tile, glass)', a: 0.1 },
  { label: 'Living room (some furnishing)', a: 0.2 },
  { label: 'Well-furnished room', a: 0.3 },
  { label: 'Treated studio / cinema', a: 0.45 },
  { label: 'Heavily damped (vocal booth)', a: 0.6 },
];

function verdict(rt: number): string {
  if (rt < 0.3) return 'Very dead — good for close-mic recording, may feel unnatural to talk in.';
  if (rt < 0.6) return 'Fairly controlled — suits studios, home theatres and critical listening.';
  if (rt < 1.0) return 'Lively but usable — typical living room / small hall.';
  if (rt < 2.0) return 'Reverberant — like a large hall; speech clarity starts to suffer.';
  return 'Very reverberant — cathedral-like; hard for speech, dramatic for music.';
}

export default function ReverbTool() {
  const [l, setL] = useState('6');
  const [w, setW] = useState('4');
  const [h, setH] = useState('3');
  const [absorption, setAbsorption] = useState(0.2);

  const r = useMemo(() => {
    const L = num(l), W = num(w), H = num(h);
    if (L == null || W == null || H == null) return null;
    return reverbRT60(L, W, H, absorption);
  }, [l, w, h, absorption]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Length (m)</span>
          <input type="number" step="any" value={l} onInput={(e) => setL((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Width (m)</span>
          <input type="number" step="any" value={w} onInput={(e) => setW((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Height (m)</span>
          <input type="number" step="any" value={h} onInput={(e) => setH((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Room type</span>
          <select value={absorption} onChange={(e) => setAbsorption(parseFloat((e.target as HTMLSelectElement).value))} class={sel}>{ROOMS.map((rm) => <option value={rm.a}>{rm.label}</option>)}</select></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Reverb time (RT60)</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.rt60)} <span class="text-lg text-slate-500">s</span></p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Room volume</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.volumeM3, 1)} m³</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total absorption</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.sabins, 1)} sabins</p></div>
          </div>
          <p class="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600 ring-1 ring-slate-200">{verdict(r.rt60)}</p>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the room dimensions.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">RT60 is the time for sound to fade by 60 dB (to near silence). The Sabine equation estimates it as RT60 = 0.161 × room volume ÷ total absorption, where absorption = surface area × the average absorption coefficient. Soft, porous materials absorb more (higher coefficient) and shorten the reverb; hard surfaces reflect and lengthen it. This uses one average coefficient — real rooms vary by frequency and material. 🔒 In your browser.</p>
    </div>
  );
}
