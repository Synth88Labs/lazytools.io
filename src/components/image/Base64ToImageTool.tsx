import { useState } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/bmp': 'bmp',
  'image/svg+xml': 'svg',
  'image/x-icon': 'ico',
};

/** Guess an image mime from the first bytes of the (cleaned) base64 payload. */
function sniffMime(clean: string): string {
  // Signature-based sniff on the base64 prefix (cheap, no decode needed).
  if (clean.startsWith('/9j/')) return 'image/jpeg';
  if (clean.startsWith('iVBOR')) return 'image/png';
  if (clean.startsWith('R0lGOD')) return 'image/gif';
  if (clean.startsWith('UklGR')) return 'image/webp';
  // Fall back to decoding a few bytes and checking magic numbers.
  try {
    const head = atob(clean.slice(0, 16));
    const b = (i: number) => head.charCodeAt(i);
    if (b(0) === 0xff && b(1) === 0xd8) return 'image/jpeg';
    if (b(0) === 0x89 && b(1) === 0x50) return 'image/png';
    if (b(0) === 0x47 && b(1) === 0x49 && b(2) === 0x46) return 'image/gif';
    if (b(0) === 0x42 && b(1) === 0x4d) return 'image/bmp';
    if (b(0) === 0x52 && b(1) === 0x49 && b(2) === 0x46 && b(3) === 0x46) return 'image/webp';
  } catch {
    /* ignore — will default below */
  }
  return 'image/png';
}

interface Decoded {
  dataUrl: string;
  mime: string;
  bytes: number;
}

/** Turn arbitrary pasted text (raw base64 or a data: URL) into a usable data URL. */
function normalise(raw: string): Decoded | null {
  let s = raw.trim();
  if (!s) return null;

  let mime = '';
  // Peel off any (possibly duplicated) data: prefix, keeping the last declared mime.
  const dataRe = /^data:([^;,]*)?(;base64)?,/i;
  let m = dataRe.exec(s);
  while (m) {
    if (m[1]) mime = m[1];
    s = s.slice(m[0].length);
    m = dataRe.exec(s);
  }

  // Strip all internal whitespace/newlines from the payload.
  const clean = s.replace(/\s+/g, '');
  if (!clean) return null;
  // Base64 alphabet sanity check (allow url-safe chars too, we normalise below).
  if (!/^[A-Za-z0-9+/_-]+={0,2}$/.test(clean)) return null;
  const b64 = clean.replace(/-/g, '+').replace(/_/g, '/');

  if (!mime || !mime.startsWith('image/')) {
    // No usable image mime declared — sniff from the bytes.
    mime = sniffMime(b64);
  }

  const padding = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0;
  const bytes = Math.max(0, Math.floor((b64.length * 3) / 4) - padding);

  return { dataUrl: `data:${mime};base64,${b64}`, mime, bytes };
}

/** Convert a data: URL to a Blob without any network round-trip. */
function dataUrlToBlob(dataUrl: string, mime: string): Blob {
  const comma = dataUrl.indexOf(',');
  const b64 = dataUrl.slice(comma + 1);
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

export default function Base64ToImageTool() {
  const [text, setText] = useState('');
  const [decoded, setDecoded] = useState<Decoded | null>(null);
  const [failed, setFailed] = useState(false);

  function update(raw: string) {
    setText(raw);
    setFailed(false);
    setDecoded(normalise(raw));
  }

  async function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    const content = await f.text();
    update(content);
  }

  function download() {
    if (!decoded) return;
    const ext = EXT[decoded.mime] ?? 'png';
    const blob = dataUrlToBlob(decoded.dataUrl, decoded.mime);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const ext = decoded ? (EXT[decoded.mime] ?? 'png') : '';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block text-sm font-semibold text-slate-700">Paste Base64 or a data: URL</label>
      <textarea
        value={text}
        onInput={(e) => update((e.target as HTMLTextAreaElement).value)}
        placeholder="iVBORw0KGgoAAAANSUhEUgAA…   or   data:image/png;base64,iVBORw0KGgo…"
        rows={7}
        spellcheck={false}
        aria-label="Base64 or data: URL"
        class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs"
      />

      <div class="mt-3 flex flex-wrap items-center gap-3">
        <label class="cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-400">
          <input type="file" accept=".txt,text/plain" onChange={onFile} class="sr-only" />
          Load a .txt file
        </label>
        {text && (
          <button
            type="button"
            onClick={() => update('')}
            class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-400"
          >
            Clear
          </button>
        )}
      </div>

      {decoded && !failed && (
        <div class="mt-4">
          <img
            src={decoded.dataUrl}
            alt="Decoded preview"
            class="max-h-72 w-auto rounded-xl border border-slate-200 bg-white"
            onError={() => setFailed(true)}
          />
          <div class="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span class="rounded-lg bg-white px-3 py-1.5 font-mono ring-1 ring-slate-200">
              {decoded.mime}
            </span>
            <span class="rounded-lg bg-white px-3 py-1.5 font-mono ring-1 ring-slate-200">
              {fmtSize(decoded.bytes)}
            </span>
            <button
              type="button"
              onClick={download}
              class="rounded-xl bg-brand-700 px-4 py-2 font-semibold text-white transition hover:bg-brand-800"
            >
              Download image.{ext}
            </button>
          </div>
        </div>
      )}

      {(failed || (text.trim() && !decoded)) && (
        <p class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          That doesn&rsquo;t look like valid Base64 image data.
        </p>
      )}

      <p class="mt-4 rounded-lg bg-white px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
        Paste a Base64 string or a full <code class="font-mono">data:image/…</code> URL to preview and download the
        original image. The format is auto-detected from the data. Everything is decoded locally in your browser —
        nothing is ever uploaded. 🔒
      </p>
    </div>
  );
}
