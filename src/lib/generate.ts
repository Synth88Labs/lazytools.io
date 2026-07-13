/**
 * Generators — pure, testable helpers for the /generate/ tools.
 * Randomness is injectable (rand: () => number in [0,1)) so results are testable;
 * widgets pass a crypto-backed rand. Luhn is the standard mod-10 checksum.
 */

/** Roll `count` dice with `sides` faces. */
export function diceRoll(count: number, sides: number, rand: () => number = Math.random): { rolls: number[]; total: number } {
  const n = Math.max(1, Math.min(100, Math.floor(count) || 1));
  const s = Math.max(2, Math.floor(sides) || 6);
  const rolls = Array.from({ length: n }, () => 1 + Math.floor(rand() * s));
  return { rolls, total: rolls.reduce((a, b) => a + b, 0) };
}

/** Random MAC address. localAdmin sets the locally-administered, unicast bits. */
export function randomMac(rand: () => number = Math.random, sep = ':', localAdmin = true, upper = false): string {
  const bytes = Array.from({ length: 6 }, () => Math.floor(rand() * 256));
  if (localAdmin) bytes[0] = (bytes[0] & 0xfc) | 0x02;
  const hex = bytes.map((b) => b.toString(16).padStart(2, '0'));
  const s = hex.join(sep);
  return upper ? s.toUpperCase() : s;
}

/** Luhn check digit for a number string that lacks its final digit. */
export function luhnCheckDigit(partial: string): number {
  let sum = 0, dbl = true;
  for (let i = partial.length - 1; i >= 0; i--) {
    let d = +partial[i];
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d; dbl = !dbl;
  }
  return (10 - (sum % 10)) % 10;
}
/** Validate a full number string against the Luhn checksum. */
export function luhnValid(num: string): boolean {
  const s = num.replace(/\D/g, '');
  if (s.length < 2) return false;
  let sum = 0, dbl = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let d = +s[i];
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d; dbl = !dbl;
  }
  return sum % 10 === 0;
}
/** Generate a Luhn-valid TEST card number from a prefix and total length. */
export function generateTestCard(prefix: string, length: number, rand: () => number = Math.random): string {
  let body = prefix;
  while (body.length < length - 1) body += Math.floor(rand() * 10);
  body = body.slice(0, length - 1);
  return body + luhnCheckDigit(body);
}
