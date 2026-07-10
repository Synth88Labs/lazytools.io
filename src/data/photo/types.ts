/**
 * Photo Size Maker registry model. One PhotoSpec drives a country×document page:
 * the editor's crop geometry, the live preview, the exact export, the compliance
 * checks, and the on-page Do's/Don'ts + cited source card.
 *
 * SENSITIVITY NOTE: every dimension here is an official government requirement — a
 * wrong value gets a real application rejected. No value ships without `source` +
 * `lastVerified`. When an authority specifies a field we cannot verify, leave it
 * undefined rather than guessing; the editor degrades gracefully.
 */

export type DocType = 'passport' | 'visa' | 'national-id';

/** Named background colours countries actually specify, plus an exact hex fallback. */
export type BgColor = 'white' | 'off-white' | 'light-grey' | 'light-blue' | 'cream';

export interface PhotoSpec {
  /** URL slug under /photo/, e.g. "us-passport", "schengen-visa". */
  slug: string;
  /** H1 / card name, e.g. "US Passport Photo". */
  label: string;
  /** Country display name, e.g. "United States". */
  country: string;
  /** ISO 3166-1 alpha-2, e.g. "US". "EU" is used for the Schengen area. */
  countryCode: string;
  docType: DocType;
  /** Flag emoji for cards/headers. */
  flag: string;

  // ---- physical print size (the authoritative spec for most countries) ----
  widthMm: number;
  heightMm: number;
  /** Set when the country specifies inches natively (US/India 2×2in) — display only. */
  widthIn?: number;
  heightIn?: number;

  // ---- digital output ----
  /** Print resolution. Most authorities imply 300; flagged as assumed where unstated. */
  dpi: number;
  /** Exact pixel dimensions when the authority specifies them (China/US-digital/UK-online). */
  pixelWidth?: number;
  pixelHeight?: number;
  /** Some authorities give a pixel RANGE (e.g. US 600–1200). Min/max square side or W/H. */
  pixelMin?: number;
  pixelMax?: number;

  // ---- face geometry (used to draw crop guides + run the ML position check) ----
  /** Head height (chin to crown) in mm, if specified. */
  headHeightMinMm?: number;
  headHeightMaxMm?: number;
  /** Head height as a fraction of image height (0–1). Derived from mm if absent. */
  headHeightMinPct?: number;
  headHeightMaxPct?: number;
  /** Eye line position as a fraction of image height measured from the BOTTOM (0–1). */
  eyeMinPctFromBottom?: number;
  eyeMaxPctFromBottom?: number;

  // ---- background & file ----
  background: BgColor;
  /** Human phrasing exactly as the authority words it. */
  backgroundLabel: string;
  allowedFormats: ('jpeg' | 'png')[];
  fileSizeMinKb?: number;
  fileSizeMaxKb?: number;

  // ---- provenance (MANDATORY) ----
  /** Issuing authority, e.g. "U.S. Department of State". */
  sourceName: string;
  /** Official government/consulate URL — never a photo-vendor blog. */
  sourceUrl: string;
  /** ISO date the spec was last checked against the source. */
  lastVerified: string;

  // ---- editorial (on-page cards) ----
  dos: string[];
  donts: string[];
  /** Country-specific gotchas surfaced under the editor. */
  notes?: string[];
  /** One-line meta description / lead. */
  lead: string;
}

/** Named background colours → the exact fill used for matting & the checker target. */
export const BG_HEX: Record<BgColor, string> = {
  white: '#ffffff',
  'off-white': '#fafaf7',
  'light-grey': '#e9eaec',
  'light-blue': '#dfe8f2',
  cream: '#f6f1e7',
};

/** mm → pixels at a given DPI (1 in = 25.4 mm). */
export const mmToPx = (mm: number, dpi: number): number => Math.round((mm / 25.4) * dpi);

/**
 * Resolve the concrete pixel output size for a spec, honouring an explicit
 * pixel spec first, otherwise deriving from physical mm at the spec DPI.
 */
export function outputPixels(s: PhotoSpec): { w: number; h: number } {
  if (s.pixelWidth && s.pixelHeight) return { w: s.pixelWidth, h: s.pixelHeight };
  return { w: mmToPx(s.widthMm, s.dpi), h: mmToPx(s.heightMm, s.dpi) };
}

/** Head-height guide band as a fraction of image height, derived from whichever field exists. */
export function headHeightBand(s: PhotoSpec): { min: number; max: number } | null {
  if (s.headHeightMinPct != null && s.headHeightMaxPct != null) {
    return { min: s.headHeightMinPct, max: s.headHeightMaxPct };
  }
  if (s.headHeightMinMm != null && s.headHeightMaxMm != null) {
    return { min: s.headHeightMinMm / s.heightMm, max: s.headHeightMaxMm / s.heightMm };
  }
  return null;
}
