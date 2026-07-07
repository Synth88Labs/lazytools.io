import { useState } from 'preact/hooks';
import { parseIpv4, ipv4ToString, ipv4ToBinary } from '../../lib/net';

const inputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800 focus:border-brand-500 focus:outline-none';

/** Accept dotted, decimal int, hex (0x… or 8 hex digits), or 32 binary bits (dots/spaces allowed). */
function parseAny(s: string): number | null {
  const t = s.trim().toLowerCase();
  if (!t) return null;
  const dotted = parseIpv4(t);
  if (dotted !== null) return dotted;
  if (/^0x[0-9a-f]{1,8}$/.test(t)) return parseInt(t, 16) >>> 0;
  if (/^[01][01.\s]{7,}$/.test(t)) {
    const bits = t.replace(/[.\s]/g, '');
    if (/^[01]{32}$/.test(bits)) return parseInt(bits, 2) >>> 0;
    return null;
  }
  if (/^\d+$/.test(t)) {
    const n = Number(t);
    if (Number.isSafeInteger(n) && n >= 0 && n <= 4294967295) return n >>> 0;
    return null;
  }
  if (/^[0-9a-f]{8}$/.test(t)) return parseInt(t, 16) >>> 0;
  return null;
}

export default function IpConverterTool() {
  const [input, setInput] = useState('192.168.1.1');
  const n = parseAny(input);

  const octets = n !== null ? [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255] : [];

  const rows: [string, string][] =
    n !== null
      ? [
          ['Dotted decimal', ipv4ToString(n)],
          ['Decimal (32-bit integer)', String(n)],
          ['Hexadecimal', '0x' + n.toString(16).toUpperCase().padStart(8, '0')],
          ['Binary', ipv4ToBinary(n)],
        ]
      : [];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block max-w-lg">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">IP in any format</span>
        <input class={inputCls} value={input} onInput={(e) => setInput((e.target as HTMLInputElement).value)} placeholder="192.168.1.1 · 3232235777 · 0xC0A80101 · 11000000…" />
      </label>

      {n === null && input.trim() !== '' && (
        <p class="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Not recognized — enter dotted decimal (192.168.1.1), an integer (0–4294967295), hex (0xC0A80101) or 32 binary bits.
        </p>
      )}

      {n !== null && (
        <>
          <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-left text-sm">
              <tbody class="divide-y divide-slate-100">
                {rows.map(([k, v]) => (
                  <tr>
                    <th scope="row" class="w-52 px-4 py-2 font-semibold text-slate-600">{k}</th>
                    <td class="px-4 py-2 font-mono text-slate-800">{v}</td>
                    <td class="w-14 px-2 py-2">
                      <button
                        type="button"
                        class="rounded px-2 py-1 text-xs text-slate-400 transition hover:bg-slate-100 hover:text-brand-700"
                        onClick={() => navigator.clipboard.writeText(v)}
                        title="Copy"
                      >
                        📋
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Per-octet breakdown</p>
            <div class="mt-2 flex flex-wrap gap-3 font-mono text-sm">
              {octets.map((o, i) => (
                <div class="rounded-lg bg-slate-50 px-3 py-2 text-center ring-1 ring-slate-200">
                  <p class="text-lg font-bold text-slate-900">{o}</p>
                  <p class="text-slate-500">{o.toString(2).padStart(8, '0')}</p>
                  <p class="text-xs text-slate-400">× 256^{3 - i}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <p class="mt-4 text-xs text-slate-500">All four representations encode the same 32-bit number. Computed locally.</p>
    </div>
  );
}
