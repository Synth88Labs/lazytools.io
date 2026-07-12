import { useMemo, useState } from 'preact/hooks';
import { refractometerFg, abvSimple } from '../../lib/brewing';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (n: number, d = 3) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export default function RefractometerTool() {
  const [ob, setOb] = useState('12');
  const [fb, setFb] = useState('7');
  const [wcf, setWcf] = useState('1.04');

  const r = useMemo(() => {
    const o = num(ob), f = num(fb), w = num(wcf);
    if (o == null || f == null || w == null || w <= 0) return null;
    const fg = refractometerFg(o, f, w);
    if (fg == null) return null;
    // OG from corrected original Brix via standard cubic-ish (Brix→SG)
    const oCorr = o / w;
    const og = oCorr / (258.6 - (oCorr / 258.2) * 227.1) + 1;
    const abv = abvSimple(og, fg);
    return { fg, og, abv };
  }, [ob, fb, wcf]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Original Brix (before ferment)</span>
          <input type="number" step="0.1" value={ob} onInput={(e) => setOb((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Final Brix reading (now)</span>
          <input type="number" step="0.1" value={fb} onInput={(e) => setFb((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Wort correction factor</span>
          <input type="number" step="0.01" value={wcf} onInput={(e) => setWcf((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Corrected final gravity</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.fg)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Original gravity</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.og)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated ABV</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.abv != null ? `${r.abv.toFixed(1)}%` : '—'}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the original Brix, the current Brix reading and your refractometer's correction factor.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Alcohol bends light differently from sugar, so once fermentation starts a refractometer reads final gravity too high — you can't just convert the Brix. This applies the Wort Correction Factor (WCF, typically ~1.04, calibrate yours against a hydrometer) and Sean Terrill's cubic to estimate the true final gravity from the original and current Brix. It's an estimate; confirm important readings with a hydrometer. 🔒 In your browser.</p>
    </div>
  );
}
