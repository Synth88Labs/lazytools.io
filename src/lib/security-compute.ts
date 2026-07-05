/** Privacy & Security helpers — Web Crypto only, everything local. */

const MAGIC = new TextEncoder().encode('LZENC1'); // format marker for encrypted files
const PBKDF2_ITERS = 310_000;

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: PBKDF2_ITERS, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/** Encrypt bytes with a password. Output: MAGIC ∥ salt(16) ∥ iv(12) ∥ ciphertext. */
export async function encryptBytes(data: ArrayBuffer, password: string): Promise<Blob> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, data);
  return new Blob([MAGIC as BufferSource, salt as BufferSource, iv as BufferSource, cipher]);
}

/** Decrypt a file produced by encryptBytes. Throws on wrong password or corruption. */
export async function decryptBytes(data: ArrayBuffer, password: string): Promise<ArrayBuffer> {
  const bytes = new Uint8Array(data);
  const magic = new TextDecoder().decode(bytes.slice(0, 6));
  if (magic !== 'LZENC1') throw new Error('Not a LazyTools-encrypted file (missing LZENC1 header).');
  const salt = bytes.slice(6, 22);
  const iv = bytes.slice(22, 34);
  const key = await deriveKey(password, salt);
  try {
    return await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, bytes.slice(34) as BufferSource);
  } catch {
    throw new Error('Decryption failed — wrong password or corrupted file.');
  }
}

export async function hashFile(data: ArrayBuffer, algo: 'SHA-256' | 'SHA-512' | 'SHA-1'): Promise<string> {
  const digest = await crypto.subtle.digest(algo, data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Scan JPEG bytes for metadata segments (EXIF APP1, XMP, IPTC APP13, ICC APP2). */
export function detectJpegMetadata(bytes: Uint8Array): string[] {
  const found: string[] = [];
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return found; // not a JPEG
  let i = 2;
  while (i + 4 < bytes.length && bytes[i] === 0xff) {
    const marker = bytes[i + 1]!;
    if (marker === 0xda) break; // start of scan — no more headers
    const len = (bytes[i + 2]! << 8) | bytes[i + 3]!;
    const seg = bytes.slice(i + 4, i + 4 + Math.min(len, 24));
    const head = new TextDecoder('ascii', { fatal: false }).decode(seg);
    if (marker === 0xe1 && head.startsWith('Exif')) found.push('EXIF (camera, date, possibly GPS)');
    else if (marker === 0xe1 && head.includes('ns.adobe.com')) found.push('XMP (editing history, creator)');
    else if (marker === 0xed) found.push('IPTC (captions, keywords, credit)');
    else if (marker === 0xe2 && head.startsWith('ICC_PROFILE')) found.push('ICC color profile');
    i += 2 + len;
  }
  return found;
}

/** Frequently cracked passwords — presence check only, tiny local list. */
const COMMON = new Set([
  'password', '123456', '12345678', '123456789', 'qwerty', 'abc123', '111111', 'letmein', 'iloveyou',
  'admin', 'welcome', 'monkey', 'dragon', 'master', 'sunshine', 'princess', 'football', 'baseball',
  'shadow', 'superman', 'trustno1', 'password1', 'password123', '1234567890', 'qwerty123', '000000',
  'zaq12wsx', '1q2w3e4r', 'qwertyuiop', 'passw0rd', 'p@ssw0rd', 'secret', 'freedom', 'whatever',
]);

export interface StrengthResult {
  entropyBits: number;
  charsetSize: number;
  warnings: string[];
  label: 'Very weak' | 'Weak' | 'Fair' | 'Strong' | 'Excellent';
}

/** Honest strength estimate: charset entropy with pattern penalties surfaced as warnings. */
export function assessPassword(pw: string): StrengthResult {
  const warnings: string[] = [];
  let charset = 0;
  if (/[a-z]/.test(pw)) charset += 26;
  if (/[A-Z]/.test(pw)) charset += 26;
  if (/[0-9]/.test(pw)) charset += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) charset += 33;
  let bits = pw.length * Math.log2(Math.max(charset, 1));

  const lower = pw.toLowerCase();
  if (COMMON.has(lower)) {
    warnings.push('This is one of the most-cracked passwords in existence — it falls instantly.');
    bits = Math.min(bits, 1);
  }
  if (pw.length > 0 && pw.length < 8) warnings.push('Under 8 characters — too short regardless of complexity.');
  if (/(.)\1{2,}/.test(pw)) warnings.push('Repeated runs (aaa, 111) add length but little strength.');
  if (/(?:abc|bcd|cde|def|123|234|345|456|567|678|789|012|qwe|wer|ert|asd|sdf|zxc)/i.test(pw))
    warnings.push('Sequential runs (abc, 123, qwe) are the first patterns crackers try.');
  if (/(?:19|20)\d{2}/.test(pw)) warnings.push('Contains a year — one of the most common human patterns.');
  if (/^[A-Z][a-z]+\d{1,4}[!.?]?$/.test(pw))
    warnings.push('Word + digits (+ optional !) is the single most common password shape — mangling rules crack it fast.');
  if (warnings.length > 1) bits = bits * 0.6; // patterned passwords are far below their formula entropy

  const label: StrengthResult['label'] =
    bits >= 100 ? 'Excellent' : bits >= 80 ? 'Strong' : bits >= 60 ? 'Fair' : bits >= 40 ? 'Weak' : 'Very weak';
  return { entropyBits: Math.round(bits * 10) / 10, charsetSize: charset, warnings, label };
}
