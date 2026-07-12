import { useMemo, useState } from 'preact/hooks';
import { RES_COLORS, resistorFromBands, fmtOhms } from '../../lib/electronics';

const digitColors = RES_COLORS.filter((c) => c.digit != null);
const multColors = RES_COLORS.filter((c) => c.mult != null);
const tolColors = RES_COLORS.filter((c) => c.tol != null);
const tempcoColors = RES_COLORS.filter((c) => c.tempco != null);

export default function ResistorColorTool() {
  const [bandCount, setBandCount] = useState<4 | 5 | 6>(4);
  // slots: [digit1, digit2, digit3, multiplier, tolerance, tempco]
  const [bands, setBands] = useState<string[]>(['Brown', 'Black', 'Black', 'Red', 'Gold', 'Brown']);

  const active = useMemo(() => {
    // build the color list for the active band count
    if (bandCount === 4) return [bands[0], bands[1], bands[3], bands[4]];
    if (bandCount === 5) return [bands[0], bands[1], bands[2], bands[3], bands[4]];
    return [bands[0], bands[1], bands[2], bands[3], bands[4], bands[5]];
  }, [bandCount, bands]);

  const r = useMemo(() => resistorFromBands(active), [active]);
  const set = (i: number, v: string) => setBands(bands.map((b, j) => j === i ? v : b));

  const sel = 'w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const digitCount = bandCount >= 5 ? 3 : 2;

  // visual resistor band positions (indices into `active`)
  const swatch = (name: string) => RES_COLORS.find((c) => c.name === name)?.hex ?? '#ccc';

  const Band = ({ label, idx, options }: { label: string; idx: number; options: typeof RES_COLORS }) => (
    <label class="block">
      <span class="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <select value={bands[idx]} onChange={(e) => set(idx, (e.target as HTMLSelectElement).value)} class={sel}>
        {options.map((o) => <option value={o.name}>{o.name}</option>)}
      </select>
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-4 flex gap-2">
        {([4, 5, 6] as const).map((n) => (
          <button onClick={() => setBandCount(n)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${bandCount === n ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{n} bands</button>
        ))}
      </div>

      {/* visual resistor */}
      <div class="mb-4 flex items-center justify-center">
        <div class="h-2 w-8 bg-slate-300"></div>
        <div class="relative flex h-16 w-56 items-center justify-center gap-2 rounded-md bg-[#e8d3a0] px-4 shadow-inner ring-1 ring-amber-200">
          {active.map((c) => (
            <div class="h-full w-3 rounded-sm" style={`background:${swatch(c)}`}></div>
          ))}
        </div>
        <div class="h-2 w-8 bg-slate-300"></div>
      </div>

      <div class={`grid gap-2 ${bandCount === 6 ? 'sm:grid-cols-6' : bandCount === 5 ? 'sm:grid-cols-5' : 'sm:grid-cols-4'}`}>
        <Band label="Digit 1" idx={0} options={digitColors} />
        <Band label="Digit 2" idx={1} options={digitColors} />
        {digitCount === 3 && <Band label="Digit 3" idx={2} options={digitColors} />}
        <Band label="Multiplier" idx={3} options={multColors} />
        <Band label="Tolerance" idx={4} options={tolColors} />
        {bandCount === 6 && <Band label="Temp. coeff." idx={5} options={tempcoColors} />}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Resistance</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmtOhms(r.ohms)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Tolerance</p><p class="mt-1 text-2xl font-extrabold text-slate-700">±{r.tolerance}%</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{r.tempco != null ? 'Temp. coeff.' : 'Range'}</p><p class="mt-1 text-lg font-extrabold text-slate-700">{r.tempco != null ? `${r.tempco} ppm/K` : `${fmtOhms(r.ohms * (1 - (r.tolerance ?? 0) / 100))} – ${fmtOhms(r.ohms * (1 + (r.tolerance ?? 0) / 100))}`}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Pick a color for each band.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Reads the IEC 60062 color code: the first bands are digits, the next is the ×10ⁿ multiplier, then tolerance (and, on 6-band resistors, the temperature coefficient). Read from the end nearest the bands, with the tolerance band (often gold/silver) last. 🔒 In your browser.</p>
    </div>
  );
}
