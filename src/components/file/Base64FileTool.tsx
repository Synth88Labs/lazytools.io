import { useState } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';

interface Props {
  mode: 'file-to-base64' | 'base64-to-file';
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** ArrayBuffer → standard base64 (chunked to avoid call-stack limits on big files). */
function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CHUNK)) as unknown as number[]);
  }
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

export default function Base64FileTool({ mode }: Props) {
  // ---- file → base64 ----
  const [file, setFile] = useState<File | null>(null);
  const [b64, setB64] = useState('');
  const [dataUri, setDataUri] = useState('');
  const [asDataUri, setAsDataUri] = useState(true);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  // ---- base64 → file ----
  const [input, setInput] = useState('');
  const [fileName, setFileName] = useState('decoded-file');
  const [error, setError] = useState('');

  const encode = async (f: File | null) => {
    setFile(f); setB64(''); setDataUri(''); setCopied(false);
    if (!f) return;
    setBusy(true);
    try {
      const bytes = new Uint8Array(await f.arrayBuffer());
      const raw = bytesToBase64(bytes);
      setB64(raw);
      setDataUri(`data:${f.type || 'application/octet-stream'};base64,${raw}`);
    } finally {
      setBusy(false);
    }
  };

  const copy = () => {
    const text = asDataUri ? dataUri : b64;
    if (text) navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  };

  const decode = () => {
    setError('');
    let raw = input.trim();
    let mime = 'application/octet-stream';
    const m = raw.match(/^data:([^;,]*)(;base64)?,/i);
    if (m) {
      if (m[1]) mime = m[1];
      raw = raw.slice(m[0].length);
      if (!m[2]) { setError('This looks like a non-base64 data URI (e.g. URL-encoded). Only base64 data URIs are supported.'); return; }
    }
    raw = raw.replace(/\s+/g, '');
    try {
      const bytes = base64ToBytes(raw);
      download(new Blob([bytes], { type: mime }), fileName || 'decoded-file');
    } catch {
      setError('That is not valid Base64. Check for missing characters or stray text.');
    }
  };

  if (mode === 'file-to-base64') {
    const out = asDataUri ? dataUri : b64;
    return (
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
        <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-8 text-center hover:border-brand-400">
          <input type="file" class="hidden" onChange={(e) => encode((e.target as HTMLInputElement).files?.[0] ?? null)} />
          <span class="text-sm font-semibold text-slate-700">{file ? `📄 ${file.name}` : '📄 Choose any file'}</span>
          <span class="mt-1 block text-xs text-slate-500">{file ? `${file.type || 'unknown type'} · ${fmtSize(file.size)}` : 'images, PDFs, fonts, anything, nothing is uploaded'}</span>
        </label>

        <label class="mt-3 flex items-center gap-1.5 text-sm text-slate-600">
          <input type="checkbox" checked={asDataUri} onChange={(e) => setAsDataUri((e.target as HTMLInputElement).checked)} /> As data URI (data:…;base64,…, paste straight into CSS/HTML)
        </label>

        {busy && <p class="mt-4 text-sm text-slate-500">Encoding…</p>}

        {out && !busy && (
          <div class="mt-4">
            <div class="mb-2 flex items-center justify-between">
              <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Base64 output · {fmtSize(out.length)} of text</span>
              <button onClick={copy} class="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-800">{copied ? '✓ Copied' : 'Copy'}</button>
            </div>
            <textarea readonly class="h-48 w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-800 break-all" value={out} />
          </div>
        )}

        <p class="mt-4 text-xs text-slate-500">
          Base64 turns any file’s bytes into text so it can be embedded in JSON, HTML, CSS or a data URI. Output is about 33% larger than the file. 🔒 Encoding runs entirely in your browser, the file is never uploaded.
        </p>
      </div>
    );
  }

  // base64 → file
  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Base64 or data URI</span>
        <textarea class="h-40 w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 break-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)} placeholder="iVBORw0KGgo…  or  data:image/png;base64,iVBORw0KGgo…" />
      </label>

      <label class="mt-3 block sm:inline-block">
        <span class="mb-1 block text-xs font-semibold text-slate-600">Download as file name</span>
        <input class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 sm:w-72 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" value={fileName} onInput={(e) => setFileName((e.target as HTMLInputElement).value)} placeholder="decoded-file" />
      </label>

      <div class="mt-4">
        <button onClick={decode} disabled={!input.trim()} class="rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50">Decode &amp; download</button>
      </div>

      {error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{error}</p>}

      <p class="mt-4 text-xs text-slate-500">
        Paste raw Base64 or a full <code>data:</code> URI and get the original file back. If you paste a data URI, its MIME type is detected automatically; otherwise pick a file name with the right extension. 🔒 Decoding runs entirely in your browser, nothing is uploaded.
      </p>
    </div>
  );
}
