import { useMemo, useState } from 'preact/hooks';
import { compressionRatio } from '../../lib/automotive';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

export default function CompressionTool() {
  const [swept, setSwept] = useState('500');
  const [clearance, setClearance] = useState('50');

  const r = useMemo(() => {
    const s = num(swept), c = num(clearance);
    if (s == null || c == null) return null;
    return compressionRatio(s, c);
  }, [swept, clearance]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Swept volume per cylinder (cc)</span>
          <input type="number" step="any" value={swept} onInput={(e) => setSwept((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Clearance (combustion chamber) volume (cc)</span>
          <input type="number" step="any" value={clearance} onInput={(e) => setClearance((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r != null ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Compression ratio</p>
          <p class="mt-1 text-4xl font-extrabold text-brand-800">{fmt(r)}:1</p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the swept and clearance volumes.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Compression ratio = (swept volume + clearance volume) ÷ clearance volume. The clearance volume is the total space above the piston at top dead centre — combustion chamber, head gasket, deck and piston-dish volumes combined. Higher ratios extract more power but need higher-octane fuel. 🔒 In your browser.</p>
    </div>
  );
}
