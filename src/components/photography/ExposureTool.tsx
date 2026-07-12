import { useMemo, useState } from 'preact/hooks';
import { evAtIso } from '../../lib/photography';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

// parse a shutter like "1/125", "0.5", "2"
function parseShutter(s: string): number | null {
  const t = s.trim();
  const frac = t.match(/^1\/(\d+(?:\.\d+)?)$/);
  if (frac) return 1 / parseFloat(frac[1]);
  const n = parseFloat(t);
  return isFinite(n) && n > 0 ? n : null;
}
function fmtShutter(sec: number): string {
  if (sec >= 1) return `${fmt(sec, 1)} s`;
  return `1/${Math.round(1 / sec)} s`;
}

export default function ExposureTool() {
  const [fnum, setFnum] = useState('2.8');
  const [shutter, setShutter] = useState('1/125');
  const [iso, setIso] = useState('100');

  const r = useMemo(() => {
    const n = num(fnum), t = parseShutter(shutter), i = num(iso);
    if (n == null || t == null || i == null) return null;
    const ev = evAtIso(n, t, i);
    // equivalent exposures: keep same EV, vary aperture
    const apertures = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
    const equivalents = apertures.map((a) => ({ f: a, shutter: (a * a) / Math.pow(2, ev + Math.log2(i / 100)) }));
    return { ev, equivalents };
  }, [fnum, shutter, iso]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Aperture (f/)</span>
          <input type="number" step="any" value={fnum} onInput={(e) => setFnum((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Shutter (e.g. 1/125 or 2)</span>
          <input value={shutter} onInput={(e) => setShutter((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">ISO</span>
          <input type="number" step="any" value={iso} onInput={(e) => setIso((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Exposure value (EV, at ISO 100)</p>
            <p class="mt-1 text-4xl font-extrabold text-brand-800">EV {fmt(r.ev, 1)}</p>
          </div>
          <div class="mt-4 overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200">
            <table class="w-full text-sm">
              <thead><tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><th class="px-4 py-2">Aperture</th><th class="px-4 py-2 text-right">Equivalent shutter (same exposure)</th></tr></thead>
              <tbody>{r.equivalents.map((e, i) => (
                <tr class={i % 2 ? 'bg-slate-50' : ''}><td class="px-4 py-1.5 font-mono">f/{e.f}</td><td class="px-4 py-1.5 text-right font-mono font-semibold text-slate-700">{fmtShutter(e.shutter)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the aperture, shutter and ISO.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Exposure value EV = log₂(N²⁄t) at ISO 100 (N = f-number, t = shutter seconds); higher ISO lowers the scene EV needed. Each "stop" doubles or halves the light. The table lists equivalent aperture/shutter pairs that give the same exposure — trade depth of field against motion blur. 🔒 In your browser.</p>
    </div>
  );
}
