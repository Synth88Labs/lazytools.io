import { useMemo, useState } from 'preact/hooks';
import { keccak256, sha3_256, functionSelector } from '../../lib/blockchain';

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const tabCls = (a: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${a ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700'}`;

function Row({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div class="rounded-xl bg-white p-3 ring-1 ring-slate-200">
      <div class="flex items-center justify-between">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <button type="button" onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1200); }} class="text-xs font-medium text-brand-700 hover:text-brand-900">{copied ? '✓' : 'Copy'}</button>
      </div>
      <p class="mt-1 break-all font-mono text-sm text-slate-900">0x{value}</p>
    </div>
  );
}

export default function KeccakTool() {
  const [mode, setMode] = useState<'hash' | 'selector'>('hash');
  const [text, setText] = useState('hello');
  const [sig, setSig] = useState('transfer(address,uint256)');

  const keccak = useMemo(() => keccak256(text), [text]);
  const sha3 = useMemo(() => sha3_256(text), [text]);
  const selector = useMemo(() => { try { return functionSelector(sig); } catch { return ''; } }, [sig]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap gap-2">
        <button type="button" class={tabCls(mode === 'hash')} onClick={() => setMode('hash')}>Keccak-256 hash</button>
        <button type="button" class={tabCls(mode === 'selector')} onClick={() => setMode('selector')}>Function selector (4-byte)</button>
      </div>

      {mode === 'hash' ? (
        <>
          <label class="mt-4 block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Text to hash</span>
            <textarea rows={3} class={inputCls} value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} /></label>
          <div class="mt-3 space-y-2">
            <Row label="Keccak-256 (Ethereum — pad byte 0x01)" value={keccak} />
            <Row label="SHA3-256 (NIST FIPS 202 — pad byte 0x06)" value={sha3} />
          </div>
          <p class="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">⚠ These differ! Ethereum uses <strong>Keccak-256</strong> (the original submission), which is <em>not</em> the same as the finalised NIST <strong>SHA3-256</strong> — they use a different padding byte and produce different hashes. Most tools blur this; pick the right one for your use.</p>
        </>
      ) : (
        <>
          <label class="mt-4 block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Function or event signature</span>
            <input class={inputCls} value={sig} placeholder="transfer(address,uint256)" onInput={(e) => setSig((e.target as HTMLInputElement).value)} /></label>
          <div class="mt-3 space-y-2">
            <Row label="4-byte function selector (calldata prefix)" value={selector.replace(/^0x/, '')} />
          </div>
          <p class="mt-3 text-xs text-slate-500">The selector is the first 4 bytes of Keccak-256 of the <strong>canonical</strong> signature (no spaces, no parameter names). The full 32-byte hash is the event <span class="font-mono">topic0</span>. 🔒 Computed in your browser.</p>
        </>
      )}
    </div>
  );
}
