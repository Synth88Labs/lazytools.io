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

// ---- Atbash (reverse alphabet, self-inverse) ----
export function atbash(text: string): string {
  return text.replace(/[a-z]/gi, (ch) => {
    const base = ch <= 'Z' ? 65 : 97;
    return String.fromCharCode(base + (25 - (ch.charCodeAt(0) - base)));
  });
}

// ---- ROT47 (printable-ASCII rotation, self-inverse) ----
export function rot47(text: string): string {
  return text.replace(/[\x21-\x7e]/g, (c) => String.fromCharCode(33 + ((c.charCodeAt(0) - 33 + 47) % 94)));
}

// ---- A1Z26 (letters ↔ numbers) ----
export function a1z26Encode(text: string): string {
  return text.toUpperCase().split('\n').map((line) =>
    line.split(/\s+/).filter(Boolean).map((word) =>
      [...word].map((ch) => (/[A-Z]/.test(ch) ? String(ch.charCodeAt(0) - 64) : ch)).join('-')
    ).join(' ')
  ).join('\n');
}
export function a1z26Decode(str: string): string {
  return str.split('\n').map((line) =>
    line.split(/\s+/).filter(Boolean).map((word) =>
      word.split(/[-,._/]+/).filter(Boolean).map((tok) => {
        const n = parseInt(tok, 10);
        return n >= 1 && n <= 26 ? String.fromCharCode(64 + n) : tok;
      }).join('')
    ).join(' ')
  ).join('\n');
}

// ---- Bacon's cipher (unique 26-letter, A/B in 5 bits) ----
export function baconEncode(text: string): string {
  return [...text.toUpperCase()].filter((c) => /[A-Z]/.test(c)).map((c) =>
    (c.charCodeAt(0) - 65).toString(2).padStart(5, '0').replace(/0/g, 'A').replace(/1/g, 'B')
  ).join(' ');
}
export function baconDecode(str: string): string {
  return str.trim().toUpperCase().split(/\s+/).filter(Boolean).map((g) => {
    if (!/^[AB]{5}$/.test(g)) return '#';
    return String.fromCharCode(65 + parseInt(g.replace(/A/g, '0').replace(/B/g, '1'), 2));
  }).join('');
}

// ---- Rail fence (zigzag transposition) ----
function railPattern(n: number, rails: number): number[] {
  const p: number[] = [];
  let r = 0, dir = 1;
  for (let i = 0; i < n; i++) {
    p.push(r);
    if (r === 0) dir = 1;
    else if (r === rails - 1) dir = -1;
    r += dir;
  }
  return p;
}
export function railFenceEncode(text: string, rails: number): string {
  if (rails < 2) return text;
  const rows: string[] = Array.from({ length: rails }, () => '');
  railPattern(text.length, rails).forEach((r, i) => (rows[r] += text[i]));
  return rows.join('');
}
export function railFenceDecode(cipher: string, rails: number): string {
  if (rails < 2) return cipher;
  const pattern = railPattern(cipher.length, rails);
  const counts = Array(rails).fill(0);
  pattern.forEach((r) => counts[r]++);
  const railStrs: string[] = [];
  let idx = 0;
  for (let r = 0; r < rails; r++) { railStrs.push(cipher.slice(idx, idx + counts[r])); idx += counts[r]; }
  const pos = Array(rails).fill(0);
  return pattern.map((r) => railStrs[r]![pos[r]++]).join('');
}

// ---- Braille (Grade 1, Unicode) ----
const BRAILLE_LETTERS = 'a⠁b⠃c⠉d⠙e⠑f⠋g⠛h⠓i⠊j⠚k⠅l⠇m⠍n⠝o⠕p⠏q⠟r⠗s⠎t⠞u⠥v⠧w⠺x⠭y⠽z⠵';
const BRAILLE_PUNCT = ",⠂;⠆:⠒.⠲?⠦!⠖'⠄-⠤(⠐)⠰"; // pairs char,braille
const B_NUMBER = '⠼', B_CAPITAL = '⠠', B_LETTER = '⠰';
const AtoBraille: Record<string, string> = {};
const BrailleToA: Record<string, string> = {};
for (let i = 0; i < BRAILLE_LETTERS.length; i += 2) { AtoBraille[BRAILLE_LETTERS[i]!] = BRAILLE_LETTERS[i + 1]!; BrailleToA[BRAILLE_LETTERS[i + 1]!] = BRAILLE_LETTERS[i]!; }
const punctMap: Record<string, string> = {};
const punctRev: Record<string, string> = {};
for (let i = 0; i < BRAILLE_PUNCT.length; i += 2) { punctMap[BRAILLE_PUNCT[i]!] = BRAILLE_PUNCT[i + 1]!; punctRev[BRAILLE_PUNCT[i + 1]!] = BRAILLE_PUNCT[i]!; }
const digitToLetter = (d: string) => 'jabcdefghi'[+d]!; // 0→j, 1→a … 9→i
const letterToDigit: Record<string, string> = { j: '0', a: '1', b: '2', c: '3', d: '4', e: '5', f: '6', g: '7', h: '8', i: '9' };

export function textToBraille(text: string): string {
  let out = '', numberMode = false;
  for (const ch of text) {
    if (ch >= '0' && ch <= '9') {
      if (!numberMode) { out += B_NUMBER; numberMode = true; }
      out += AtoBraille[digitToLetter(ch)];
    } else if (/[a-z]/i.test(ch)) {
      const lower = ch.toLowerCase();
      if (numberMode) { out += B_LETTER; numberMode = false; }
      if (ch !== lower) out += B_CAPITAL;
      out += AtoBraille[lower];
    } else if (ch === ' ') { numberMode = false; out += ' '; }
    else if (punctMap[ch]) { numberMode = false; out += punctMap[ch]; }
    else { numberMode = false; out += ch; }
  }
  return out;
}
export function brailleToText(braille: string): string {
  let out = '', numberMode = false, capital = false;
  for (const cell of braille) {
    if (cell === B_CAPITAL) { capital = true; continue; }
    if (cell === B_NUMBER) { numberMode = true; continue; }
    if (cell === B_LETTER) { numberMode = false; continue; }
    if (cell === ' ') { numberMode = false; out += ' '; continue; }
    const letter = BrailleToA[cell];
    if (letter) {
      if (numberMode && letter in letterToDigit) { out += letterToDigit[letter]; continue; }
      out += capital ? letter.toUpperCase() : letter;
      capital = false;
    } else if (punctRev[cell]) { numberMode = false; out += punctRev[cell]; }
    else out += cell;
  }
  return out;
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
