import { useMemo, useState } from 'preact/hooks';
import { isAddressFormat, isValidChecksum, toChecksumAddress } from '../../lib/blockchain';

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function Eip55Tool() {
  const [addr, setAddr] = useState('0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const s = addr.trim();
    if (!s) return null;
    if (!isAddressFormat(s)) return { error: 'Not a valid Ethereum address (need 0x + 40 hex characters).' };
    const checksummed = toChecksumAddress(s);
    const body = s.replace(/^0x/, '');
    const isMixed = body !== body.toLowerCase() && body !== body.toUpperCase();
    return { checksummed, alreadyValid: isMixed && isValidChecksum(s), wasMixed: isMixed };
  }, [addr]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ethereum address</span>
        <input class={inputCls} value={addr} onInput={(e) => setAddr((e.target as HTMLInputElement).value)} /></label>

      {result && (result.error ? (
        <p class="mt-4 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 ring-2 ring-red-200">✗ {result.error}</p>
      ) : (
        <>
          {result.wasMixed && (
            <div class={`mt-4 rounded-xl p-3 text-sm font-semibold ring-2 ${result.alreadyValid ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' : 'bg-red-50 text-red-800 ring-red-200'}`}>
              {result.alreadyValid ? '✓ Valid EIP-55 checksum — this address is correctly formatted.' : '✗ Invalid checksum — the mixed-case does not match EIP-55. This address may be mistyped.'}
            </div>
          )}
          <div class="mt-3 rounded-xl bg-white p-4 ring-2 ring-brand-200">
            <div class="flex items-center justify-between">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Checksummed (EIP-55)</p>
              <button type="button" onClick={() => { navigator.clipboard.writeText(result.checksummed!); setCopied(true); setTimeout(() => setCopied(false), 1200); }} class="rounded-lg bg-brand-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-brand-800">{copied ? '✓ Copied' : 'Copy'}</button>
            </div>
            <p class="mt-1 break-all font-mono text-sm text-slate-900">{result.checksummed}</p>
          </div>
        </>
      ))}
      <p class="mt-3 text-xs text-slate-500">EIP-55 encodes a checksum in the letter casing of a hex address — each letter is uppercased when the matching nibble of the address’s Keccak-256 hash is ≥ 8. Wallets use it to catch typos. This validates and converts any address, entirely in your browser. Public addresses only — never paste a private key or seed phrase anywhere.</p>
    </div>
  );
}
