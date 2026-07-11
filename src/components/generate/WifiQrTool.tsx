import { useEffect, useRef, useState } from 'preact/hooks';
import QRCode from 'qrcode';

/** Escape special characters in a WIFI: field per the de-facto standard. */
function esc(s: string): string {
  return s.replace(/([\\;,":])/g, '\\$1');
}

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function WifiQrTool() {
  const [ssid, setSsid] = useState('MyNetwork');
  const [password, setPassword] = useState('');
  const [enc, setEnc] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [hidden, setHidden] = useState(false);
  const [size, setSize] = useState(320);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const payload = enc === 'nopass'
    ? `WIFI:T:nopass;S:${esc(ssid)};${hidden ? 'H:true;' : ''};`
    : `WIFI:T:${enc};S:${esc(ssid)};P:${esc(password)};${hidden ? 'H:true;' : ''};`;

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!ssid.trim()) { canvasRef.current.getContext('2d')?.clearRect(0, 0, size, size); return; }
    QRCode.toCanvas(canvasRef.current, payload, { width: size, margin: 2, errorCorrectionLevel: 'M', color: { dark: '#153056', light: '#ffffff' } })
      .then(() => setError('')).catch((e) => setError((e as Error).message));
  }, [payload, size, ssid]);

  function download() {
    const url = canvasRef.current?.toDataURL('image/png');
    if (!url) return;
    const a = document.createElement('a'); a.href = url; a.download = `wifi-${ssid || 'network'}.png`; a.click();
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 lg:grid-cols-2">
        <div class="space-y-3">
          <div>
            <label for="w-ssid" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Network name (SSID)</label>
            <input id="w-ssid" class={inputCls} value={ssid} onInput={(e) => setSsid((e.target as HTMLInputElement).value)} />
          </div>
          <div>
            <label for="w-enc" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Security</label>
            <select id="w-enc" class={inputCls} value={enc} onChange={(e) => setEnc((e.target as HTMLSelectElement).value as typeof enc)}>
              <option value="WPA">WPA / WPA2 / WPA3</option>
              <option value="WEP">WEP (old)</option>
              <option value="nopass">None (open network)</option>
            </select>
          </div>
          {enc !== 'nopass' && (
            <div>
              <label for="w-pass" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Password</label>
              <input id="w-pass" class={`${inputCls} font-mono`} value={password} onInput={(e) => setPassword((e.target as HTMLInputElement).value)} />
            </div>
          )}
          <label class="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={hidden} onChange={(e) => setHidden((e.target as HTMLInputElement).checked)} class="accent-brand-600" /> Hidden network
          </label>
          <div>
            <label for="w-size" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Size: {size}px</label>
            <input id="w-size" type="range" min={128} max={1024} step={32} value={size} onInput={(e) => setSize(parseInt((e.target as HTMLInputElement).value, 10))} class="w-full accent-brand-600" />
          </div>
        </div>

        <div class="flex flex-col items-center rounded-xl border border-brand-100 bg-white p-4">
          <canvas ref={canvasRef} width={size} height={size} class="max-w-full rounded-lg" aria-label="WiFi QR code" />
          {error && <p class="mt-2 text-sm font-medium text-red-700">✗ {error}</p>}
          <button type="button" onClick={download} disabled={!ssid.trim() || !!error} class="mt-3 rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800 disabled:opacity-40">⬇ Download PNG</button>
        </div>
      </div>
      <p class="mt-3 text-xs text-slate-500">Scanning this code connects a phone to your WiFi automatically — perfect for a guest network or a printed card. The password is encoded directly into the code and <strong>never leaves your browser</strong>; there's no tracking redirect, so it never expires.</p>
    </div>
  );
}
