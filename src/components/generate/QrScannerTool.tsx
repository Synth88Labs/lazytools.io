import { useState } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';

type JsQrFn = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  opts?: { inversionAttempts?: 'dontInvert' | 'onlyInvert' | 'attemptBoth' | 'invertFirst' },
) => { data: string } | null;

const MAX_DIM = 1600;

export default function QrScannerTool() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isUrl = result != null && (result.startsWith('http://') || result.startsWith('https://'));

  async function decodeFile(file: File) {
    setError(null);
    setResult(null);
    setNotFound(false);
    setCopied(false);
    setFileMeta(`${file.name} · ${fmtSize(file.size)}`);
    setScanning(true);

    let objectUrl: string | null = null;
    try {
      objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      const img = await loadImage(objectUrl);

      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (!w || !h) throw new Error('Could not read image dimensions.');

      const scale = Math.min(1, MAX_DIM / Math.max(w, h));
      w = Math.max(1, Math.round(w * scale));
      h = Math.max(1, Math.round(h * scale));

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas is not supported in this browser.');
      ctx.drawImage(img, 0, 0, w, h);

      const imageData = ctx.getImageData(0, 0, w, h);

      const jsQR = (await import('jsqr')).default as unknown as JsQrFn;
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth',
      });

      if (code && code.data) {
        setResult(code.data);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while decoding the image.');
    } finally {
      setScanning(false);
    }
  }

  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('That file could not be loaded as an image.'));
      img.src = src;
    });
  }

  function onFileChange(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files && input.files[0];
    if (file) void decodeFile(file);
  }

  function onPaste(e: ClipboardEvent) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          void decodeFile(file);
        }
        return;
      }
    }
  }

  // Attach a window paste listener (nice-to-have). Runs once per render but the
  // handler is idempotent; use a ref-free guard via a data attribute on window.
  if (typeof window !== 'undefined' && !(window as unknown as { __qrPaste?: boolean }).__qrPaste) {
    (window as unknown as { __qrPaste?: boolean }).__qrPaste = true;
    window.addEventListener('paste', (ev) => onPaste(ev as ClipboardEvent));
  }

  async function copyResult() {
    if (result == null) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError('Could not copy to clipboard.');
    }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label
        class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-8 text-center transition hover:border-brand-500 hover:bg-brand-50"
      >
        <span class="text-sm font-medium text-slate-700">
          Choose a QR image, or paste one (Ctrl/Cmd+V)
        </span>
        <span class="text-xs text-slate-500">PNG, JPG, WebP, GIF — decoded on your device</span>
        <input
          type="file"
          accept="image/*"
          class="hidden"
          onChange={onFileChange}
        />
      </label>

      <p class="mt-3 text-xs text-slate-500">
        100% private: the image never leaves your browser — decoding happens locally.
      </p>

      {fileMeta && (
        <p class="mt-3 text-xs text-slate-600">{fileMeta}</p>
      )}

      {preview && (
        <div class="mt-3">
          <img src={preview} alt="Uploaded QR preview" class="max-h-64 w-auto rounded-xl border" />
        </div>
      )}

      {scanning && (
        <p class="mt-4 text-sm font-medium text-slate-600">Scanning…</p>
      )}

      {error && (
        <p class="mt-4 text-sm font-medium text-red-600">{error}</p>
      )}

      {result != null && !scanning && (
        <div class="mt-4">
          <label class="block text-sm font-medium text-slate-700">Decoded content</label>
          <textarea
            readonly
            rows={4}
            value={result}
            class="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 font-mono text-sm text-slate-800"
            aria-label="Decoded content"
          />
          <div class="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={copyResult}
              class="rounded-lg bg-brand-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-800"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {isUrl && (
            <div class="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                class="break-all text-sm font-medium text-brand-700 underline hover:text-brand-800"
              >
                {result}
              </a>
              <p class="mt-1 text-xs text-amber-700">Only open links you trust.</p>
            </div>
          )}
        </div>
      )}

      {notFound && !scanning && (
        <p class="mt-4 text-sm text-slate-600">
          No QR code detected — try a clearer or more tightly-cropped image.
        </p>
      )}
    </div>
  );
}
