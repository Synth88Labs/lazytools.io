import { useState } from 'preact/hooks';
import { dropboxLinks } from '../../lib/links-compute';

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function DropboxLinkTool() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const res = dropboxLinks(input);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied((c) => (c === key ? null : c)), 1400); });
  }

  const rows = res && res.download ? [
    { key: 'download', format: 'DOWNLOAD', label: 'Direct download (forces a download)', url: res.download },
    { key: 'raw', format: 'RAW', label: 'Raw hot-link (embed / fetch the bytes)', url: res.raw! },
  ] : [];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Dropbox share link</span>
        <div class="flex gap-2">
          <input
            type="url" autocomplete="off" spellcheck={false}
            class={`${inputCls} font-mono`} value={input}
            placeholder="Paste your Dropbox …?dl=0 share link here…"
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          />
          {input && (
            <button type="button" onClick={() => { setInput(''); setCopied(null); }} class="shrink-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 hover:border-brand-400 hover:text-brand-700">Clear</button>
          )}
        </div>
      </label>

      {res && res.error && (
        <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-800">{res.error}</p>
      )}

      {rows.length > 0 && (
        <ul class="mt-4 space-y-2">
          {rows.map((l) => (
            <li class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <span class="shrink-0 rounded-md bg-brand-600 px-2 py-1 text-xs font-bold tracking-wide text-white">{l.format}</span>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-slate-800">{l.label}</p>
                <p class="truncate font-mono text-xs text-slate-500" title={l.url}>{l.url}</p>
              </div>
              <a href={l.url} target="_blank" rel="noopener noreferrer" class="shrink-0 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-brand-400 hover:text-brand-700">Open</a>
              <button type="button" onClick={() => copy(l.url, l.key)} class="shrink-0 rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-800">{copied === l.key ? 'Copied!' : 'Copy'}</button>
            </li>
          ))}
        </ul>
      )}

      <p class="mt-4 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-500">
        🔒 Rewritten in your browser — nothing is sent to Dropbox or to us. The share link must be public ("Anyone with the link"). The raw host suits embedding and light fetching, not high-traffic hot-linking.
      </p>
    </div>
  );
}
