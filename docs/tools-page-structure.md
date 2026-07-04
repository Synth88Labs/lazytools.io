# LazyTools.io — Tools Page Structure

*Decided: July 2026. Based on market research of TinyWow, 123apps, iLovePDF, VERT.sh, Squoosh, it-tools and current SEO/GEO practice.*

## Market findings

| Player | Model | URL pattern | Weakness we exploit |
|---|---|---|---|
| TinyWow (200+ tools) | Server-side, files deleted after 1h | `/{category}/{tool}` e.g. `/pdf/merge` | Uploads files — not truly private |
| 123apps / Clideo / FreeConvert | Server-side processing | Mixed, some separate domains | Same — privacy is a policy, not architecture |
| iLovePDF / Smallpdf | Server-side, single category | Flat `/merge_pdf` | Single-category, freemium walls |
| VERT.sh | Client-side WASM, open source | Flat, app-like | Narrow scope (conversion only), no SEO/content engine |
| Squoosh | Client-side WASM | Single-page app | One tool, no content, no discoverability play |
| it-tools / 10015.io | Client-side | Flat | Dev-audience only, minimal SEO |

**The gap:** nobody combines (a) TinyWow's breadth + content engine with (b) VERT/Squoosh's genuine client-side privacy architecture. Privacy-first players are engineering projects with no distribution; distribution players aren't private. LazyTools sits in that gap.

## URL structure (decided)

Two-level hub-and-spoke — category folder + tool slug:

```
lazytools.io/
├── /                          Homepage: search, categories, popular tools
├── /{category}/               Category hub (internal-linking engine)
│   └── /{category}/{tool}/    Tool page
├── /blog/                     Content engine
│   └── /blog/{slug}/
├── /about/  /privacy/  /how-it-works/    Trust & E-E-A-T pages
├── sitemap.xml
└── llms.txt                   For AI crawlers/GEO
```

Examples: `/pdf/merge-pdf/`, `/image/compress-image/`, `/text/word-counter/`

**Why category folders over flat URLs:**
- Category hubs concentrate and distribute link authority (hub-and-spoke is the proven programmatic-SEO pattern)
- Keyword appears in both path segments; clean breadcrumbs (BreadcrumbList schema)
- Analytics/Search Console segmentation per category
- i18n-ready: `/es/pdf/unir-pdf/` later without restructuring
- Max 3 clicks from homepage to any tool

**Slug rule:** slug = the exact primary keyword phrase (`merge-pdf`, not `pdf-merger`). Never change a slug after launch (redirects cost authority).

### Programmatic long-tail spokes

One engine, many landing pages. The canonical tool plus format/variant-specific pages that share the same component but have unique copy, FAQs and H1s:

- `/image/compress-image/` (canonical) → `/image/compress-png/`, `/image/compress-jpg/`, `/image/compress-webp/`
- `/pdf/pdf-to-image/` → `/pdf/pdf-to-jpg/`, `/pdf/pdf-to-png/`

Rules: each variant page must have genuinely differentiated content (format-specific tips, FAQs, limits) — thin duplicates get penalized. Variant preselects the format in the same tool component.

## Category taxonomy (launch set — broad enough to never restructure)

1. `/pdf/` — PDF tools
2. `/image/` — Image tools
3. `/video/` — Video tools
4. `/audio/` — Audio tools
5. `/text/` — Text & writing utilities
6. `/file/` — File & data converters (CSV, JSON, Excel, XML)
7. `/dev/` — Developer tools (formatters, encoders, hash, regex)
8. `/calc/` — Calculators & generators (QR, password, units)
9. `/security/` — Privacy & security tools (EXIF stripper, metadata cleaner, encryptor) — on-brand flagship category

New categories can be added without touching existing URLs.

## Tool page anatomy (single template, every tool)

Order matters — tool first, content below:

1. **Breadcrumb** (Home › Category › Tool)
2. **H1 + one-line value prop** (primary keyword + "free, private, in your browser")
3. **The tool itself** — fully usable above the fold, zero signup, drag-and-drop
4. **Privacy strip** — "🔒 Your files never leave your device — processing happens 100% in your browser." Links to /how-it-works. (Differentiator + a concrete, citable claim for AI engines)
5. **How to use** — 3 numbered steps (extractable by AI Overviews)
6. **Why LazyTools** — feature bullets: private by architecture, free, no file-size games, works offline
7. **Technical explainer** — short "how client-side X works (WASM/Web APIs)" section; unique factual content that earns citations and E-E-A-T
8. **FAQ** — 4–8 real questions phrased as users ask them (FAQPage schema; AI Overviews pull directly from these)
9. **Ratings panel** — anonymous one-click star rating, shown after a successful tool run (peak-sentiment moment). Rules:
   - Collect from day one, but only render the panel + `aggregateRating` schema once a tool has ≥25 real ratings (avoids "4.9 from 3 ratings" and review-schema abuse risk). Never seed fake numbers.
   - Anonymous by design: single POST `{tool, stars}`, no cookies/fingerprinting/accounts; label it "Anonymous, no tracking" (on-brand proof point). localStorage flag to soften duplicate votes.
   - Aggregates pulled in at build time so schema stays server-rendered; doubles as product analytics for which tools to improve.
10. **Related tools** — same-category siblings + cross-category (internal-link mesh)
11. **Related blog posts** — pulls from the content engine

### Structured data per tool page
- `WebApplication` (name, category, offers: price 0, operatingSystem: "Any (browser)", aggregateRating when we have one)
- `FAQPage`
- `BreadcrumbList`
- `HowTo` on the steps section
- Sitewide: `Organization` + `WebSite` (with SearchAction)

## Category hub anatomy

- H1 ("Free Online PDF Tools — Private & Browser-Based")
- Grid of all tools in the category with one-line descriptions (crawlable HTML links)
- Short category intro (keywordable)
- Category-level FAQ
- Links to the category's blog cluster
- `CollectionPage` + `ItemList` schema

## Efficiency architecture: registry-driven pages

**One tool = one registry entry + one component.** Everything else generates automatically.

```
/src/tools/registry/merge-pdf.(json|ts):
  slug, category, name, seo: {title, description, keywords},
  variants: [...], howTo: [...], faq: [...],
  related: [...], blogTags: [...], schema overrides
```

The registry auto-generates: routes, category hubs, sitemap.xml, breadcrumbs, related-tool links, homepage search index, JSON-LD, llms.txt entries, and the blog↔tool cross-link map. Adding tool #150 costs the same effort as tool #5.

## Rendering & GEO technical requirements

- **Static-first (SSG)** — every tool page ships as full server-rendered HTML. AI crawlers (GPTBot, ClaudeBot, PerplexityBot) don't reliably execute JS; content invisible to them can't be cited. Tool interactivity hydrates client-side (islands architecture — Astro, or Next.js SSG).
- **robots.txt allows AI crawlers** explicitly; publish **llms.txt** describing the site and tool list.
- **Fast Core Web Vitals** — no heavy WASM on initial load; lazy-load engines on first interaction.
- **PWA/offline-capable** — proves the "never leaves your browser" claim, unique in market.
- **Trust pages** (/about, /privacy, /how-it-works) — E-E-A-T signals AI engines weight for citation confidence.

## Blog / content engine (aspect 2 hook-in)

- `/blog/{slug}/` — flat, tagged by tool/category
- Per tool cluster: how-to guides, "best X tools 2026" listicles (GEO loves enumerated comparisons — include a comparison table near the top), "X vs Y" pages, privacy-angle explainers
- Every post links to its tool(s); every tool page links back to its cluster
