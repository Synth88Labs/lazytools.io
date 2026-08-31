/**
 * HMAC and JWT (HS256/384/512) signing via Web Crypto, available in browsers
 * and Node. Deterministic, so Node-tested against an independent oracle
 * (Node's crypto for HMAC) and the well-known jwt.io example token for JWT.
 * Secrets never leave the device.
 */

export type HmacAlgo = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';
export type JwtAlgo = 'HS256' | 'HS384' | 'HS512';

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function toBase64(bytes: Uint8Array): string {
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

function toBase64Url(bytes: Uint8Array): string {
  return toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** HMAC of `message` keyed by `key` (both UTF-8), as hex or base64. */
export async function hmac(
  message: string,
  key: string,
  algo: HmacAlgo = 'SHA-256',
  encoding: 'hex' | 'base64' = 'hex',
): Promise<string> {
  const keyBytes = new TextEncoder().encode(key);
  const ck = await crypto.subtle.importKey('raw', keyBytes as unknown as ArrayBuffer, { name: 'HMAC', hash: algo }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', ck, new TextEncoder().encode(message)));
  return encoding === 'hex' ? toHex(sig) : toBase64(sig);
}

const JWT_HASH: Record<JwtAlgo, HmacAlgo> = { HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512' };

/**
 * Build and HMAC-sign a compact JWT. `header` is generated as
 * {alg, typ:"JWT"}; `payload` is any JSON-serialisable object. Returns the
 * three-segment token. (HS algorithms only, no private-key material.)
 */
export async function signJwt(payload: Record<string, unknown>, secret: string, algo: JwtAlgo = 'HS256'): Promise<string> {
  const header = { alg: algo, typ: 'JWT' };
  const seg = (obj: unknown) => toBase64Url(new TextEncoder().encode(JSON.stringify(obj)));
  const signingInput = `${seg(header)}.${seg(payload)}`;
  const keyBytes = new TextEncoder().encode(secret);
  const ck = await crypto.subtle.importKey('raw', keyBytes as unknown as ArrayBuffer, { name: 'HMAC', hash: JWT_HASH[algo] }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', ck, new TextEncoder().encode(signingInput)));
  return `${signingInput}.${toBase64Url(sig)}`;
}
