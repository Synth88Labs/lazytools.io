/**
 * Blockchain/Web3 developer utilities — DETERMINISTIC, exact, staleness-proof.
 * No keys, no seeds, no live data — purely spec-based conversions and checks.
 * Exact decimal math uses BigInt so 18-decimal wei↔ether never loses precision
 * (floating point cannot represent these values). Node-tested.
 */

/** Parse a decimal string into the smallest-unit integer (like ethers parseUnits). */
export function parseUnits(value: string, decimals: number): bigint {
  const s = value.trim();
  if (!/^-?\d*\.?\d*$/.test(s) || s === '' || s === '.' || s === '-') throw new Error('Invalid number');
  const neg = s.startsWith('-');
  const [intPart = '0', fracPartRaw = ''] = s.replace('-', '').split('.');
  if (fracPartRaw.length > decimals) throw new Error(`Too many decimal places (max ${decimals})`);
  const frac = fracPartRaw.padEnd(decimals, '0');
  const combined = (intPart || '0') + frac;
  const result = BigInt(combined || '0');
  return neg ? -result : result;
}

/** Format a smallest-unit integer back to a decimal string (like ethers formatUnits). */
export function formatUnits(value: bigint, decimals: number): string {
  const neg = value < 0n;
  const s = (neg ? -value : value).toString().padStart(decimals + 1, '0');
  const intPart = s.slice(0, s.length - decimals) || '0';
  let frac = decimals ? s.slice(s.length - decimals).replace(/0+$/, '') : '';
  return (neg ? '-' : '') + intPart + (frac ? '.' + frac : '');
}

/** Ethereum named units → their decimal exponent. */
export const ETH_UNITS: Record<string, number> = {
  wei: 0, kwei: 3, mwei: 6, gwei: 9, szabo: 12, finney: 15, ether: 18,
};

/** Convert a value between two Ethereum units, exactly. */
export function convertEthUnit(value: string, from: string, to: string): string {
  const wei = parseUnits(value, ETH_UNITS[from] ?? 0);
  return formatUnits(wei, ETH_UNITS[to] ?? 0);
}

/** Bitcoin: satoshis ↔ BTC (1 BTC = 100,000,000 sats). */
export const satsToBtc = (sats: string) => formatUnits(BigInt(sats.trim() || '0'), 8);
export const btcToSats = (btc: string) => parseUnits(btc, 8).toString();

/** ERC-20 token amount: raw base units ↔ human display, given the token's decimals. */
export const tokenRawToDisplay = (raw: string, decimals: number) => formatUnits(BigInt(raw.trim() || '0'), decimals);
export const tokenDisplayToRaw = (display: string, decimals: number) => parseUnits(display, decimals).toString();

/** Gas cost (rate-as-input, never a live oracle): gasUsed × gasPriceGwei → ETH. */
export function gasCostEth(gasUsed: string, gasPriceGwei: string): string {
  const priceWei = parseUnits(gasPriceGwei, 9); // gwei → wei
  const total = BigInt(gasUsed.trim() || '0') * priceWei;
  return formatUnits(total, 18);
}

// ───────────────────────── keccak-256 based (EIP-55, selectors) ─────────────────────────
import jsSha3 from 'js-sha3';
const keccak256: (m: string) => string = jsSha3.keccak256;
export const sha3_256: (m: string) => string = jsSha3.sha3_256;
export { keccak256 };

/** True if a string is a well-formed 0x-prefixed 40-hex Ethereum address (no checksum check). */
export const isAddressFormat = (addr: string) => /^0x[0-9a-fA-F]{40}$/.test(addr.trim());

/** Apply the EIP-55 mixed-case checksum to a 40-hex address. */
export function toChecksumAddress(addr: string): string {
  const a = addr.trim().toLowerCase().replace(/^0x/, '');
  if (!/^[0-9a-f]{40}$/.test(a)) throw new Error('Not a 40-character hex address');
  const hash = keccak256(a);
  let out = '0x';
  for (let i = 0; i < 40; i++) out += parseInt(hash[i]!, 16) >= 8 ? a[i]!.toUpperCase() : a[i];
  return out;
}

/** Check whether an address already carries a valid EIP-55 checksum. */
export function isValidChecksum(addr: string): boolean {
  const s = addr.trim();
  if (!isAddressFormat(s)) return false;
  const body = s.replace(/^0x/, '');
  if (body === body.toLowerCase() || body === body.toUpperCase()) return false; // not checksummed
  return s === toChecksumAddress(s);
}

/** 4-byte function selector / event topic: first 4 bytes of keccak-256 of the canonical signature. */
export function functionSelector(signature: string): string {
  const canonical = signature.replace(/\s+/g, '');
  return '0x' + keccak256(canonical).slice(0, 8);
}
