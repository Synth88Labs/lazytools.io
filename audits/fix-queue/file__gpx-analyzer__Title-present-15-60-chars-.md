# 🛠️ Fix proposal — file/gpx-analyzer

**Title present (15–60 chars)** (seo/high) · https://lazytools.io/file/gpx-analyzer/ · drafted 2026-08-22 · model claude-sonnet-5

> Senior-Fixer draft. **Review, then apply + deploy through the normal build.** Not auto-committed.

---

# Fix: Title Tag (74 → ≤60 chars)

## Current
```
GPX File Analyzer (Distance, Elevation, Pace) — Fr[...] (74 chars, truncated)
```

## Replacement

**`<title>`:**
```html
<title>GPX File Analyzer – Distance, Elevation & Pace</title>
```
*(52 chars)*

**Meta description** (pair with it, since you're touching the `<head>` anyway):
```html
<meta name="description" content="Analyze GPX files free in your browser. Get distance, elevation gain, pace, and speed stats instantly — no upload, 100% private.">
```
*(155 chars)*

## Notes
- Dropped the truncated "— Free..." suffix (likely "— Free Online Tool") since it was getting cut off in SERPs anyway and adds no unique keyword value beyond what's already implied by lazytools.io branding.
- Kept primary keywords (GPX, Distance, Elevation, Pace) intact and front-loaded for CTR/SEO.
- Used `&` instead of "and" to save 2 chars and match typical tool-title conventions.
- If your title template auto-appends `" | LazyTools"` or similar via a layout/Astro frontmatter (`Astro.props.title`), verify the **final rendered length** stays ≤60 chars including that suffix — adjust the base string further if needed (e.g., drop to `GPX Analyzer – Distance & Elevation` at 37 chars for extra headroom).
