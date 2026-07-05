---
title: "WCAG Color Contrast Explained: The 4.5:1 Rule Without the Jargon"
description: "WCAG AA requires 4.5:1 contrast for normal text and 3:1 for large text and UI — the standard cited by the EU Accessibility Act. What the ratio means, how to check it, and how to fix failing brand colors."
pubDate: 2026-07-05
updatedDate: 2026-07-05
archetype: explainer
tools: ["/color/contrast-checker/", "/color/color-shades-generator/"]
keywords:
  - wcag contrast ratio
  - color contrast accessibility
  - 4.5:1 contrast rule
  - aa vs aaa contrast
  - contrast checker
  - accessible color combinations
  - european accessibility act wcag
  - text contrast requirements
heroImage: /blog/wcag-contrast-guide.png
heroAlt: "WCAG contrast explained — AA requires 4.5:1 for normal text, 3:1 for large text and UI"
faqs:
  - q: "What contrast ratio does WCAG require?"
    a: "Level AA: 4.5:1 for normal text, 3:1 for large text (≥24px, or ≥18.66px bold) and for UI components/graphics (WCAG 2.1). Level AAA raises text thresholds to 7:1 and 4.5:1. AA is the level regulations reference."
  - q: "Is WCAG contrast legally required?"
    a: "Increasingly, yes: the European Accessibility Act (applying to many services since June 2025) references EN 301 549, which incorporates WCAG 2.1 AA; US ADA web cases and Section 508 also point at WCAG. For private sites it is at minimum the standard courts and regulators use as the benchmark."
  - q: "What does a ratio like 4.5:1 actually mean?"
    a: "It compares the relative luminance (perceived brightness) of two colors: (lighter + 0.05) ÷ (darker + 0.05). The scale runs 1:1 (identical colors) to 21:1 (pure black on pure white)."
  - q: "What counts as large text?"
    a: "At least 18pt (24px), or 14pt (18.66px) if bold. Bigger glyphs stay legible at lower contrast, so the requirement relaxes to 3:1."
  - q: "Do logos and placeholder icons need to pass?"
    a: "Logos and purely decorative text are exempt. Placeholder text, disabled-state text and icons that convey information are commonly missed — informative icons need 3:1 as UI graphics."
  - q: "My brand color fails on white — do I have to change the brand?"
    a: "No — keep the bright color for graphics and large headlines (3:1 often passes) and use a darker shade of the same hue for body text and small labels. A shades generator gives you the candidates; the checker confirms."
  - q: "Is gray text on white ever okay?"
    a: "Light grays fail fast: #999 on white is 2.8:1. The darkest 'still feels gray' passing choices are around #767676 (4.54:1) for normal text."
draft: false
---

**WCAG requires a contrast ratio of at least 4.5:1 between normal text and its background (Level AA) —
3:1 for large text and UI components, 7:1 for the stricter AAA level.** These are the numbers behind
accessibility law, and checking any pair takes seconds in the
[contrast checker](/color/contrast-checker/), which computes the official formula live.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>AA (the legal reference): 4.5:1</strong> normal text · <strong>3:1</strong> large text (≥24px / ≥18.66px bold) and UI components</li>
<li><strong>AAA: 7:1</strong> normal · 4.5:1 large — enhanced, not usually mandated</li>
<li><strong>The scale: 1:1 → 21:1</strong> (identical colors → black on white)</li>
<li><strong>The EU Accessibility Act</strong> (in force for services since June 2025) points to WCAG 2.1 AA via EN 301 549</li>
<li><strong>Failing brand color?</strong> Darken it for text, keep the bright version for graphics</li>
</ul>
</aside>

## What the ratio measures

Contrast compares how bright two colors *appear*, not how different they look. Each color gets a
**relative luminance** — a 0-to-1 brightness value computed from its RGB channels, weighted the way
human vision weights them (green counts most: L = 0.2126R + 0.7152G + 0.0722B, on linearized values).
The ratio is then:

**ratio = (L_lighter + 0.05) ÷ (L_darker + 0.05)**

That yields 1:1 for identical colors and 21:1 for black on white. Hue barely matters — a saturated red
and a saturated blue can have *terrible* contrast with each other if their brightness is similar,
which is why "it looks colorful" is not the same as "it's readable."

