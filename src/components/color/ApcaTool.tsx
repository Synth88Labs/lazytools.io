import { useMemo, useState } from 'preact/hooks';
import { parseColor, rgbToHex, contrastRatio } from '../../lib/color-compute';
import { apcaContrast, apcaMinFont } from '../../lib/color-advanced';

export default function ApcaTool() {
  const [txtRaw, setTxt] = useState('#5b6b7f');
  const [bgRaw, setBg] = useState('#ffffff');

  const txt = useMemo(() => parseColor(txtRaw), [txtRaw]);
  const bg = useMemo(() => parseColor(bgRaw), [bgRaw]);

  const r = useMemo(() => {
    if (!txt || !bg) return null;
    const lc = apcaContrast(txt, bg);
    const wcag = contrastRatio(txt, bg);
    return { lc, abs: Math.abs(lc), wcag, normal: apcaMinFont(lc, 400), bold: apcaMinFont(lc, 700) };
  }, [txt, bg]);

  const inp = (val: string, set: (v: string) => void, label: string, swatch?: ReturnType<typeof parseColor>) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <div class="flex items-center gap-2">
        <span class="h-9 w-9 shrink-0 rounded-lg ring-1 ring-slate-300" style={swatch ? `background:${rgbToHex(swatch)}` : 'background:#eee'} />
        <input value={val} spellcheck={false} onInput={(e) => set((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
      </div>
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        {inp(txtRaw, setTxt, 'Text color', txt)}
        {inp(bgRaw, setBg, 'Background color', bg)}
      </div>

      {r ? (
        <>
          <div class="mt-4 rounded-xl p-5 text-center ring-2 ring-brand-200" style={txt && bg ? `background:${rgbToHex(bg)}` : ''}>
            <p class="text-lg font-bold" style={txt && bg ? `color:${rgbToHex(txt)}` : ''}>The quick brown fox jumps</p>
            <p class="text-sm" style={txt && bg ? `color:${rgbToHex(txt)}` : ''}>over the lazy dog — 16px body sample</p>
          </div>

          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">APCA lightness contrast</p>
              <p class="mt-1 text-3xl font-extrabold text-brand-800">Lc {r.lc.toFixed(1)}</p>
              <p class="mt-1 text-xs text-slate-400">{r.lc >= 0 ? 'dark text on light bg' : 'light text on dark bg'}</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">WCAG 2 ratio (for comparison)</p>
              <p class="mt-1 text-3xl font-extrabold text-slate-700">{r.wcag.toFixed(2)}:1</p>
              <p class="mt-1 text-xs text-slate-400">{r.wcag >= 4.5 ? 'AA normal ✓' : r.wcag >= 3 ? 'AA large only' : 'fails AA'}</p>
            </div>
          </div>

          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <div class="rounded-lg bg-white p-3 ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Min size — regular (400)</p>
              <p class="mt-0.5 font-semibold text-slate-800">{r.normal}</p>
            </div>
            <div class="rounded-lg bg-white p-3 ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Min size — bold (700)</p>
              <p class="mt-0.5 font-semibold text-slate-800">{r.bold}</p>
            </div>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a valid text and background color (HEX, RGB or HSL).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        APCA-W3 <strong>version 0.1.9</strong> (the version referenced by the WCAG 3 working draft). Lc is polarity-aware and maps to a minimum font size. 🔒 Computed in your browser.
      </p>
    </div>
  );
}
