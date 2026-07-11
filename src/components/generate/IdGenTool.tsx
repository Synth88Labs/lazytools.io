import { useState } from 'preact/hooks';
import { uuidV7, ulid, nanoid, decodeId } from '../../lib/gen-compute';

type Tab = 'v4' | 'v7' | 'ulid' | 'nanoid' | 'decode';
const tabCls = (a: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${a ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700'}`;
const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

const LABELS: Record<Tab, string> = { v4: 'UUID v4', v7: 'UUID v7', ulid: 'ULID', nanoid: 'NanoID', decode: 'Decode' };

export default function IdGenTool({ variant = 'v4' }: { variant?: Tab }) {
  const [tab, setTab] = useState<Tab>(variant);
  const [count, setCount] = useState(5);
  const [nanoSize, setNanoSize] = useState(21);
  const [out, setOut] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [decodeIn, setDecodeIn] = useState('');

  function gen() {
    const n = Math.max(1, Math.min(1000, count));
    const one = () => tab === 'v4' ? crypto.randomUUID() : tab === 'v7' ? uuidV7() : tab === 'ulid' ? ulid() : nanoid(nanoSize);
    setOut(Array.from({ length: n }, one));
  }
  function copy() { navigator.clipboard.writeText(out.join('\n')).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400); }); }

  const decoded = tab === 'decode' ? decodeId(decodeIn) : null;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap gap-2">
        {(['v4', 'v7', 'ulid', 'nanoid', 'decode'] as Tab[]).map((t) => <button type="button" class={tabCls(tab === t)} onClick={() => { setTab(t); setOut([]); }}>{LABELS[t]}</button>)}
      </div>

      {tab !== 'decode' ? (
        <>
          <div class="mt-4 flex flex-wrap items-end gap-3">
            <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">How many</span>
              <input type="number" min={1} max={1000} class={`${inputCls} w-28`} value={count} onInput={(e) => setCount(parseInt((e.target as HTMLInputElement).value) || 1)} /></label>
            {tab === 'nanoid' && <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Length</span>
              <input type="number" min={4} max={64} class={`${inputCls} w-24`} value={nanoSize} onInput={(e) => setNanoSize(parseInt((e.target as HTMLInputElement).value) || 21)} /></label>}
            <button type="button" onClick={gen} class="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">Generate</button>
            {out.length > 0 && <button type="button" onClick={copy} class="rounded-lg border border-brand-300 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50">{copied ? '✓ Copied' : 'Copy all'}</button>}
          </div>
          {out.length > 0 && <textarea readOnly rows={Math.min(12, out.length + 1)} class="mt-3 w-full rounded-xl border border-brand-200 bg-white px-3 py-3 font-mono text-sm text-slate-900" value={out.join('\n')} />}
          <p class="mt-3 text-xs text-slate-500">
            {tab === 'v4' && 'Random UUID (RFC 9562 v4) via crypto.getRandomValues — 122 bits of entropy.'}
            {tab === 'v7' && 'Time-sortable UUID v7 (RFC 9562, 2024): a 48-bit millisecond timestamp + secure randomness — better database index locality than v4.'}
            {tab === 'ulid' && 'ULID: 48-bit timestamp + 80-bit randomness in Crockford base32 — lexicographically sortable, 26 characters.'}
            {tab === 'nanoid' && 'NanoID: URL-safe, cryptographically random, rejection-sampled for an unbiased distribution.'}
            {' '}🔒 Generated entirely in your browser.
          </p>
        </>
      ) : (
        <div class="mt-4">
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Paste a UUID or ULID to inspect</span>
            <input class={`${inputCls} font-mono`} value={decodeIn} placeholder="0192f0c1-… or 01ARZ3NDEK…" onInput={(e) => setDecodeIn((e.target as HTMLInputElement).value)} /></label>
          <div class="mt-3 rounded-xl bg-white p-4 ring-2 ring-brand-200">
            {!decodeIn.trim() ? <p class="text-sm text-slate-500">Paste an ID above.</p> : decoded ? (
              <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                <dt class="text-slate-500">Type</dt><dd class="font-semibold text-slate-900">{decoded.kind}{decoded.version ? ` ${decoded.version}` : ''}</dd>
                {decoded.timestamp && <><dt class="text-slate-500">Timestamp</dt><dd class="font-mono text-slate-900">{decoded.timestamp}</dd></>}
                {decoded.note && <><dt class="text-slate-500">Note</dt><dd class="text-slate-600">{decoded.note}</dd></>}
              </dl>
            ) : <p class="text-sm text-amber-700">Not a recognised UUID or ULID.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
