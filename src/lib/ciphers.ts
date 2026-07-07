/** Codes & ciphers — deterministic text transforms, all local. */

// ---- Morse ----
export const MORSE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
  K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
  U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
};
const MORSE_REV: Record<string, string> = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

export function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split('\n')
    .map((line) =>
      line
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => [...word].map((ch) => MORSE[ch] ?? (ch === '' ? '' : '#')).join(' '))
        .join(' / ')
    )
    .join('\n');
}
export function morseToText(morse: string): string {
  return morse
    .trim()
    .split('\n')
    .map((line) =>
      line
        .split(/\s*\/\s*|\s{2,}/)
        .map((word) =>
          word
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((code) => MORSE_REV[code] ?? '#')
            .join('')
        )
        .join(' ')
    )
    .join('\n');
}

// ---- NATO phonetic ----
export const NATO: Record<string, string> = {
  A: 'Alfa', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo', F: 'Foxtrot', G: 'Golf', H: 'Hotel', I: 'India',
  J: 'Juliett', K: 'Kilo', L: 'Lima', M: 'Mike', N: 'November', O: 'Oscar', P: 'Papa', Q: 'Quebec', R: 'Romeo',
  S: 'Sierra', T: 'Tango', U: 'Uniform', V: 'Victor', W: 'Whiskey', X: 'X-ray', Y: 'Yankee', Z: 'Zulu',
  '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine',
};
const NATO_REV: Record<string, string> = Object.fromEntries(Object.entries(NATO).map(([k, v]) => [v.toUpperCase(), k]));

export function textToNato(text: string): string {
  return text
    .toUpperCase()
    .split('\n')
    .map((line) => [...line].map((ch) => (ch === ' ' ? '|' : NATO[ch] ?? ch)).filter((s) => s !== '').join(' '))
    .join('\n');
}
export function natoToText(nato: string): string {
  return nato
    .split('\n')
    .map((line) =>
      line
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => (w === '|' ? ' ' : NATO_REV[w.toUpperCase()] ?? w))
        .join('')
    )
    .join('\n');
}

// ---- Binary (UTF-8, 8 bits per byte) ----
export function textToBinary(text: string): string {
  const bytes = new TextEncoder().encode(text);
  return [...bytes].map((b) => b.toString(2).padStart(8, '0')).join(' ');
}
export function binaryToText(binary: string): string {
  const groups = binary.trim().split(/\s+/).filter(Boolean);
  const bytes = groups.map((g) => parseInt(g, 2)).filter((n) => Number.isFinite(n) && n >= 0 && n <= 255);
  try {
    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch {
    return bytes.map((b) => String.fromCharCode(b)).join('');
  }
}

// ---- Caesar / ROT ----
export function caesar(text: string, shift: number): string {
  const s = ((shift % 26) + 26) % 26;
  return text.replace(/[a-z]/gi, (ch) => {
    const base = ch <= 'Z' ? 65 : 97;
    return String.fromCharCode(((ch.charCodeAt(0) - base + s) % 26) + base);
  });
}
export function rot13(text: string): string {
  return caesar(text, 13);
}
/** All 25 non-trivial Caesar shifts, for cracking. */
export function caesarBruteForce(text: string): { shift: number; text: string }[] {
  return Array.from({ length: 25 }, (_, i) => ({ shift: i + 1, text: caesar(text, -(i + 1)) }));
}

// ---- Vigenère ----
export function vigenere(text: string, key: string, decode: boolean): string {
  const k = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!k) return text;
  let ki = 0;
  return text.replace(/[a-z]/gi, (ch) => {
    const base = ch <= 'Z' ? 65 : 97;
    const shift = k.charCodeAt(ki % k.length) - 65;
    ki++;
    const s = decode ? -shift : shift;
    return String.fromCharCode(((ch.charCodeAt(0) - base + s + 26) % 26) + base);
  });
}
