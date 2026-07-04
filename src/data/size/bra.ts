/**
 * Bra size conversion: band systems + cup ladders + sister sizes.
 *
 * Band equivalence (standard chart): US/UK band (inches) ↔ EU (cm, steps of 5)
 * ↔ FR/ES (EU + 15) ↔ IT (index) ↔ AU (dress number = US band − 22).
 * Cup ladders diverge past D: US uses DD/DDD/G…, UK uses DD/E/F/FF/G…, EU uses E/F/G….
 * A "sister size" keeps cup VOLUME constant: band down one step = cup up one step.
 */

export interface BandRow {
  us: number; // == UK band, inches
  eu: number;
  fr: number;
  it: number;
  au: number;
}

export const BANDS: BandRow[] = [
  { us: 28, eu: 60, fr: 75, it: 0, au: 6 },
  { us: 30, eu: 65, fr: 80, it: 1, au: 8 },
  { us: 32, eu: 70, fr: 85, it: 2, au: 10 },
  { us: 34, eu: 75, fr: 90, it: 3, au: 12 },
  { us: 36, eu: 80, fr: 95, it: 4, au: 14 },
  { us: 38, eu: 85, fr: 100, it: 5, au: 16 },
  { us: 40, eu: 90, fr: 105, it: 6, au: 18 },
  { us: 42, eu: 95, fr: 110, it: 7, au: 20 },
  { us: 44, eu: 100, fr: 115, it: 8, au: 22 },
];

/** Cup ladders by index (0 = A). Same index = same cup depth across systems. */
export const CUPS: Record<'us' | 'uk' | 'eu', string[]> = {
  us: ['A', 'B', 'C', 'D', 'DD', 'DDD', 'G', 'H', 'I', 'J'],
  uk: ['A', 'B', 'C', 'D', 'DD', 'E', 'F', 'FF', 'G', 'GG'],
  eu: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
};

export function bandRow(us: number): BandRow | undefined {
  return BANDS.find((b) => b.us === us);
}

/**
 * Sister sizes: same cup volume, different band.
 * Down: band −1 step, cup +1 index. Up: band +1 step, cup −1 index.
 */
export function sisterSizes(usBand: number, cupIndex: number): { down?: { band: number; cupIndex: number }; up?: { band: number; cupIndex: number } } {
  const i = BANDS.findIndex((b) => b.us === usBand);
  const out: ReturnType<typeof sisterSizes> = {};
  if (i > 0 && cupIndex + 1 < CUPS.us.length) out.down = { band: BANDS[i - 1]!.us, cupIndex: cupIndex + 1 };
  if (i >= 0 && i + 1 < BANDS.length && cupIndex - 1 >= 0) out.up = { band: BANDS[i + 1]!.us, cupIndex: cupIndex - 1 };
  return out;
}
