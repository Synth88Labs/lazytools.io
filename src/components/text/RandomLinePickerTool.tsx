import { useState } from 'preact/hooks';
import { pickLines } from '../../lib/text-compute';

const cryptoRand = () => {
  const a = new Uint32Array(1);
  (globalThis.crypto ?? ({ getRandomValues: (x: Uint32Array) => { x[0] = Math.floor(Math.random() * 2 ** 32); return x; } } as Crypto)).getRandomValues(a);
  return a[0] / 2 ** 32;
};

export default function RandomLinePickerTool() {
  const [text, setText] = useState('Alice\nBob\nCharlie\nDana\nEli\nFatima');
  const [count, setCount] = useState('1');
  const [unique, setUnique] = useState(true);
  const [picked, setPicked] = useState<string[] | null>(null);

  const total = text.split('\n').filter((l) => l.trim() !== '').length;

  const pick = () => {
    const n = Math.max(1, parseInt(count, 10) || 1);
    setPicked(pickLines(text.split('\n'), n, unique, cryptoRand));
  };

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Your list (one item per line)</span>
        <textarea class="h-32 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} /></label>
      <p class="mt-1 text-xs text-slate-500">{total} items</p>

      <div class="mt-3 flex flex-wrap items-center gap-3">
        <label class="flex items-center gap-2 text-sm text-slate-600">Pick <input type="number" min="1" value={count} onInput={(e) => setCount((e.target as HTMLInputElement).value)} class="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1 text-center font-mono text-sm" /></label>
        <label class="flex items-center gap-1.5 text-sm text-slate-600"><input type="checkbox" checked={unique} onChange={(e) => setUnique((e.target as HTMLInputElement).checked)} /> no repeats</label>
        <button onClick={pick} class="rounded-xl bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800">🎲 Pick</button>
      </div>

      {picked && (
        <div class="mt-4 rounded-xl bg-white p-4 ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{picked.length} picked</p>
          <ul class="mt-1 space-y-1">{picked.map((p, i) => <li class="font-mono text-lg font-semibold text-brand-800">{i + 1}. {p}</li>)}</ul>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Randomly draws items from your list — for raffles, giveaways, picking a winner, assigning tasks or making a decision. Uses your browser\'s cryptographic random generator for a fair, unpredictable draw. "No repeats" draws distinct items (up to the list length); unchecking it allows the same item to be drawn more than once. 🔒 In your browser.</p>
    </div>
  );
}
