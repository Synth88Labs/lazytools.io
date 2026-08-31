/**
 * SEO title/description helpers, keep <title> ≤ 60 chars and
 * <meta name="description"> ≤ 160 chars (Google SERP display limits),
 * which is also what the in-house UX auditor checks for.
 */

const BRAND = ' | LazyTools';

/**
 * Build a page <title> from a tool/page name. Appends the "| LazyTools"
 * brand when it fits in 60 chars; drops it (and, only as a last resort,
 * truncates at a word boundary) when the name is very long.
 */
export function seoTitle(name: string): string {
  const clean = (name || '').trim();
  const withBrand = `${clean}${BRAND}`;
  if (withBrand.length <= 60) return withBrand;
  if (clean.length <= 60) return clean;
  const cut = clean.slice(0, 60);
  const sp = cut.lastIndexOf(' ');
  return (sp >= 40 ? cut.slice(0, sp) : cut).trimEnd();
}

/**
 * Clamp a meta description to `max` chars, trimming at a word boundary and
 * appending an ellipsis. Short descriptions are returned unchanged.
 */
export function clampDescription(desc: string, max = 160): string {
  const d = (desc || '').trim();
  if (d.length <= max) return d;
  const cut = d.slice(0, max - 1);
  const sp = cut.lastIndexOf(' ');
  const base = sp >= 100 ? cut.slice(0, sp) : cut;
  return base.replace(/[\s,;:.–—-]+$/, '') + '…';
}
