/**
 * Build-time tool ratings, refreshed in CI by scripts/fetch-ratings.mjs
 * (which pulls /api/stats.php from production before each deploy build).
 * Aggregates — and the aggregateRating schema — only render once a tool
 * has >= 25 ratings; the endpoint enforces the same threshold.
 */
import data from '../data/ratings.json';

export interface ToolRating {
  avg: number;
  count: number;
}

const RATINGS = data as Record<string, ToolRating>;

export function ratingFor(slug: string): ToolRating | undefined {
  const r = RATINGS[slug];
  return r && r.count >= 25 ? r : undefined;
}
