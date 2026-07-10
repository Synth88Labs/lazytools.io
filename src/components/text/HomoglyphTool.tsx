import { useMemo, useState } from 'preact/hooks';
import { scanHomoglyphs } from '../../lib/textscan';

const ta = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function HomoglyphTool() {
  const [input, setInput] = useState('раypal.com'); // starts with Cyrillic р, а
  const [copied, setCopied] = useState(false);
  const res = useMemo(() => scanHomoglyphs(input), [input]);
  function copy() { navigator.clipboard.writeText(res.normalized).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400); }); }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Paste text to check for lookalike (homoglyph) characters</span>
        <textarea class={ta} rows={5} value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)} />
      </label>

      <div class={`mt-4 rounded-xl p-4 ring-2 ${res.hits.length ? 'bg-red-50 ring-red-200' : 'bg-emerald-50 ring-emerald-200'}`}>
        <p class={`text-lg font-bold ${res.hits.length ? 'text-red-800' : 'text-emerald-800'}`}>
          {res.hits.length ? `⚠ ${res.hits.length} lookalike character${res.hits.length > 1 ? 's' : ''} found` : '✓ No confusable characters detected'}
        </p>
        {res.mixedScript && <p class="mt-1 text-sm font-semibold text-red-700">Mixed scripts detected — Latin letters mixed with Cyrillic/Greek. This is a classic spoofing/phishing signature.</p>}
      </div>

      {res.hits.length > 0 && (
        <>
          <div class="mt-4 overflow-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr><th class="px-3 py-2">Character</th><th class="px-3 py-2">Codepoint</th><th class="px-3 py-2">Script</th><th class="px-3 py-2">Looks like</th></tr></thead>
              <tbody class="divide-y divide-slate-100 font-mono">
                {res.hits.slice(0, 100).map((h) => (
                  <tr><td class="px-3 py-1.5 text-lg">{h.char}</td><td class="px-3 py-1.5 text-slate-600">{h.codepoint}</td><td class="px-3 py-1.5"><span class="rounded bg-red-100 px-1.5 text-xs text-red-800">{h.script}</span></td><td class="px-3 py-1.5 font-bold text-emerald-700">{h.looksLike}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div class="mt-4">
            <div class="mb-1 flex items-center justify-between">
              <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">ASCII-normalized text</span>
              <button type="button" onClick={copy} class="rounded-lg bg-brand-700 px-3 py-1 text-xs font-medium text-white hover:bg-brand-800">{copied ? '✓ Copied' : 'Copy'}</button>
            </div>
            <textarea class={`${ta} border-brand-200`} rows={3} readOnly value={res.normalized} />
          </div>
        </>
      )}
      <p class="mt-3 text-xs text-slate-500">Homoglyphs are non-Latin characters that look identical to ASCII (Cyrillic <span class="font-mono">а</span>, Greek <span class="font-mono">ο</span>, fullwidth <span class="font-mono">Ａ</span>) — used to spoof domains and brand names. 🔒 Checked entirely in your browser.</p>
    </div>
  );
}
