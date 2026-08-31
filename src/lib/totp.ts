/**
 * RFC 4226 HOTP / RFC 6238 TOTP using Web Crypto (crypto.subtle), available in
 * modern browsers and Node. Deterministic when the time is injected, so it is
 * Node-tested against the RFC 6238 Appendix B test vectors. No secret ever
 * leaves the device, that is the whole point of doing this locally.
 */

export type TotpAlgo = 'SHA-1' | 'SHA-256' | 'SHA-512';

/** HMAC-based One-Time Password (RFC 4226) for an explicit counter. */
export async function hotp(keyBytes: Uint8Array, counter: number, digits = 6, algo: TotpAlgo = 'SHA-1'): Promise<string> {
  const counterBuf = new ArrayBuffer(8);
  const view = new DataView(counterBuf);
  // 64-bit big-endian counter; high 32 bits are effectively always 0 here.
  view.setUint32(0, Math.floor(counter / 0x100000000));
  view.setUint32(4, counter >>> 0);

  const key = await crypto.subtle.importKey('raw', keyBytes as unknown as ArrayBuffer, { name: 'HMAC', hash: algo }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, counterBuf));

  const offset = sig[sig.length - 1] & 0x0f;
  const binary =
    ((sig[offset] & 0x7f) << 24) |
    ((sig[offset + 1] & 0xff) << 16) |
    ((sig[offset + 2] & 0xff) << 8) |
    (sig[offset + 3] & 0xff);
  const otp = binary % 10 ** digits;
  return otp.toString().padStart(digits, '0');
}

/** Time-based One-Time Password (RFC 6238). */
export async function totp(
  keyBytes: Uint8Array,
  unixSeconds: number,
  period = 30,
  digits = 6,
  algo: TotpAlgo = 'SHA-1',
): Promise<string> {
  const counter = Math.floor(unixSeconds / period);
  return hotp(keyBytes, counter, digits, algo);
}

/** Seconds remaining in the current TOTP window (for a countdown display). */
export function secondsRemaining(unixSeconds: number, period = 30): number {
  return period - (Math.floor(unixSeconds) % period);
}
