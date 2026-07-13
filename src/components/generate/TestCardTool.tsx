import { useState } from 'preact/hooks';
import { generateTestCard } from '../../lib/generate';

const rand = () => { const a = new Uint32Array(1); (globalThis.crypto ?? { getRandomValues: (x: Uint32Array) => { x[0] = Math.floor(Math.random() * 2 ** 32); return x; } } as Crypto).getRandomValues(a); return a[0] / 2 ** 32; };
const NETWORKS: { id: string; label: string; prefix: string; length: number }[] = [
  { id: 'visa', label: 'Visa', prefix: '4', length: 16 },
  { id: 'mc', label: 'Mastercard', prefix: '5555', length: 16 },
  { id: 'amex', label: 'American Express', prefix: '3714', length: 15 },
  { id: 'disc', label: 'Discover', prefix: '6011', length: 16 },
];

function group(num: string): string {
  return num.length === 15 ? `${num.slice(0, 4)} ${num.slice(4, 10)} ${num.slice(10)}` : num.replace(/(.{4})/g, '$1 ').trim();
}

export default function TestCardTool() {
  const [net, setNet] = useState('visa');
  const [count, setCount] = useState('3');
  const [cards, setCards] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const gen = () => {
    const n = NETWORKS.find((x) => x.id === net)!;
    const c = Math.max(1, Math.min(50, parseInt(count, 10) || 1));
    setCards(Array.from({ length: c }, () => generateTestCard(n.prefix, n.length, rand)));
  };
  const inp = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-800 ring-1 ring-rose-200">⚠️ <strong>Test numbers only.</strong> These are randomly generated, Luhn-valid numbers for testing payment forms. They are <strong>not real cards</strong>, have no funds, and cannot be used to buy anything.</div>
      <div class="flex flex-wrap items-center gap-3">
        <label class="text-sm text-slate-600">Network <select value={net} onChange={(e) => setNet((e.target as HTMLSelectElement).value)} class={inp}>{NETWORKS.map((n) => <option value={n.id}>{n.label}</option>)}</select></label>
        <label class="text-sm text-slate-600">Count <input type="number" min="1" max="50" value={count} onInput={(e) => setCount((e.target as HTMLInputElement).value)} class="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1 text-center font-mono text-sm" /></label>
        <button onClick={gen} class="rounded-xl bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800">Generate</button>
        {cards.length > 0 && <button onClick={() => { navigator.clipboard?.writeText(cards.join('\n')); setCopied(true); setTimeout(() => setCopied(false), 1200); }} class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-400">{copied ? 'Copied' : 'Copy all'}</button>}
      </div>

      {cards.length > 0 && <ul class="mt-4 space-y-1 rounded-xl bg-white p-4 font-mono text-sm ring-1 ring-slate-200">{cards.map((c) => <li class="text-slate-800">{group(c)}</li>)}</ul>}

      <p class="mt-4 text-xs text-slate-500">Generates card numbers that pass the Luhn check-digit algorithm and start with a real network prefix, so payment forms accept them as syntactically valid during development and QA. They are randomly generated and correspond to no real account — for live testing use the official test cards from your payment processor (Stripe, PayPal, etc.). Never enter a real card here. 🔒 Generated in your browser.</p>
    </div>
  );
}
