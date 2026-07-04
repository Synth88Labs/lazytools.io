/**
 * LazyTools logo/icon generator.
 * Concept "Hex Lock": rounded hex nut (tools) with a mint keyhole (privacy)
 * on a blue gradient squircle.
 *
 * Usage: node scripts/generate-logo.mjs
 * Regenerates: public/logo.svg, favicon.svg, favicon.ico,
 *              apple-touch-icon.png, icon-192.png, icon-512.png
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const S = 1024;

function hexPoints(cx, cy, R) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + R * Math.cos(a)},${cy + R * Math.sin(a)}`;
  }).join(' ');
}

const DEFS = `<defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3fa9fd"/>
      <stop offset="1" stop-color="#1465cf"/>
    </linearGradient>
    <linearGradient id="mint" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2fc98e"/>
      <stop offset="1" stop-color="#059669"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.20"/>
      <stop offset="0.7" stop-color="#ffffff" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>`;

function masterSvg({ fullBleed = false } = {}) {
  const pts = hexPoints(512, 512, 300);
  const bgShape = fullBleed
    ? `<rect width="${S}" height="${S}" fill="url(#bg)"/>`
    : `<rect width="${S}" height="${S}" rx="${S * 0.22}" fill="url(#bg)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">
  ${DEFS}
  ${bgShape}
  <ellipse cx="512" cy="60" rx="700" ry="380" fill="url(#glow)"/>
  <!-- hex nut shadow -->
  <polygon points="${pts}" fill="#0c3f85" opacity="0.35" transform="translate(0 16)" stroke="#0c3f85" stroke-width="70" stroke-linejoin="round"/>
  <!-- hex nut -->
  <polygon points="${pts}" fill="#ffffff" stroke="#ffffff" stroke-width="70" stroke-linejoin="round"/>
  <!-- keyhole -->
  <circle cx="512" cy="465" r="92" fill="url(#mint)"/>
  <path d="M 478 520 L 546 520 L 576 664 Q 512 688 448 664 Z" fill="url(#mint)"/>
</svg>`;
}

/**
 * Simplified variant for 16/32px favicons: bigger hex, thicker keyhole,
 * no drop shadow (it muddies at tiny sizes).
 */
function smallSvg() {
  const pts = hexPoints(512, 512, 350);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">
  ${DEFS}
  <rect width="${S}" height="${S}" rx="${S * 0.22}" fill="url(#bg)"/>
  <polygon points="${pts}" fill="#ffffff" stroke="#ffffff" stroke-width="90" stroke-linejoin="round"/>
  <circle cx="512" cy="440" r="125" fill="url(#mint)"/>
  <path d="M 460 510 L 564 510 L 606 700 Q 512 730 418 700 Z" fill="url(#mint)"/>
</svg>`;
}

/**
 * Animated header logo: a glint sweeps across the hex every 6s and the
 * keyhole "breathes" gently. CSS animations inside SVG run when embedded
 * via <img>; prefers-reduced-motion disables them.
 */
function animatedSvg() {
  const pts = hexPoints(512, 512, 300);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">
  <style>
    .keyhole { animation: lt-breathe 4s ease-in-out infinite; transform-origin: 512px 520px; }
    .glint { animation: lt-glint 6s ease-in-out infinite; }
    @keyframes lt-breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.045); }
    }
    @keyframes lt-glint {
      0%, 55%, 100% { transform: translateX(-900px) rotate(18deg); opacity: 0; }
      60% { opacity: 0.5; }
      75% { transform: translateX(900px) rotate(18deg); opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .keyhole, .glint { animation: none; }
    }
  </style>
  ${DEFS}
  <clipPath id="squircle"><rect width="${S}" height="${S}" rx="${S * 0.22}"/></clipPath>
  <rect width="${S}" height="${S}" rx="${S * 0.22}" fill="url(#bg)"/>
  <ellipse cx="512" cy="60" rx="700" ry="380" fill="url(#glow)"/>
  <polygon points="${pts}" fill="#0c3f85" opacity="0.35" transform="translate(0 16)" stroke="#0c3f85" stroke-width="70" stroke-linejoin="round"/>
  <polygon points="${pts}" fill="#ffffff" stroke="#ffffff" stroke-width="70" stroke-linejoin="round"/>
  <g class="keyhole">
    <circle cx="512" cy="465" r="92" fill="url(#mint)"/>
    <path d="M 478 520 L 546 520 L 576 664 Q 512 688 448 664 Z" fill="url(#mint)"/>
  </g>
  <g clip-path="url(#squircle)">
    <rect class="glint" x="380" y="-100" width="130" height="1300" fill="#ffffff" opacity="0.35"/>
  </g>
</svg>`;
}

const outDir = new URL('../public/', import.meta.url);

async function renderPng(svg, size, file) {
  const buf = await sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toBuffer();
  await writeFile(new URL(file, outDir), buf);
  return buf;
}

const master = masterSvg();
const fullBleed = masterSvg({ fullBleed: true });
const small = smallSvg();

await writeFile(new URL('logo.svg', outDir), master);
await writeFile(new URL('logo-animated.svg', outDir), animatedSvg());
// favicon.svg uses the small-size-optimized mark (browsers show it tiny)
await writeFile(new URL('favicon.svg', outDir), small);

await renderPng(fullBleed, 180, 'apple-touch-icon.png');
await renderPng(master, 192, 'icon-192.png');
await renderPng(master, 512, 'icon-512.png');

const png16 = await sharp(Buffer.from(small), { density: 300 }).resize(16, 16).png().toBuffer();
const png32 = await sharp(Buffer.from(small), { density: 300 }).resize(32, 32).png().toBuffer();
const png48 = await sharp(Buffer.from(master), { density: 300 }).resize(48, 48).png().toBuffer();
const ico = await pngToIco([png16, png32, png48]);
await writeFile(new URL('favicon.ico', outDir), ico);

console.log('Generated logo.svg, logo-animated.svg, favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png');
