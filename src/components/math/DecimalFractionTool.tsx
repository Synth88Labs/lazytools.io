import { useState } from 'preact/hooks';
import { Rat, repeatingToRat, absB } from '../../lib/mathx';

const inputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none';
const tabCls = (active: boolean) =>
  `rounded-lg px-4 py-2 text-sm font-semibold transition ${active ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700'}`;

/** Exact decimal expansion with repetend detection: returns "0.58(3)" style. */
function fracToRepeating(r: Rat, maxDigits = 400): { text: string; truncated: boolean } {
  const sign = r.n < 0n ? '-' : '';
  let n = absB(r.n);
  const whole = n / r.d;
  let rem = n % r.d;
  if (rem === 0n) return { text: sign + String(whole), truncated: false };
  const seen = new Map<string, number>();
  let digits = '';
  let repeatAt = -1;
  while (rem !== 0n && digits.length < maxDigits) {
    const key = String(rem);
    if (seen.has(key)) { repeatAt = seen.get(key)!; break; }
    seen.set(key, digits.length);
    rem *= 10n;
    digits += String(rem / r.d);
    rem %= r.d;
  }
  if (rem === 0n) return { text: `${sign}${whole}.${digits}`, truncated: false };
  if (repeatAt === -1) return { text: `${sign}${whole}.${digits}…`, truncated: true };
  return { text: `${sign}${whole}.${digits.slice(0, repeatAt)}(${digits.slice(repeatAt)})`, truncated: false };
}

export default function DecimalFractionTool() {
  const [mode, setMode] = useState<'d2f' | 'f2d'>('d2f');
  const [decStr, setDecStr] = useState('0.625');
  const [fracStr, setFracStr] = useState('5/12');

  let out: { label: string; value: string }[] = [];
  let error = '';
  try {
    if (mode === 'd2f') {
      const r = repeatingToRat(decStr);
      out = [
        { label: 'Exact fraction', value: r.toFrac() },
        ...(r.toMixed() !== r.toFrac() ? [{ label: 'Mixed number', value: r.toMixed() }] : []),
      ];
    } else {
      const r = Rat.parse(fracStr);
      const rep = fracToRepeating(r);
      out = [
        { label: rep.text.includes('(') ? 'Exact decimal (repeating part in parentheses)' : rep.truncated ? 'Decimal (repetend longer than 400 digits)' : 'Exact decimal', value: rep.text },
        { label: 'Lowest terms', value: r.toFrac() },
      ];
    }
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex gap-2">
        <button type="button" class={tabCls(mode === 'd2f')} onClick={() => setMode('d2f')}>Decimal → fraction</button>
        <button type="button" class={tabCls(mode === 'f2d')} onClick={() => setMode('f2d')}>Fraction → decimal</button>
      </div>

      {mode === 'd2f' ? (
        <label class="mt-4 block max-w-xs">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Decimal — use (…) for repeating digits</span>
          <input class={inputCls} value={decStr} onInput={(e) => setDecStr((e.target as HTMLInputElement).value)} placeholder="0.625 or 0.1(6)" />
        </label>
      ) : (
        <label class="mt-4 block max-w-xs">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Fraction</span>
          <input class={inputCls} value={fracStr} onInput={(e) => setFracStr((e.target as HTMLInputElement).value)} placeholder="5/12" />
        </label>
      )}

      {error && <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>}

      {!error && out.length > 0 && (
        <div class="mt-4 flex flex-wrap gap-3">
          {out.map((o) => (
            <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
              <p class="break-all font-mono text-2xl font-extrabold text-brand-700">{o.value}</p>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{o.label}</p>
            </div>
          ))}
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Repeating decimals convert exactly: 0.1(6) means 0.1666… = 1/6, and 0.(3) = 1/3. Every fraction's decimal either terminates or repeats — this tool shows which, with the repetend in parentheses. Exact arithmetic, computed locally.
      </p>
    </div>
  );
}
