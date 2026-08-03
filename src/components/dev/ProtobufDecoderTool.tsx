import { useMemo, useState } from 'preact/hooks';
import { decodeProtobuf, type WireField } from '../../lib/protobuf';

const SAMPLE = '08 96 01 12 07 74 65 73 74 69 6e 67 1a 03 08 96 01';

function FieldRows({ fields, depth }: { fields: WireField[]; depth: number }) {
  return (
    <div class={depth > 0 ? 'ml-4 border-l-2 border-slate-200 pl-3' : ''}>
      {fields.map((f) => (
        <div class="py-1.5">
          <div class="flex flex-wrap items-baseline gap-2">
            <span class="rounded bg-brand-100 px-1.5 py-0.5 font-mono text-xs font-bold text-brand-800">{f.field}</span>
            <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{f.wire}</span>
            {f.wire === 'varint' && (
              <span class="font-mono text-sm text-slate-800">{f.uint}{f.uint !== f.sint && <span class="text-slate-400"> · sint {f.sint}</span>}{f.bool !== undefined && <span class="text-slate-400"> · bool {String(f.bool)}</span>}</span>
            )}
            {f.wire === 'i32' && <span class="font-mono text-sm text-slate-800">{f.int}<span class="text-slate-400"> · float {f.float} · {f.hex}</span></span>}
            {f.wire === 'i64' && <span class="font-mono text-sm text-slate-800">{f.int}<span class="text-slate-400"> · double {f.double} · {f.hex}</span></span>}
            {f.wire === 'len' && f.kind === 'string' && <span class="font-mono text-sm text-emerald-700">"{f.text}"</span>}
            {f.wire === 'len' && f.kind === 'bytes' && <span class="font-mono text-sm text-slate-600">{f.length} bytes · {f.hex}</span>}
            {f.wire === 'len' && f.kind === 'message' && <span class="text-xs text-slate-400">message ({f.length} bytes)</span>}
          </div>
          {f.wire === 'len' && f.kind === 'message' && f.fields && <FieldRows fields={f.fields} depth={depth + 1} />}
        </div>
      ))}
    </div>
  );
}

export default function ProtobufDecoderTool() {
  const [text, setText] = useState(SAMPLE);

  const result = useMemo(() => {
    const t = text.trim();
    if (!t) return null;
    try { return { fields: decodeProtobuf(t), error: null as string | null }; }
    catch (e) { return { fields: null, error: e instanceof Error ? e.message : 'Could not decode' }; }
  }, [text]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Protobuf bytes (hex or base64)</span>
        <textarea rows={4} class={inp} value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} placeholder="08 96 01 …  or  CJYB" />
      </label>

      {result?.error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">⚠️ {result.error}</p>}

      {result?.fields && (
        <div class="mt-4 rounded-xl bg-white p-4 ring-1 ring-slate-200">
          <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Decoded fields</p>
          <FieldRows fields={result.fields} depth={0} />
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Paste a Protocol Buffers message as hex or base64 to decode its structure — like <code class="rounded bg-slate-200 px-1">protoc --decode_raw</code>. The wire format is self-describing for field numbers and types, so you get each field&#39;s number, wire type and the plausible readings of its value (a length-delimited field is shown as a nested message when it parses, otherwise as a string or raw bytes). Without the <code class="rounded bg-slate-200 px-1">.proto</code> schema, field names and exact types (int vs sint, string vs bytes) can&#39;t be recovered — that&#39;s a property of the format, not a limit of the tool. 🔒 Decoded entirely in your browser.</p>
    </div>
  );
}
