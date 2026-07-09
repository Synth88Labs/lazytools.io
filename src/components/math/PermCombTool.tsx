import { useState } from 'preact/hooks';
import { nCr, nPr, factorialB } from '../../lib/mathx';

const inputCls = 'w-28 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none';

function big(b: bigint): string {
  const s = String(b);
  return s.length > 40 ? `${s.slice(0, 20)}…${s.slice(-10)} (${s.length} digits)` : s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function PermCombTool() {
  const [nStr, setNStr] = useState('52');
  const [rStr, setRStr] = useState('5');

  const n = parseInt(nStr.trim(), 10);
  const r = parseInt(rStr.trim(), 10);
  let error = '';
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0) error = 'Enter whole numbers n ≥ 0 and r ≥ 0.';
  else if (r > n) error = 'r cannot exceed n (you cannot choose more items than exist).';
  else if (n > 5000) error = 'Keep n ≤ 5000 — beyond that even exact integers stop being readable.';

  const comb = !error ? nCr(n, r) : 0n;
  const perm = !error ? nPr(n, r) : 0n;
  const factN = !error && n <= 2000 ? factorialB(n) : null;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-end gap-3">
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">n (total items)</span>
          <input class={inputCls} value={nStr} onInput={(e) => setNStr((e.target as HTMLInputElement).value)} />
        </label>
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">r (chosen)</span>
          <input class={inputCls} value={rStr} onInput={(e) => setRStr((e.target as HTMLInputElement).value)} />
        </label>
      </div>

      {error && <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>}

      {!error && (
        <>
          <div class="mt-5 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Combinations — order doesn't matter</p>
              <p class="mt-1 font-mono text-sm text-slate-500">C({n}, {r}) = {n}! / ({r}!({n}−{r})!)</p>
              <p class="mt-1 break-all font-mono text-2xl font-extrabold text-brand-700">{big(comb)}</p>
            </div>
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Permutations — order matters</p>
              <p class="mt-1 font-mono text-sm text-slate-500">P({n}, {r}) = {n}! / ({n}−{r})!</p>
              <p class="mt-1 break-all font-mono text-2xl font-extrabold text-slate-800">{big(perm)}</p>
            </div>
          </div>
          {factN !== null && (
            <div class="mt-3 rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{n}! (factorial)</p>
              <p class="mt-1 break-all font-mono text-lg font-bold text-slate-800">{big(factN)}</p>
            </div>
          )}
        </>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Exact BigInt arithmetic — C(52, 5) = 2,598,960 poker hands, and even 1000! comes out digit-perfect where ordinary calculators overflow at 170!. Runs locally.
      </p>
    </div>
  );
}
