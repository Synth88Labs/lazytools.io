import { useMemo, useState } from 'preact/hooks';
import { ibuTinseth, tinsethUtilization, type HopAddition } from '../../lib/brewing';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (n: number, d = 1) => n.toLocaleString('en-US', { maximumFractionDigits: d });

let idSeed = 0;
interface Row extends HopAddition { id: number; }

export default function IbuTool() {
  const [gravity, setGravity] = useState('1.050');
  const [volume, setVolume] = useState('20');
  const [rows, setRows] = useState<Row[]>([
    { id: idSeed++, grams: 28, alphaPct: 10, boilMinutes: 60 },
    { id: idSeed++, grams: 28, alphaPct: 5, boilMinutes: 15 },
  ]);

  const r = useMemo(() => {
    const g = num(gravity), v = num(volume);
    if (g == null || v == null) return null;
    const total = ibuTinseth(rows, g, v);
    const perRow = rows.map((row) => tinsethUtilization(g, row.boilMinutes) * ((row.grams * (row.alphaPct / 100) * 1000) / v));
    return total != null ? { total, perRow } : null;
  }, [gravity, volume, rows]);

  const update = (id: number, patch: Partial<Row>) => setRows((rs) => rs.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const remove = (id: number) => setRows((rs) => rs.filter((x) => x.id !== id));
  const add = () => setRows((rs) => [...rs, { id: idSeed++, grams: 20, alphaPct: 6, boilMinutes: 10 }]);

  const inp = 'w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const top = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Boil gravity (avg SG)</span>
          <input type="number" step="0.001" value={gravity} onInput={(e) => setGravity((e.target as HTMLInputElement).value)} class={top} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Batch volume (L)</span>
          <input type="number" step="any" value={volume} onInput={(e) => setVolume((e.target as HTMLInputElement).value)} class={top} /></label>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[520px] text-sm">
          <thead>
            <tr class="text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <th class="pb-2 pr-2 w-28">Hops (g)</th><th class="pb-2 px-2 w-28">Alpha acid %</th><th class="pb-2 px-2 w-28">Boil (min)</th><th class="pb-2 px-2 w-20 text-right">IBU</th><th class="pb-2 pl-2 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} class="border-t border-slate-200">
                <td class="py-1.5 pr-2"><input type="number" step="any" value={row.grams} onInput={(e) => update(row.id, { grams: parseFloat((e.target as HTMLInputElement).value) || 0 })} class={inp} /></td>
                <td class="py-1.5 px-2"><input type="number" step="any" value={row.alphaPct} onInput={(e) => update(row.id, { alphaPct: parseFloat((e.target as HTMLInputElement).value) || 0 })} class={inp} /></td>
                <td class="py-1.5 px-2"><input type="number" step="any" value={row.boilMinutes} onInput={(e) => update(row.id, { boilMinutes: parseFloat((e.target as HTMLInputElement).value) || 0 })} class={inp} /></td>
                <td class="py-1.5 px-2 text-right font-mono font-semibold text-slate-700">{r ? fmt(r.perRow[i]) : '—'}</td>
                <td class="py-1.5 pl-2 text-center"><button onClick={() => remove(row.id)} class="text-slate-400 hover:text-rose-600" aria-label="Remove">✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={add} class="mt-3 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700">+ Add hop addition</button>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total bitterness</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.total)} IBU</p></div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your boil gravity and volume.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Uses Glenn Tinseth's utilization model: bitterness rises with boil time and falls as wort gravity increases (sugar suppresses hop utilization). Enter each hop addition's weight, alpha-acid percentage (from the packet) and boil time. Late/whirlpool/dry hops (0 min) add little measured IBU. Values are an estimate; actual bitterness varies with hop form, boil vigour and equipment. 🔒 In your browser.</p>
    </div>
  );
}
