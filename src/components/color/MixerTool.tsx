import { useMemo, useState } from 'preact/hooks';
import { parseColor, rgbToHex, mix } from '../../lib/color-compute';

export default function MixerTool() {
  const [c1, setC1] = useState('#1d87f1');
  const [c2, setC2] = useState('#f59e0b');
  const [ratio, setRatio] = useState('50');
  const [copied, setCopied] = useState('');

  const data = useMemo(() => {
    const a = parseColor(c1), b = parseColor(c2);
    if (!a || !b) return null;
    const t = Math.min(100, Math.max(0, parseFloat(ratio) || 0)) / 100;
    const result = rgbToHex(mix(a, b, t));
    const scale = Array.from({ length: 11 }, (_, i) => rgbToHex(mix(a, b, i / 10)));
    const rgbOut = mix(a, b, t);
    return { result, scale, rgb: `rgb(${rgbOut.r}, ${rgbOut.g}, ${rgbOut.b})` };
  }, [c1, c2, ratio]);

  async function copy(v: string) {
    try {
      await navigator.clipboard.writeText(v);
      setCopied(v);
      setTimeout(() => setCopied(''), 1200);
    } catch { /* unavailable */ }
  }

  const colorField = (label: string, value: string, set: (v: string) => void) => (
    <div class="flex-1">
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
      <div class="flex flex-wrap gap-4">
        {colorField('Color A', c1, setC1)}
        {colorField('Color B', c2, setC2)}
      </div>
      <div class="mt-4">
        <label for="mx-ratio" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Mix: {100 - (parseFloat(ratio) || 0)}% A · {ratio}% B
        </label>
        <input
          id="mx-ratio"
          type="range"
          min={0}
          max={100}
          value={ratio}
          onInput={(e) => setRatio((e.target as HTMLInputElement).value)}
          class="w-full accent-brand-600"
        />
      </div>

      {data && (
        <div class="mt-5 rounded-xl border border-brand-100 bg-white p-4">
          <div class="flex flex-wrap items-center gap-4">
            <div class="h-24 w-24 shrink-0 rounded-xl border border-slate-200" style={`background:${data.result}`} />
            <div class="space-y-1">
              <button type="button" onClick={() => copy(data.result)} class="block font-mono text-xl font-bold text-slate-900 hover:text-brand-700" title="Copy">
                {copied === data.result ? '✓ copied' : data.result}
              </button>
              <button type="button" onClick={() => copy(data.rgb)} class="block font-mono text-sm text-slate-600 hover:text-brand-700" title="Copy">
                {copied === data.rgb ? '✓ copied' : data.rgb}
              </button>
            </div>
          </div>
          <p class="mt-4 mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Full blend scale A → B (click to copy)</p>
          <div class="flex gap-1">
            {data.scale.map((h) => (
              <button
                type="button"
                onClick={() => copy(h)}
                title={h}
                class="h-10 flex-1 rounded-md border border-slate-200 transition hover:scale-105"
                style={`background:${h}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
