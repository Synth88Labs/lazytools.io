import { useState } from 'preact/hooks';

// Loosely-typed Turndown service (the `turndown` types may not be installed).
type TurndownLike = { turndown: (html: string) => string };

// Module-level cache so the service is only created once across the page.
let cachedService: TurndownLike | null = null;

const SAMPLE_HTML =
  '<h1>Title</h1><p>Hello <strong>world</strong>, see <a href="https://example.com">this link</a>.</p><ul><li>one</li><li>two</li></ul>';

async function getService(): Promise<TurndownLike> {
  if (cachedService) return cachedService;

  // Dynamic import: keeps Turndown out of the SSR bundle and off the initial
  // render. It needs a DOM, so it must only ever run in the browser.
  const { default: TurndownService } = await import('turndown');
  const service: TurndownLike = new (TurndownService as any)({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  });

  // Optionally enable GitHub-flavored tables/strikethrough, only if the
  // plugin happens to be installed. Never assume it is; swallow any failure.
  try {
    const gfm: any = await import('turndown-plugin-gfm' as any);
    if (gfm && typeof gfm.gfm === 'function') {
      (service as any).use(gfm.gfm);
    }
  } catch {
    // turndown-plugin-gfm not available, plain Turndown is fine.
  }

  cachedService = service;
  return service;
}

export default function HtmlToMarkdownTool() {
  const [html, setHtml] = useState<string>(SAMPLE_HTML);
  const [markdown, setMarkdown] = useState<string>('');
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  async function convert() {
    setBusy(true);
    setError('');
    setCopied(false);
    try {
      const service = await getService();
      const md = service.turndown(html);
      setMarkdown(md);
    } catch {
      setError('Couldn’t convert this HTML.');
    } finally {
      setBusy(false);
    }
  }

  function loadFile(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setHtml(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.onerror = () => setError('Couldn’t read that file.');
    reader.readAsText(file);
    // Allow re-selecting the same file later.
    input.value = '';
  }

  async function copyOutput() {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError('Couldn’t copy to clipboard.');
    }
  }

  function downloadOutput() {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="space-y-4">
        <div>
          <div class="mb-1 flex flex-wrap items-center justify-between gap-2">
            <label
              for="html-input"
              class="text-sm font-medium text-slate-700"
            >
              HTML input
            </label>
            <label class="cursor-pointer text-xs font-medium text-brand-700 hover:text-brand-800">
              Load .html file
              <input
                type="file"
                accept=".html,.htm,text/html"
                class="hidden"
                onChange={loadFile}
              />
            </label>
          </div>
          <textarea
            id="html-input"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs"
            rows={8}
            spellcheck={false}
            value={html}
            onInput={(e) => setHtml((e.currentTarget as HTMLTextAreaElement).value)}
          />
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            class="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
            onClick={convert}
            disabled={busy}
          >
            {busy ? 'Converting…' : 'Convert to Markdown'}
          </button>
          {error ? <span class="text-sm text-red-600">{error}</span> : null}
        </div>

        <div>
          <div class="mb-1 flex flex-wrap items-center justify-between gap-2">
            <label
              for="md-output"
              class="text-sm font-medium text-slate-700"
            >
              Markdown output
            </label>
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="text-xs font-medium text-brand-700 hover:text-brand-800 disabled:opacity-50"
                onClick={copyOutput}
                disabled={!markdown}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                type="button"
                class="text-xs font-medium text-brand-700 hover:text-brand-800 disabled:opacity-50"
                onClick={downloadOutput}
                disabled={!markdown}
              >
                Download output.md
              </button>
            </div>
          </div>
          <textarea
            id="md-output"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs"
            rows={8}
            readOnly
            spellcheck={false}
            value={markdown}
            placeholder="Your Markdown will appear here…"
          />
        </div>

        <p class="text-xs text-slate-500">
          Everything runs locally in your browser, nothing is uploaded. This is
          the inverse of the{' '}
          <a
            href="/file/markdown-to-html/"
            class="text-brand-700 underline hover:text-brand-800"
          >
            Markdown-to-HTML converter
          </a>
          .
        </p>
      </div>
    </div>
  );
}
