import { useState } from 'preact/hooks';
import { parseIpv4, ipv4ToString, prefixToMask, maskToPrefix, ipv4ToBinary, ipv4Class, ipv4Scope, subnetInfo } from '../../lib/net';

const inputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800 focus:border-brand-500 focus:outline-none';

export default function SubnetCalculatorTool() {
  const [ipStr, setIpStr] = useState('192.168.1.10');
  const [prefix, setPrefix] = useState(24);
  const [split, setSplit] = useState(1);

  const ip = parseIpv4(ipStr);
  const info = ip !== null ? subnetInfo(ip, prefix) : null;

  function onMaskInput(v: string) {
    const m = parseIpv4(v);
    if (m !== null) {
      const p = maskToPrefix(m);
      if (p !== null) setPrefix(p);
    }
  }

  const rows: [string, string][] = info
    ? [
        ['CIDR notation', `${ipv4ToString(info.network)}/${info.prefix}`],
        ['Network address', ipv4ToString(info.network)],
        ['Broadcast address', info.prefix >= 31 ? '— (RFC 3021 point-to-point)' : ipv4ToString(info.broadcast)],
        ['Usable host range', info.hostCount > 0 ? `${ipv4ToString(info.firstHost!)} – ${ipv4ToString(info.lastHost!)}` : ipv4ToString(info.network)],
        ['Usable hosts', info.hostCount.toLocaleString('en-US')],
        ['Subnet mask', ipv4ToString(info.mask)],
        ['Wildcard mask', ipv4ToString(info.wildcard)],
        ['Mask in binary', ipv4ToBinary(info.mask)],
        ['IP in binary', ipv4ToBinary(ip!)],
        ['Address class', ipv4Class(ip!)],
        ['Scope', ipv4Scope(ip!)],
      ]
    : [];

  const splitPrefix = prefix + Math.log2(split);
  const subnets: { net: string; range: string; hosts: number }[] = [];
  if (info && split > 1 && splitPrefix <= 32) {
    const size = 2 ** (32 - splitPrefix);
    for (let i = 0; i < split && i < 64; i++) {
      const s = subnetInfo((info.network + i * size) >>> 0, splitPrefix);
      subnets.push({
        net: `${ipv4ToString(s.network)}/${splitPrefix}`,
        range: s.hostCount > 0 ? `${ipv4ToString(s.firstHost!)} – ${ipv4ToString(s.lastHost!)}` : ipv4ToString(s.network),
        hosts: s.hostCount,
      });
    }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">IP address</span>
          <input class={inputCls} value={ipStr} onInput={(e) => setIpStr((e.target as HTMLInputElement).value)} placeholder="192.168.1.10" />
        </label>
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Prefix length</span>
          <select class={inputCls} value={prefix} onChange={(e) => setPrefix(parseInt((e.target as HTMLSelectElement).value, 10))}>
            {Array.from({ length: 32 }, (_, i) => i + 1).map((p) => (
              <option value={p}>/{p} — {ipv4ToString(prefixToMask(p))}</option>
            ))}
          </select>
        </label>
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">…or type a mask</span>
          <input class={inputCls} placeholder="255.255.255.0" onInput={(e) => onMaskInput((e.target as HTMLInputElement).value)} />
        </label>
      </div>

      {ip === null && <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Enter a valid IPv4 address (four numbers 0–255 separated by dots).</p>}

      {info && (
        <div class="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table class="w-full text-left text-sm">
            <tbody class="divide-y divide-slate-100">
              {rows.map(([k, v]) => (
                <tr>
                  <th scope="row" class="w-44 px-4 py-2 font-semibold text-slate-600">{k}</th>
                  <td class="px-4 py-2 font-mono text-slate-800">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {info && (
        <div class="mt-5">
          <label class="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700">
            Split into
            <select class="rounded-lg border border-slate-300 bg-white px-2 py-1.5 font-mono text-sm" value={split} onChange={(e) => setSplit(parseInt((e.target as HTMLSelectElement).value, 10))}>
              {[1, 2, 4, 8, 16, 32, 64].filter((n) => prefix + Math.log2(n) <= 32).map((n) => (
                <option value={n}>{n === 1 ? 'no split' : `${n} equal subnets`}</option>
              ))}
            </select>
          </label>
          {subnets.length > 0 && (
            <div class="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table class="w-full text-left text-sm">
                <thead class="bg-slate-50 text-slate-600">
                  <tr>
                    <th class="px-4 py-2 font-semibold">Subnet</th>
                    <th class="px-4 py-2 font-semibold">Usable range</th>
                    <th class="px-4 py-2 font-semibold">Hosts</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-mono">
                  {subnets.map((s) => (
                    <tr>
                      <td class="px-4 py-1.5 text-slate-800">{s.net}</td>
                      <td class="px-4 py-1.5 text-slate-700">{s.range}</td>
                      <td class="px-4 py-1.5 text-slate-700">{s.hosts.toLocaleString('en-US')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">All subnet math runs in your browser — addresses and network plans are never uploaded.</p>
    </div>
  );
}
