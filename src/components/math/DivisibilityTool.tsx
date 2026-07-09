import { useState } from 'preact/hooks';

interface RuleResult {
  d: number;
  divisible: boolean;
  rule: string;
  working: string;
}

const digitSum = (s: string) => s.split('').reduce((a, c) => a + Number(c), 0);

function rules(sIn: string): { results: RuleResult[]; digitalRoot: number; rootWorking: string } {
  const s = sIn;
  const n = BigInt(s);
  const div = (d: bigint) => n % d === 0n;
  const last = (k: number) => s.slice(-k);
  const ds = digitSum(s);

  // alternating sum for 11 (from the right)
  let alt = 0;
  for (let i = 0; i < s.length; i++) alt += (i % 2 === 0 ? 1 : -1) * Number(s[s.length - 1 - i]);

  // truncate-and-double test for 7: remove last digit, subtract twice it
  const sevenSteps: string[] = [];
  let cur = n < 0n ? -n : n;
  while (cur >= 100n) {
    const lastD = cur % 10n;
    cur = cur / 10n - 2n * lastD;
    if (cur < 0n) cur = -cur;
    sevenSteps.push(String(cur));
    if (sevenSteps.length > 12) break;
  }
  // truncate-and-add-4× for 13
  const thirteenSteps: string[] = [];
  let cur13 = n < 0n ? -n : n;
  while (cur13 >= 100n) {
    const lastD = cur13 % 10n;
    cur13 = cur13 / 10n + 4n * lastD;
    thirteenSteps.push(String(cur13));
    if (thirteenSteps.length > 12) break;
  }

  const results: RuleResult[] = [
    { d: 2, divisible: div(2n), rule: 'last digit even', working: `last digit ${last(1)} is ${Number(last(1)) % 2 === 0 ? 'even ✓' : 'odd ✗'}` },
    { d: 3, divisible: div(3n), rule: 'digit sum divisible by 3', working: `digit sum ${s.split('').join('+')} = ${ds}; ${ds} ${ds % 3 === 0 ? 'is' : 'is not'} a multiple of 3` },
    { d: 4, divisible: div(4n), rule: 'last two digits divisible by 4', working: `last two digits ${last(2)} ÷ 4 ${Number(last(2)) % 4 === 0 ? 'divides exactly' : `leaves ${Number(last(2)) % 4}`}` },
    { d: 5, divisible: div(5n), rule: 'ends in 0 or 5', working: `last digit is ${last(1)}` },
    { d: 6, divisible: div(6n), rule: 'divisible by both 2 and 3', working: `2: ${div(2n) ? '✓' : '✗'}, 3: ${div(3n) ? '✓' : '✗'}` },
    { d: 7, divisible: div(7n), rule: 'truncate & subtract 2× last digit, repeat', working: sevenSteps.length ? `${s} → ${sevenSteps.join(' → ')}; ${sevenSteps[sevenSteps.length - 1]} ${BigInt(sevenSteps[sevenSteps.length - 1]!) % 7n === 0n ? 'is' : 'is not'} a multiple of 7` : `${s} ${div(7n) ? 'is' : 'is not'} a multiple of 7 (small enough to check directly)` },
    { d: 8, divisible: div(8n), rule: 'last three digits divisible by 8', working: `last three digits ${last(3)} ÷ 8 ${Number(last(3)) % 8 === 0 ? 'divides exactly' : `leaves ${Number(last(3)) % 8}`}` },
    { d: 9, divisible: div(9n), rule: 'digit sum divisible by 9', working: `digit sum = ${ds}; ${ds} ${ds % 9 === 0 ? 'is' : 'is not'} a multiple of 9` },
    { d: 10, divisible: div(10n), rule: 'ends in 0', working: `last digit is ${last(1)}` },
    { d: 11, divisible: div(11n), rule: 'alternating digit sum divisible by 11', working: `alternating sum (from the right) = ${alt}; ${alt} ${alt % 11 === 0 ? 'is' : 'is not'} a multiple of 11` },
    { d: 12, divisible: div(12n), rule: 'divisible by both 3 and 4', working: `3: ${div(3n) ? '✓' : '✗'}, 4: ${div(4n) ? '✓' : '✗'}` },
    { d: 13, divisible: div(13n), rule: 'truncate & add 4× last digit, repeat', working: thirteenSteps.length ? `${s} → ${thirteenSteps.join(' → ')}; ${thirteenSteps[thirteenSteps.length - 1]} ${BigInt(thirteenSteps[thirteenSteps.length - 1]!) % 13n === 0n ? 'is' : 'is not'} a multiple of 13` : `${s} ${div(13n) ? 'is' : 'is not'} a multiple of 13 (small enough to check directly)` },
  ];

  // digital root: repeated digit sums
  const roots: number[] = [ds];
  let dr = ds;
  while (dr >= 10) { dr = digitSum(String(dr)); roots.push(dr); }
  return { results, digitalRoot: dr, rootWorking: `${s} → ${roots.join(' → ')}` };
}

export default function DivisibilityTool() {
  const [input, setInput] = useState('123456');

  const s = input.trim().replace(/[,\s]/g, '');
  const valid = /^\d+$/.test(s) && s.length <= 30 && s !== '0';
  const out = valid ? rules(s) : null;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block max-w-sm">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Number (up to 30 digits)</span>
        <input
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none"
          value={input}
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          placeholder="123456"
        />
      </label>

      {!valid && input.trim() !== '' && <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Enter a positive whole number of up to 30 digits.</p>}

      {out && (
        <>
          <div class="mt-4 flex flex-wrap items-center gap-3">
            <div class="rounded-xl bg-white px-4 py-2.5 ring-1 ring-slate-200">
              <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Divisible by: </span>
              <span class="font-mono text-lg font-extrabold text-brand-700">{out.results.filter((r) => r.divisible).map((r) => r.d).join(', ') || 'none of 2–13'}</span>
            </div>
            <div class="rounded-xl bg-white px-4 py-2.5 ring-1 ring-slate-200">
              <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Digital root: </span>
              <span class="font-mono text-lg font-extrabold text-slate-800">{out.digitalRoot}</span>
              <span class="ml-2 font-mono text-xs text-slate-400">({out.rootWorking})</span>
            </div>
          </div>

          <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr><th class="px-3 py-2">÷</th><th class="px-3 py-2">Verdict</th><th class="px-3 py-2">Rule</th><th class="px-3 py-2">Working</th></tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                {out.results.map((r) => (
                  <tr class={r.divisible ? 'bg-emerald-50/50' : ''}>
                    <td class="px-3 py-1.5 font-mono font-bold text-slate-800">{r.d}</td>
                    <td class="px-3 py-1.5">{r.divisible ? '✅' : '—'}</td>
                    <td class="px-3 py-1.5 text-slate-600">{r.rule}</td>
                    <td class="px-3 py-1.5 font-mono text-xs text-slate-600">{r.working}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <p class="mt-4 text-xs text-slate-500">
        Each verdict is exact BigInt arithmetic — the "working" column shows the classroom rule applied so you can do it by hand next time. The digital root (repeated digit sum) is what the 3 and 9 rules are really computing. Runs locally.
      </p>
    </div>
  );
}
