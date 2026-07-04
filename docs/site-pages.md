# LazyTools.io — Auxiliary & Supporting Pages

*Decided: July 2026. Complete inventory of non-tool, non-blog pages, tiered by launch priority.*

## Tier 1 — Required at launch

### Legal & compliance

| Page | URL | Notes |
|---|---|---|
| **Privacy Policy** | `/privacy/` | Our flagship legal page — unusually, a marketing asset. Must honestly cover the small data we DO touch: analytics (Plausible/GoatCounter), anonymous ratings endpoint, server logs from Namecheap, newsletter (if any). GDPR + CCPA aware. States plainly: files are processed in-browser and never transmitted. |
| **Terms of Service** | `/terms/` | Tools provided "as-is", acceptable use, no warranty on outputs, limitation of liability, IP (users keep rights to their files — trivially true since we never receive them, say so), governing law. Fold DMCA contact in here (we host no user content, so a short clause suffices). |
| **Cookie Policy / statement** | `/cookies/` or section in privacy | If we truly use no cookies (Plausible is cookieless, ratings uses localStorage): publish a short "we use no cookies" statement — a differentiator worth its own page. If ads come later, this becomes a real policy + consent banner (CMP for EEA). |
| **Disclaimer** | `/disclaimer/` or section in terms | Critical for calculators (financial, health, unit conversions): outputs are informational, not professional advice. Also: conversion fidelity not guaranteed. |

### Trust & E-E-A-T (AI engines weigh these for citation confidence)

| Page | URL | Notes |
|---|---|---|
| **About** | `/about/` | Who builds LazyTools, why privacy-first, mission. Real names/photos if possible — E-E-A-T. `AboutPage` + `Organization` schema. |
| **How It Works** | `/how-it-works/` | The technical trust pillar: client-side processing, WASM, "open DevTools and watch — no upload requests." Every tool page's privacy strip links here. Highly citable. |
| **Contact** | `/contact/` | Email + simple form (form can POST to a PHP mailer or just be a mailto). Required for trust, AdSense (later), and legal notices. `ContactPage` schema. |

### Product utility

| Page | URL | Notes |
|---|---|---|
| **All-tools directory** | `/tools/` | Every tool grouped by category on one crawlable page — internal-link engine + the page AI crawlers/llms.txt point to. `ItemList` schema. |
| **Custom 404** | `404.html` | Search box + popular tools + categories. Namecheap: wire via `.htaccess` `ErrorDocument`. |
| **Blog index** | `/blog/` | Plus tag archives `/blog/tag/{tag}/` once volume justifies. |

### Technical files (not pages, same tier)

- `sitemap.xml` (registry-generated), `robots.txt` (explicitly allowing GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- `llms.txt` — site description + tool list for AI crawlers
- `/.well-known/security.txt` — responsible disclosure contact (strong trust signal for a privacy brand)
- `manifest.json` + full favicon set (PWA)
- RSS/Atom feed for blog (`/rss.xml`) — feeds are crawled by AI aggregators too
- **Licenses/attributions** `/licenses/` — we ship pdf-lib, ffmpeg.wasm, Squoosh codecs etc.; MIT/Apache/LGPL require attribution. Legally required, and open-source transparency is on-brand. (ffmpeg.wasm is LGPL — attribution + source link needed.)

## Tier 2 — Soon after launch (weeks 2–8)

| Page | URL | Notes |
|---|---|---|
| **Request a tool** | `/request-a-tool/` | Feeds the market-research pipeline with real demand; simple form → PHP mailer or GitHub-issue link. |
| **Changelog / What's new** | `/changelog/` | Freshness signal + shows active development (users and AI engines both read this as "maintained"). |
| **Author pages** | `/authors/{name}/` | Required once blog has bylines; `Person` schema linked from every post. |
| **Site-wide FAQ** | `/faq/` | The meta-questions ("Is LazyTools really free?", "How do you make money?", "Are my files uploaded?"). `FAQPage` schema; strong AI-answer target. |
| **Accessibility statement** | `/accessibility/` | Commitment + known issues + contact. Legally expected in EU (EAA applies to services since 2025); on-brand for a user-respecting product. |
| **Offline page** | `/offline/` | PWA fallback — doubles as a proof-point ("this site works without internet — that's how private it is"). |

## Tier 3 — When triggered by growth

| Page | Trigger |
|---|---|
| `/alternatives/{competitor}/` landing pages ("iLovePDF alternative") | When domain has authority to rank for them; programmatic, registry-driven like variant pages |
| `/pricing/` or `/pro/` | Only if/when a paid tier is decided |
| Refund policy | Only with paid tier (required by card processors) |
| Newsletter subscribe/confirm/unsubscribe + archive | If newsletter launches |
| Press/media kit `/press/` | On first press interest |
| Imprint/Legal notice `/imprint/` | If actively targeting Germany/Austria (Impressumspflicht) |
| Status page (external, e.g. free UptimeRobot page) | When traffic justifies |
| Consent management platform (CMP) banner | Only if ad networks are added — revisit cookie policy then |

## Cross-cutting rules

- All Tier-1 legal/trust pages linked from the **sitewide footer** (crawlers and AI engines check for their presence as a quality signal).
- Legal pages get honest "Last updated" dates and plain-English summaries at top (a privacy policy humans can read is itself marketing — link it from tool-page privacy strips).
- Every page in this doc is registry-driven where enumerable (licenses, authors, alternatives) — same build pipeline as everything else.
- Draft legal text can be generated, but **have a human review Privacy Policy + Terms before launch**; if revenue grows, a proper legal review.
