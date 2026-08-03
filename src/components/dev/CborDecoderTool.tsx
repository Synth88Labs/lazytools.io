import { useMemo, useState } from 'preact/hooks';
import { decodeCbor, type CborNode } from '../../lib/cbor';

const SAMPLE = 'a2636167651903e8646e616d656543686c6f65';

function typeLabel(n: CborNode): string {
  switch (n.type) {
    case 'uint': return 'unsigned int';
    case 'nint': return 'negative int';
    case 'float': return 'float';
    case 'bool': return 'boolean';
    case 'null': return 'null';
    case 'undefined': return 'undefined';
    case 'simple': return 'simple';
    case 'bytes': return `byte string (${n.length})`;
    case 'text': return `text string (${n.length})`;
    case 'array': return `array (${n.items.length})`;
    case 'map': return `map (${n.entries.length})`;
    case 'tag': return `tag ${n.tag}`;
  }
}

function Tree({ node, depth, keyLabel }: { node: CborNode; depth: number; keyLabel?: string }) {
  const pad = depth > 0 ? 'ml-4 border-l-2 border-slate-200 pl-3' : '';
  const scalar = node.type !== 'array' && node.type !== 'map' && node.type !== 'tag';
  return (
    <div class={pad}>
      <div class="flex flex-wrap items-baseline gap-2 py-1">
        {keyLabel !== undefined && <span class="font-mono text-xs font-bold text-brand-800">{keyLabel}:</span>}
        <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{typeLabel(node)}</span>
        {scalar && <span class={`font-mono text-sm ${node.type === 'text' ? 'text-emerald-700' : 'text-slate-800'}`}>{node.diag}</span>}
      </div>
      {node.type === 'array' && node.items.map((it, i) => <Tree node={it} depth={depth + 1} keyLabel={String(i)} />)}
      {node.type === 'map' && node.entries.map((e) => <Tree node={e.value} depth={depth + 1} keyLabel={e.key.diag} />)}
      {node.type === 'tag' && <Tree node={node.content} depth={depth + 1} />}
    </div>
  );
}

export default function CborDecoderTool() {
  const [text, setText] = useState(SAMPLE);

  const result = useMemo(() => {
    const t = text.trim();
    if (!t) return null;
    try { return { r: decodeCbor(t), error: null as string | null }; }
    catch (e) { return { r: null, error: e instanceof Error ? e.message : 'Could not decode' }; }
  }, [text]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const copy = (v: string) => navigator.clipboard?.writeText(v);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">CBOR bytes (hex or base64)</span>
        <textarea rows={3} class={inp} value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} placeholder="a2636167… or base64" />
      </label>

      {result?.error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">⚠️ {result.error}</p>}

      {result?.r && (
        <div class="mt-4 space-y-4">
          <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <div class="mb-1 flex items-center justify-between">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Diagnostic notation</p>
              <button onClick={() => copy(result.r!.diagnostic)} class="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300">Copy</button>
            </div>
            <p class="break-all font-mono text-sm text-slate-800">{result.r.diagnostic}</p>
          </div>

          <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Structure</p>
            <Tree node={result.r.tree} depth={0} />
          </div>

          {result.r.trailing > 0 && (
            <p class="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 ring-1 ring-amber-200">Note: {result.r.trailing} trailing byte(s) after the first CBOR item were ignored.</p>
          )}
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Paste a CBOR (Concise Binary Object Representation, RFC 8949) message as hex or base64 to decode it into readable diagnostic notation and a typed structure tree. CBOR is a compact binary format used by WebAuthn/passkeys (COSE), IoT protocols and more. The decoder handles integers (exact to 64 bits), byte and text strings, arrays, maps, tags, half/single/double floats and indefinite-length items — all in your browser, with nothing uploaded. 🔒 100% client-side.</p>
    </div>
  );
}
