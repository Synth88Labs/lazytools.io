import { useState } from 'preact/hooks';
import { githubRaw } from '../../lib/links-compute';

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function GithubRawTool() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const res = githubRaw(input);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied((c) => (c === key ? null : c)), 1400); });
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">GitHub file URL</span>
        <div class="flex gap-2">
          <input type="url" autocomplete="off" spellcheck={false} class={`${inputCls} font-mono`} value={input}
            placeholder="https://github.com/owner/repo/blob/main/path/to/file"
            onInput={(e) => setInput((e.target as HTMLInputElement).value)} />
          {input && (
            <button type="button" onClick={() => { setInput(''); setCopied(null); }} class="shrink-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 hover:border-brand-400 hover:text-brand-700">Clear</button>
          )}
        </div>
      </label>

      {res && res.error && (
        <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-800">{res.error}</p>
      )}

      {res && res.raw && !res.error && (
        <div class="mt-4 space-y-3">
          <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <span class="shrink-0 rounded-md bg-brand-600 px-2 py-1 text-xs font-bold tracking-wide text-white">RAW</span>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-slate-800">Raw file link</p>
              <p class="truncate font-mono text-xs text-slate-500" title={res.raw}>{res.raw}</p>
            </div>
            <a href={res.raw} target="_blank" rel="noopener noreferrer" class="shrink-0 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-brand-400 hover:text-brand-700">Open</a>
            <button type="button" onClick={() => copy(res.raw!, 'raw')} class="shrink-0 rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-800">{copied === 'raw' ? 'Copied!' : 'Copy'}</button>
          </div>
          <details class="rounded-xl border border-slate-200 bg-white p-3">
            <summary class="cursor-pointer text-sm font-semibold text-slate-700">Markdown &amp; HTML snippets</summary>
            <pre class="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-100"><code>{`![](${res.raw})\n<img src="${res.raw}" alt="">`}</code></pre>
          </details>
        </div>
      )}

      <p class="mt-4 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-500">
        🔒 Parsed in your browser — nothing is sent anywhere. Works for public repos; the raw host is rate-limited and not a CDN, so use it for scripts, downloads and docs rather than production assets.
      </p>
    </div>
  );
}
