import { useMemo, useState } from 'preact/hooks';
import { scanInvisible, cleanInvisible } from '../../lib/textscan';

const ta = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function InvisibleCharTool() {
  const [input, setInput] = useState('This looks normal​ but has a hidden character.');
  const [copied, setCopied] = useState(false);
  const hits = useMemo(() => scanInvisible(input), [input]);
  const cleaned = useMemo(() => cleanInvisible(input), [input]);

  function copy() { navigator.clipboard.writeText(cleaned).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400); }); }

  const byName = useMemo(() => {
    const m: Record<string, { count: number; hex: string; kind: string }> = {};
    for (const h of hits) { m[h.name] = m[h.name] || { count: 0, hex: h.hex, kind: h.kind }; m[h.name].count++; }
    return Object.entries(m).sort((a, b) => b[1].count - a[1].count);
  }, [hits]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Paste text to scan for hidden characters</span>
        <textarea class={ta} rows={6} value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)} />
      </label>

      <div class={`mt-4 rounded-xl p-4 ring-2 ${hits.length ? 'bg-amber-50 ring-amber-200' : 'bg-emerald-50 ring-emerald-200'}`}>
        <p class={`text-lg font-bold ${hits.length ? 'text-amber-800' : 'text-emerald-800'}`}>
          {hits.length ? `⚠ ${hits.length} hidden character${hits.length > 1 ? 's' : ''} found` : '✓ No hidden characters detected'}
        </p>
        {byName.length > 0 && (
          <ul class="mt-2 space-y-1 text-sm text-amber-900/90">
            {byName.map(([name, d]) => (
              <li class="flex items-center gap-2"><span class="font-mono text-xs text-amber-700">{d.hex}</span> <strong>{name}</strong> <span class="text-amber-700">×{d.count}</span> <span class="rounded bg-amber-100 px-1.5 text-xs">{d.kind}</span></li>
            ))}
          </ul>
        )}
      </div>

      {hits.length > 0 && (
        <div class="mt-4">
          <div class="mb-1 flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cleaned text (hidden characters removed)</span>
            <button type="button" onClick={copy} class="rounded-lg bg-brand-700 px-3 py-1 text-xs font-medium text-white hover:bg-brand-800">{copied ? '✓ Copied' : 'Copy clean text'}</button>
          </div>
          <textarea class={`${ta} border-brand-200`} rows={6} readOnly value={cleaned} />
        </div>
      )}
      <p class="mt-3 text-xs text-slate-500">Detects zero-width spaces, non-breaking spaces, bidirectional controls, the BOM, and the tag/variation-selector characters increasingly used to invisibly watermark AI-generated text. 🔒 Everything runs in your browser — your text is never uploaded.</p>
    </div>
  );
}
