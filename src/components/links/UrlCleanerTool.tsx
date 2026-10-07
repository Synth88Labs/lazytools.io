import { useState } from 'preact/hooks';
import { cleanUrl } from '../../lib/links-compute';

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function UrlCleanerTool() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const res = cleanUrl(input);

  function copy() {
    if (!res?.cleaned) return;
    navigator.clipboard.writeText(res.cleaned).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400); });
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">URL to clean</span>
        <div class="flex gap-2">
          <input type="url" autocomplete="off" spellcheck={false} class={`${inputCls} font-mono`} value={input}
            placeholder="https://example.com/article?utm_source=x&fbclid=…"
            onInput={(e) => setInput((e.target as HTMLInputElement).value)} />
          {input && (
            <button type="button" onClick={() => { setInput(''); setCopied(false); }} class="shrink-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 hover:border-brand-400 hover:text-brand-700">Clear</button>
          )}
        </div>
      </label>

      {res && res.error && (
        <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-800">{res.error}</p>
      )}

      {res && res.cleaned && !res.error && (
        <div class="mt-4 space-y-3">
          <div class="rounded-xl border border-mint-600/30 bg-mint-500/5 p-3">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Clean URL</p>
            <p class="mt-1 break-all font-mono text-sm text-slate-800">{res.cleaned}</p>
            <button type="button" onClick={copy} class="mt-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800">{copied ? 'Copied!' : 'Copy clean URL'}</button>
          </div>
          {res.removed && res.removed.length > 0 ? (
            <div class="rounded-xl border border-slate-200 bg-white p-3">
              <p class="text-sm text-slate-600"><strong class="font-semibold text-slate-900">{res.removed.length}</strong> tracking parameter{res.removed.length === 1 ? '' : 's'} removed:</p>
              <div class="mt-2 flex flex-wrap gap-1.5">
                {res.removed.map((r) => <code class="rounded bg-rose-50 px-2 py-0.5 font-mono text-xs text-rose-700 line-through">{r}</code>)}
              </div>
            </div>
          ) : (
            <p class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600">No known tracking parameters found — this link is already clean.</p>
          )}
        </div>
      )}

      <p class="mt-4 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-500">
        🔒 Cleaned in your browser — the URL is never sent anywhere. Removes <code class="font-mono">utm_*</code> and known click IDs (fbclid, gclid, igshid…); unrecognised parameters are kept so the link keeps working.
      </p>
    </div>
  );
}
