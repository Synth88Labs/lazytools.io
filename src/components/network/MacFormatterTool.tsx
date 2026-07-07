import { useState } from 'preact/hooks';
import { parseMac, macFormats, macToEui64, macToLinkLocal } from '../../lib/net';

export default function MacFormatterTool() {
  const [input, setInput] = useState('aa:bb:cc:dd:ee:ff');
  const [upper, setUpper] = useState(false);

  const hex = parseMac(input);
  const cased = (s: string) => (upper ? s.toUpperCase() : s.toLowerCase());

  const rows: [string, string][] = hex
    ? (() => {
        const f = macFormats(hex);
        const eui = macFormats(macToEui64(hex) as string);
        return [
          ['Colon (Unix / macOS)', cased(f.colon)],
          ['Hyphen (Windows)', cased(f.hyphen)],
          ['Dotted (Cisco IOS)', cased(f.cisco)],
          ['Bare hex', cased(f.bare)],
          ['EUI-64 interface ID', cased(eui.colon)],
          ['IPv6 link-local', macToLinkLocal(hex)],
        ];
      })()
    : [];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-end gap-3">
        <label class="block max-w-sm flex-1">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">MAC address — any format</span>
          <input
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800 focus:border-brand-500 focus:outline-none"
            value={input}
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            placeholder="aa:bb:cc:dd:ee:ff · AA-BB-… · aabb.ccdd.eeff"
          />
        </label>
        <label class="flex items-center gap-2 pb-2 text-sm font-medium text-slate-700">
          <input type="checkbox" class="h-4 w-4 accent-brand-600" checked={upper} onChange={() => setUpper((u) => !u)} />
          UPPERCASE
        </label>
      </div>

      {!hex && input.trim() !== '' && (
        <p class="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Not a valid MAC — it needs exactly 12 hex digits (separators optional).</p>
      )}

      {hex && (
        <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table class="w-full text-left text-sm">
            <tbody class="divide-y divide-slate-100">
              {rows.map(([k, v]) => (
                <tr>
                  <th scope="row" class="w-52 px-4 py-2 font-semibold text-slate-600">{k}</th>
                  <td class="break-all px-4 py-2 font-mono text-slate-800">{v}</td>
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
      )}

      <p class="mt-4 text-xs text-slate-500">
        EUI-64 flips the universal/local bit and inserts ff:fe; the link-local address is fe80::/64 + EUI-64. Everything is computed locally — MAC addresses identify hardware, so they never leave your browser here.
      </p>
    </div>
  );
}
