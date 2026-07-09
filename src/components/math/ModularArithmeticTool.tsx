import { useState } from 'preact/hooks';
import { powmodTrace, egcd, modInverse } from '../../lib/mathx';

const inputCls = 'w-36 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none';
const tabCls = (active: boolean) =>
  `rounded-lg px-4 py-2 text-sm font-semibold transition ${active ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700'}`;

function parseBig(s: string, name: string): bigint {
  const t = s.trim().replace(/[,\s]/g, '');
  if (!/^-?\d+$/.test(t)) throw new Error(`${name} must be a whole number.`);
  if (t.replace('-', '').length > 30) throw new Error(`Keep ${name} to 30 digits or fewer.`);
  return BigInt(t);
}

export default function ModularArithmeticTool() {
  const [mode, setMode] = useState<'power' | 'inverse'>('power');
  const [b, setB] = useState('7');
  const [e, setE] = useState('128');
  const [m, setM] = useState('13');
  const [ia, setIa] = useState('17');
  const [im, setIm] = useState('43');

  let body: preact.JSX.Element | null = null;
  let error = '';
  try {
    if (mode === 'power') {
      const B = parseBig(b, 'base'), E = parseBig(e, 'exponent'), M = parseBig(m, 'modulus');
      if (E < 0n) throw new Error('Use a non-negative exponent (negative powers need the inverse tab).');
      if (M <= 0n) throw new Error('The modulus must be positive.');
      const { result, steps } = powmodTrace(B, E, M);
      body = (
        <>
          <p class="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-mono text-2xl font-extrabold text-brand-800">
            {b}^{e} mod {m} = {String(result)}
          </p>
          <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr><th class="px-3 py-2">Exponent bit</th><th class="px-3 py-2">Operation</th><th class="px-3 py-2 text-right">Accumulator (mod {m})</th></tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-mono">
                {steps.map((s) => (
                  <tr>
                    <td class="px-3 py-1.5 font-bold text-brand-700">{s.bit}</td>
                    <td class="px-3 py-1.5 text-slate-600">{s.op === 'init' ? 'start: acc = base (bit 1)' : s.op === 'square+multiply' ? 'square, then × base' : 'square'}</td>
                    <td class="px-3 py-1.5 text-right text-slate-800">{String(s.acc)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p class="mt-2 text-xs text-slate-500">
            Square-and-multiply reads the exponent in binary ({E.toString(2)}) — {steps.length} steps instead of {e} multiplications. This is the same algorithm inside RSA and Diffie–Hellman.
          </p>
        </>
      );
    } else {
      const A = parseBig(ia, 'a'), M = parseBig(im, 'modulus');
      if (M <= 1n) throw new Error('The modulus must be at least 2.');
      const aa = ((A % M) + M) % M;
      const { rows, g } = egcd(aa, M);
      let inv: bigint | null = null;
      try { inv = modInverse(A, M); } catch { /* handled below */ }
      body = (
        <>
          {inv !== null ? (
            <p class="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-mono text-2xl font-extrabold text-brand-800">
              {ia}⁻¹ mod {im} = {String(inv)} <span class="text-base font-semibold text-slate-600">(check: {ia} × {String(inv)} ≡ 1 mod {im})</span>
            </p>
          ) : (
            <p class="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-lg font-bold text-amber-900">
              No inverse exists: gcd({ia}, {im}) = {String(g)} ≠ 1. Inverses exist only when a and the modulus are coprime.
            </p>
          )}
          <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr><th class="px-3 py-2">a</th><th class="px-3 py-2">b</th><th class="px-3 py-2">quotient</th><th class="px-3 py-2">remainder</th></tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-mono">
                {rows.map((r) => (
                  <tr>
                    <td class="px-3 py-1.5 text-slate-800">{String(r.a)}</td>
                    <td class="px-3 py-1.5 text-slate-800">{String(r.b)}</td>
                    <td class="px-3 py-1.5 text-slate-600">{String(r.q)}</td>
                    <td class="px-3 py-1.5 font-bold text-brand-700">{String(r.r)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p class="mt-2 text-xs text-slate-500">
            The extended Euclidean algorithm above finds x, y with x·a + y·m = gcd(a, m); when the gcd is 1, x (mod m) is the inverse. This is how RSA computes its private exponent.
          </p>
        </>
      );
    }
  } catch (e2) {
    error = (e2 as Error).message;
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap gap-2">
        <button type="button" class={tabCls(mode === 'power')} onClick={() => setMode('power')}>aᵇ mod n (power)</button>
        <button type="button" class={tabCls(mode === 'inverse')} onClick={() => setMode('inverse')}>a⁻¹ mod n (inverse)</button>
      </div>

      {mode === 'power' ? (
        <div class="mt-4 flex flex-wrap items-center gap-2 text-xl font-bold text-slate-500">
          <input class={inputCls} value={b} onInput={(ev) => setB((ev.target as HTMLInputElement).value)} aria-label="base" />
          <span>^</span>
          <input class={inputCls} value={e} onInput={(ev) => setE((ev.target as HTMLInputElement).value)} aria-label="exponent" />
          <span>mod</span>
          <input class={inputCls} value={m} onInput={(ev) => setM((ev.target as HTMLInputElement).value)} aria-label="modulus" />
        </div>
      ) : (
        <div class="mt-4 flex flex-wrap items-center gap-2 text-xl font-bold text-slate-500">
          <input class={inputCls} value={ia} onInput={(ev) => setIa((ev.target as HTMLInputElement).value)} aria-label="a" />
          <span>⁻¹ mod</span>
          <input class={inputCls} value={im} onInput={(ev) => setIm((ev.target as HTMLInputElement).value)} aria-label="modulus" />
        </div>
      )}

      {error ? <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p> : body}

      <p class="mt-4 text-xs text-slate-500">Exact BigInt arithmetic with the full algorithm trace — the working your cryptography or number-theory course wants to see. Runs locally.</p>
    </div>
  );
}
