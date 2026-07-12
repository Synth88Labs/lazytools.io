import { useMemo, useState } from 'preact/hooks';
import { decodeSmd, fmtOhms } from '../../lib/electronics';

const EXAMPLES = ['103', '4700', '1002', '01C', '68X', 'R47', '4R7', '000'];

export default function SmdResistorTool() {
  const [code, setCode] = useState('103');

  const res = useMemo(() => decodeSmd(code), [code]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-center font-mono text-2xl font-bold uppercase tracking-widest text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">SMD resistor code</span>
        <input value={code} onInput={(e) => setCode((e.target as HTMLInputElement).value)} placeholder="e.g. 103" class={inp} />
      </label>

      <div class="mt-3 flex flex-wrap gap-1.5">
        {EXAMPLES.map((ex) => (
          <button onClick={() => setCode(ex)} class="rounded-lg border border-slate-300 bg-white px-2.5 py-1 font-mono text-xs font-semibold text-slate-600 hover:border-brand-400 hover:text-brand-700">{ex}</button>
        ))}
      </div>

      {res ? (
        <div class="mt-4 rounded-xl bg-white p-5 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Resistance</p>
          <p class="mt-1 text-4xl font-extrabold text-brand-800">{res.ohms === 0 ? '0 Ω' : fmtOhms(res.ohms)}</p>
          <p class="mt-2 text-sm text-slate-500">Read as <span class="font-semibold text-slate-700">{res.format}</span></p>
        </div>
      ) : (
        <p class="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 ring-1 ring-amber-200">Not a recognised SMD code. Try a 3-digit (103), 4-digit (1002), EIA-96 (01C), R-notation (R47) or 0-ohm (000) marking.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        3-digit codes are two significant figures plus a ×10ⁿ multiplier (103 = 10 kΩ), so a plain 470 means 47 Ω, not 470 Ω. 4-digit codes (1%) use three significant figures (1002 = 10 kΩ). An "R" marks a decimal point for small values (R47 = 0.47 Ω, 4R7 = 4.7 Ω). EIA-96 codes are two digits (a 1% E96 value) plus a letter multiplier (01C = 10 kΩ). 000/00/0 is a zero-ohm jumper. 🔒 In your browser.
      </p>
    </div>
  );
}
