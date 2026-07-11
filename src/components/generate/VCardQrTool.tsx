import { useEffect, useRef, useState } from 'preact/hooks';
import QRCode from 'qrcode';

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function VCardQrTool() {
  const [f, setF] = useState({ first: 'Jane', last: 'Doe', org: '', title: '', phone: '', email: '', url: '', addr: '' });
  const [size, setSize] = useState(360);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const set = (k: keyof typeof f, v: string) => setF({ ...f, [k]: v });

  const vcard = [
    'BEGIN:VCARD', 'VERSION:3.0',
    `N:${f.last};${f.first};;;`,
    `FN:${[f.first, f.last].filter(Boolean).join(' ')}`,
    f.org && `ORG:${f.org}`,
    f.title && `TITLE:${f.title}`,
    f.phone && `TEL;TYPE=CELL:${f.phone}`,
    f.email && `EMAIL:${f.email}`,
    f.url && `URL:${f.url}`,
    f.addr && `ADR;TYPE=HOME:;;${f.addr};;;;`,
    'END:VCARD',
  ].filter(Boolean).join('\n');

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, vcard, { width: size, margin: 2, errorCorrectionLevel: 'M', color: { dark: '#153056', light: '#ffffff' } })
      .then(() => setError('')).catch((e) => setError((e as Error).message));
  }, [vcard, size]);

  function download() {
    const url = canvasRef.current?.toDataURL('image/png'); if (!url) return;
    const a = document.createElement('a'); a.href = url; a.download = 'vcard-qr.png'; a.click();
  }

  const F = (k: keyof typeof f, label: string, ph = '') => (
    <div><label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      <input class={inputCls} value={f[k]} placeholder={ph} onInput={(e) => set(k, (e.target as HTMLInputElement).value)} /></div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 lg:grid-cols-2">
        <div class="grid grid-cols-2 gap-3">
          {F('first', 'First name')}{F('last', 'Last name')}
          {F('org', 'Organisation')}{F('title', 'Job title')}
          {F('phone', 'Phone', '+1 555 123 4567')}{F('email', 'Email')}
          <div class="col-span-2">{F('url', 'Website')}</div>
          <div class="col-span-2">{F('addr', 'Address')}</div>
          <div class="col-span-2"><label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Size: {size}px</label>
            <input type="range" min={128} max={1024} step={32} value={size} onInput={(e) => setSize(parseInt((e.target as HTMLInputElement).value))} class="w-full accent-brand-600" /></div>
        </div>
        <div class="flex flex-col items-center rounded-xl border border-brand-100 bg-white p-4">
          <canvas ref={canvasRef} width={size} height={size} class="max-w-full rounded-lg" aria-label="vCard QR code" />
          {error && <p class="mt-2 text-sm text-red-700">✗ {error}</p>}
          <button type="button" onClick={download} class="mt-3 rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800">⬇ Download PNG</button>
        </div>
      </div>
      <p class="mt-3 text-xs text-slate-500">Scanning adds you straight to a phone's contacts (vCard 3.0). The details are encoded directly into the code — <strong>never uploaded</strong>, and with no tracking redirect that could expire.</p>
    </div>
  );
}
