# Color Tools Expansion — Research & Build List — 2026-07-11

Owner-directed category expansion of `/color/` (same posture as `/calc/`, `/biology/`, `/generate/`, `/web3/`): a ranked build list, **not** a gap-gated scan. Scoring uses the house x/25 rubric (demand · competition-gap · durability · on-brand differentiation · build-cost, where build-cost 5 = cheapest). `[S]` = declarative fields→compute; `[C]` = custom island (canvas / matrix / interactive).

## Executive summary

Color is worth a real flagship push, but **only under today's reality** (per `2026-07-11-opportunities.md`): client-side is the *baseline*, not the differentiator — every color-tool intent already has multiple clean, no-upload, client-side incumbents (oklch.com, Coblis/DaltonLens, tints.dev, EightShapes, accessible-colors.com, imagecolorpicker.com). So the competition-gap axis is a **structural 2–3 across the whole category** and "we don't upload" wins nothing here. The edge is exactly what the daily thesis prescribes: **exact, staleness-proof color-space math (sRGB↔OKLab/LAB/XYZ matrices, WCAG 2 + APCA formulas, published color-vision-deficiency matrices), clean single-purpose ad-free SEO pages, and a coherent accessibility sub-brand** that our existing WCAG contrast checker already anchors.

The single strongest driver is **OKLCH / CSS Color 4**: adopted as Tailwind CSS 4's default color space, supported in ~93–95% of browsers, and now the authoring format with HEX as the compatibility format — this is a named driver *strengthening over 3+ years*, and OKLCH↔HEX conversion is a documented, recurring pain point. That is our lead. The second pillar is **accessibility** (WCAG AA legal teeth via EAA/ADA; WCAG 3 / APCA emerging): our existing contrast checker should grow into a small cluster — an accessible-color fixer, an APCA (WCAG 3) checker, and a contrast grid — all reusing math we already ship. Everything is pure deterministic algorithm and never rots (flagged exceptions marked `[D!]`).

Recommendation: **GO.** Build the modern-color-space converter first (its OKLab/LAB/XYZ core is shared by the name-finder, harmony-in-OKLCH, and accessible-fix tools), then the accessibility cluster, then the color-vision simulator.

---

## Existing `/color/` tools (do NOT duplicate)

`color-converter` (HEX/RGB/HSL/CMYK), `hex-to-rgb`, `rgb-to-hex`, `contrast-checker` (WCAG 2), `color-shades-generator` (naive white/black tint+shade mix), `css-gradient-generator`, `color-mixer` (sRGB channel interpolation), `brand-colors` (1,161 palettes). Note the current shades tool mixes toward white/black in sRGB and the mixer interpolates in sRGB — both are candidates for OKLCH *modes* once the OKLab core exists.

---

## Ranked build list

### LEAD

**1. Modern color-space converter — OKLCH / OKLAB (+ LAB / LCH / XYZ / HWB) — 20/25 `[C]`**
- **Slugs:** `/color/oklch-color-picker/` (flagship) + SEO satellites `/color/hex-to-oklch/`, `/color/oklch-to-hex/`, `/color/rgb-to-oklch/`. One island; LAB/LCH/XYZ/HWB shown as additional output rows (see FOLD).
- **Scores:** demand 5 · gap 2 · durability 5 · differentiation 4 · build-cost 4.
- **Future driver (named):** CSS Color Module Level 4 `oklch()`/`oklab()` — CR since 2022, shipped in all evergreen engines (Chrome/Edge 111, Safari 15.4, Firefox 113; ~93–95% coverage) and adopted as **Tailwind CSS 4's default color space**. OKLCH is now the authoring format, HEX the compatibility format — a driver strengthening year over year. OKLCH↔HEX conversion + gamut mapping is a documented recurring pain (color.js issue #557; "moving away from hex" blog trend).
- **Algorithm (staleness-proof, Björn Ottosson OKLab):** sRGB gamma-decode `c_lin = c≤0.04045 ? c/12.92 : ((c+0.055)/1.055)^2.4` → linear-sRGB→XYZ (D65) matrix → XYZ→LMS (M1) → cube-root → LMS→OKLab (M2); OKLCH = `C=√(a²+b²), H=atan2(b,a)`. Reverse inverts each step. **Gamut mapping:** when OKLCH→sRGB is out of gamut, reduce chroma along constant L/H (CSS Color 4 gamut-mapping algorithm) and flag it. CIE LAB via XYZ→Lab `f(t)` with D65 white; LCH polar of LAB; HWB from HSV. Reference lib: `culori` (or hand-rolled ~120 lines).
- **Differentiation / demand angle:** incumbents (oklch.com, oklch.net, oklch.fyi, evilmartians) are strong but crowded; we win on (a) being part of one converter that also emits **guaranteed HEX/RGB fallback + P3 flag** (the actual dev pain), (b) clean SEO-exact pages for "hex to oklch" / "oklch to hex" / "rgb to oklch" long-tails, (c) an honest gamut-out-of-range indicator. Strong AI-resistance: byte-exact matrix output a chatbot cannot reliably produce.

