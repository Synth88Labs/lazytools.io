import { useMemo, useState } from 'preact/hooks';
import { numberToWords, amountToWords } from '../../lib/text-compute';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

function Copy({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return <button onClick={() => { navigator.clipboard?.writeText(text); setDone(true); setTimeout(() => setDone(false), 1200); }} class="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-600 hover:border-brand-400">{done ? 'Copied' : 'Copy'}</button>;
}

export default function NumberToWordsTool() {
  const [val, setVal] = useState('1234.50');
  const res = useMemo(() => {
    const n = parseFloat(val);
    if (!isFinite(n)) return null;
    const words = numberToWords(n);
    return { words: words.charAt(0).toUpperCase() + words.slice(1), cheque: amountToWords(n) };
  }, [val]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Number</span>
        <input type="number" step="any" value={val} onInput={(e) => setVal((e.target as HTMLInputElement).value)} class={inp} /></label>

      {res ? (
        <div class="mt-4 space-y-3">
          <div class="rounded-xl bg-white p-4 ring-2 ring-brand-200">
            <div class="flex items-center justify-between"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">In words</p><Copy text={res.words} /></div>
            <p class="mt-1 text-lg font-semibold text-brand-800">{res.words}</p>
          </div>
          <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <div class="flex items-center justify-between"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cheque / "amount in words"</p><Copy text={res.cheque} /></div>
            <p class="mt-1 text-lg font-semibold text-slate-800">{res.cheque}</p>
          </div>
        </div>
      ) : <p class="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 ring-1 ring-amber-200">Enter a number.</p>}

      <p class="mt-4 text-xs text-slate-500">Converts a number to English words — for cheques, contracts, invoices and legal documents where amounts must be spelled out. The "amount in words" line uses the cheque convention, writing the whole part in words and the cents as a fraction over 100 (e.g. "and 50/100"). Handles negatives and decimals. 🔒 In your browser.</p>
    </div>
  );
}
