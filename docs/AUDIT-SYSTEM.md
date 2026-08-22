# Autonomous audit-and-fix system

Two cooperating bots keep the live tools healthy, running entirely in GitHub
Actions with **no LLM / no Claude tokens** and no external services beyond
optional email. All state and output live in git (public).

- **Bot 1 — Auditor** (`scripts/audit-ux.mjs`): every day, audits 10 rotating
  tools **plus** any tool a fix is awaiting verification on, against the **live**
  site with headless Chromium + axe-core.
- **Bot 2 — Fixer** (`scripts/audit-fix.mjs`): applies safe, deterministic fixes
  to the auditor's open findings, gated by a full production build (reverts if
  the build breaks), and compiles everything it can't safely touch into
  `audits/recommendations.md` with reasoning.
- **The loop**: Fixer marks a fix `verifying` → next day the Auditor re-tests the
  live tool → `complete` if it now passes, or `challenged` (with reasoning) if it
  still fails after 3 attempts.

Orchestrated by `.github/workflows/audit.yml` (daily 06:17 UTC + manual). Results
are committed back to `audits/`; the report is emailed if mail secrets are set.

Rotation covers the whole catalogue (~1,070 tools, 10/day) about every 107 days,
then cycles — so every tool is re-audited on a rolling basis and regressions are
caught.

## What is audited (comprehensive)

Each tool page is scored (weighted by severity) across eight dimensions, drawn
from web/SEO/accessibility best practice:

### 1. Functionality
| Check | Why |
|---|---|
| Loads (HTTP 200) | The page is reachable. |
| No JavaScript / console errors | Runtime errors break the tool silently. |
| No failed resource requests | Missing JS/CSS/assets degrade or break the UI. |
| Interactive tool hydrates | The interactive widget actually mounted (controls present in `<main>`). |
| Actions run without error | Clicking the tool's safe action buttons (convert/generate/calculate/spin/…) throws nothing. Destructive/permission buttons (start camera, download, delete) are deliberately skipped. |

### 2. Input → output
| Check | Why |
|---|---|
| Produces output for its input | After interacting, the tool's output region is non-empty — catches "does nothing" bugs (e.g. a widget that renders but never computes). Exact correctness of the maths is covered separately by the `scripts/test-*.ts` unit tests. |

### 3. SEO / metadata (best practice)
| Check | Best-practice target |
|---|---|
| `<title>` | present, 15–60 characters. |
| `<meta name="description">` | present, 70–160 characters. |
| Exactly one `<h1>` | one, non-empty. |
| Canonical link | present (avoids duplicate-content dilution). |
| Open Graph tags | `og:title`, `og:description`, `og:image` all present (social/share previews). |
| Structured data | JSON-LD present (e.g. WebApplication / FAQPage) for rich results. |
| `<html lang>` | set (i18n + a11y). |
| Not `noindex` | the page isn't accidentally blocked from search. |

### 4. Content quality
| Check | Why |
|---|---|
| Enough unique content (≥ 200 words) | Thin-content / AdSense guard — every tool must carry real editorial (how it works, notes, FAQ), not just a widget. |
| Has an FAQ (≥ 3 questions) | Depth + FAQ rich results. |
| No placeholder text | No "lorem ipsum", "TODO", "coming soon" leaking to production. |

### 5. Accessibility (WCAG, via axe-core)
| Check | Why |
|---|---|
| No serious/critical axe violations | Industry-standard automated a11y audit — colour contrast, ARIA misuse, names/roles, etc. (only serious+critical are ledgered, to stay actionable). |
| All images have `alt` | Screen-reader access. |
| No broken images | Visual + a11y integrity. |

### 6. Performance
| Check | Target |
|---|---|
| Loads under 6 s | Core-Web-Vitals-adjacent responsiveness signal (measured full load on a CI runner). |

### 7. Mobile / responsive
| Check | Why |
|---|---|
| No horizontal scroll at 375 px | The single most common mobile UX defect. |
| Viewport meta present | Correct mobile scaling. |

### 8. Privacy (brand-critical)
| Check | Why |
|---|---|
| No unexpected external requests | LazyTools is privacy-first and client-side. Any request to a host outside the allow-list (the site itself, Google Analytics, Google Fonts) — especially non-GET or with a body — is flagged as a potential data leak or third-party tracker. |

> Correctness of each tool's computation is asserted by the per-library
> `scripts/test-*.ts` Node tests (run in CI on every push). The audit adds the
> *live user-experience* layer on top of that unit-level correctness.

## The ledger

`audits/ledger.json` is the shared source of truth. Each finding:

```json
{
  "id": "color/foo::Meta description (70–160 chars)",
  "tool": "color/foo", "url": "https://lazytools.io/color/foo/",
  "category": "seo", "check": "Meta description (70–160 chars)",
  "severity": "high", "detail": "164 chars",
  "fixType": "auto:trim-meta-description",   // or "manual"
  "status": "open",                          // lifecycle below
  "firstSeen": "2026-08-06", "lastSeen": "2026-08-06",
  "attempts": 0,
  "history": [{ "date": "2026-08-06", "event": "opened", "note": "164 chars" }]
}
```

**Lifecycle:** `open` → (Fixer) `verifying` → (Auditor re-test) `complete`, or
after 3 failed verifications `challenged` (with the reason in `history`).
Findings the Fixer can't safely touch stay `open` with `fixType: manual` and are
listed in `audits/recommendations.md`.

## What the Fixer can and can't do (by design)

Because it runs **without an LLM**, the Fixer only applies changes that are
**provably safe and deterministic**, and every change is gated by a full build
(reverted if it breaks). Current auto-fixers:

- `trim-meta-description` — shorten an over-160-character meta description to ≤157
  at a word boundary (only when the registry value is a simple string literal).

Everything requiring written content or code judgement — rewriting thin content,
adding FAQs, fixing a colour-contrast token, restructuring a component for
accessibility, changing a title template, resolving a functional bug — is **not**
auto-edited (regex-editing prose or logic would be unsafe and off-brand). Those
are logged to `recommendations.md` for a human or an AI assistant to action.

New auto-fixers can be added to the `FIXERS` map in `scripts/audit-fix.mjs` as
safe, testable transformations are identified.

## Files (all public, in git)

| Path | What |
|---|---|
| `audits/ledger.json` | Canonical finding state + history. |
| `audits/reports/<date>.md` | Daily audit report (Bot 1). |
| `audits/reports/<date>-fixes.md` | Daily fixer report (Bot 2). |
| `audits/recommendations.md` | Rolling list of open manual findings, by severity. |

## Running it

- **Scheduled:** daily at 06:17 UTC.
- **On demand:** GitHub → Actions → "Daily UX Audit & Fix" → Run workflow
  (optional `count` / `offset` inputs).
- **Locally:** `AUDIT_COUNT=5 AUDIT_OFFSET=0 node scripts/audit-ux.mjs` then
  `node scripts/audit-fix.mjs` (needs `npx playwright install chromium`).

## Where to see progress

No email — everything is in git (public), so you can glance at it any time:

- **`audits/DASHBOARD.md`** — always-current single view: completed / open /
  awaiting-verification / challenged counts, catalogue coverage, a score trend
  over recent runs, what was just fixed, what's challenged, and the top open
  findings. Regenerated every run.
- **`audits/reports/<date>.md`** — that day's full audit; **`-fixes.md`** — that
  day's fixes.
- **`audits/recommendations.md`** — the open manual to-do list.
- Each run also prints a **job summary** on its GitHub Actions run page and
  uploads the report as an artifact.
