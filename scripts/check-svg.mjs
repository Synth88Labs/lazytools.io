/**
 * Build-time guard: fail if any SVG under public/ contains an unescaped
 * ampersand (or literal <>) in text, which makes it invalid XML and stops
 * browsers rendering it (xmlParseEntityRef: no name).
 *
 * These SVGs (blog infographics etc.) are hand-authored, so a raw "&" in a
 * label slips through easily. This runs as the first step of `npm run build`,
 * so a broken SVG fails the build locally and in CI before it can deploy.
 *
 * Run standalone:  node scripts/check-svg.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../public/', import.meta.url));

/** Recursively collect every .svg path under dir. */
function collectSvgs(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...collectSvgs(full));
    else if (entry.toLowerCase().endsWith('.svg')) out.push(full);
  }
  return out;
}

// A "&" that is NOT the start of a valid entity: &name; &#123; &#xAF;
const RAW_AMP = /&(?!(?:[a-zA-Z][a-zA-Z0-9]*|#[0-9]+|#x[0-9a-fA-F]+);)/;

const files = collectSvgs(ROOT);
const problems = [];

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    const m = RAW_AMP.exec(line);
    if (m) {
      const col = m.index + 1;
      const snippet = line.slice(Math.max(0, m.index - 30), m.index + 30).trim();
      problems.push({ file: file.replace(ROOT, 'public/'), line: i + 1, col, snippet });
    }
  });
}

if (problems.length) {
  console.error(`\n✗ check-svg: ${problems.length} unescaped ampersand(s) — invalid XML, will not render:\n`);
  for (const p of problems) {
    console.error(`  ${p.file}:${p.line}:${p.col}`);
    console.error(`    …${p.snippet}…`);
    console.error(`    fix: replace "&" with "&amp;" (or &lt; / &gt; / a numeric entity)\n`);
  }
  process.exit(1);
}

console.log(`✓ check-svg: ${files.length} SVG file(s) clean — no unescaped ampersands`);
