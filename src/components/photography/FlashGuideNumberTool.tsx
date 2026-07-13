import { useMemo, useState } from 'preact/hooks';
import { flashAperture, flashDistance, flashGnAtIso } from '../../lib/photography';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

type Solve = 'aperture' | 'distance';

export default function FlashGuideNumberTool() {
  const [gn, setGn] = useState('56');
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [iso, setIso] = useState('100');
  const [solve, setSolve] = useState<Solve>('aperture');
  const [distance, setDistance] = useState('5');
  const [fStop, setFStop] = useState('8');

  const r = useMemo(() => {
    const g0 = num(gn), i = num(iso);
    if (g0 == null || i == null) return null;
    const gn2 = flashGnAtIso(g0, i); // effective GN at chosen ISO
    if (solve === 'aperture') {
      const d = num(distance);
      if (d == null) return null;
      return { gnEff: gn2, out: flashAperture(gn2, d), label: `Aperture at ${d} ${unit}`, prefix: 'f/' };
    }
    const f = num(fStop);
    if (f == null) return null;
    return { gnEff: gn2, out: flashDistance(gn2, f), label: `Flash reach at f/${f}`, prefix: '', suffix: ` ${unit}` };
  }, [gn, unit, iso, solve, distance, fStop]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm';
  const tog = (on: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${on ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Guide number (at ISO 100)</span>
          <div class="flex gap-1"><input type="number" step="any" value={gn} onInput={(e) => setGn((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'm' | 'ft')} class={sel}><option value="m">m</option><option value="ft">ft</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">ISO</span>
          <input type="number" step="any" value={iso} onInput={(e) => setIso((e.target as HTMLInputElement).value)} class={inp} /></label>
        <div><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Solve for</span>
          <div class="flex gap-2">
            <button onClick={() => setSolve('aperture')} class={tog(solve === 'aperture')}>Aperture</button>
            <button onClick={() => setSolve('distance')} class={tog(solve === 'distance')}>Distance</button>
          </div></div>
      </div>

      <div class="mt-3">
        {solve === 'aperture' ? (
          <label class="block sm:w-56"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Subject distance ({unit})</span>
            <input type="number" step="any" value={distance} onInput={(e) => setDistance((e.target as HTMLInputElement).value)} class={inp} /></label>
        ) : (
          <label class="block sm:w-56"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Aperture (f-number)</span>
            <input type="number" step="any" value={fStop} onInput={(e) => setFStop((e.target as HTMLInputElement).value)} class={inp} /></label>
        )}
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-5 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{r.label}</p>
          <p class="mt-1 text-4xl font-extrabold text-brand-800">{r.prefix}{fmt(r.out)}{r.suffix ?? ''}</p>
          {num(iso) !== 100 && <p class="mt-2 text-xs text-slate-400">Effective guide number at ISO {iso}: {fmt(r.gnEff)}</p>}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the guide number and the remaining value.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Guide number ties flash power to aperture and distance: GN = f-number × distance. So aperture = GN ÷ distance and reach = GN ÷ f-number, using the flash\'s rated GN (quoted at ISO 100 in metres or feet). Raising ISO increases effective GN by √(ISO ÷ 100) — ISO 400 doubles it. This is for direct, manual flash; bounced or diffused light needs more power. 🔒 In your browser.</p>
    </div>
  );
}
