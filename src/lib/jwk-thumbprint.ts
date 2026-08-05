/**
 * JWK Thumbprint (RFC 7638) and the JWK Thumbprint URI (RFC 9278). A thumbprint
 * is a stable hash of the *required* public members of a JSON Web Key, taken in
 * lexicographic order from a whitespace-free JSON string, then base64url-encoded.
 * The canonicalization is pure and synchronous; the hash uses Web Crypto's
 * SubtleCrypto (available in browsers and Node). Public members only.
 */

// The required members per key type, in the lexicographic order RFC 7638 mandates.
const REQUIRED: Record<string, string[]> = {
  RSA: ['e', 'kty', 'n'],
  EC: ['crv', 'kty', 'x', 'y'],
  OKP: ['crv', 'kty', 'x'],
  oct: ['k', 'kty'],
};

// Members that must never appear in a thumbprint input — they are private.
export const PRIVATE_MEMBERS = ['d', 'p', 'q', 'dp', 'dq', 'qi', 'oth', 'k'];

/** Build the exact canonical JSON string RFC 7638 hashes for a JWK. */
export function canonicalJwk(jwk: Record<string, unknown>): string {
  const kty = jwk.kty;
  if (typeof kty !== 'string' || !(kty in REQUIRED)) {
    throw new Error(`Unsupported or missing "kty" (key type). Expected one of: ${Object.keys(REQUIRED).join(', ')}.`);
  }
  const members = REQUIRED[kty]!;
  for (const m of members) {
    if (typeof jwk[m] !== 'string') throw new Error(`Missing required member "${m}" for a ${kty} key (it must be a string).`);
  }
  // Members are already in lexicographic order; emit with no whitespace.
  return '{' + members.map((m) => `${JSON.stringify(m)}:${JSON.stringify(jwk[m])}`).join(',') + '}';
}

/** True if the JWK contains any private-key member (so it's not just a public key). */
export function hasPrivateMembers(jwk: Record<string, unknown>): boolean {
  return PRIVATE_MEMBERS.some((m) => m in jwk);
}

function base64url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = typeof btoa === 'function' ? btoa(bin) : Buffer.from(bin, 'binary').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export type ThumbHash = 'SHA-256' | 'SHA-384' | 'SHA-512' | 'SHA-1';

export interface ThumbprintResult {
  canonical: string;
  thumbprint: string;   // base64url
  uri: string;          // RFC 9278 thumbprint URI
  hash: ThumbHash;
  hasPrivate: boolean;
}

/** Compute a JWK thumbprint (RFC 7638) and its thumbprint URI (RFC 9278). */
export async function jwkThumbprint(jwk: Record<string, unknown>, hash: ThumbHash = 'SHA-256'): Promise<ThumbprintResult> {
  const canonical = canonicalJwk(jwk);
  const digest = await crypto.subtle.digest(hash, new TextEncoder().encode(canonical));
  const thumbprint = base64url(new Uint8Array(digest));
  const uri = `urn:ietf:params:oauth:jwk-thumbprint:${hash.toLowerCase()}:${thumbprint}`;
  return { canonical, thumbprint, uri, hash, hasPrivate: hasPrivateMembers(jwk) };
}
