import { useMemo, useState } from 'preact/hooks';
import { ETH_UNITS, convertEthUnit, satsToBtc, btcToSats } from '../../lib/blockchain';

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const UNITS = Object.keys(ETH_UNITS); // wei..ether

export default function EthUnitTool() {
  const [value, setValue] = useState('1');
  const [from, setFrom] = useState('ether');
  const [err, setErr] = useState('');

  const rows = useMemo(() => {
    try {
      const r = UNITS.map((u) => [u, convertEthUnit(value || '0', from, u)] as [string, string]);
      setErr('');
      return r;
    } catch (e) { setErr((e as Error).message); return []; }
  }, [value, from]);

  // Bitcoin
  const [btc, setBtc] = useState('');
  const [sats, setSats] = useState('');
  function onBtc(v: string) { setBtc(v); try { setSats(v ? btcToSats(v) : ''); } catch { /* */ } }
  function onSats(v: string) { setSats(v); try { setBtc(v ? satsToBtc(v) : ''); } catch { /* */ } }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div><label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</label>
          <input class={`${inputCls} font-mono`} value={value} onInput={(e) => setValue((e.target as HTMLInputElement).value)} /></div>
        <div><label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">In unit</label>
          <select class={inputCls} value={from} onChange={(e) => setFrom((e.target as HTMLSelectElement).value)}>
            {UNITS.map((u) => <option value={u}>{u} (10^{ETH_UNITS[u]})</option>)}
          </select></div>
      </div>
      {err ? <p class="mt-3 text-sm text-red-700">✗ {err}</p> : (
        <div class="mt-3 overflow-auto rounded-xl border border-slate-200 bg-white">
          <table class="w-full text-left text-sm">
            <tbody class="divide-y divide-slate-100 font-mono">
              {rows.map(([u, v]) => (
                <tr class={u === from ? 'bg-brand-50' : 'hover:bg-slate-50'}>
                  <td class="px-3 py-1.5 font-semibold text-slate-600">{u}</td>
                  <td class="px-3 py-1.5 break-all text-slate-900">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p class="mt-2 text-xs text-slate-500">Exact conversion via BigInt fixed-point — no floating-point error even at 18 decimals. 1 ether = 10¹⁸ wei · 1 gwei = 10⁹ wei. 🔒 Computed in your browser.</p>

      <div class="mt-5 border-t border-slate-200 pt-4">
        <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Bitcoin — satoshi ⇄ BTC</p>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="mb-1 block text-xs text-slate-500">BTC</label><input class={`${inputCls} font-mono`} value={btc} placeholder="0.001" onInput={(e) => onBtc((e.target as HTMLInputElement).value)} /></div>
          <div><label class="mb-1 block text-xs text-slate-500">satoshi</label><input class={`${inputCls} font-mono`} value={sats} placeholder="100000" onInput={(e) => onSats((e.target as HTMLInputElement).value)} /></div>
        </div>
        <p class="mt-1 text-xs text-slate-400">1 BTC = 100,000,000 satoshi (8 decimals).</p>
      </div>
    </div>
  );
}
