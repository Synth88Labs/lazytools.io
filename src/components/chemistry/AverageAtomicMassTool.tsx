import { useMemo, useState } from 'preact/hooks';

interface Row { mass: string; abund: string }
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };

export default function AverageAtomicMassTool() {
  const [rows, setRows] = useState<Row[]>([{ mass: '34.969', abund: '75.77' }, { mass: '36.966', abund: '24.23' }]);

  const update = (i: number, patch: Partial<Row>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const r = useMemo(() => {
    const iso = rows.map((x) => ({ mass: num(x.mass), abund: num(x.abund) })).filter((x) => x.mass != null && x.abund != null) as { mass: number; abund: number }[];
    if (iso.length === 0) return null;
    const totalAbund = iso.reduce((a, b) => a + b.abund, 0);
    const avg = iso.reduce((a, b) => a + b.mass * (b.abund / 100), 0);
    return { avg, totalAbund, count: iso.length };
  }, [rows]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Isotopes — mass (u) and natural abundance (%)</p>
      <div class="space-y-2">
        {rows.map((row, i) => (
          <div class="flex items-center gap-2">
            <span class="w-6 shrink-0 text-center font-mono text-xs text-slate-400">{i + 1}</span>
            <input type="number" step="any" value={row.mass} placeholder="mass (u)" onInput={(e) => update(i, { mass: (e.target as HTMLInputElement).value })}
              class="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
            <input type="number" step="any" value={row.abund} placeholder="abundance %" onInput={(e) => update(i, { abund: (e.target as HTMLInputElement).value })}
              class="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
            <button onClick={() => setRows(rows.filter((_, j) => j !== i))} class="shrink-0 rounded-lg px-2.5 py-2 text-sm text-slate-400 ring-1 ring-slate-200 hover:text-red-600 hover:ring-red-300" aria-label="Remove">✕</button>
          </div>
        ))}
      </div>
      <button onClick={() => setRows([...rows, { mass: '', abund: '' }])} class="mt-2 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50">+ Add isotope</button>

      {r ? (
        <>
          <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Average atomic mass</p>
            <p class="mt-1 text-3xl font-extrabold text-brand-800">{r.avg.toFixed(4)} <span class="text-lg font-bold text-slate-500">u</span></p>
          </div>
          {Math.abs(r.totalAbund - 100) > 0.5 && (
            <p class="mt-2 text-center text-xs font-semibold text-amber-700">⚠ Abundances sum to {r.totalAbund.toFixed(2)}% — they should total 100% for a correct weighted average.</p>
          )}
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter each isotope’s mass and its percent abundance.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Average atomic mass = Σ (isotope mass × fractional abundance). 🔒 Computed in your browser.</p>
    </div>
  );
}
