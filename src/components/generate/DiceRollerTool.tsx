import { useState } from 'preact/hooks';
import { diceRoll } from '../../lib/generate';

const rand = () => { const a = new Uint32Array(1); (globalThis.crypto ?? { getRandomValues: (x: Uint32Array) => { x[0] = Math.floor(Math.random() * 2 ** 32); return x; } } as Crypto).getRandomValues(a); return a[0] / 2 ** 32; };
const DICE = [4, 6, 8, 10, 12, 20, 100];

export default function DiceRollerTool() {
  const [count, setCount] = useState('2');
  const [sides, setSides] = useState(6);
  const [res, setRes] = useState<{ rolls: number[]; total: number } | null>(null);
  const [coin, setCoin] = useState<string | null>(null);

  const roll = () => { setCoin(null); setRes(diceRoll(parseInt(count, 10) || 1, sides, rand)); };
  const flip = () => { setRes(null); setCoin(rand() < 0.5 ? 'Heads' : 'Tails'); };

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-end gap-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">How many</span>
          <input type="number" min="1" max="100" value={count} onInput={(e) => setCount((e.target as HTMLInputElement).value)} class="w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono" /></label>
        <div><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Dice</span>
          <div class="flex flex-wrap gap-1">{DICE.map((d) => <button onClick={() => setSides(d)} class={`rounded-lg px-2.5 py-1.5 text-sm font-semibold ring-1 ${sides === d ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-slate-600 ring-slate-200'}`}>d{d}</button>)}</div></div>
      </div>
      <div class="mt-3 flex gap-2">
        <button onClick={roll} class="rounded-xl bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800">🎲 Roll {count}d{sides}</button>
        <button onClick={flip} class="rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:border-brand-400">🪙 Flip a coin</button>
      </div>

      {res && (
        <div class="mt-4 rounded-xl bg-white p-4 ring-2 ring-brand-200">
          <div class="flex flex-wrap gap-2">{res.rolls.map((r) => <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 font-mono text-lg font-bold text-brand-800 ring-1 ring-brand-200">{r}</span>)}</div>
          {res.rolls.length > 1 && <p class="mt-3 font-mono text-xl font-extrabold text-slate-800">Total: {res.total}</p>}
        </div>
      )}
      {coin && <div class="mt-4 rounded-xl bg-white p-6 text-center ring-2 ring-brand-200"><p class="font-mono text-4xl font-extrabold text-brand-800">{coin}</p></div>}

      <p class="mt-4 text-xs text-slate-500">Rolls virtual dice (d4 to d100) or flips a coin using your browser\'s cryptographic random generator, so every result is fair and unpredictable — good for tabletop and board games, D&D, or any decision. Roll up to 100 dice at once and it totals them. 🔒 In your browser.</p>
    </div>
  );
}
