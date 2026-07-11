import { useEffect, useState } from 'preact/hooks';

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

/** Unbiased index in [0, n) from crypto randomness via rejection sampling. */
function secureIndex(n: number): number {
  const max = Math.floor(0x100000000 / n) * n;
  const a = new Uint32Array(1);
  do { crypto.getRandomValues(a); } while (a[0]! >= max);
  return a[0]! % n;
}

export default function PassphraseTool() {
  const [words, setWords] = useState<string[]>([]);
  const [count, setCount] = useState(6);
  const [sep, setSep] = useState('-');
  const [cap, setCap] = useState(false);
  const [addNum, setAddNum] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/vendor/eff-wordlist.txt').then((r) => r.text()).then((t) => {
      const w = t.split('\n').map((l) => l.split('\t')[1]?.trim()).filter(Boolean) as string[];
      setWords(w); setLoaded(true);
    }).catch(() => setLoaded(false));
  }, []);

  function gen() {
    if (!words.length) return;
    const n = Math.max(3, Math.min(12, count));
    let picked = Array.from({ length: n }, () => words[secureIndex(words.length)]!);
    if (cap) picked = picked.map((w) => w[0]!.toUpperCase() + w.slice(1));
    let out = picked.join(sep);
    if (addNum) out += (sep || '') + secureIndex(100);
    setPhrase(out);
  }
  useEffect(() => { if (loaded) gen(); }, [loaded]);

  function copy() { navigator.clipboard.writeText(phrase).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400); }); }

  const bitsPerWord = Math.log2(7776);
  const entropy = count * bitsPerWord;
  const strength = entropy >= 90 ? { label: 'Excellent', c: 'text-emerald-700' } : entropy >= 70 ? { label: 'Strong', c: 'text-emerald-700' } : entropy >= 50 ? { label: 'Reasonable', c: 'text-amber-700' } : { label: 'Weak', c: 'text-red-700' };

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="rounded-xl bg-white p-4 ring-2 ring-brand-200">
        <p class="break-all font-mono text-xl font-bold text-slate-900">{phrase || (loaded ? '' : 'Loading word list…')}</p>
        <div class="mt-3 flex flex-wrap items-center gap-3">
          <button type="button" onClick={gen} disabled={!loaded} class="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-40">🎲 Generate</button>
          <button type="button" onClick={copy} disabled={!phrase} class="rounded-lg border border-brand-300 bg-white px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-40">{copied ? '✓ Copied' : 'Copy'}</button>
          <span class="ml-auto text-sm">≈ <strong>{entropy.toFixed(0)} bits</strong> · <span class={`font-semibold ${strength.c}`}>{strength.label}</span></span>
        </div>
      </div>

      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        <div><label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Words: {count}</label>
          <input type="range" min={3} max={10} value={count} onInput={(e) => setCount(parseInt((e.target as HTMLInputElement).value))} class="w-full accent-brand-600" /></div>
        <div><label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Separator</label>
          <select class={inputCls} value={sep} onChange={(e) => setSep((e.target as HTMLSelectElement).value)}>
            <option value="-">hyphen -</option><option value=".">dot .</option><option value="_">underscore _</option><option value=" ">space</option><option value="">none</option>
          </select></div>
        <label class="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={cap} onChange={(e) => setCap((e.target as HTMLInputElement).checked)} class="accent-brand-600" /> Capitalise each word</label>
        <label class="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={addNum} onChange={(e) => setAddNum((e.target as HTMLInputElement).checked)} class="accent-brand-600" /> Append a number</label>
      </div>
      <p class="mt-3 text-xs text-slate-500">True <strong>diceware</strong>: each word is chosen from the 7,776-word EFF list with <span class="font-mono">crypto.getRandomValues</span> (rejection-sampled, so every word is equally likely). Each word adds ~12.9 bits of entropy — a memorable 6-word passphrase is stronger than most random passwords. 🔒 Generated entirely in your browser.</p>
    </div>
  );
}
