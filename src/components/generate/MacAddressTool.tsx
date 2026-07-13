import { useState } from 'preact/hooks';
import { randomMac } from '../../lib/generate';

const rand = () => { const a = new Uint32Array(1); (globalThis.crypto ?? { getRandomValues: (x: Uint32Array) => { x[0] = Math.floor(Math.random() * 2 ** 32); return x; } } as Crypto).getRandomValues(a); return a[0] / 2 ** 32; };

export default function MacAddressTool() {
  const [sep, setSep] = useState(':');
  const [upper, setUpper] = useState(false);
  const [localAdmin, setLocalAdmin] = useState(true);
  const [count, setCount] = useState('5');
  const [macs, setMacs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const gen = () => {
    const n = Math.max(1, Math.min(100, parseInt(count, 10) || 1));
    setMacs(Array.from({ length: n }, () => randomMac(rand, sep, localAdmin, upper)));
  };
  const inp = 'rounded-xl border border-slate-300 bg-white px-2 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-center gap-3">
        <label class="text-sm text-slate-600">Separator <select value={sep} onChange={(e) => setSep((e.target as HTMLSelectElement).value)} class={inp}><option value=":">colon (:)</option><option value="-">dash (-)</option><option value="">none</option></select></label>
        <label class="flex items-center gap-1.5 text-sm text-slate-600"><input type="checkbox" checked={upper} onChange={(e) => setUpper((e.target as HTMLInputElement).checked)} /> uppercase</label>
        <label class="flex items-center gap-1.5 text-sm text-slate-600"><input type="checkbox" checked={localAdmin} onChange={(e) => setLocalAdmin((e.target as HTMLInputElement).checked)} /> locally administered</label>
        <label class="text-sm text-slate-600">Count <input type="number" min="1" max="100" value={count} onInput={(e) => setCount((e.target as HTMLInputElement).value)} class="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1 text-center font-mono text-sm" /></label>
      </div>
      <div class="mt-3 flex gap-2">
        <button onClick={gen} class="rounded-xl bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800">Generate</button>
        {macs.length > 0 && <button onClick={() => { navigator.clipboard?.writeText(macs.join('\n')); setCopied(true); setTimeout(() => setCopied(false), 1200); }} class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-400">{copied ? 'Copied' : 'Copy all'}</button>}
      </div>

      {macs.length > 0 && <ul class="mt-4 space-y-1 rounded-xl bg-white p-4 font-mono text-sm ring-1 ring-slate-200">{macs.map((m) => <li class="text-slate-800">{m}</li>)}</ul>}

      <p class="mt-4 text-xs text-slate-500">Generates random MAC addresses (48-bit, 6 octets) for testing, mocking devices or spoofing. "Locally administered" sets the address\'s second-least-significant bit of the first octet (making the first octet 02, 06, 0A or 0E…), the correct range for addresses you assign yourself rather than manufacturer-burned ones. Choose the separator and case to match your platform. 🔒 Generated in your browser.</p>
    </div>
  );
}
