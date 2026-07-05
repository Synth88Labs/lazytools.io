import { useEffect, useRef, useState } from 'preact/hooks';
import QRCode from 'qrcode';

export default function QrTool() {
  const [text, setText] = useState('https://lazytools.io');
  const [size, setSize] = useState(320);
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!text.trim()) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, size, size);
      return;
    }
    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      margin: 2,
      errorCorrectionLevel: level,
      color: { dark: '#153056', light: '#ffffff' },
    })
      .then(() => setError(''))
      .catch((e) => setError((e as Error).message));
  }, [text, size, level]);

  function download() {
    const url = canvasRef.current?.toDataURL('image/png');
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-code.png';
    a.click();
  }

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label for="qr-text" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">URL or text to encode</label>
      <textarea
        id="qr-text"
        rows={3}
        value={text}
        onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
        placeholder="https://example.com — or any text, WiFi string, vCard…"
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        spellcheck={false}
      />

      <div class="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label for="qr-size" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Size: {size}px</label>
          <input id="qr-size" type="range" min={128} max={1024} step={32} value={size} onInput={(e) => setSize(parseInt((e.target as HTMLInputElement).value, 10))} class="w-full accent-brand-600" />
        </div>
        <div>
          <label for="qr-level" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Error correction</label>
          <select id="qr-level" value={level} onChange={(e) => setLevel((e.target as HTMLSelectElement).value as typeof level)} class={inputCls}>
            <option value="L">L — 7% (max capacity)</option>
            <option value="M">M — 15% (default)</option>
            <option value="Q">Q — 25%</option>
            <option value="H">H — 30% (print / logo overlay)</option>
          </select>
        </div>
      </div>

      <div class="mt-4 flex flex-col items-center rounded-xl border border-brand-100 bg-white p-4">
        <canvas ref={canvasRef} width={size} height={size} class="max-w-full rounded-lg" aria-label="Generated QR code" />
        {error && <p class="mt-2 text-sm font-medium text-red-700">✗ {error}</p>}
        <button type="button" onClick={download} disabled={!text.trim() || !!error} class="mt-3 rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800 disabled:opacity-40">
          ⬇ Download PNG
        </button>
        <p class="mt-2 text-xs text-slate-500">Encodes your content directly — no tracking redirect, so the code never expires.</p>
      </div>
    </div>
  );
}
