/**
 * Check-digit validation for barcodes/GTINs (EAN-13, UPC-A, EAN-8, GTIN-14,
 * ITF-14), ISBN-10/13, ISSN, and Luhn-based identifiers (IMEI, and generic
 * Luhn e.g. credit-card format). Pure and deterministic, every algorithm is a
 * fixed, published checksum, so results are exact and Node-testable.
 */

function digitsOnly(s: string): string {
  return s.replace(/[\s-]/g, '');
}

/** GS1 mod-10 check digit for the given data digits (no check digit included). */
export function gtinCheckDigit(dataDigits: string): number {
  let sum = 0;
  const rev = dataDigits.split('').reverse();
  for (let i = 0; i < rev.length; i++) {
    sum += Number(rev[i]) * (i % 2 === 0 ? 3 : 1); // rightmost data digit weighted ×3
  }
  return (10 - (sum % 10)) % 10;
}

const GTIN_NAMES: Record<number, string> = { 8: 'EAN-8', 12: 'UPC-A', 13: 'EAN-13 / GTIN-13', 14: 'GTIN-14 / ITF-14' };

export interface GtinResult {
  input: string; length: number; format: string;
  valid: boolean; expectedCheckDigit: number; actualCheckDigit: number;
}
/** Validate an EAN/UPC/GTIN barcode number by its trailing check digit. */
export function validateGtin(raw: string): GtinResult | null {
  const s = digitsOnly(raw);
  if (!/^\d+$/.test(s) || !(s.length === 8 || s.length === 12 || s.length === 13 || s.length === 14)) return null;
  const data = s.slice(0, -1);
  const actual = Number(s.slice(-1));
  const expected = gtinCheckDigit(data);
  return { input: s, length: s.length, format: GTIN_NAMES[s.length], valid: expected === actual, expectedCheckDigit: expected, actualCheckDigit: actual };
}

/** Complete a barcode from its data digits (all but the check digit). */
export function completeGtin(dataDigits: string): string | null {
  const s = digitsOnly(dataDigits);
  if (!/^\d+$/.test(s) || !(s.length === 7 || s.length === 11 || s.length === 12 || s.length === 13)) return null;
  return s + gtinCheckDigit(s);
}

// ---------------- ISBN ----------------

export interface IsbnResult { input: string; type: 'ISBN-10' | 'ISBN-13'; valid: boolean; expectedCheckDigit: string; }

export function validateIsbn(raw: string): IsbnResult | null {
  const s = digitsOnly(raw).toUpperCase();
  if (/^\d{9}[\dX]$/.test(s)) {
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += Number(s[i]) * (10 - i);
    const check = (11 - (sum % 11)) % 11;
    const expected = check === 10 ? 'X' : String(check);
    return { input: s, type: 'ISBN-10', valid: expected === s[9], expectedCheckDigit: expected };
  }
  if (/^\d{13}$/.test(s)) {
    const expected = String(gtinCheckDigit(s.slice(0, 12)));
    return { input: s, type: 'ISBN-13', valid: expected === s[12], expectedCheckDigit: expected };
  }
  return null;
}

/** ISSN: 8 digits (last may be X), mod-11 weighted 8..2. */
export interface IssnResult { input: string; valid: boolean; expectedCheckDigit: string; }
export function validateIssn(raw: string): IssnResult | null {
  const s = digitsOnly(raw).toUpperCase();
  if (!/^\d{7}[\dX]$/.test(s)) return null;
  let sum = 0;
  for (let i = 0; i < 7; i++) sum += Number(s[i]) * (8 - i);
  const check = (11 - (sum % 11)) % 11;
  const expected = check === 10 ? 'X' : String(check);
  return { input: s, valid: expected === s[7], expectedCheckDigit: expected };
}

// ---------------- Luhn / IMEI ----------------

/** Luhn checksum validity for a numeric string (whole number incl. its check digit). */
export function luhnValid(raw: string): boolean {
  const s = digitsOnly(raw);
  if (!/^\d+$/.test(s) || s.length < 2) return false;
  let sum = 0, alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let d = Number(s[i]);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d; alt = !alt;
  }
  return sum % 10 === 0;
}

/** Luhn check digit that would make dataDigits valid. */
export function luhnCheckDigit(dataDigits: string): number {
  const s = digitsOnly(dataDigits);
  let sum = 0, alt = true; // the appended digit is position 1 (not doubled); so data digit nearest it IS doubled
  for (let i = s.length - 1; i >= 0; i--) {
    let d = Number(s[i]);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d; alt = !alt;
  }
  return (10 - (sum % 10)) % 10;
}

export interface ImeiResult {
  input: string; valid: boolean; length: number;
  tac: string; serial: string; checkDigit: string; expectedCheckDigit: number;
}
/** Validate a 15-digit IMEI (Luhn) and split into TAC / serial / check digit. */
export function validateImei(raw: string): ImeiResult | null {
  const s = digitsOnly(raw);
  if (!/^\d{15}$/.test(s)) return null;
  return {
    input: s,
    valid: luhnValid(s),
    length: 15,
    tac: s.slice(0, 8),      // Type Allocation Code
    serial: s.slice(8, 14),  // device serial
    checkDigit: s.slice(14),
    expectedCheckDigit: luhnCheckDigit(s.slice(0, 14)),
  };
}
