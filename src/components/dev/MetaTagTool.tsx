import { useState } from 'preact/hooks';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function Field({ label, value, onInput, placeholder, area }: { label: string; value: string; onInput: (v: string) => void; placeholder?: string; area?: boolean }) {
  return (
    <label class="block">
      <span class="text-sm font-medium text-slate-600">{label}</span>
      {area ? (
        <textarea value={value} rows={2} placeholder={placeholder} onInput={(e) => onInput((e.target as HTMLTextAreaElement).value)} class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200" />
      ) : (
        <input type="text" value={value} placeholder={placeholder} onInput={(e) => onInput((e.target as HTMLInputElement).value)} class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200" />
      )}
    </label>
  );
}

export default function MetaTagTool() {
  const [title, setTitle] = useState('LazyTools — Free Online Tools That Never Upload Your Data');
  const [desc, setDesc] = useState('Free, privacy-first online tools that run entirely in your browser. No sign-up, no uploads.');
  const [url, setUrl] = useState('https://example.com/');
  const [site, setSite] = useState('Example');
  const [image, setImage] = useState('https://example.com/og-image.png');
  const [card, setCard] = useState('summary_large_image');
  const [handle, setHandle] = useState('@example');
  const [copied, setCopied] = useState(false);

  const lines = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    url && `<link rel="canonical" href="${esc(url)}">`,
    '',
    '<!-- Open Graph / Facebook -->',
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    url && `<meta property="og:url" content="${esc(url)}">`,
    image && `<meta property="og:image" content="${esc(image)}">`,
    site && `<meta property="og:site_name" content="${esc(site)}">`,
    '',
    '<!-- Twitter / X -->',
    `<meta name="twitter:card" content="${card}">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(desc)}">`,
    image && `<meta name="twitter:image" content="${esc(image)}">`,
    handle && `<meta name="twitter:site" content="${esc(handle)}">`,
  ].filter((l) => l !== false && l !== undefined).join('\n');

  const copy = async () => {
    try { await navigator.clipboard.writeText(lines); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch {}
  };

  const host = (() => { try { return new URL(url).hostname; } catch { return url; } })();
  const titleT = title.length > 60 ? title.slice(0, 60) + '…' : title;
  const descT = desc.length > 160 ? desc.slice(0, 160) + '…' : desc;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="space-y-3">
          <Field label="Page title" value={title} onInput={setTitle} />
          <Field label="Meta description" value={desc} onInput={setDesc} area />
          <Field label="Page URL" value={url} onInput={setUrl} placeholder="https://…" />
          <Field label="Site name" value={site} onInput={setSite} />
          <Field label="Image URL (1200×630)" value={image} onInput={setImage} placeholder="https://…/og.png" />
          <Field label="Twitter handle" value={handle} onInput={setHandle} placeholder="@you" />
          <label class="block">
            <span class="text-sm font-medium text-slate-600">Twitter card type</span>
            <select value={card} onChange={(e) => setCard((e.target as HTMLSelectElement).value)} class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900">
              <option value="summary_large_image">summary_large_image</option>
              <option value="summary">summary</option>
            </select>
          </label>
        </div>

        <div class="space-y-4">
          <div>
            <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Google result preview</p>
            <div class="rounded-lg border border-slate-200 bg-white p-3">
              <p class="truncate text-xs text-slate-600">{host}</p>
              <p class="truncate text-lg text-[#1a0dab]">{titleT || 'Page title'}</p>
              <p class="text-sm leading-snug text-slate-600">{descT || 'Your meta description shows here.'}</p>
            </div>
          </div>
          <div>
            <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Social card preview</p>
            <div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div class="flex aspect-[1200/630] items-center justify-center bg-slate-100 text-xs text-slate-400" style={image ? `background:#e2e8f0 url("${esc(image)}") center/cover` : ''}>{!image && 'og:image'}</div>
              <div class="p-3">
                <p class="truncate text-xs uppercase text-slate-400">{host}</p>
                <p class="truncate text-sm font-semibold text-slate-900">{titleT || 'Page title'}</p>
                <p class="line-clamp-2 text-xs text-slate-600">{descT}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-400">Meta tags</span>
          <button type="button" onClick={copy} class="rounded-lg bg-brand-700 px-3 py-1 text-xs font-semibold text-white transition hover:bg-brand-800">{copied ? '✓ Copied!' : 'Copy'}</button>
        </div>
        <pre class="mt-1 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-100"><code>{lines}</code></pre>
      </div>
    </div>
  );
}
