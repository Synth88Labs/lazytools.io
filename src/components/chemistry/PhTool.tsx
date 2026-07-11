import { useMemo, useState } from 'preact/hooks';

type Field = 'pH' | 'pOH' | 'H' | 'OH';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmtC = (x: number) => x.toExponential(3);

export default function PhTool() {
  const [field, setField] = useState<Field>('pH');
  const [val, setVal] = useState('3');

  const r = useMemo(() => {
    const x = num(val);
    if (x == null) return null;
    let pH: number;
    if (field === 'pH') pH = x;
    else if (field === 'pOH') pH = 14 - x;
    else if (field === 'H') { if (x <= 0) return null; pH = -Math.log10(x); }
    else { if (x <= 0) return null; pH = 14 + Math.log10(x); }
    const pOH = 14 - pH;
    const H = Math.pow(10, -pH);
    const OH = Math.pow(10, -pOH);
    const verdict = pH < 6.999 ? { t: 'Acidic', cls: 'bg-red-100 text-red-800' } : pH > 7.001 ? { t: 'Basic (alkaline)', cls: 'bg-blue-100 text-blue-800' } : { t: 'Neutral', cls: 'bg-slate-100 text-slate-700' };
    return { pH, pOH, H, OH, verdict };
  }, [field, val]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        {([['pH', 'pH'], ['pOH', 'pOH'], ['H', '[H⁺]'], ['OH', '[OH⁻]']] as [Field, string][]).map(([k, l]) => (
          <button onClick={() => setField(k)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${field === k ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>Enter {l}</button>
        ))}
      </div>

      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          {field === 'pH' ? 'pH value' : field === 'pOH' ? 'pOH value' : field === 'H' ? 'Hydrogen-ion concentration [H⁺] (mol/L)' : 'Hydroxide-ion concentration [OH⁻] (mol/L)'}
        </span>
        <input type="number" step="any" value={val} onInput={(e) => setVal((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder={field === 'H' || field === 'OH' ? 'e.g. 1e-3' : 'e.g. 3'} />
      </label>

      {r ? (
        <>
          <div class="mt-4 text-center">
            <span class={`inline-block rounded-full px-4 py-1 text-sm font-bold ${r.verdict.cls}`}>{r.verdict.t}</span>
          </div>
          <div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[['pH', r.pH.toFixed(2)], ['pOH', r.pOH.toFixed(2)], ['[H⁺]', fmtC(r.H) + ' M'], ['[OH⁻]', fmtC(r.OH) + ' M']].map(([l, v]) => (
              <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{l}</p>
                <p class="mt-1 font-mono text-lg font-bold text-brand-800">{v}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a value. Concentrations must be positive (use scientific notation like 1e-3).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">pH = −log₁₀[H⁺]; pH + pOH = 14 and [H⁺][OH⁻] = 1×10⁻¹⁴ at 25 °C. 🔒 Computed in your browser.</p>
    </div>
  );
}
