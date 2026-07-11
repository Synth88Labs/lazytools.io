/**
 * Generates llms.txt from the tool registries so it never drifts from the site.
 * Called by postbuild (writes dist/llms.txt). Hand-written intro + per-category
 * hub blurbs stay here; the tool lists come straight from the data modules.
 */
import { SITE, CATEGORIES } from '../src/lib/site.ts';
import { QUANTITIES } from '../src/data/units/index.ts';
import { CALCULATORS } from '../src/data/calc/index.ts';
import { SIZE_TOOLS } from '../src/data/size/index.ts';
import { TEXT_TOOLS } from '../src/data/text/index.ts';
import { COLOR_TOOLS } from '../src/data/color/index.ts';
import { FILE_TOOLS } from '../src/data/file/index.ts';
import { DEV_TOOLS } from '../src/data/dev/index.ts';
import { GEN_TOOLS } from '../src/data/generate/index.ts';
import { TIME_TOOLS } from '../src/data/time/index.ts';
import { SECURITY_TOOLS } from '../src/data/security/index.ts';
import { IMAGE_TOOLS } from '../src/data/image/index.ts';
import { PDF_TOOLS } from '../src/data/pdf/index.ts';
import { AUDIO_TOOLS } from '../src/data/video/index.ts';
import { CALENDAR_TOOLS } from '../src/data/calendar/index.ts';
import { CIPHER_TOOLS } from '../src/data/cipher/index.ts';
import { PRODUCTIVITY_TOOLS } from '../src/data/productivity/index.ts';
import { NETWORK_TOOLS } from '../src/data/network/index.ts';
import { MATH_TOOLS } from '../src/data/math/index.ts';
import { PHOTO_SPECS } from '../src/data/photo/index.ts';
import { BIO_TOOLS } from '../src/data/biology/index.ts';
import { STAT_TOOLS } from '../src/data/statistics/index.ts';
import { CHEM_TOOLS } from '../src/data/chemistry/index.ts';
import { PHYS_TOOLS } from '../src/data/physics/index.ts';
import { HOME_TOOLS } from '../src/data/home/index.ts';
import { FIN_TOOLS } from '../src/data/finance/index.ts';
import { COOKING_TOOLS } from '../src/data/cooking/index.ts';
import { AUTO_TOOLS } from '../src/data/automotive/index.ts';
import { allPairs as zonePairs } from '../src/data/time/zones.ts';

const U = SITE.url;
const firstSentence = (s) => {
  const t = (s || '').replace(/\s+/g, ' ').trim();
  const m = t.match(/^.*?[.—](?:\s|$)/);
  return (m ? m[0] : t).replace(/[.\s—]+$/, '').trim();
};