**2. Color-vision-deficiency simulator (image + single color/palette) — 18/25 `[C]`**
- **Slug:** `/color/color-blindness-simulator/` (satellites `/color/deuteranopia-simulator/`, `/color/protanopia-simulator/`, `/color/tritanopia-simulator/`).
- **Scores:** demand 5 · gap 2 · durability 4 · differentiation 4 · build-cost 3.
- **Future driver:** accessibility (EAA in force since Jun 2025, WCAG; designers/devs testing UI for ~8% of men). Deterministic — the transform matrices are **fixed published constants, not rotting curated data**.
- **Algorithm:** operate in linear-sRGB. Use **Machado, Oliveira & Fernandes (2009)** severity-parameterized 3×3 matrices (0–100% severity per type) OR **Brettel–Viénot–Mollon (1997/1999)** LMS projection for full dichromats — both are the field-standard published matrices (jsColorblindSimulator, DaltonLens, R `colorspace` all use them). Ship dichromacy (prot/deut/trit-anopia) + optional severity slider (anomalous trichromacy) + achromatopsia (luminance). Canvas `getImageData` → per-pixel matrix → `putImageData`; export PNG. Also a **swatch/palette mode** (simulate a pasted palette, not just an uploaded image) — the differentiator vs image-only incumbents.
- **Differentiation:** Coblis/DaltonLens/rgblind are entrenched and client-side, so gap=2; we win on a clean single-purpose page + side-by-side original/simulated + **palette-simulation mode** + PNG export + cross-link to our contrast checker. Strong AI-resistance: binary image, privacy-sensitive (unreleased designs), deterministic, repeat-workflow.

### SOLID

**3. Accessible-color finder / contrast fixer — 20/25 `[S]` (reuses contrast math)**
- **Slug:** `/color/accessible-color-generator/` (standalone SEO page) **AND** fold a "Suggest an accessible fix" panel into the existing `contrast-checker`.
- **Scores:** demand 4 · gap 2 · durability 4 · differentiation 5 · build-cost 5.
- **Future driver:** WCAG AA legal mandate (EAA/ADA/public-sector law) — the same driver already justifying our shipped contrast checker.
- **Algorithm:** given a foreground + fixed background + target (AA 4.5 / AA-large 3 / AAA 7), **binary-search lightness** (hold hue & chroma — do it in OKLCH L or HSL L) until WCAG 2 ratio ≥ target; return the nearest passing color both lighter and darker. Trivial given we already compute WCAG relative luminance.
- **Differentiation:** highest strategic-fit score — directly extends our biggest color asset (the contrast checker) at near-zero build cost, and "accessible colors" / "make color pass WCAG" is a rich long-tail. accessible-colors.com/FWD/Coddy exist (gap=2) but a clean hue-preserving fixer as both a fold *and* an SEO page is high leverage.

**4. APCA contrast checker (WCAG 3) — 18/25 `[C]` `[D!-lite: pin version]`**
- **Slug:** `/color/apca-contrast-checker/`.
- **Scores:** demand 4 · gap 3 · durability 4 · differentiation 4 · build-cost 3.
- **Future driver:** WCAG 3 draft introduces APCA as its contrast method; growing designer adoption (Figma plugins, Designsystemet, accessibility.build already dual-report WCAG 2.2 + APCA). **Distinct from our WCAG 2 checker** — reports Lc (lightness contrast) 0–±106, accounts for polarity (dark-on-light vs light-on-dark) and font size/weight lookup.
- **Algorithm:** APCA-W3 (`apca-w3` npm) — soft-clamp black, luminance via specific exponents, `SAPC = (Ybg^0.56 − Ytxt^0.57)` style polarity math, scale to Lc. **`[D!-lite]`:** APCA has versioned across releases; **pin one published version (e.g. APCA-W3 0.1.9 / the version referenced by the current WCAG 3 working draft) and state it on-page.** Not rotting like a price table, but not frozen like a matrix either — hence the flag.
- **Differentiation:** most tools bundle it; a clean single-purpose "APCA contrast checker" page with an honest **WCAG 2 vs APCA explainer** (why some WCAG-2-failing pairs are APCA-OK and vice-versa) is the educational wedge, cross-linked to our WCAG 2 checker.

