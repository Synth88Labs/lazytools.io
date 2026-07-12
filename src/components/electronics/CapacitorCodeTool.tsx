import { useMemo, useState } from 'preact/hooks';
import { capacitorCodePf, fmtCapacitance } from '../../lib/electronics';

const COMMON: [string, string][] = [['104', '100 nF'], ['103', '10 nF'], ['102', '1 nF'], ['473', '47 nF'], ['224', '220 nF'], ['105', '1 µF']];

export default function CapacitorCodeTool() {
  const [code, setCode] = useState('104');

  const r = useMemo(() => {
    const pf = capacitorCodePf(code);
    if (pf == null) return null;
    return { pf, nf: pf / 1000, uf: pf / 1e6 };
  }, [code]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Capacitor code (e.g. 104)</span>
        <input value={code} onInput={(e) => setCode((e.target as HTMLInputElement).value)} class={`${inp} sm:w-40`} placeholder="104" /></label>
      <div class="mt-2 flex flex-wrap gap-1.5">
        {COMMON.map(([c, v]) => (
          <button onClick={() => setCode(c)} class="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300">{c} = {v}</button>
        ))}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Capacitance</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmtCapacitance(r.pf)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">In picofarads</p><p class="mt-1 text-xl font-extrabold text-slate-700">{r.pf.toLocaleString()} pF</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">nF / µF</p><p class="mt-1 text-lg font-extrabold text-slate-700">{Number(r.nf.toPrecision(4))} nF · {Number(r.uf.toPrecision(4))} µF</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a 3-digit ceramic capacitor code, or a 1–2 digit value in pF.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">A 3-digit ceramic code is read like the resistor code: the first two digits, then the number of zeros. So 104 = 10 followed by 4 zeros = 100,000 pF = 100 nF. A trailing letter (if present) is the tolerance. 1 µF = 1,000 nF = 1,000,000 pF. 🔒 In your browser.</p>
    </div>
  );
}
