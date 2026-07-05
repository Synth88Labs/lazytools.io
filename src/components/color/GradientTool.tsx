import { useMemo, useState } from 'preact/hooks';
import { parseColor, rgbToHex } from '../../lib/color-compute';

export default function GradientTool() {
  const [c1, setC1] = useState('#1d87f1');
  const [c2, setC2] = useState('#059669');
  const [angle, setAngle] = useState('90');
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [copied, setCopied] = useState(false);

  const css = useMemo(() => {
    const a = parseColor(c1), b = parseColor(c2);
    if (!a || !b) return null;
    const h1 = rgbToHex(a), h2 = rgbToHex(b);
    return type === 'linear'
      ? `background: linear-gradient(${angle}deg, ${h1}, ${h2});`
      : `background: radial-gradient(circle, ${h1}, ${h2});`;
  }, [c1, c2, angle, type]);

  async function copy() {
    if (!css) return;
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* unavailable */ }
  }

  const colorField = (label: string, value: string, set: (v: string) => void) => (
    <div>
      <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      <div class="flex gap-2">
        <input
          type="text"
          value={value}
          onInput={(e) => set((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none"
        />
        <input
          type="color"
          value={parseColor(value) ? rgbToHex(parseColor(value)!) : '#000000'}
          onInput={(e) => set((e.target as HTMLInputElement).value)}
          aria-label={`Pick ${label}`}
          class="h-11 w-12 shrink-0 cursor-pointer rounded-xl border border-slate-300 bg-white p-1"
        />
      </div>
    </div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {colorField('Start color', c1, setC1)}
        {colorField('End color', c2, setC2)}
        <div>
          <label for="gr-type" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Type</label>
          <select id="gr-type" value={type} onChange={(e) => setType((e.target as HTMLSelectElement).value as 'linear' | 'radial')} class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none">
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </div>
        <div>
          <label for="gr-angle" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Angle: {angle}°{type === 'radial' && ' (linear only)'}
          </label>
          <input
            id="gr-angle"
            type="range"
            min={0}
            max={360}
            value={angle}
            disabled={type === 'radial'}
            onInput={(e) => setAngle((e.target as HTMLInputElement).value)}
            class="w-full accent-brand-600"
          />
        </div>
      </div>

      {css && (
        <div class="mt-5 rounded-xl border border-brand-100 bg-white p-4">
          <div class="h-40 w-full rounded-xl border border-slate-200" style={css.replace('background: ', 'background:').replace(';', '')} />
          <div class="mt-3 flex flex-wrap items-center justify-between gap-3">
            <code class="rounded bg-slate-100 px-3 py-2 font-mono text-sm text-slate-800">{css}</code>
            <button type="button" onClick={copy} class="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800">
              {copied ? '✓ Copied' : 'Copy CSS'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