**5. Contrast grid generator — 18/25 `[C]` (reuses contrast math)**
- **Slug:** `/color/contrast-grid/`.
- **Scores:** demand 3 · gap 3 · durability 4 · differentiation 4 · build-cost 4.
- **Future driver:** accessibility + design-systems workflow (batch-checking a whole palette, not one pair).
- **Algorithm:** parse a list of colors (one per line, optional label), compute the full N×N WCAG-2 ratio matrix, render cells with ratio + AA/AA-large/AAA pass badges. Pure reuse of existing WCAG luminance/ratio code.
- **Differentiation:** the incumbent (EightShapes contrast-grid) essentially *owns* this niche with few alternatives → gap=3 (rarer than the single-pair space). Distinct **design-system / palette-wide** intent vs our single-pair checker; add APCA-Lc cells once tool #4 exists. Repeat-workflow, bookmarkable.

**6. Color harmony / scheme generator — 18/25 `[S]`**
- **Slug:** `/color/color-harmony-generator/` (satellites `/color/complementary-color/`, `/color/triadic-colors/`, `/color/analogous-colors/`).
- **Scores:** demand 5 · gap 2 · durability 3 · differentiation 3 · build-cost 5.
- **Future driver:** evergreen (color theory) — not strengthening, but the **harmony math never rots**.
- **Algorithm:** deterministic hue geometry on the color wheel — complementary `H+180`, triadic `H±120`, analogous `H±30`, split-complementary `H+150/210`, tetradic/square `H+90/180/270`, monochromatic (vary L/S). **This is exact geometry, not "suggest a nice color"** — it passes the value filter (the tool computes exact partner hues; it does not opine on taste). Best done in OKLCH hue for perceptual evenness once the OKLab core exists.
- **Differentiation:** enormous demand but saturated (Adobe/Canva/coolors/Sessions) → gap=2; we win only on a clean ad-free single-purpose page + exact HSL/OKLCH rotations *shown as codes* + copy-all. Cheap to build; earns a page on demand volume + category coherence, not on gap.

### WATCHLIST

**7. Image eyedropper + palette-from-image (one widget) — 17/25 `[C]`**
- `/color/image-color-picker/`. demand 5 · gap 2 · durability 3 · differentiation 3 · build-cost 4. Canvas click → HEX/RGB/HSL, plus median-cut/k-means dominant-palette extraction, plus the native **EyeDropper API** for screen-picking (mild driver). Enormous demand (imagecolorpicker.com-class) but extremely crowded and already client-side. **Promote** by bundling pick + extract in one clean page with CSS/Tailwind-var export; the extraction half alone (k-means) is heavier. Processes binary images + privacy = strong AI-resistance.

**8. Tailwind / CSS shade scale (50–950, OKLCH) — 16/25 `[S]` (overlaps shades tool)**
- `/color/tailwind-color-generator/`. demand 4 · gap 2 · durability 4 · differentiation 3 · build-cost 3. Driver: Tailwind 4 OKLCH. Distinct from our naive white/black shades tool (perceptual OKLCH lightness ramp + `@theme`/config export). Saturated (tints.dev, hex2tailwind, magicpattern). **Best shipped as an OKLCH "design-token scale" mode + Tailwind-export inside the shades generator** once the OKLab core lands; promote to standalone only with a keyword-gap proof.

**9. Nearest color-name finder — 16/25 `[S]` `[D!]`**
- `/color/color-name-finder/`. demand 4 · gap 2 · durability 3 · differentiation 3 · build-cost 4. Convert to LAB, min ΔE (CIEDE2000) over a **fixed canonical set** (CSS Color 4 named colors ~148, optionally +X11) — `[D!]`: pick and freeze one stable name list; do NOT chase 30k-name incumbents (colorxs, color-name.com) whose lists are the maintenance surface. AI-resistant (nearest-of-N Euclidean/ΔE a chatbot botches). Distinct intent from `brand-colors`. Promote with long-tail proof ("what color is #xxxxxx").

**10. Color temperature (Kelvin → RGB) — 14/25 `[S]`**
- `/color/color-temperature/`. demand 2 · gap 3 · durability 3 · differentiation 3 · build-cost 4. Deterministic Planckian-locus approximation (Tanner Helland). Niche (photography/lighting/white-balance). Low demand; parked.