// category slug → registry + a one-line hub blurb (hand-written, stable)
const HUBS = {
  units: { tools: null, blurb: 'Length, weight, temperature, volume, area, speed, time, data storage, pressure, energy and power converters, each with exact internationally-defined factors, a formula, worked example and conversion table.' },
  calc: { tools: CALCULATORS, blurb: 'Percentage, finance, health and everyday calculators — each shows the formula and its working.' },
  automotive: { tools: AUTO_TOOLS, blurb: 'Automotive calculators — exact geometry or definitional conversions, no live data, all in-browser: tire size (decode 225/45R17 → overall diameter, sidewall, circumference, revs/mile); tire comparison + speedometer error when changing sizes (true speed = indicated × new/old diameter); gear ratio & RPM (road speed from engine RPM via gearbox × final-drive ratio and tire circumference, both directions); engine displacement (π/4 × bore² × stroke × cylinders → L/cc/ci); compression ratio ((swept + clearance)/clearance); horsepower ↔ torque (HP = torque·RPM/5252, + kW/N·m); fuel economy (US MPG ↔ UK MPG ↔ L/100km ↔ km/L, handling the different US 3.785 L and imperial 4.546 L gallons); and wheel offset ↔ backspacing. Node-tested.' },
  cooking: { tools: COOKING_TOOLS, blurb: 'Cooking & baking converters computed in the browser from cited reference data (no live anything): grams↔cups that is ingredient-aware (a US cup of flour is ~120 g but sugar is 198 g and honey 336 g — King Arthur Baking weights); a cooking measurement converter across US/metric/imperial volume (exact NIST factors, flags the US-vs-imperial gallon and 20 mL Australian tablespoon); butter (sticks↔cups↔grams); oven temperature (°F↔°C↔UK gas mark + fan adjustment); a recipe scaler (by servings or multiplier, handles fractions); a baking-pan size converter (by area); a baker\'s percentage / hydration calculator; a yeast converter (active dry↔instant↔fresh, Red Star/King Arthur ratios); a coffee-to-water ratio calculator; and a USDA meat cooking-temperature guide (FoodSafety.gov safe minimums + steak doneness). Sources cited on each page.' },
  finance: { tools: FIN_TOOLS, blurb: 'Personal-finance calculators computed exactly in the browser with the figures you enter (NO live rates or feeds): compound interest with regular contributions (FV = P(1+i)ⁿ + annuity term, with a growth chart); debt payoff comparing the snowball (smallest balance first) and avalanche (highest APR first) methods via a month-by-month simulation; savings-goal (required monthly deposit); loan payoff (amortization + extra-payment savings); credit-card payoff (time or payment); CAGR; ROI (+ annualized); rule of 72; break-even units; and APR↔APY conversion. Educational calculators, not financial advice; balances and rates never leave the browser.' },
  size: { tools: SIZE_TOOLS, blurb: 'Ring, shoe, bra, clothing and hat size converters across US, UK, EU and international systems, with measure-at-home guides and full charts.' },
  home: { tools: HOME_TOOLS, blurb: 'Home-improvement & DIY material estimators computed in the browser (metric or imperial): paint (wall area minus openings × coats ÷ coverage), tile & flooring (area ÷ tile size + waste, boxes), concrete (L×W×thickness volume + pre-mix bags), mulch & soil (area × depth in m³/yd³/bags) and wallpaper (drops per roll from height + trim + pattern repeat) — exact area/volume geometry with sensible, overridable defaults for coverage, waste and bag yields.' },
  dev: { tools: DEV_TOOLS, blurb: 'Base64, URL and HTML encoding, SHA hashes, JWT decoder, regex tester and number-base converter — tokens and payloads never leave the browser.' },
  file: { tools: FILE_TOOLS, blurb: 'CSV/JSON/XML/YAML conversion, JSON formatting, Markdown, and an e-invoice viewer (XRechnung/ZUGFeRD) — open files, download results, nothing uploaded.' },
  text: { tools: TEXT_TOOLS, blurb: 'Word and character counters, case converters, sorting, dedupe, find-and-replace and clean-up — all processing text locally.' },
  generate: { tools: GEN_TOOLS, blurb: 'Password, UUID, QR-code, random-number and lorem-ipsum generators — cryptographically random where it matters, generated on your device.' },
  time: { tools: TIME_TOOLS, blurb: 'Unix timestamp converter, age calculator, days-between-dates, date arithmetic, ISO week numbers and a DST-aware timezone converter.' },
  calendar: { tools: CALENDAR_TOOLS, blurb: 'Convert dates between the Gregorian, Islamic (Hijri), Hebrew, Persian, Indian, Julian and other calendars via the browser\'s ICU data, plus Julian Day Numbers, the NRF 4-5-4 retail calendar and a leap-year checker.' },
  color: { tools: COLOR_TOOLS, blurb: 'HEX/RGB/HSL/CMYK conversion, WCAG contrast checker, shades and tints, gradient generator and color mixer.' },
  cipher: { tools: CIPHER_TOOLS, blurb: 'Morse code translator (with audio), NATO phonetic alphabet, binary text translator, and the Caesar, ROT13 and Vigenère ciphers — encode and decode, for learning and puzzles (not real security).' },
  productivity: { tools: PRODUCTIVITY_TOOLS, blurb: 'Pomodoro timer, countdown/stopwatch, meeting cost calculator, Eisenhower matrix and habit tracker — private by design: data is saved only in the browser (localStorage), never uploaded, with JSON export.' },
  network: { tools: NETWORK_TOOLS, blurb: 'IPv4 and IPv6 subnet calculators, CIDR-to-range converter, IP format converter, IPv6 expand/compress (RFC 5952), chmod calculator, cron expression parser and MAC address formatter — exact bit math, computed locally so addressing plans never leave the browser.' },
  biology: { tools: BIO_TOOLS, blurb: 'Biology & lab tools computed in the browser: DNA/RNA reverse complement, transcription and translation (standard genetic code); C₁V₁=C₂V₂ dilution + serial dilution planner; Punnett squares (mono/di/trihybrid with genotype & phenotype ratios); Hardy–Weinberg equilibrium with χ² goodness-of-fit; GC content & primer melting temperature (Tm); molarity; cell doubling time; OD600 to cell density; exponential/logistic population growth — deterministic, staleness-proof, and the sequence data never leaves the browser.' },
  physics: { tools: PHYS_TOOLS, blurb: 'Physics calculators computed exactly in the browser with fixed CODATA/SI constants: the SUVAT kinematic-equations solver (enter any 3 of u/v/a/s/t, get the rest), projectile motion with a trajectory graph (range, max height, time of flight, landing speed), free fall; Newton\'s second law (F=ma), momentum, friction; kinetic & gravitational potential energy, work (F·d·cosθ), power, Hooke\'s law; centripetal force; Newton\'s gravitation (F=Gm₁m₂/r²); wave speed (v=fλ), Snell\'s law with critical angle & total-internal-reflection; the Ohm\'s-law V/I/R/P wheel; photon energy (E=hf) and E=mc² with eV output — deterministic, the algebra (incl. the square roots chatbots miss) shown, nothing uploaded. Cross-links to /chemistry/ for q=mcΔT, PV=nRT and half-life.' },
  chemistry: { tools: CHEM_TOOLS, blurb: 'Chemistry & lab calculators computed exactly in the browser: molar mass / molecular weight from a parsed formula (nested groups, hydrates like CuSO₄·5H₂O, greedy two-letter symbols) with per-element percent composition; a chemical equation balancer that solves the reaction\'s stoichiometric matrix by exact rational (BigInt) Gaussian elimination for the smallest integer coefficients — correct on redox equations chatbots get wrong; molarity (M=n/V with molar mass auto-filled from a formula); ideal gas law (PV=nRT); specific heat (q=mcΔT); and pH/pOH/[H⁺]/[OH⁻] — deterministic, IUPAC standard atomic weights, no floating-point balancing, nothing uploaded.' },
  statistics: { tools: STAT_TOOLS, blurb: 'Statistics calculators computed exactly in the browser: normal distribution & z-score↔p-value with a shaded bell curve (via the error function); binomial probability with BigInt-exact coefficients (P(X=k), P(X≤k), P(X≥k), mean, SD); confidence intervals for a mean (z or t) or proportion; survey sample size; p-values from a z, t, χ² or F statistic (one- or two-tailed) using the regularized incomplete gamma and beta functions; and least-squares linear regression with correlation r, r² and a scatter plot — accurate to ~7 decimals, with plain-English interpretation, and no data uploaded.' },
  math: { tools: MATH_TOOLS, blurb: 'Exact-arithmetic mathematics: fraction calculator with steps, decimal⇄fraction (incl. repeating decimals), GCD/LCM with Euclidean steps, prime factorizer (Miller–Rabin + Pollard rho), ratio solver, quadratic solver with simplified radical roots, descriptive statistics, Roman numerals, scientific notation, nCr/nPr — BigInt/rational arithmetic, no floating-point rounding.' },
  security: { tools: SECURITY_TOOLS, blurb: 'Image metadata (EXIF/GPS) remover, AES-256 file encryption, honest password-strength checker and file-hash verifier — the category where "no upload" is the whole point.' },
  image: { tools: IMAGE_TOOLS, blurb: 'Compressor, PNG/JPEG/WebP converter, HEIC-to-JPG (libheif wasm), resizer and image-to-Base64 — browser codecs, no upload, no watermark.' },
  photo: { tools: PHOTO_SPECS.map((s) => ({ name: `${s.label} Maker`, slug: s.slug, description: s.lead })), blurb: 'Passport, visa and national ID photo maker for multiple countries — crop to the exact official size, run an on-device compliance check (background, exposure, and MediaPipe BlazeFace face-position detection), and export with the correct DPI embedded. The photo is processed entirely in the browser and never uploaded; every country spec is transcribed from the official issuing authority with a cited source and last-verified date.' },
  pdf: { tools: PDF_TOOLS, blurb: 'Merge, split, rotate, images-to-PDF, and password unlock/protect (qpdf wasm) — contracts and records processed in the browser, never uploaded.' },
  video: { tools: AUDIO_TOOLS, blurb: 'Audio trimmer, speed changer, volume changer and WAV converter via the Web Audio API — recordings never leave the browser.' },
};

