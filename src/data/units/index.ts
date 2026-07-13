import type { Quantity, Unit, PairMeta } from './types.ts';
import { length } from './length.ts';
import { weight } from './weight.ts';
import { temperature } from './temperature.ts';
import { area } from './area.ts';
import { volume } from './volume.ts';
import { speed } from './speed.ts';
import { time } from './time.ts';
import { dataStorage } from './data-storage.ts';
import { pressure } from './pressure.ts';
import { energy } from './energy.ts';
import { power } from './power.ts';
import { dataTransferRate } from './data-transfer-rate.ts';
import { frequency } from './frequency.ts';
import { torque } from './torque.ts';
import { force } from './force.ts';
import { density } from './density.ts';
import { flowRate } from './flow-rate.ts';
import { angle } from './angle.ts';
import { acceleration } from './acceleration.ts';
import { illuminance } from './illuminance.ts';
import { magneticField } from './magnetic-field.ts';
import { viscosity } from './viscosity.ts';
import { kinematicViscosity } from './kinematic-viscosity.ts';
import { radioactivity } from './radioactivity.ts';

export type { Quantity, Unit, PairMeta };

export const QUANTITIES: Quantity[] = [
  length,
  weight,
  temperature,
  volume,
  area,
  speed,
  time,
  dataStorage,
  pressure,
  energy,
  power,
  dataTransferRate,
  frequency,
  torque,
  force,
  density,
  flowRate,
  angle,
  acceleration,
  illuminance,
  magneticField,
  viscosity,
  kinematicViscosity,
  radioactivity,
];

/** baseValue = v * factor + offset; target = (base - offset2) / factor2 */
export function convert(value: number, from: Unit, to: Unit): number {
  const base = value * from.factor + (from.offset ?? 0);
  return (base - (to.offset ?? 0)) / to.factor;
}

/** Multiplicative factor between two offset-free units (1 from = N to). */
export function factorBetween(from: Unit, to: Unit): number {
  return from.factor / to.factor;
}

export function isLinearPair(from: Unit, to: Unit): boolean {
  return !from.offset && !to.offset;
}

/** Format a number for display: up to `sig` significant digits, no float noise, grouping for big values. */
export function formatNumber(value: number, sig = 10): string {
  if (!Number.isFinite(value)) return '—';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1e15 || abs < 1e-9) return value.toExponential(4);
  const precise = Number(value.toPrecision(sig));
  return precise.toLocaleString('en-US', {
    maximumFractionDigits: 12,
    useGrouping: Math.abs(precise) >= 10000,
  });
}

/**
 * Noun for titles/links: "Kilograms" (plural) for normal units,
 * but the scale name ("Celsius") for offset scales where pluralizing is wrong.
 */
export function titleNoun(u: Unit): string {
  if (u.offset !== undefined) return u.name;
  return u.plural.charAt(0).toUpperCase() + u.plural.slice(1);
}

/** Singular noun with article for prose: "a kilogram" / "the Celsius scale". */
export function proseNoun(u: Unit): string {
  if (u.offset !== undefined) return `the ${u.name} scale`;
  return `a ${u.name.toLowerCase()}`;
}

export interface Pair {
  quantity: Quantity;
  from: Unit;
  to: Unit;
  slug: string;
  meta?: PairMeta;
}

export function pairSlug(from: Unit, to: Unit): string {
  return `${from.slug}-to-${to.slug}`;
}

export function getUnit(q: Quantity, id: string): Unit {
  const u = q.units.find((u) => u.id === id);
  if (!u) throw new Error(`Unknown unit "${id}" in quantity "${q.id}"`);
  return u;
}

/** All directional pairs that get static pages. */
export function allPairs(): Pair[] {
  const pairs: Pair[] = [];
  for (const q of QUANTITIES) {
    for (const [fromId, toId] of q.popularPairs) {
      const from = getUnit(q, fromId);
      const to = getUnit(q, toId);
      const slug = pairSlug(from, to);
      pairs.push({ quantity: q, from, to, slug, meta: q.pairMeta?.[slug] });
    }
  }
  return pairs;
}

export function getPair(slug: string): Pair | undefined {
  return allPairs().find((p) => p.slug === slug);
}

export function getQuantity(slug: string): Quantity | undefined {
  return QUANTITIES.find((q) => q.slug === slug);
}

/** Human formula sentence for a pair (falls back to generated text for linear pairs). */
export function formulaText(pair: Pair): string {
  if (pair.meta?.formulaText) return pair.meta.formulaText;
  const f = factorBetween(pair.from, pair.to);
  return `${pair.to.plural} = ${pair.from.plural} × ${formatNumber(f, 10)} — multiply the ${pair.from.name.toLowerCase()} value by ${formatNumber(f, 6)}.`;
}

export function reverseFormulaText(pair: Pair): string {
  if (pair.meta?.reverseFormulaText) return pair.meta.reverseFormulaText;
  const f = factorBetween(pair.from, pair.to);
  return `${pair.from.plural} = ${pair.to.plural} ÷ ${formatNumber(f, 10)}`;
}

/** The one-sentence citable fact: "1 kilogram = 2.2046226218 pounds." */
export function factSentence(pair: Pair): string {
  if (isLinearPair(pair.from, pair.to)) {
    const f = factorBetween(pair.from, pair.to);
    return `1 ${pair.from.name.toLowerCase()} (${pair.from.symbol}) = ${formatNumber(f, 10)} ${pair.to.plural} (${pair.to.symbol}).`;
  }
  const converted = convert(1, pair.from, pair.to);
  return `1 ${pair.from.symbol} equals ${formatNumber(converted, 10)} ${pair.to.symbol} — note this scale uses an offset formula, not simple multiplication.`;
}

/** Default from-values for the conversion table. */
export function tableValues(pair: Pair): number[] {
  return (
    pair.meta?.tableValues ?? [0.1, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40, 50, 75, 100, 250, 500, 1000]
  );
}

/** Related pairs from the same quantity (excluding self), reverse pair first if it exists. */
export function relatedPairs(pair: Pair, limit = 10): Pair[] {
  const all = allPairs().filter((p) => p.quantity.id === pair.quantity.id && p.slug !== pair.slug);
  const reverseSlug = pairSlug(pair.to, pair.from);
  all.sort((a, b) => (a.slug === reverseSlug ? -1 : b.slug === reverseSlug ? 1 : 0));
  return all.slice(0, limit);
}

/** Flagship pairs for the homepage — first pair of each quantity, then depth. */
export function popularPairsGlobal(limit = 12): Pair[] {
  const byQuantity = QUANTITIES.map((q) => allPairs().filter((p) => p.quantity.id === q.id));
  const out: Pair[] = [];
  for (let i = 0; out.length < limit; i++) {
    let added = false;
    for (const list of byQuantity) {
      if (list[i] && out.length < limit) {
        out.push(list[i]);
        added = true;
      }
    }
    if (!added) break;
  }
  return out;
}
