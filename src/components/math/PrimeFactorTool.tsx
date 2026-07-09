import { useState } from 'preact/hooks';
import { factorize, isPrime, divisorsOf, nextPrime, prevPrime } from '../../lib/mathx';

export default function PrimeFactorTool() {
  const [input, setInput] = useState('360');
  const [result, setResult] = useState<{ n: bigint; prime: boolean; factors: [bigint, bigint][]; divisors: bigint; divisorSum: bigint; divisorList: bigint[] | null; next: bigint; prev: bigint | null } | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function run() {
    setError('');
    setResult(null);
    const s = input.trim().replace(/[,\s]/g, '');
    if (!/^\d+$/.test(s)) { setError('Enter a positive integer.'); return; }
    const n = BigInt(s);
    if (n < 2n) { setError('Enter an integer of 2 or more.'); return; }
    if (s.length > 19) { setError('Keep it to 19 digits or fewer (up to about 10^19) so factorization stays fast on your device.'); return; }
    setBusy(true);
    // let the UI paint before potentially heavy work
    setTimeout(() => {
      try {
        const prime = isPrime(n);
        const factors = prime ? ([[n, 1n]] as [bigint, bigint][]) : factorize(n);
        let divisors = 1n, divisorSum = 1n;
        for (const [p, e] of factors) {
          divisors *= e + 1n;
          let geo = 0n, pow = 1n;
          for (let i = 0n; i <= e; i++) { geo += pow; pow *= p; }
          divisorSum *= geo;
        }
        let divisorList: bigint[] | null = null;
        if (divisors <= 256n) {
          try { divisorList = divisorsOf(n); } catch { divisorList = null; }
        }
        setResult({ n, prime, factors, divisors, divisorSum, divisorList, next: nextPrime(n), prev: prevPrime(n) });
      } catch (err) {
        setError((err as Error).message);
      }
      setBusy(false);
    }, 30);
  }

  const sup = (e: bigint) => String(e).split('').map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('');

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex max-w-md gap-2">
        <input
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none"
          value={input}
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder="360"
        />
        <button type="button" onClick={run} disabled={busy} class="rounded-lg bg-brand-700 px-5 py-2 font-semibold text-white transition hover:bg-brand-800 disabled:opacity-40">
          {busy ? '…' : 'Factorize'}
        </button>
      </div>

      {error && <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>}

      {result && (
        <>
          <div class={`mt-5 rounded-xl border px-4 py-3 ${result.prime ? 'border-emerald-200 bg-emerald-50' : 'border-brand-200 bg-brand-50'}`}>
            <p class="text-lg font-bold text-slate-900">
              {result.prime
                ? `${String(result.n)} is PRIME`
                : <>{String(result.n)} = <span class="font-mono">{result.factors.map(([p, e]) => e === 1n ? String(p) : `${p}${sup(e)}`).join(' × ')}</span></>}
            </p>
          </div>

          {!result.prime && (
            <div class="mt-3 flex flex-wrap gap-3">
              <div class="rounded-xl bg-white px-4 py-2.5 text-center ring-1 ring-slate-200">
                <p class="font-mono text-2xl font-extrabold text-slate-800">{String(result.divisors)}</p>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">divisors</p>
              </div>
              <div class="rounded-xl bg-white px-4 py-2.5 text-center ring-1 ring-slate-200">
                <p class="break-all font-mono text-2xl font-extrabold text-slate-800">{String(result.divisorSum)}</p>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">sum of divisors</p>
              </div>
              <div class="rounded-xl bg-white px-4 py-2.5 text-center ring-1 ring-slate-200">
                <p class="font-mono text-2xl font-extrabold text-slate-800">{result.factors.length}</p>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">distinct primes</p>
              </div>
            </div>
          )}

          {result.divisorList && !result.prime && (
            <div class="mt-3 rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">All {result.divisorList.length} factors of {String(result.n)}</p>
              <p class="mt-2 flex flex-wrap gap-1.5 font-mono text-sm">
                {result.divisorList.map((d) => (
                  <span class="rounded bg-slate-50 px-2 py-0.5 text-slate-700 ring-1 ring-slate-200">{String(d)}</span>
                ))}
              </p>
              <p class="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Factor pairs</p>
              <p class="mt-1 flex flex-wrap gap-1.5 font-mono text-sm">
                {result.divisorList.filter((d) => d * d <= result.n!).map((d) => (
                  <span class="rounded bg-brand-50 px-2 py-0.5 text-brand-800 ring-1 ring-brand-100">{String(d)} × {String(result.n / d)}</span>
                ))}
              </p>
            </div>
          )}

          <p class="mt-3 text-sm text-slate-600">
            Neighbouring primes: <span class="font-mono font-semibold">{result.prev !== null ? `${result.prev} ←` : ''} {String(result.n)} → {String(result.next)}</span>
          </p>
        </>
      )}
      <p class="mt-4 text-xs text-slate-500">
        Primality via deterministic Miller–Rabin; factoring via trial division + Pollard's rho — exact for inputs up to ~10¹⁹. Runs locally, works offline.
      </p>
    </div>
  );
}
