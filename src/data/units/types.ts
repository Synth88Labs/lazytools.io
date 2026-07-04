/**
 * Unit conversion data model.
 *
 * Every unit converts to its quantity's base unit via a linear transform:
 *   baseValue = value * factor + offset
 * This covers all standard units including temperatures.
 */

export interface Unit {
  /** Stable id used in data and pair definitions, e.g. "kg" */
  id: string;
  /** Singular display name, e.g. "Kilogram" */
  name: string;
  /** Plural display name, e.g. "kilograms" */
  plural: string;
  /** Symbol shown next to values, e.g. "kg" */
  symbol: string;
  /** URL token used in pair slugs — must match how people search, e.g. "kg", "inches" */
  slug: string;
  /** baseValue = value * factor + offset */
  factor: number;
  offset?: number;
  system: 'metric' | 'imperial' | 'us' | 'uk' | 'si' | 'other';
  /** 1–2 sentence citable definition. Rendered on pair pages — must be accurate and self-contained. */
  definition: string;
}

/** Extra hand-written content for high-value pairs (uniqueness + accuracy for non-multiplicative formulas). */
export interface PairMeta {
  /** e.g. "celsius-to-fahrenheit" */
  slug: string;
  /** Overrides the generated "multiply by N" formula copy. Required for offset units (temperature). */
  formulaText?: string;
  reverseFormulaText?: string;
  /** A realistic worked example input value, e.g. 70 for kg→lbs (body weight). */
  exampleValue?: number;
  /** Real-world context paragraph — makes the page genuinely unique. */
  note?: string;
  /** Override the from-values used in the conversion table. */
  tableValues?: number[];
  /** Extra pair-specific FAQ items appended to the generated ones. */
  faqs?: { q: string; a: string }[];
}

export interface Quantity {
  /** e.g. "weight" */
  id: string;
  /** Display name, e.g. "Weight & Mass" */
  name: string;
  /** URL segment, e.g. "weight" → /units/weight/ */
  slug: string;
  /** Base unit id (factor 1, offset 0) */
  baseUnit: string;
  /** Icon emoji for hubs/cards */
  icon: string;
  /** 1–2 sentence hub description, citable */
  description: string;
  units: Unit[];
  /**
   * Directional pairs that get their own static page, ordered by priority.
   * [fromId, toId] → /units/{from.slug}-to-{to.slug}/
   */
  popularPairs: [string, string][];
  /** Optional hand-written extras keyed by pair slug */
  pairMeta?: Record<string, PairMeta>;
}
