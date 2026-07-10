import { useMemo, useState } from 'preact/hooks';

const ta = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const enc = new TextEncoder();

function category(ch: string): string {
  if (/\p{L}/u.test(ch)) return 'Letter';
  if (/\p{N}/u.test(ch)) return 'Number';
  if (/\p{P}/u.test(ch)) return 'Punctuation';
  if (/\p{S}/u.test(ch)) return 'Symbol';
  if (/\p{M}/u.test(ch)) return 'Mark';
  if (/\p{Zs}/u.test(ch)) return 'Space';
  if (/\p{Z}/u.test(ch)) return 'Separator';
  if (/\p{C}/u.test(ch)) return 'Control/Other';
  return '—';
}

export default function UnicodeInspectorTool() {
  const [input, setInput] = useState('Aé—🎉');
  const rows = useMemo(() => {
    const out: { char: string; cp: string; dec: number; utf8: string; entity: string; cat: string }[] = [];
    for (const ch of input) {
      if (ch === '\n') continue;
      const dec = ch.codePointAt(0)!;
      out.push({
        char: ch,
        cp: 'U+' + dec.toString(16).toUpperCase().padStart(4, '0'),
        dec,
        utf8: [...enc.encode(ch)].map((b) => b.toString(16).toUpperCase().padStart(2, '0')).join(' '),
        entity: `&#${dec};`,
        cat: category(ch),
      });
    }
    return out.slice(0, 500);
  }, [input]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Type or paste text (each character is inspected)</span>
        <textarea class={ta} rows={3} value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)} />
      </label>

      <div class="mt-4 overflow-auto rounded-xl border border-slate-200 bg-white">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr><th class="px-3 py-2">Char</th><th class="px-3 py-2">Code point</th><th class="px-3 py-2">Decimal</th><th class="px-3 py-2">UTF-8 bytes</th><th class="px-3 py-2">HTML</th><th class="px-3 py-2">Category</th></tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-mono">
            {rows.map((r) => (
              <tr class="hover:bg-slate-50">
                <td class="px-3 py-1.5 text-lg">{r.cat === 'Control/Other' || r.cat === 'Space' ? <span class="text-slate-300">·</span> : r.char}</td>
                <td class="px-3 py-1.5 font-semibold text-brand-700">{r.cp}</td>
                <td class="px-3 py-1.5 text-slate-600">{r.dec}</td>
                <td class="px-3 py-1.5 text-slate-600">{r.utf8}</td>
                <td class="px-3 py-1.5 text-slate-600">{r.entity}</td>
                <td class="px-3 py-1.5"><span class="rounded bg-slate-100 px-1.5 text-xs text-slate-600">{r.cat}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-xs text-slate-500">Every character’s exact Unicode code point, decimal value, UTF-8 byte encoding, HTML entity and category — the details a chatbot can’t reliably give. 🔒 Computed in your browser.</p>
    </div>
  );
}