<figure>
<img src="/blog/infographic-contrast-scale.svg" alt="Infographic: the WCAG contrast scale from 1:1 to 21:1 with markers at 3:1 (AA large text and UI), 4.5:1 (AA normal text — the legal reference) and 7:1 (AAA), plus a passing 8.6:1 text sample beside a failing 1.7:1 sample" width="1200" height="620" loading="lazy" />
<figcaption>The whole standard on one line — and what passing vs failing actually looks like.</figcaption>
</figure>

## The thresholds, precisely

| Requirement | Ratio | Applies to |
|---|---|---|
| AA — normal text | **4.5:1** | body copy, labels, links under 24px |
| AA — large text | **3:1** | ≥24px, or ≥18.66px bold |
| AA — UI & graphics (WCAG 2.1) | **3:1** | input borders, icons, focus indicators, chart elements |
| AAA — normal text | **7:1** | enhanced level |
| AAA — large text | **4.5:1** | enhanced level |
| Exempt | — | logos, decorative text, disabled controls |

**Why it has legal weight:** the **European Accessibility Act** — applying to e-commerce, banking and
other services since June 2025 — requires conformance with EN 301 549, which incorporates **WCAG 2.1
Level AA**. In the US, ADA web lawsuits and Section 508 procurement likewise use WCAG as the yardstick.
AA is the line to clear; AAA is credit, not obligation.

## Checking your colors: the 2-minute workflow

1. Open the [contrast checker](/color/contrast-checker/) and enter your text and background colors
   (HEX, RGB or the picker).
2. Read the ratio and the four pass/fail verdicts (AA/AAA × normal/large).
3. Test the *real* pairs from your UI: body-on-background, link-on-background, button-label-on-button,
   placeholder-on-input. The last two are where most sites fail.
4. Don't forget states: hover, focus and error colors need to pass too.

**Worked example:** this site's bright brand blue `#1d87f1` on white scores **3.46:1** — passes for
large headlines, fails for body text. The fix wasn't changing the brand: buttons and links use the
darker `#166fde`/`#185ab4` shades of the same hue, which clear 4.5:1. That exact pattern — bright for
graphics, darkened for text — solves most "brand color fails" cases.

## Fixing failures without redesigning

- **Darken, don't abandon.** Generate the ramp of your color in the
  [shades generator](/color/color-shades-generator/) and test shades until one clears 4.5:1 — the hue
  stays recognizably yours.
- **Grays are the usual suspects.** Placeholder and helper text at #999 (2.8:1) fails; #767676 is
  about the lightest passing gray on white.
- **Size up instead.** Text at ≥24px (or 18.66px bold) only needs 3:1 — sometimes the fix is
  typography, not color.
- **Check both themes.** A pair passing in light mode can fail inverted in dark mode; ratios don't
  transfer automatically.

## Common contrast mistakes

1. **Testing only body text** — buttons, placeholders, focus rings and informative icons have
   requirements too (3:1 as UI components).
2. **Judging by eye on a good monitor** — your calibrated screen in a dim office is the best case;
   the standard exists for sunlight, cheap panels and aging eyes.
3. **White text on bright accents** — the classic near-miss (white on this site's bright blue: 3.46:1);
   darken the accent one step.
4. **Forgetting text over images/gradients** — measure against the *lightest* area the text can sit on,
   or add a scrim.
5. **Chasing AAA everywhere** — 7:1 constrains palettes hard; AA everywhere beats AAA somewhere.

## Quick summary

Normal text needs **4.5:1**, large text and UI need **3:1**, AAA asks 7:1 — measured as the luminance
ratio between foreground and background on a 1-to-21 scale. The AA level carries legal weight via the
EU Accessibility Act and WCAG-based rulings elsewhere. Check every real color pair in the
[contrast checker](/color/contrast-checker/), and fix failures by darkening your hue's shade — not by
abandoning your brand.

*Related tools: [shades & tints generator](/color/color-shades-generator/) ·
[color converter](/color/color-converter/) · [HEX to RGB](/color/hex-to-rgb/). Formula and thresholds
are from [WCAG 2.1 (W3C Recommendation)](https://www.w3.org/TR/WCAG21/) — the checker implements
them exactly.*
