import { useEffect, useRef, useState } from 'preact/hooks';
import QRCode from 'qrcode';

type Mode = 'email' | 'sms' | 'phone' | 'geo';
const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const tabCls = (a: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${a ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700'}`;

export default function MessageQrTool() {
  const [mode, setMode] = useState<Mode>('email');
  const [email, setEmail] = useState({ to: 'hello@example.com', subject: '', body: '' });
  const [sms, setSms] = useState({ number: '', message: '' });
  const [phone, setPhone] = useState('');
  const [geo, setGeo] = useState({ lat: '48.8584', lon: '2.2945' });
  const [size, setSize] = useState(320);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const payload = (() => {
    if (mode === 'email') {
      const q = [email.subject && `subject=${encodeURIComponent(email.subject)}`, email.body && `body=${encodeURIComponent(email.body)}`].filter(Boolean).join('&');
      return `mailto:${email.to}${q ? '?' + q : ''}`;
    }
    if (mode === 'sms') return `SMSTO:${sms.number}:${sms.message}`;
    if (mode === 'phone') return `tel:${phone}`;
    return `geo:${geo.lat},${geo.lon}`;
  })();

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, payload || ' ', { width: size, margin: 2, errorCorrectionLevel: 'M', color: { dark: '#153056', light: '#ffffff' } })
      .then(() => setError('')).catch((e) => setError((e as Error).message));
  }, [payload, size]);

  function download() { const url = canvasRef.current?.toDataURL('image/png'); if (!url) return; const a = document.createElement('a'); a.href = url; a.download = `${mode}-qr.png`; a.click(); }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap gap-2">
        {(['email', 'sms', 'phone', 'geo'] as Mode[]).map((m) => <button type="button" class={tabCls(mode === m)} onClick={() => setMode(m)}>{m === 'geo' ? 'Location' : m === 'sms' ? 'SMS' : m[0].toUpperCase() + m.slice(1)}</button>)}
      </div>
      <div class="mt-4 grid gap-4 lg:grid-cols-2">
        <div class="space-y-3">
          {mode === 'email' && (<>
            <div><label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">To</label><input class={inputCls} value={email.to} onInput={(e) => setEmail({ ...email, to: (e.target as HTMLInputElement).value })} /></div>
            <div><label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Subject</label><input class={inputCls} value={email.subject} onInput={(e) => setEmail({ ...email, subject: (e.target as HTMLInputElement).value })} /></div>
            <div><label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Body</label><textarea rows={3} class={inputCls} value={email.body} onInput={(e) => setEmail({ ...email, body: (e.target as HTMLTextAreaElement).value })} /></div>
          </>)}
          {mode === 'sms' && (<>
            <div><label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Phone number</label><input class={inputCls} value={sms.number} placeholder="+1 555 123 4567" onInput={(e) => setSms({ ...sms, number: (e.target as HTMLInputElement).value })} /></div>
            <div><label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Message</label><textarea rows={3} class={inputCls} value={sms.message} onInput={(e) => setSms({ ...sms, message: (e.target as HTMLTextAreaElement).value })} /></div>
          </>)}
          {mode === 'phone' && (
            <div><label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Phone number</label><input class={inputCls} value={phone} placeholder="+1 555 123 4567" onInput={(e) => setPhone((e.target as HTMLInputElement).value)} /></div>
          )}
          {mode === 'geo' && (
            <div class="grid grid-cols-2 gap-3">
              <div><label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Latitude</label><input class={`${inputCls} font-mono`} value={geo.lat} onInput={(e) => setGeo({ ...geo, lat: (e.target as HTMLInputElement).value })} /></div>
              <div><label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Longitude</label><input class={`${inputCls} font-mono`} value={geo.lon} onInput={(e) => setGeo({ ...geo, lon: (e.target as HTMLInputElement).value })} /></div>
            </div>
          )}
          <div><label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Size: {size}px</label><input type="range" min={128} max={1024} step={32} value={size} onInput={(e) => setSize(parseInt((e.target as HTMLInputElement).value))} class="w-full accent-brand-600" /></div>
        </div>
        <div class="flex flex-col items-center rounded-xl border border-brand-100 bg-white p-4">
          <canvas ref={canvasRef} width={size} height={size} class="max-w-full rounded-lg" aria-label="QR code" />
          {error && <p class="mt-2 text-sm text-red-700">✗ {error}</p>}
          <button type="button" onClick={download} class="mt-3 rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800">⬇ Download PNG</button>
        </div>
      </div>
      <p class="mt-3 text-xs text-slate-500">Encodes a <span class="font-mono">mailto:</span>, <span class="font-mono">SMSTO:</span>, <span class="font-mono">tel:</span> or <span class="font-mono">geo:</span> action directly — scanning opens the pre-filled email, text, dialler or map. No tracking redirect. 🔒 Generated in your browser.</p>
    </div>
  );
}
