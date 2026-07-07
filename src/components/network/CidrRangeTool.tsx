import { useState } from 'preact/hooks';
import { parseIpv4, ipv4ToString, subnetInfo, rangeToCidrs } from '../../lib/net';

const inputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800 focus:border-brand-500 focus:outline-none';
const tabCls = (active: boolean) =>
  `rounded-lg px-4 py-2 text-sm font-semibold transition ${active ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700'}`;

export default function CidrRangeTool() {
  const [mode, setMode] = useState<'cidr' | 'range'>('cidr');
  const [cidrStr, setCidrStr] = useState('192.168.0.0/22');
  const [startStr, setStartStr] = useState('10.0.0.5');
  const [endStr, setEndStr] = useState('10.0.0.20');

  // CIDR → range
  let cidrRows: [string, string][] = [];
  let cidrErr = '';
  if (mode === 'cidr') {
    const m = cidrStr.trim().match(/^(.+)\/(\d{1,2})$/);
    const ip = m ? parseIpv4(m[1]!) : null;
    const prefix = m ? parseInt(m[2]!, 10) : NaN;
    if (ip === null || !(prefix >= 0 && prefix <= 32)) cidrErr = 'Enter a CIDR block like 192.168.0.0/22.';
    else {
      const info = subnetInfo(ip, prefix);
      const total = prefix === 0 ? 4294967296 : 2 ** (32 - prefix);
      cidrRows = [
        ['Range', `${ipv4ToString(info.network)} – ${ipv4ToString(info.broadcast)}`],
        ['First address', ipv4ToString(info.network)],
        ['Last address', ipv4ToString(info.broadcast)],
        ['Total addresses', total.toLocaleString('en-US')],
        ['Usable hosts', info.hostCount.toLocaleString('en-US')],
        ['Subnet mask', ipv4ToString(info.mask)],
      ];
    }
  }

  // range → CIDRs
  let cidrList: string[] = [];
  let rangeErr = '';
  let rangeCount = 0;
  if (mode === 'range') {
    const s = parseIpv4(startStr);
    const e = parseIpv4(endStr);
    if (s === null || e === null) rangeErr = 'Enter valid start and end IPv4 addresses.';
    else if (s > e) rangeErr = 'The start address must not be higher than the end address.';
    else {
      cidrList = rangeToCidrs(s, e).map((b) => `${ipv4ToString(b.base)}/${b.prefix}`);
      rangeCount = e - s + 1;
    }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex gap-2">
        <button type="button" class={tabCls(mode === 'cidr')} onClick={() => setMode('cidr')}>CIDR → range</button>
        <button type="button" class={tabCls(mode === 'range')} onClick={() => setMode('range')}>Range → CIDR</button>
      </div>

      {mode === 'cidr' && (
        <div class="mt-4">
          <label class="block max-w-md">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">CIDR block</span>
            <input class={inputCls} value={cidrStr} onInput={(e) => setCidrStr((e.target as HTMLInputElement).value)} placeholder="192.168.0.0/22" />
          </label>
          {cidrErr && <p class="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{cidrErr}</p>}
          {cidrRows.length > 0 && (
            <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table class="w-full text-left text-sm">
                <tbody class="divide-y divide-slate-100">
                  {cidrRows.map(([k, v]) => (
                    <tr>
                      <th scope="row" class="w-44 px-4 py-2 font-semibold text-slate-600">{k}</th>
                      <td class="px-4 py-2 font-mono text-slate-800">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {mode === 'range' && (
        <div class="mt-4">
          <div class="grid max-w-lg gap-3 sm:grid-cols-2">
            <label class="block">
              <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Start address</span>
              <input class={inputCls} value={startStr} onInput={(e) => setStartStr((e.target as HTMLInputElement).value)} />
            </label>
            <label class="block">
              <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">End address</span>
              <input class={inputCls} value={endStr} onInput={(e) => setEndStr((e.target as HTMLInputElement).value)} />
            </label>
          </div>
          {rangeErr && <p class="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{rangeErr}</p>}
          {cidrList.length > 0 && (
            <div class="mt-4">
              <p class="text-sm text-slate-600">
                {rangeCount.toLocaleString('en-US')} addresses → <strong class="text-slate-900">{cidrList.length} CIDR block{cidrList.length > 1 ? 's' : ''}</strong> (minimal set):
              </p>
              <ul class="mt-2 grid gap-1.5 font-mono text-sm sm:grid-cols-2">
                {cidrList.map((c) => (
                  <li class="rounded-lg bg-white px-3 py-1.5 text-slate-800 ring-1 ring-slate-200">{c}</li>
                ))}
              </ul>
              <button
                type="button"
                class="mt-3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400"
                onClick={() => navigator.clipboard.writeText(cidrList.join('\n'))}
              >
                📋 Copy list
              </button>
            </div>
          )}
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Both conversions run locally — nothing you enter is uploaded.</p>
    </div>
  );
}
