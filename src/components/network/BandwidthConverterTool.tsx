import { useMemo, useState } from 'preact/hooks';
import { toBitsPerSecond, fromBitsPerSecond } from '../../lib/network';

const UNITS = ['bps', 'Kbps', 'Mbps', 'Gbps', 'B/s', 'KB/s', 'MB/s', 'GB/s'];
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number) => {
  if (x === 0) return '0';
  if (x < 1e-3 || x >= 1e9) return x.toExponential(3);
  return Number(x.toPrecision(6)).toString();
};

export default function BandwidthConverterTool() {
  const [value, setValue] = useState('100');
  const [unit, setUnit] = useState('Mbps');

  const rows = useMemo(() => {
    const v = num(value);
    if (v == null) return null;
    const bps = toBitsPerSecond(v, unit);
    if (bps == null) return null;
    return UNITS.map((u) => ({ u, val: fromBitsPerSecond(bps, u)! }));
  }, [value, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Bandwidth</span>
        <div class="flex gap-1 sm:w-72"><input type="number" step="any" value={value} onInput={(e) => setValue((e.target as HTMLInputElement).value)} class={inp} />
          <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value)} class={sel}>{UNITS.map((u) => <option value={u}>{u}</option>)}</select></div></label>

      {rows ? (
        <div class="mt-4 overflow-hidden rounded-xl ring-1 ring-slate-200">
          <table class="w-full text-sm">
            <tbody>
              {rows.map((r, i) => (
                <tr class={`${r.u === unit ? 'bg-brand-50 font-bold text-brand-800' : i % 2 ? 'bg-white' : 'bg-slate-50'}`}>
                  <td class="px-4 py-2 font-mono">{fmt(r.val)}</td>
                  <td class="px-4 py-2 text-slate-500">{r.u}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a bandwidth value.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The core catch: 1 byte = 8 bits, so a bit-rate divided by 8 gives the byte-rate. 100 Mbps is 12.5 MB/s. Bit-rates (bps, Mbps) are how ISPs advertise speed; byte-rates (MB/s) are what download managers show. Units here are decimal (kilo = 1000), matching networking convention. 🔒 In your browser.</p>
    </div>
  );
}
