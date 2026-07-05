/**
 * Women's clothing (dress/top) size conversion — the standard published chart.
 * Relations: UK = US + 4 · EU/DE = US + 30 · FR = US + 32 · IT = US + 36 ·
 * AU = UK · JP = US + 5. Letter sizes are the common retail mapping.
 */

export interface DressRow {
  us: number;
  uk: number;
  eu: number;
  fr: number;
  it: number;
  au: number;
  jp: number;
  letter: string;
}

const LETTERS: Record<number, string> = {
  0: 'XS', 2: 'XS', 4: 'S', 6: 'S', 8: 'M', 10: 'M', 12: 'L', 14: 'L', 16: 'XL', 18: 'XL', 20: 'XXL',
};

export const DRESS_ROWS: DressRow[] = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((us) => ({
  us,
  uk: us + 4,
  eu: us + 30,
  fr: us + 32,
  it: us + 36,
  au: us + 4,
  jp: us + 5,
  letter: LETTERS[us]!,
}));
