/**
 * Client-side PII detection and redaction for the /security/ category. Finds
 * emails, phone numbers, US SSNs, credit-card numbers (Luhn-validated), IPv4/6
 * addresses and IBANs in free text and masks them — so a user can scrub
 * personal data before pasting it into a chatbot or ticket. Pure regex + Luhn;
 * nothing leaves the browser. Detection is best-effort, not a guarantee.
 */

export type PiiType = 'email' | 'phone' | 'ssn' | 'card' | 'ipv4' | 'ipv6' | 'iban';
export type MaskStyle = 'label' | 'block' | 'partial';

export interface PiiMatch { type: PiiType; value: string; start: number; end: number; }

export const PII_LABELS: Record<PiiType, string> = {
  email: 'Email', phone: 'Phone', ssn: 'SSN', card: 'Card', ipv4: 'IPv4', ipv6: 'IPv6', iban: 'IBAN',
};

// Priority for resolving overlaps (higher wins).
const PRIORITY: Record<PiiType, number> = { email: 7, iban: 6, card: 5, ssn: 4, ipv6: 3, phone: 2, ipv4: 1 };

const PATTERNS: { type: PiiType; re: RegExp; validate?: (s: string) => boolean }[] = [
  { type: 'email', re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g },
  { type: 'iban', re: /\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/g, validate: validIban },
  { type: 'card', re: /\b(?:\d[ -]?){13,19}\b/g, validate: (s) => { const d = s.replace(/[ -]/g, ''); return d.length >= 13 && d.length <= 19 && luhn(d); } },
  { type: 'ssn', re: /\b\d{3}-\d{2}-\d{4}\b/g },
  { type: 'ipv6', re: /\b(?:[A-Fa-f0-9]{1,4}:){2,7}[A-Fa-f0-9]{1,4}\b/g, validate: (s) => s.includes(':') && s.split(':').length >= 3 },
  { type: 'phone', re: /(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g, validate: (s) => (s.replace(/\D/g, '').length >= 10) },
  { type: 'ipv4', re: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, validate: (s) => s.split('.').every((o) => +o >= 0 && +o <= 255) },
];

/** Luhn checksum (credit cards). */
export function luhn(digits: string): boolean {
  if (!/^\d+$/.test(digits)) return false;
  let sum = 0, alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d; alt = !alt;
  }
  return sum % 10 === 0;
}

/** Basic IBAN mod-97 check. */
function validIban(iban: string): boolean {
  const s = iban.toUpperCase();
  if (s.length < 15 || s.length > 34) return false;
  const rearr = s.slice(4) + s.slice(0, 4);
  let rem = 0;
  for (const ch of rearr) {
    const v = /[0-9]/.test(ch) ? ch : String(ch.charCodeAt(0) - 55);
    for (const c of v) rem = (rem * 10 + (c.charCodeAt(0) - 48)) % 97;
  }
  return rem === 1;
}

/** Detect all enabled PII types, resolving overlaps by priority. Returns non-overlapping matches sorted by position. */
export function detectPii(text: string, enabled: Record<PiiType, boolean>): PiiMatch[] {
  const all: PiiMatch[] = [];
  for (const p of PATTERNS) {
    if (!enabled[p.type]) continue;
    p.re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = p.re.exec(text)) !== null) {
      const value = m[0];
      if (p.validate && !p.validate(value)) continue;
      all.push({ type: p.type, value, start: m.index, end: m.index + value.length });
    }
  }
  all.sort((a, b) => a.start - b.start || PRIORITY[b.type] - PRIORITY[a.type]);
  const out: PiiMatch[] = [];
  let lastEnd = -1;
  for (const m of all) {
    if (m.start >= lastEnd) { out.push(m); lastEnd = m.end; }
    else {
      // overlap: replace previous if this one is higher priority and starts at same place
      const prev = out[out.length - 1];
      if (prev && m.start === prev.start && PRIORITY[m.type] > PRIORITY[prev.type] && m.end >= prev.end) {
        out[out.length - 1] = m; lastEnd = m.end;
      }
    }
  }
  return out;
}

/** Mask a single match according to the style. */
function maskValue(m: PiiMatch, style: MaskStyle): string {
  if (style === 'label') return `[${PII_LABELS[m.type].toUpperCase()}]`;
  if (style === 'block') return '█'.repeat(Math.min(m.value.length, 12));
  // partial: keep last 4 significant chars for card/phone/iban, mask the rest of the value's characters
  if (m.type === 'card' || m.type === 'phone' || m.type === 'iban' || m.type === 'ssn') {
    const digits = m.value.replace(/\D/g, '');
    const last4 = digits.slice(-4);
    return `••••${last4}`;
  }
  if (m.type === 'email') {
    const at = m.value.indexOf('@');
    return `${m.value[0]}•••${m.value.slice(at)}`;
  }
  return '•'.repeat(Math.min(m.value.length, 12));
}

export interface RedactResult { text: string; matches: PiiMatch[]; counts: Partial<Record<PiiType, number>>; }

/** Redact the detected PII in the text. */
export function redactPii(text: string, enabled: Record<PiiType, boolean>, style: MaskStyle = 'label'): RedactResult {
  const matches = detectPii(text, enabled);
  let out = '';
  let cursor = 0;
  const counts: Partial<Record<PiiType, number>> = {};
  for (const m of matches) {
    out += text.slice(cursor, m.start) + maskValue(m, style);
    cursor = m.end;
    counts[m.type] = (counts[m.type] ?? 0) + 1;
  }
  out += text.slice(cursor);
  return { text: out, matches, counts };
}

export const ALL_TYPES: PiiType[] = ['email', 'phone', 'ssn', 'card', 'ipv4', 'ipv6', 'iban'];
export const defaultEnabled = (): Record<PiiType, boolean> =>
  ({ email: true, phone: true, ssn: true, card: true, ipv4: true, ipv6: true, iban: true });
