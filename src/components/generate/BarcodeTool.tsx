import { useEffect, useRef, useState } from 'preact/hooks';
import JsBarcode from 'jsbarcode';

const FORMATS = [
  { value: 'CODE128', label: 'Code 128 (any text)', ph: 'LAZYTOOLS-123' },
  { value: 'EAN13', label: 'EAN-13 (retail, 12–13 digits)', ph: '400638133393' },
  { value: 'UPC', label: 'UPC-A (US retail, 11–12 digits)', ph: '03600029145' },
  { value: 'EAN8', label: 'EAN-8 (7–8 digits)', ph: '9638507' },
  { value: 'CODE39', label: 'Code 39 (alphanumeric)', ph: 'ABC-123' },
  { value: 'ITF14', label: 'ITF-14 (shipping, 13–14 digits)', ph: '1540014128876' },
];
const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function BarcodeTool() {
  const [format, setFormat] = useState('CODE128');
  const [value, setValue] = useState('LAZYTOOLS-123');
  const [error, setError] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    try {
      JsBarcode(svgRef.current, value || ' ', { format, displayValue: true, lineColor: '#153056', width: 2, height: 90, margin: 10, font: 'monospace', fontSize: 16 });
      setError('');
    } catch (e) {
      setError((e as Error).message || 'Invalid value for this barcode type.');
    }
  }, [format, value]);

  function download(kind: 'svg' | 'png') {
    const svg = svgRef.current; if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    if (kind === 'svg') {
      const blob = new Blob([xml], { type: 'image/svg+xml' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `barcode-${format}.svg`; a.click();
      return;
    }
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = img.width * 2; c.height = img.height * 2;
      const ctx = c.getContext('2d')!; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
      const a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = `barcode-${format}.png`; a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(xml)));
  }

  const active = FORMATS.find((f) => f.value === format)!;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <div><label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Barcode type</label>
          <select class={inputCls} value={format} onChange={(e) => setFormat((e.target as HTMLSelectElement).value)}>
            {FORMATS.map((f) => <option value={f.value}>{f.label}</option>)}
          </select>
        </div>
        <div><label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Value</label>
          <input class={`${inputCls} font-mono`} value={value} placeholder={active.ph} onInput={(e) => setValue((e.target as HTMLInputElement).value)} />
        </div>
      </div>

      <div class="mt-4 flex flex-col items-center rounded-xl border border-brand-100 bg-white p-4">
        <svg ref={svgRef} class={error ? 'hidden' : 'max-w-full'} aria-label="Generated barcode" />
        {error ? <p class="py-6 text-sm font-medium text-red-700">✗ {error}</p> : (
          <div class="mt-3 flex gap-2">
            <button type="button" onClick={() => download('svg')} class="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800">⬇ SVG</button>
            <button type="button" onClick={() => download('png')} class="rounded-lg border border-brand-300 bg-white px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50">⬇ PNG</button>
          </div>
        )}
      </div>
      <p class="mt-3 text-xs text-slate-500">EAN, UPC, EAN-8 and ITF-14 include the correct <strong>mod-10 check digit</strong> automatically — enter one digit short and it's computed for you. Vector SVG export is print-crisp. 🔒 Generated in your browser; internal SKUs never leave your device.</p>
    </div>
  );
}
