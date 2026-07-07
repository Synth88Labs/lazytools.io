import { useState } from 'preact/hooks';
import { parseIpv6, ipv6Expand, ipv6Compress, ipv6NetworkStart, ipv6NetworkEnd, bigCount } from '../../lib/net';

const inputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800 focus:border-brand-500 focus:outline-none';

export default function Ipv6SubnetTool() {
  const [addrStr, setAddrStr] = useState('2001:db8:abcd:12::1');
  const [prefix, setPrefix] = useState(64);

  const addr = parseIpv6(addrStr);
  const start = addr !== null ? ipv6NetworkStart(addr, prefix) : null;
  const end = addr !== null ? ipv6NetworkEnd(addr, prefix) : null;
  const hostBits = 128 - prefix;
  const sixtyFours = prefix <= 64 ? 64 - prefix : null;

  const rows: [string, string][] =
    addr !== null && start !== null && end !== null
      ? [
          ['Canonical (RFC 5952)', ipv6Compress(addr)],
          ['Fully expanded', ipv6Expand(addr)],
          ['Network prefix', `${ipv6Compress(start)}/${prefix}`],
          ['First address', ipv6Expand(start)],
          ['Last address', ipv6Expand(end)],
          ['Total addresses', bigCount(hostBits)],
          ...(sixtyFours !== null ? ([['Contains /64 subnets', prefix === 64 ? 'this is one /64 (one LAN segment)' : bigCount(sixtyFours)]] as [string, string][]) : []),
        ]
      : [];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-[1fr_170px]">
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">IPv6 address</span>
          <input class={inputCls} value={addrStr} onInput={(e) => setAddrStr((e.target as HTMLInputElement).value)} placeholder="2001:db8::1" />
        </label>
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Prefix length</span>
          <select class={inputCls} value={prefix} onChange={(e) => setPrefix(parseInt((e.target as HTMLSelectElement).value, 10))}>
            {Array.from({ length: 128 }, (_, i) => i + 1).map((p) => (
              <option value={p}>/{p}</option>
            ))}
          </select>
        </label>
      </div>

      {addr === null && <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Enter a valid IPv6 address — e.g. 2001:db8::1, fe80::1, or ::ffff:192.0.2.1.</p>}

      {rows.length > 0 && (
        <div class="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table class="w-full text-left text-sm">
            <tbody class="divide-y divide-slate-100">
              {rows.map(([k, v]) => (
                <tr>
                  <th scope="row" class="w-48 px-4 py-2 align-top font-semibold text-slate-600">{k}</th>
                  <td class="break-all px-4 py-2 font-mono text-slate-800">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div class="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
        <p class="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200"><strong class="text-slate-700">/48</strong> — typical site allocation: 65,536 LANs</p>
        <p class="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200"><strong class="text-slate-700">/56</strong> — typical home delegation: 256 LANs</p>
        <p class="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200"><strong class="text-slate-700">/64</strong> — one LAN segment, always</p>
      </div>
      <p class="mt-3 text-xs text-slate-500">Exact 128-bit arithmetic (BigInt), entirely in your browser.</p>
    </div>
  );
}
