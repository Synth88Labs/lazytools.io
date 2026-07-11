import { useMemo, useState } from 'preact/hooks';
import { ELEMENT_DATA } from '../../data/chemistry/elements';

// Aufbau (Madelung) filling order and subshell capacities
const ORDER: [string, number][] = [
  ['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 6],
  ['5s', 2], ['4d', 10], ['5p', 6], ['6s', 2], ['4f', 14], ['5d', 10], ['6p', 6], ['7s', 2],
  ['5f', 14], ['6d', 10], ['7p', 6],
];
const SUP: Record<string, string> = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = (n: number) => String(n).split('').map((d) => SUP[d]).join('');

function aufbau(z: number): { config: string; shells: number[] } {
  let left = z;
  const parts: string[] = [];
  const shells: number[] = [];
  for (const [sub, cap] of ORDER) {
    if (left <= 0) break;
    const put = Math.min(cap, left);
    left -= put;
    parts.push(`${sub}${sup(put)}`);
    const n = parseInt(sub[0], 10);
    shells[n - 1] = (shells[n - 1] ?? 0) + put;
  }
  return { config: parts.join(' '), shells };
}

export default function ElectronConfigTool() {
  const [raw, setRaw] = useState('26');

  const el = useMemo(() => {
    const s = raw.trim().toLowerCase();
    if (!s) return null;
    const byNum = /^\d+$/.test(s) ? ELEMENT_DATA.find((e) => e.z === parseInt(s, 10)) : null;
    return byNum ?? ELEMENT_DATA.find((e) => e.symbol.toLowerCase() === s || e.name.toLowerCase() === s) ?? null;
  }, [raw]);

  const r = useMemo(() => {
    if (!el) return null;
    const a = aufbau(el.z);
    return { ...a, actual: el.config };
  }, [el]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Element — symbol, name or atomic number</span>
        <input value={raw} spellcheck={false} onInput={(e) => setRaw((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" placeholder="Fe, iron or 26" />
      </label>

      {el && r ? (
        <>
          <div class="mt-4 rounded-xl bg-white p-4 ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{el.name} (Z = {el.z}) — full configuration</p>
            <p class="mt-1 font-mono text-lg font-bold text-brand-800 break-words">{r.actual}</p>
          </div>
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Aufbau (idealised) order</p>
              <p class="mt-1 font-mono text-sm text-slate-700 break-words">{r.config}</p>
              <p class="mt-1 text-xs text-slate-400">Fills subshells in increasing energy (Madelung rule).</p>
            </div>
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Electrons per shell (K, L, M…)</p>
              <p class="mt-1 font-mono text-lg font-bold text-slate-800">{r.shells.map((n) => n ?? 0).join(', ')}</p>
              <p class="mt-1 text-xs text-slate-400">Sum = {el.z} electrons</p>
            </div>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter an element symbol (Fe), name (iron) or atomic number (26).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        The full configuration is the experimentally observed one; the Aufbau order is the idealised filling. Some d- and f-block elements deviate from the simple prediction (e.g. Cr, Cu). 🔒 Computed in your browser.
      </p>
    </div>
  );
}
