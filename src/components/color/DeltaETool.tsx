import { useMemo, useState } from 'preact/hooks';
import { parseColor, rgbToHex } from '../../lib/color-compute';
import { rgbToLab, deltaE2000, deltaE76 } from '../../lib/color-advanced';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

function interpret(de: number) {
  if (de < 1) return { label: 'Not perceptible — below the just-noticeable difference', color: 'text-emerald-700' };
  if (de < 2) return { label: 'Perceptible on close inspection', color: 'text-emerald-700' };
  if (de < 10) return { label: 'Perceptible at a glance', color: 'text-amber-700' };
  if (de < 50) return { label: 'Clearly different colours', color: 'text-rose-700' };
  return { label: 'Opposite / very different colours', color: 'text-rose-700' };
}

export default function DeltaETool() {
  const [c1, setC1] = useState('#1d87f1');
  const [c2, setC2] = useState('#2a90e8');

  const res = useMemo(() => {
    const a = parseColor(c1), b = parseColor(c2);
    if (!a || !b) return null;
    const la = rgbToLab(a), lb = rgbToLab(b);
    return { hexA: rgbToHex(a), hexB: rgbToHex(b), de2000: deltaE2000(la, lb), de76: deltaE76(la, lb) };
  }, [c1, c2]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Color 1</span><input value={c1} onInput={(e) => setC1((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Color 2</span><input value={c2} onInput={(e) => setC2((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res ? (
        <>
          <div class="mt-4 flex h-16 overflow-hidden rounded-xl ring-1 ring-slate-200"><div class="flex-1" style={`background:${res.hexA}`}></div><div class="flex-1" style={`background:${res.hexB}`}></div></div>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">ΔE (CIEDE2000)</p><p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{res.de2000.toFixed(2)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">ΔE (CIE76)</p><p class="mt-1 font-mono text-3xl font-extrabold text-slate-800">{res.de76.toFixed(2)}</p></div>
          </div>
          <p class={`mt-2 text-center text-sm font-semibold ${interpret(res.de2000).color}`}>{interpret(res.de2000).label}</p>
        </>
      ) : <p class="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 ring-1 ring-amber-200">Enter two valid colours (HEX, rgb() or names).</p>}

      <p class="mt-4 text-xs text-slate-500">Delta-E (ΔE) measures how different two colours look, in CIELAB space. A ΔE of about 1 is the "just-noticeable difference" — below it, most people can\'t tell the colours apart; around 2–3 is a close match; large values are clearly different. CIEDE2000 is the modern, perceptually-accurate formula; the older CIE76 is a simple Euclidean distance shown for comparison. Used in print, QA and brand-colour matching. 🔒 In your browser.</p>
    </div>
  );
}
