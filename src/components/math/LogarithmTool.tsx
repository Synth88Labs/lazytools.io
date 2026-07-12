import { useState } from 'preact/hooks';
import { logBase } from '../../lib/math-extra';

const inp = 'w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const fmt = (x: number) => (Number.isFinite(x) ? Number(x.toPrecision(10)).toString() : '—');

export default function LogarithmTool() {
  const [xStr, setXStr] = useState('1000');
  const [bStr, setBStr] = useState('10');
  const [antiBase, setAntiBase] = useState('2');
  const [antiExp, setAntiExp] = useState('10');

  const x = parseFloat(xStr), b = parseFloat(bStr);
  const valid = isFinite(x) && x > 0 && isFinite(b) && b > 0 && b !== 1;
  const result = valid ? logBase(x, b) : null;

  const ab = parseFloat(antiBase), ae = parseFloat(antiExp);
  const anti = isFinite(ab) && isFinite(ae) ? Math.pow(ab, ae) : null;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-end gap-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Value (x)</span>
          <input type="number" step="any" value={xStr} onInput={(e) => setXStr((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Base (b)</span>
          <input type="number" step="any" value={bStr} onInput={(e) => setBStr((e.target as HTMLInputElement).value)} class={inp} /></label>
        <div class="flex gap-1 pb-1">
          {[['2', '2'], ['e', String(Math.E)], ['10', '10']].map(([lbl, v]) => (
            <button onClick={() => setBStr(v)} class="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-sm font-semibold text-slate-600 hover:border-brand-400">{lbl}</button>
          ))}
        </div>
      </div>

      {result != null ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="font-mono text-lg text-slate-500">log<sub>{Number(bStr) === Math.E ? 'e' : bStr}</sub>({fmt(x)}) =</p>
          <p class="mt-1 font-mono text-4xl font-extrabold text-brand-800">{fmt(result)}</p>
        </div>
      ) : (
        <p class="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 ring-1 ring-amber-200">Enter a positive value and a positive base (not 1).</p>
      )}

      {valid && (
        <div class="mt-3 grid gap-2 sm:grid-cols-3">
          {[['ln (base e)', Math.log(x)], ['log₁₀', Math.log10(x)], ['log₂', Math.log2(x)]].map(([lbl, v]) => (
            <div class="rounded-lg bg-white p-3 text-center ring-1 ring-slate-200"><p class="font-mono text-lg font-bold text-slate-800">{fmt(v as number)}</p><p class="text-xs text-slate-500">{lbl}</p></div>
          ))}
        </div>
      )}

      <div class="mt-5 border-t border-slate-200 pt-4">
        <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Antilogarithm (bˣ)</p>
        <div class="flex flex-wrap items-center gap-2">
          <input type="number" step="any" value={antiBase} onInput={(e) => setAntiBase((e.target as HTMLInputElement).value)} class={inp.replace('w-32', 'w-24')} />
          <span class="font-mono text-slate-500">^</span>
          <input type="number" step="any" value={antiExp} onInput={(e) => setAntiExp((e.target as HTMLInputElement).value)} class={inp.replace('w-32', 'w-24')} />
          <span class="font-mono text-slate-500">=</span>
          <span class="font-mono text-2xl font-extrabold text-slate-800">{anti != null ? fmt(anti) : '—'}</span>
        </div>
      </div>

      <p class="mt-4 text-xs text-slate-500">The logarithm answers "what power gives this value": log<sub>b</sub>(x) is the exponent y for which bʸ = x. Computed by change of base, log<sub>b</sub>(x) = ln(x) ÷ ln(b). The antilog reverses it: bˣ. 🔒 In your browser.</p>
    </div>
  );
}
