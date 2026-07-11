import { useMemo, useState } from 'preact/hooks';
import { dli, ppfdForDli, DLI_TARGETS } from '../../lib/garden';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function GrowLightTool() {
  const [ppfd, setPpfd] = useState('300');
  const [hours, setHours] = useState('14');

  const r = useMemo(() => {
    const p = num(ppfd), h = num(hours);
    if (p == null || h == null) return null;
    const value = dli(p, h);
    const match = DLI_TARGETS.find((t) => value >= t.lo && value <= t.hi);
    return { value, match };
  }, [ppfd, hours]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Light intensity (PPFD, µmol/m²/s)</span>
          <input type="number" step="any" value={ppfd} onInput={(e) => setPpfd((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Photoperiod (hours of light per day)</span>
          <input type="number" step="any" value={hours} onInput={(e) => setHours((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Daily Light Integral (DLI)</p>
          <p class="mt-1 text-4xl font-extrabold text-brand-800">{fmt(r.value)} <span class="text-lg text-slate-500">mol/m²/day</span></p>
          {r.match && <p class="mt-1 text-sm text-slate-500">suits: {r.match.label}</p>}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your light's PPFD and daily hours.</p>
      )}

      <div class="mt-4 rounded-xl bg-white p-3 ring-1 ring-slate-200">
        <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Typical target DLI</p>
        <table class="w-full text-sm"><tbody>
          {DLI_TARGETS.map((t, i) => (
            <tr class={i % 2 ? 'bg-slate-50' : ''}><td class="px-2 py-1.5 text-slate-600">{t.label}</td><td class="px-2 py-1.5 text-right font-mono font-semibold text-slate-800">{t.lo}–{t.hi} mol/m²/day</td></tr>
          ))}
        </tbody></table>
      </div>

      <p class="mt-4 text-xs text-slate-500">DLI = PPFD × hours × 3,600 ÷ 1,000,000 — the total moles of light photons per m² per day. PPFD is on your grow light's spec sheet at a given distance. Target ranges are general horticulture guidelines. 🔒 In your browser.</p>
    </div>
  );
}
