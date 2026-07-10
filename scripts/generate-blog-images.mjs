/**
 * Branded 1200×630 feature images for blog posts (also used as og:image).
 * One entry per post; rerun after adding posts: node scripts/generate-blog-images.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const POSTS = [
  {
    slug: 'kg-to-lbs-guide',
    kicker: 'WEIGHT CONVERSION GUIDE',
    lines: ['Kg to Lbs:', 'formula, charts &', 'the 2-second trick'],
    fact: '1 kg = 2.2046226218 lb',
    icon: '⚖️',
  },
  {
    slug: 'celsius-to-fahrenheit-guide',
    kicker: 'TEMPERATURE GUIDE',
    lines: ['Celsius to Fahrenheit', 'made simple:', 'formula & anchors'],
    fact: '°F = °C × 9/5 + 32',
    icon: '🌡️',
  },
  {
    slug: 'mb-vs-gb-explained',
    kicker: 'DATA STORAGE EXPLAINED',
    lines: ['MB vs GB: why your', '1 TB drive shows', 'only 931 GB'],
    fact: '1 GB = 1,000 MB · 1 GiB = 1,024 MiB',
    icon: '💾',
  },
  {
    slug: 'percentage-guide',
    kicker: 'EVERYDAY MATH GUIDE',
    lines: ['How to calculate', 'percentages: all 3', 'forms & fast tricks'],
    fact: 'X% of Y = Y% of X — always',
    icon: '％',
  },
  {
    slug: 'emi-explained',
    kicker: 'LOAN MATH EXPLAINED',
    lines: ['How EMI is', 'calculated: the exact', 'formula banks use'],
    fact: 'EMI = P·r·(1+r)ⁿ ÷ ((1+r)ⁿ−1)',
    icon: '🏦',
  },
  {
    slug: 'cups-to-ml-grams-baking',
    kicker: 'BAKING CONVERSIONS',
    lines: ['Cups to mL & grams:', 'the recipe conversion', 'guide that works'],
    fact: '1 US cup = 236.59 mL',
    icon: '🧁',
  },
  {
    slug: 'running-distances-miles',
    kicker: 'RUNNING DISTANCES',
    lines: ['5K, 10K, half & full', 'marathon in miles', '(+ pace charts)'],
    fact: 'marathon = 42.195 km = 26.219 mi',
    icon: '🏃',
  },
  {
    slug: 'ring-size-guide',
    kicker: 'SIZING GUIDE',
    lines: ['Measure your ring', 'size at home with', 'a strip of paper'],
    fact: 'US 7 = UK N = EU 54.4',
    icon: '💍',
  },
  {
    slug: 'shoe-size-guide',
    kicker: 'SIZING EXPLAINED',
    lines: ['US, UK, EU & cm:', 'why shoe sizes', 'never quite agree'],
    fact: 'US M 9 = UK 8 = EU 42.5 = 26.5 cm',
    icon: '👟',
  },
  {
    slug: 'bra-size-guide',
    kicker: 'SIZING EXPLAINED',
    lines: ['Bra sizes & sister', 'sizes: US, UK & EU', 'finally decoded'],
    fact: '34DD = EU 75E · sister: 36D',
    icon: '🩱',
  },
  {
    slug: 'clothing-size-guide',
    kicker: 'SIZING EXPLAINED',
    lines: ['Dress sizes: US, UK,', 'EU, IT & why vanity', 'sizing broke them'],
    fact: 'US 8 = UK 12 = EU 38 = IT 44',
    icon: '👗',
  },
  {
    slug: 'kids-shoe-size-guide',
    kicker: 'PARENTS GUIDE',
    lines: ['Kids shoe sizes by', 'age — and the 13C', 'to 1Y mystery'],
    fact: '1Y is BIGGER than 13.5C',
    icon: '👶',
  },
  {
    slug: 'hat-size-guide',
    kicker: 'SIZING EXPLAINED',
    lines: ['Hat sizes decoded:', 'your head diameter,', 'in eighths of an inch'],
    fact: 'fitted size = inches ÷ π · 57 cm = 7⅛',
    icon: '🎩',
  },
  {
    slug: 'character-limits-guide',
    kicker: 'WRITING FOR PLATFORMS',
    lines: ['Character limits', 'cheat sheet: X, SMS,', 'Google & Instagram'],
    fact: 'X: 280 · SMS: 160 · meta: ~158',
    icon: '🔡',
  },
  {
    slug: 'wcag-contrast-guide',
    kicker: 'ACCESSIBILITY EXPLAINED',
    lines: ['The 4.5:1 rule:', 'WCAG color contrast', 'without the jargon'],
    fact: 'AA: 4.5:1 text · 3:1 large & UI',
    icon: '♿',
  },
  {
    slug: 'naming-cases-guide',
    kicker: 'DEVELOPER CONVENTIONS',
    lines: ['camelCase, snake_case', 'or kebab-case? Which', 'case goes where'],
    fact: 'JS: camelCase · Python: snake_case · URLs: kebab-case',
    icon: 'Aa',
  },
  {
    slug: 'clean-up-lists-guide',
    kicker: 'TEXT CLEANUP WORKFLOW',
    lines: ['Messy list? Dedupe,', 'sort & fix broken', 'text in 4 steps'],
    fact: 'dedupe → sort → clean → replace',
    icon: '🧹',
  },
  {
    slug: 'css-color-formats-guide',
    kicker: 'CSS COLORS EXPLAINED',
    lines: ['HEX, RGB & HSL:', 'same color, three', 'dialects decoded'],
    fact: '#1d87f1 = rgb(29,135,241)',
    icon: '🎨',
  },
  {
    slug: 'csv-to-json-guide',
    kicker: 'DATA CONVERSION GUIDE',
    lines: ['CSV to JSON without', 'the traps: quotes,', 'commas & semicolons'],
    fact: '"Doe, Jane" = one field, not two',
    icon: '📊',
  },
  {
    slug: 'json-yaml-xml-guide',
    kicker: 'DATA FORMATS COMPARED',
    lines: ['JSON vs YAML vs XML:', 'which format for', 'which job'],
    fact: 'APIs: JSON · configs: YAML · legacy: XML',
    icon: '🗂️',
  },
  {
    slug: 'password-entropy-guide',
    kicker: 'PASSWORD SECURITY',
    lines: ['How strong is a', 'password? Entropy,', 'explained honestly'],
    fact: 'entropy = length × log₂(alphabet)',
    icon: '🔑',
  },
  {
    slug: 'unix-timestamps-guide',
    kicker: 'TIME EXPLAINED',
    lines: ['Unix timestamps:', 'seconds, milliseconds', '& the year 2038'],
    fact: '10 digits = s · 13 digits = ms',
    icon: '⏱️',
  },
  {
    slug: 'base64-explained-guide',
    kicker: 'ENCODING EXPLAINED',
    lines: ['Base64 is not', 'encryption — what it', 'actually does'],
    fact: '3 bytes → 4 chars (+33%)',
    icon: '🔡',
  },
  {
    slug: 'exif-metadata-guide',
    kicker: 'PHOTO PRIVACY',
    lines: ['What your photos', 'reveal: EXIF, GPS &', 'how to strip them'],
    fact: 'phone GPS ≈ 5 m accuracy',
    icon: '🧹',
  },
  {
    slug: 'image-formats-guide',
    kicker: 'IMAGE FORMATS',
    lines: ['JPEG vs PNG vs', 'WebP: which format', 'for which job'],
    fact: 'resize + q80 ≈ 90% smaller',
    icon: '🖼️',
  },
  {
    slug: 'merge-pdf-guide',
    kicker: 'PDF WORKFLOWS',
    lines: ['Merge & split PDFs', 'without uploading', 'them anywhere'],
    fact: 'structural copy = zero quality loss',
    icon: '📄',
  },
  {
    slug: 'wav-vs-mp3-guide',
    kicker: 'AUDIO FORMATS',
    lines: ['WAV vs MP3:', 'lossless, lossy & the', 'one-way conversion'],
    fact: 'WAV ≈ 10 MB/min · MP3 ≈ 1 MB/min',
    icon: '🎚️',
  },
  {
    slug: 'heic-to-jpg-guide',
    kicker: 'PHOTO FORMATS',
    lines: ['Why iPhone photos', "won't open — HEIC", 'explained'],
    fact: 'HEIC ≈ ½ the size of JPEG',
    icon: '📲',
  },
  {
    slug: 'pdf-password-guide',
    kicker: 'PDF SECURITY',
    lines: ['Password-protect (or', 'unlock) a PDF without', 'uploading it'],
    fact: 'never send the file + password together',
    icon: '🔐',
  },
  {
    slug: 'e-invoice-guide',
    kicker: 'E-INVOICING',
    lines: ['Invoice as an XML', 'file? XRechnung &', 'ZUGFeRD explained'],
    fact: 'EN 16931 · receive since Jan 2025',
    icon: '🧾',
  },
  {
    slug: '4-5-4-retail-calendar-guide',
    kicker: 'RETAIL CALENDAR',
    lines: ['The 4-5-4 retail', 'calendar: why months', "aren't normal"],
    fact: '4 quarters × 13 weeks = 364 days',
    icon: '🛍️',
  },
  {
    slug: 'calendar-systems-guide',
    kicker: 'WORLD CALENDARS',
    lines: ['Hijri, Hebrew, Persian', '& Julian: how the', "world's calendars work"],
    fact: 'lunar · solar · lunisolar',
    icon: '🗓️',
  },
  {
    slug: 'nepali-date-bs-ad-guide',
    kicker: 'NEPALI CALENDAR',
    lines: ['BS to AD: how the', 'Bikram Sambat', 'calendar works'],
    fact: '2024 AD = 2081 BS · +56 yrs 8 mths',
    icon: '🇳🇵',
  },
  {
    slug: 'codes-and-ciphers-guide',
    kicker: 'CODES & CIPHERS',
    lines: ['Morse, NATO, binary', '& classic ciphers you', 'can actually read'],
    fact: 'encoding ≠ cipher ≠ encryption',
    icon: '📡',
  },
  {
    slug: 'privacy-first-productivity-guide',
    kicker: 'PRODUCTIVITY',
    lines: ['Privacy-first', 'productivity: plan &', 'focus without the cloud'],
    fact: 'your data stays in your browser',
    icon: '🚀',
  },
  {
    slug: 'pomodoro-technique-guide',
    kicker: 'FOCUS TECHNIQUE',
    lines: ['The Pomodoro', 'Technique: why 25-min', 'sprints beat marathons'],
    fact: '25 min focus · 5 min break · repeat',
    icon: '🍅',
  },
  {
    slug: 'ipv6-subnetting-guide',
    kicker: 'NETWORK & IT',
    lines: ['IPv6 crossed 50%:', 'subnetting for the', 'dual-stack era'],
    fact: 'every LAN is a /64 — count subnets, not hosts',
    icon: '🌐',
  },
  {
    slug: 'facturx-france-2026-guide',
    kicker: 'E-INVOICING',
    lines: ['Factur-X & France’s', '2026 mandate: read the', 'invoice inside the PDF'],
    fact: 'receive obligation: all companies, 1 Sept 2026',
    icon: '🇫🇷',
  },
  {
    slug: 'llm-tokens-cost-guide',
    kicker: 'DEVELOPER TOOLS',
    lines: ['LLM tokens explained:', 'what your prompts cost', '& which counts are exact'],
    fact: 'output tokens cost 5–6× input — cap the reply',
    icon: '🪙',
  },
  {
    slug: 'ksef-fa3-invoice-guide',
    kicker: 'E-INVOICING',
    lines: ['KSeF 2026/2027: how to', 'read an FA(3) invoice —', 'no software, no upload'],
    fact: 'from Jan 2027: penalties up to 100% of VAT',
    icon: '🇵🇱',
  },
  {
    slug: 'pdf-accessibility-guide',
    kicker: 'PDF TOOLS',
    lines: ['PDF accessibility after', 'the EAA: what screen', 'readers actually need'],
    fact: 'tags · language · title · text layer · alt text',
    icon: '♿',
  },
  {
    slug: 'pdf-redaction-guide',
    kicker: 'PDF TOOLS',
    lines: ['Why PDF redactions', 'keep failing — and how', 'to redact for real'],
    fact: 'a black box hides text; it does not remove it',
    icon: '⬛',
  },
  {
    slug: 'exact-math-guide',
    kicker: 'MATHEMATICS',
    lines: ['0.1 + 0.2 ≠ 0.3: why', 'calculators quietly round', '& what exact math looks like'],
    fact: 'floats hold ~15–17 digits — then they invent',
    icon: '➗',
  },
  {
    slug: 'brand-colors-guide',
    kicker: 'COLOR TOOLS',
    lines: ['Brand colors: the exact', 'hex codes — and how', 'to use them legally'],
    fact: 'a color isn’t owned; impersonation is the line',
    icon: '🏷️',
  },
  {
    slug: 'significant-figures-guide',
    kicker: 'MATHEMATICS',
    lines: ['Significant figures:', 'the rules, the ambiguous', 'cases & how to round'],
    fact: '0.004560 → 4 sig figs · 1200 is ambiguous',
    icon: '🎯',
  },
  {
    slug: 'chmod-permissions-guide',
    kicker: 'NETWORK & IT',
    lines: ['chmod 755 explained:', 'Unix file permissions', 'without the guesswork'],
    fact: 'read=4 · write=2 · execute=1 — each digit sums',
    icon: '🔑',
  },
  {
    slug: 'cron-expressions-guide',
    kicker: 'NETWORK & IT',
    lines: ['Cron syntax explained:', 'five fields, shortcuts', '& the OR-rule trap'],
    fact: '0 0 1 * 1 fires the 1st AND every Monday',
    icon: '⏲️',
  },
  {
    slug: 'tdee-calorie-needs-guide',
    kicker: 'CALCULATORS',
    lines: ['BMR vs TDEE: how', 'many calories you', 'actually need'],
    fact: 'TDEE = BMR × activity factor (1.2 → 1.9)',
    icon: '🍎',
  },
  {
    slug: 'mortgage-amortization-guide',
    kicker: 'CALCULATORS',
    lines: ['Why your first', 'mortgage payment is', 'almost all interest'],
    fact: 'Payment #1: $1,500 interest · $299 principal',
    icon: '🏠',
  },
  {
    slug: 'markup-vs-margin-guide',
    kicker: 'CALCULATORS',
    lines: ['Markup vs margin:', 'same profit, two very', 'different percentages'],
    fact: '$60 → $100 = 66.7% markup but 40% margin',
    icon: '🏷️',
  },
  {
    slug: 'reverse-complement-guide',
    kicker: 'BIOLOGY & LAB',
    lines: ['Reverse complement:', 'complement each base,', 'then reverse 5′→3′'],
    fact: 'ATGC → complement TACG → reverse GCAT',
    icon: '🧬',
  },
  {
    slug: 'punnett-square-guide',
    kicker: 'BIOLOGY & LAB',
    lines: ['Punnett squares:', 'monohybrid 3:1 and', 'where 9:3:3:1 comes from'],
    fact: 'Aa × Aa → 1:2:1 genotype · 3:1 phenotype',
    icon: '🟩',
  },
  {
    slug: 'passport-photo-size-by-country-guide',
    kicker: 'PHOTO SIZE MAKER',
    lines: ['Passport photo size', 'by country: 35×45,', '2×2 in & the outliers'],
    fact: 'Spain 26×32 · Canada 50×70 · Kenya 55×55',
    icon: '🪪',
  },
  {
    slug: 'dilution-c1v1-c2v2-guide',
    kicker: 'BIOLOGY & LAB',
    lines: ['C1V1 = C2V2:', 'how to calculate', 'any dilution'],
    fact: '100 mL of 1× from 10× = 10 mL stock + 90 mL',
    icon: '🧪',
  },
  {
    slug: 'hardy-weinberg-guide',
    kicker: 'BIOLOGY & LAB',
    lines: ['Hardy–Weinberg:', 'p²+2pq+q²=1 and', 'the chi-square test'],
    fact: 'p = (2·AA + Aa) / 2N · test at 1 df',
    icon: '📊',
  },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function heroSvg({ kicker, lines, fact, icon }) {
  const titleSpans = lines
    .map((l, i) => `<tspan x="72" dy="${i === 0 ? 0 : 74}">${esc(l)}</tspan>`)
    .join('');
  kicker = esc(kicker);
  fact = esc(fact);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#153056"/>
      <stop offset="0.55" stop-color="#185ab4"/>
      <stop offset="1" stop-color="#1d87f1"/>
    </linearGradient>
    <linearGradient id="mint" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2fc98e"/>
      <stop offset="1" stop-color="#059669"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.14"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <ellipse cx="980" cy="80" rx="620" ry="360" fill="url(#glow)"/>
  <!-- hex accents -->
  <g opacity="0.10" fill="none" stroke="#ffffff" stroke-width="10">
    <polygon points="1050,120 1130,166 1130,258 1050,304 970,258 970,166"/>
    <polygon points="1120,330 1185,368 1185,442 1120,480 1055,442 1055,368"/>
  </g>
  <text x="1005" y="215" font-size="120" text-anchor="middle" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif">${icon}</text>
  <text x="72" y="120" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="4" fill="#8ed9ff">${kicker}</text>
  <text x="72" y="220" font-family="Segoe UI, Arial, sans-serif" font-size="62" font-weight="800" fill="#ffffff">${titleSpans}</text>
  <!-- citable fact chip -->
  <rect x="72" y="440" rx="16" width="${Math.min(1050, 40 + fact.length * 17)}" height="64" fill="#0c3f85"/>
  <text x="100" y="482" font-family="Consolas, Menlo, monospace" font-size="30" font-weight="600" fill="#7ef0c0">${fact}</text>
  <!-- brand footer -->
  <g transform="translate(72 556)">
    <polygon points="18,0 33,9 33,27 18,36 3,27 3,9" fill="#ffffff"/>
    <circle cx="18" cy="14" r="5.5" fill="url(#mint)"/>
    <path d="M 15 17 L 21 17 L 23 26 Q 18 28 13 26 Z" fill="url(#mint)"/>
    <text x="46" y="26" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="700" fill="#ffffff">lazytools.io</text>
    <text x="212" y="26" font-family="Segoe UI, Arial, sans-serif" font-size="22" fill="#bce7ff">· free, private, in-browser tools</text>
  </g>
</svg>`;
}

const outDir = new URL('../public/blog/', import.meta.url);
await mkdir(outDir, { recursive: true });
for (const post of POSTS) {
  const png = await sharp(Buffer.from(heroSvg(post)), { density: 150 }).resize(1200, 630).png().toBuffer();
  await writeFile(new URL(`${post.slug}.png`, outDir), png);
  console.log(`generated public/blog/${post.slug}.png`);
}
