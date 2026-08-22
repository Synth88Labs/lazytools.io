/**
 * Generates public/og-default.png (1200×630) — the default social-share image
 * used by every page that doesn't supply its own. Run: node scripts/gen-og-default.mjs
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1120"/>
      <stop offset="0.55" stop-color="#0e1e3a"/>
      <stop offset="1" stop-color="#0a1730"/>
    </linearGradient>
    <linearGradient id="wm" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#38bdf8"/>
      <stop offset="1" stop-color="#818cf8"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1040" cy="120" r="360" fill="#1d87f1" opacity="0.10"/>
  <circle cx="120" cy="560" r="280" fill="#8b5cf6" opacity="0.08"/>
  <g transform="translate(90,120)">
    <rect x="0" y="0" width="74" height="74" rx="18" fill="#1d87f1"/>
    <path d="M20 20 L20 54 L52 54" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="98" y="58" font-family="Segoe UI, Arial, sans-serif" font-size="64" font-weight="800" fill="url(#wm)">LazyTools</text>
  </g>
  <text x="90" y="330" font-family="Segoe UI, Arial, sans-serif" font-size="52" font-weight="700" fill="#eaf2ff">Free online tools that never</text>
  <text x="90" y="392" font-family="Segoe UI, Arial, sans-serif" font-size="52" font-weight="700" fill="#eaf2ff">upload your data.</text>
  <g transform="translate(90,470)">
    <rect x="0" y="0" width="320" height="52" rx="26" fill="#0f2a1c" stroke="#22c55e" stroke-width="1.5"/>
    <text x="26" y="34" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="600" fill="#4ade80">100% in your browser</text>
  </g>
  <text x="90" y="588" font-family="Segoe UI, Arial, sans-serif" font-size="22" fill="#7d8db3">lazytools.io  ·  a Synth88 Labs project</text>
</svg>`;

const out = fileURLToPath(new URL('../public/og-default.png', import.meta.url));
await sharp(Buffer.from(svg)).png().toFile(out);
console.log('Wrote', out);