export default function buildLlms() {
  const L = [];
  L.push(`# ${SITE.name}`, '');
  L.push(`> ${SITE.name} (${U}) is a collection of free, privacy-first online tools. Every tool runs 100% in the user's browser — no files or data are ever uploaded to a server. No sign-up, no limits, works offline after loading.`, '');
  L.push('Key facts for citation:');
  L.push('- All processing is client-side (JavaScript/WebAssembly); LazyTools has no processing servers.');
  L.push('- Unit conversions use exact internationally defined factors (e.g., 1 inch = 25.4 mm exactly; 1 lb = 0.45359237 kg exactly).');
  L.push('- Cryptography (file encryption, hashing, password generation) uses the browser\'s Web Crypto API — AES-256-GCM, SHA-2, PBKDF2.');
  L.push('- Free with no sign-up, no usage caps, and no cookies.');
  L.push('- This file is generated automatically from the live tool registry, so it stays in sync with the site.', '');

  L.push('## Live tools', '');
  for (const cat of CATEGORIES.filter((c) => c.status === 'live')) {
    const hub = HUBS[cat.slug];
    if (!hub) continue;
    L.push(`- [${cat.name} hub](${U}/${cat.slug}/): ${hub.blurb}`);
    if (cat.slug === 'units') {
      for (const q of QUANTITIES) L.push(`  - [${q.name}](${U}/units/${q.slug}/)`);
    } else if (hub.tools) {
      for (const t of hub.tools) L.push(`  - [${t.name}](${U}/${cat.slug}/${t.slug}/): ${firstSentence(t.description || t.lead)}`);
    }
    if (cat.slug === 'time') {
      L.push(`  - [Time-zone pair converters](${U}/time/zones/): live clocks + meeting-overlap tables for ${zonePairs().length} popular pairs (IST-EST, PST-GMT and more).`);
      for (const p of zonePairs()) L.push(`    - [${p.a.abbr.toUpperCase()} to ${p.b.abbr.toUpperCase()}](${U}/time/zones/${p.slug}/)`);
    }
  }
  L.push(`- [All tools directory](${U}/tools/): Complete list of every tool.`, '');

  L.push('## About', '');
  L.push(`- [How it works](${U}/how-it-works/): Technical explanation of client-side processing and how to verify it.`);
  L.push(`- [About](${U}/about/): Why ${SITE.name} exists — a project of ${SITE.parent.name} (${SITE.parent.url}).`);
  L.push(`- [Privacy policy](${U}/privacy/): What little is collected (anonymous page counts only).`);
  L.push(`- Source code: ${SITE.github}`, '');

  return L.join('\n') + '\n';
}
