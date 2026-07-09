import { useState } from 'preact/hooks';
import { gcdB, lcmB, gcdSteps } from '../../lib/mathx';

export default function GcdLcmTool() {
  const [input, setInput] = useState('48, 180, 36');

  let nums: bigint[] = [];
  let error = '';
  try {
    nums = input.split(/[\s,;]+/).filter(Boolean).map((s) => {
      if (!/^\d+$/.test(s)) throw new Error(`"${s}" is not a positive integer.`);
      return BigInt(s);
    });
    if (nums.length < 2) error = 'Enter at least two positive integers, separated by commas or spaces.';
    if (nums.some((n) => n === 0n)) error = 'Use positive integers (zero has no LCM with other numbers in the usual sense).';
  } catch (e) {
    error = (e as Error).message;
  }

  const gcd = !error && nums.length >= 2 ? nums.reduce((a, b) => gcdB(a, b)) : null;
  const lcm = !error && nums.length >= 2 ? nums.reduce((a, b) => lcmB(a, b)) : null;
  const steps = !error && nums.length >= 2 ? gcdSteps(nums[0]!, nums[1]!) : [];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block max-w-md">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Numbers (two or more)</span>
        <input
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none"
          value={input}
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          placeholder="48, 180, 36"
        />
      </label>

      {error && <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>}

      {gcd !== null && lcm !== null && (
        <>
          <div class="mt-5 flex flex-wrap gap-3">
            <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
              <p class="break-all font-mono text-3xl font-extrabold text-brand-700">{String(gcd)}</p>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">GCD (greatest common divisor)</p>
            </div>
            <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
              <p class="break-all font-mono text-3xl font-extrabold text-slate-800">{String(lcm)}</p>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">LCM (least common multiple)</p>
            </div>
          </div>

          {steps.length > 0 && (
            <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Euclidean algorithm for the first pair ({String(nums[0])}, {String(nums[1])})
              </p>
              <ol class="mt-2 space-y-1 font-mono text-sm text-slate-700">
                {steps.map((s) => (
                  <li>{String(s.a)} = {String(s.q)} × {String(s.b)} + <strong class={s.r === 0n ? 'text-brand-700' : ''}>{String(s.r)}</strong></li>
                ))}
              </ol>
              <p class="mt-2 text-sm text-slate-600">
                The last non-zero remainder is the GCD{nums.length > 2 ? ' of the pair; further numbers fold in the same way (gcd(gcd(a,b),c)…)' : ''}. LCM comes from a × b ÷ gcd(a, b).
              </p>
            </div>
          )}
        </>
      )}
      <p class="mt-4 text-xs text-slate-500">Arbitrary-precision integers (BigInt) — works far beyond the 15-digit limit where ordinary calculators silently round. Runs locally.</p>
    </div>
  );
}
