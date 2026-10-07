import { useState } from 'preact/hooks';
import { driveLinks } from '../../lib/links-compute';

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const TYPE_LABEL: Record<string, string> = { sheets: 'Google Sheets', docs: 'Google Docs', slides: 'Google Slides', file: 'Drive file' };

export default function DriveLinkTool() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<number | null>(null);
  const res = driveLinks(input);

  function copy(text: string, i: number) {
    navigator.clipboard.writeText(text).then(() => { setCopied(i); setTimeout(() => setCopied((c) => (c === i ? null : c)), 1400); });
  }

  const first = res && res.links ? res.links[0].url : '';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Google Drive / Docs / Sheets / Slides link</span>
        <div class="flex gap-2">
          <input
            type="url" autocomplete="off" spellcheck={false}
            class={`${inputCls} font-mono`} value={input}
            placeholder="Paste your Google Drive, Sheets, Docs, or Slides link here…"
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

      {res && res.links && (
        <div class="mt-4">
          <p class="text-sm text-slate-600">Detected <strong class="font-semibold text-slate-900">{TYPE_LABEL[res.type!]}</strong> · ID <code class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700">{res.id}</code></p>
          <ul class="mt-3 space-y-2">
            {res.links.map((l, i) => (
              <li class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <span class="shrink-0 rounded-md bg-brand-600 px-2 py-1 text-xs font-bold tracking-wide text-white">.{l.format}</span>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-slate-800">{l.label}</p>
                  <p class="truncate font-mono text-xs text-slate-500" title={l.url}>{l.url}</p>
                </div>
                <a href={l.url} target="_blank" rel="noopener noreferrer" class="shrink-0 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-brand-400 hover:text-brand-700">Open</a>
                <button type="button" onClick={() => copy(l.url, i)} class="shrink-0 rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-800">{copied === i ? 'Copied!' : 'Copy'}</button>
              </li>
            ))}
          </ul>

          <details class="mt-3 rounded-xl border border-slate-200 bg-white p-3">
            <summary class="cursor-pointer text-sm font-semibold text-slate-700">HTML snippet</summary>
            <p class="mt-2 text-xs text-slate-500">Drop this into a page to offer the file as a download:</p>
            <pre class="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-100"><code>{`<a href="${first}" class="download-btn">Download File</a>`}</code></pre>
            <button type="button" onClick={() => copy(`<a href="${first}" class="download-btn">Download File</a>`, 99)} class="mt-2 rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50">{copied === 99 ? 'Copied!' : 'Copy snippet'}</button>
          </details>
        </div>
      )}

      <p class="mt-4 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-500">
        🔒 Parsed in your browser — the link and file are never uploaded. <strong class="font-semibold text-slate-700">Set the file's sharing to "Anyone with the link"</strong> for direct downloads to work; Google still enforces permissions.
      </p>
    </div>
  );
}
