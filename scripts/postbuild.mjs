/**
 * Post-build steps:
 * 1. Expose the sitemap index as /sitemap.xml (robots.txt / Search Console convention).
 * 2. Regenerate the ratings-endpoint allowlist from the tool registry, so
 *    api/rate.php only accepts slugs that are real tool pages.
 * 3. Copy the ratings API into dist/ so it deploys with the site.
 *    (The SQLite DB itself is created server-side and never touched by deploys.)
 */
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { QUANTITIES, allPairs } from '../src/data/units/index.ts';
import { CALCULATORS } from '../src/data/calc/index.ts';
import { SIZE_TOOLS } from '../src/data/size/index.ts';

await copyFile(new URL('../dist/sitemap-index.xml', import.meta.url), new URL('../dist/sitemap.xml', import.meta.url));
console.log('postbuild: dist/sitemap.xml created (copy of sitemap-index.xml)');

const slugs = [
  ...allPairs().map((p) => `units/${p.slug}`),
  ...QUANTITIES.map((q) => `units/${q.slug}`),
  ...CALCULATORS.map((c) => `calc/${c.slug}`),
  ...SIZE_TOOLS.map((t) => `size/${t.slug}`),
].sort();
await writeFile(new URL('../api/tools-allowlist.json', import.meta.url), JSON.stringify(slugs, null, 2) + '\n');
console.log(`postbuild: api/tools-allowlist.json regenerated (${slugs.length} tools)`);

await mkdir(new URL('../dist/api/data/', import.meta.url), { recursive: true });
for (const f of ['rate.php', 'stats.php', 'tools-allowlist.json', 'data/.htaccess']) {
  await copyFile(new URL(`../api/${f}`, import.meta.url), new URL(`../dist/api/${f}`, import.meta.url));
}
console.log('postbuild: ratings API copied into dist/api/');
