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
  size: { tools: SIZE_TOOLS, blurb: 'Ring, shoe, bra, clothing and hat size converters across US, UK, EU and international systems, with measure-at-home guides and full charts.' },
  dev: { tools: DEV_TOOLS, blurb: 'Base64, URL and HTML encoding, SHA hashes, JWT decoder, regex tester and number-base converter — tokens and payloads never leave the browser.' },
  file: { tools: FILE_TOOLS, blurb: 'CSV/JSON/XML/YAML conversion, JSON formatting, Markdown, and an e-invoice viewer (XRechnung/ZUGFeRD) — open files, download results, nothing uploaded.' },
  text: { tools: TEXT_TOOLS, blurb: 'Word and character counters, case converters, sorting, dedupe, find-and-replace and clean-up — all processing text locally.' },
  generate: { tools: GEN_TOOLS, blurb: 'Password, UUID, QR-code, random-number and lorem-ipsum generators — cryptographically random where it matters, generated on your device.' },
  time: { tools: TIME_TOOLS, blurb: 'Unix timestamp converter, age calculator, days-between-dates, date arithmetic, ISO week numbers and a DST-aware timezone converter.' },
  calendar: { tools: CALENDAR_TOOLS, blurb: 'Convert dates between the Gregorian, Islamic (Hijri), Hebrew, Persian, Indian, Julian and other calendars via the browser\'s ICU data, plus Julian Day Numbers, the NRF 4-5-4 retail calendar and a leap-year checker.' },
  color: { tools: COLOR_TOOLS, blurb: 'HEX/RGB/HSL/CMYK conversion, WCAG contrast checker, shades and tints, gradient generator and color mixer.' },
  security: { tools: SECURITY_TOOLS, blurb: 'Image metadata (EXIF/GPS) remover, AES-256 file encryption, honest password-strength checker and file-hash verifier — the category where "no upload" is the whole point.' },
  image: { tools: IMAGE_TOOLS, blurb: 'Compressor, PNG/JPEG/WebP converter, HEIC-to-JPG (libheif wasm), resizer and image-to-Base64 — browser codecs, no upload, no watermark.' },
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