---

## FOLD (build as modes/rows of existing or lead tools — not standalone pages)

- **LAB / LCH / XYZ / HWB converter → into the OKLCH converter (#1)** as additional output rows. One "modern color spaces" converter, not five thin pages. (Standalone `17/25` on its own, but strictly better folded — shares the exact same XYZ core.)
- **Alpha / opacity blender + 8-digit HEX alpha (`#rrggbbaa`) + `rgba()` ↔ HEX-alpha → into `color-converter`.** Real demand ("hex opacity", "rgba to hex with alpha") but it's a row/mode, not a page (June-2026 spam-update thin-page risk).
- **hex ⇄ RGB shorthand (`#fa0`↔`#ffaa00`) → already handled by the converter.** FAQ line at most.
- **OKLCH mix mode → into `color-mixer`.** CSS `color-mix(in oklch, …)` gives better midpoints than our current sRGB interpolation; add as a "mix in OKLCH" toggle once the OKLab core exists.
- **OKLCH perceptual ramp + Tailwind/`@theme` export → into `color-shades-generator`** (see watchlist #8).
- **APCA-Lc cells → into the contrast grid (#5)** once the APCA engine (#4) is built.

## DO-NOT-BUILD (with reasons)

- **Random / "generate a nice palette" generator** — fails the AI-resistance/value filter: it's a creative "suggest pleasing colors" generator (coolors/Khroma territory), taste not math. Excluded.
- **Duotone / gradient-map image effect** — creative image styling, off-brand, heavier canvas work, drifts toward AI-image territory; no durable deterministic-utility angle.
- **Pantone / RAL / HKS exact conversion** — `[D!]` proprietary licensed color libraries; legally fraught and a maintenance/staleness surface. sRGB↔CMYK approximation already carries the honest print caveat; do not claim Pantone matches.
- **Live "trending palettes" / palette community feed** — needs a server/feed (CORS), off-charter.

---

## Build-order recommendation

1. **Modern color-space converter (#1, OKLCH lead).** Ships the OKLab/LAB/XYZ/gamut-mapping core that the name-finder (#9), OKLCH-harmony (#6), accessible-fix hue preservation (#3), OKLCH mixer/shades folds all reuse. Highest-demand + strongest driver.
2. **Accessibility cluster reusing WCAG math:** accessible-color fixer (#3, cheapest, fold + page) → APCA checker (#4) → contrast grid (#5). Coherent sub-brand anchored by the shipped contrast checker; adds APCA-Lc to the grid last.
3. **Color-vision-deficiency simulator (#2).** Standalone canvas + published matrices; highest AI-resistance (binary + privacy) and strong accessibility SEO.
4. **Color harmony generator (#6).** Cheap, high demand; ship in OKLCH once #1 lands.
5. Then watchlist: image picker/extractor (#7), Tailwind OKLCH scale fold (#8), name finder (#9).

---

## Sources

- https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch
- https://oklch.org/
- https://66colorful.com/blog/oklch-color/
- https://dopelycolors.com/blog/oklch-vs-lch-why-modern-web-developers-are-moving-away-from-hex-codes
- https://github.com/color-js/color.js/issues/557
- https://www.color-blindness.com/coblis-color-blindness-simulator/
- https://daltonlens.org/colorblindness-simulator
- https://daltonlens.org/understanding-cvd-simulation/
- https://github.com/MaPePeR/jsColorblindSimulator
- http://colorspace.r-forge.r-project.org/articles/color_vision_deficiency.html
- https://rgblind.com/color-blindness-simulator
- https://github.com/Myndex/SAPC-APCA
- https://git.apcacontrast.com/documentation/APCAeasyIntro.html
- https://designsystemet.no/en/best-practices/accessibility/contrast
- https://accessibility.build/tools/contrast-checker
- https://accessible-colors.com/
- https://fwdtools.com/color-contrast-checker/
- https://coddy.tech/tools/contrast-checker
- https://contrast-grid.eightshapes.com/
- https://eightshapes.com/articles/color-in-design-systems/
- https://www.tints.dev/
- https://hex2tailwind.com/palette-generator
- https://grafeum.com/tools/tailwind-color-generator
- https://color.adobe.com/create/image
- https://icolorpalette.com/color-palette-from-images/
- https://www.sessions.edu/color-calculator/
- https://colorffy.com/color-scheme-generator
- https://www.colorxs.com/
- https://colornamer.robertcooper.me/
- https://imagecolorpicker.com/
- https://pickcoloronline.com/
