/**
 * Three revision concepts for the LazyTools mark, rendered as 256px previews.
 * A: "Lazy Sloth" — minimal sloth face (owns the name, friendly, memorable)
 * B: "Hex Lock"  — hex nut (tools) with keyhole cutout (privacy), geometric
 * C: "Bolt Shield" — shield + lightning bolt (protected + fast)
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const S = 1024;

const defs = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3fa9fd"/>
      <stop offset="1" stop-color="#1465cf"/>
    </linearGradient>
    <linearGradient id="deep" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1d87f1"/>
      <stop offset="1" stop-color="#1155b8"/>
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

const bg = `<rect width="${S}" height="${S}" rx="${S * 0.22}" fill="url(#bg)"/>
  <ellipse cx="512" cy="60" rx="700" ry="380" fill="url(#glow)"/>`;

function wrap(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">${defs}${bg}${inner}</svg>`;
}

// ---------------- Concept A: Lazy Sloth ----------------
function sloth() {
  return wrap(`
  <!-- face shadow -->
  <circle cx="512" cy="548" r="312" fill="#0c3f85" opacity="0.35"/>
  <circle cx="512" cy="532" r="312" fill="#ffffff"/>
  <!-- eye patches: outer ends droop downward like a sloth's mask -->
  <g fill="url(#deep)">
    <ellipse cx="380" cy="492" rx="158" ry="86" transform="rotate(24 380 492)"/>
    <ellipse cx="644" cy="492" rx="158" ry="86" transform="rotate(-24 644 492)"/>
  </g>
  <!-- eyes: sleepy half-closed lids -->
  <g>
    <circle cx="404" cy="478" r="46" fill="#ffffff"/>
    <circle cx="620" cy="478" r="46" fill="#ffffff"/>
    <path d="M 368 478 A 36 36 0 0 0 440 478 Z" fill="#153056"/>
    <path d="M 584 478 A 36 36 0 0 0 656 478 Z" fill="#153056"/>
  </g>
  <!-- nose -->
  <ellipse cx="512" cy="612" rx="36" ry="27" fill="#153056"/>
  <!-- content smile -->
  <path d="M 448 668 Q 512 716 576 668" fill="none" stroke="#153056" stroke-width="18" stroke-linecap="round"/>
  `);
}

// ---------------- Concept B: Hex Lock ----------------
function hexLock() {
  // pointy-top hexagon, rounded via thick round-join stroke
  const R = 300;
  const cx = 512, cy = 512;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + R * Math.cos(a)},${cy + R * Math.sin(a)}`;
  }).join(' ');
  return wrap(`
  <polygon points="${pts}" fill="#0c3f85" opacity="0.35" transform="translate(0 16)" stroke="#0c3f85" stroke-width="70" stroke-linejoin="round"/>
  <polygon points="${pts}" fill="#ffffff" stroke="#ffffff" stroke-width="70" stroke-linejoin="round"/>
  <!-- keyhole -->
  <circle cx="512" cy="465" r="92" fill="url(#deep)"/>
  <path d="M 478 520 L 546 520 L 576 664 Q 512 688 448 664 Z" fill="url(#deep)"/>
  `);
}

// ---------------- Concept C: Bolt Shield ----------------
function boltShield() {
  const shield = `M 512 214
    C 560 236, 646 250, 806 262
    L 806 552
    C 806 700, 668 800, 512 852
    C 356 800, 218 700, 218 552
    L 218 262
    C 378 250, 464 236, 512 214 Z`;
  return wrap(`
  <path d="${shield}" fill="#0c3f85" opacity="0.35" transform="translate(0 16)"/>
  <path d="${shield}" fill="#ffffff"/>
  <path d="M 556 316 L 400 564 L 492 564 L 452 744 L 634 476 L 536 476 Z" fill="url(#mint)"/>
  `);
}

// ---------------- Concept B2: Hex Lock, mint keyhole ----------------
function hexLockMint() {
  const R = 300;
  const cx = 512, cy = 512;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + R * Math.cos(a)},${cy + R * Math.sin(a)}`;
  }).join(' ');
  return wrap(`
  <polygon points="${pts}" fill="#0c3f85" opacity="0.35" transform="translate(0 16)" stroke="#0c3f85" stroke-width="70" stroke-linejoin="round"/>
  <polygon points="${pts}" fill="#ffffff" stroke="#ffffff" stroke-width="70" stroke-linejoin="round"/>
  <circle cx="512" cy="465" r="92" fill="url(#mint)"/>
  <path d="M 478 520 L 546 520 L 576 664 Q 512 688 448 664 Z" fill="url(#mint)"/>
  `);
}

const outDir = new URL('../public/', import.meta.url);
for (const [name, svg] of [
  ['concept-a-sloth', sloth()],
  ['concept-b-hexlock', hexLock()],
  ['concept-b-mint', hexLockMint()],
  ['concept-c-boltshield', boltShield()],
]) {
  const buf = await sharp(Buffer.from(svg), { density: 300 }).resize(256, 256).png().toBuffer();
  await writeFile(new URL(`${name}.png`, outDir), buf);
  const buf32 = await sharp(Buffer.from(svg), { density: 300 }).resize(32, 32).png().toBuffer();
  await writeFile(new URL(`${name}-32.png`, outDir), buf32);
}
console.log('concept previews written');
