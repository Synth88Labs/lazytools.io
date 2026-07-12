import { useMemo, useState } from 'preact/hooks';
import { awg, AWG_AMPACITY } from '../../lib/electronics';

const GAUGES = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];
const fmt = (x: number, d = 3) => Number(x.toPrecision(d)).toString();

export default function WireGaugeTool() {
  const [n, setN] = useState(12);

  const r = useMemo(() => {
    const a = awg(n);
    const amp = AWG_AMPACITY[n];
    return { ...a, amp };
  }, [n]);

  const sel = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Wire gauge (AWG)</span>
        <select value={n} onChange={(e) => setN(+(e.target as HTMLSelectElement).value)} class={sel}>
          {GAUGES.map((g) => <option value={g}>AWG {g}</option>)}
        </select></label>

      <div class="mt-4 grid gap-3 sm:grid-cols-3">
        <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Diameter</p><p class="mt-1 text-2xl font-extrabold text-brand-800">{fmt(r.diameterMm)} mm</p><p class="mt-1 text-xs text-slate-400">{fmt(r.diameterMm / 25.4, 3)} in</p></div>
        <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cross-section area</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.areaMm2)} mm²</p></div>
        <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Copper resistance</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.ohmPerKm)} Ω/km</p><p class="mt-1 text-xs text-slate-400">{fmt(r.ohmPer1000ft)} Ω/1000 ft</p></div>
      </div>

      {r.amp && (
        <div class="mt-3 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Ampacity — single wire in free air</p><p class="mt-1 text-2xl font-extrabold text-slate-700">≈ {r.amp.chassis} A</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-amber-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Ampacity — bundled / in conduit</p><p class="mt-1 text-2xl font-extrabold text-amber-700">≈ {r.amp.power} A</p></div>
        </div>
      )}

      <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200">
        <strong>Safety:</strong> ampacity figures are conservative guidelines, not code. The real safe current depends on the insulation's temperature rating, the ambient temperature, and how many wires are bundled together. For building and mains wiring, always follow your local electrical code (e.g. NEC Table 310.16) and, if in doubt, a qualified electrician.
      </p>
      <p class="mt-2 text-xs text-slate-500">Diameter = 0.127 × 92^((36 − AWG)/39) mm; resistance uses copper's resistivity (1.68×10⁻⁸ Ω·m at 20°C). A lower AWG number means a thicker wire. 🔒 In your browser.</p>
    </div>
  );
}
