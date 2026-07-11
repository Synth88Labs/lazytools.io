/**
 * Post-build steps:
 * 1. Expose the sitemap index as /sitemap.xml (robots.txt / Search Console convention).
 * 2. Regenerate the ratings-endpoint allowlist from the tool registry, so
 *    api/rate.php only accepts slugs that are real tool pages.
 * 3. Copy the ratings API into dist/ so it deploys with the site.
 *    (The SQLite DB itself is created server-side and never touched by deploys.)
 * 4. Generate dist/llms.txt from the registry so it never drifts from the site.
 */
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import buildLlms from './generate-llms.mjs';
import { allPairs as zonePairs } from '../src/data/time/zones.ts';
import { QUANTITIES, allPairs } from '../src/data/units/index.ts';
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

await copyFile(new URL('../dist/sitemap-index.xml', import.meta.url), new URL('../dist/sitemap.xml', import.meta.url));
console.log('postbuild: dist/sitemap.xml created (copy of sitemap-index.xml)');

const slugs = [
  ...allPairs().map((p) => `units/${p.slug}`),
  ...QUANTITIES.map((q) => `units/${q.slug}`),
  ...CALCULATORS.map((c) => `calc/${c.slug}`),
  ...SIZE_TOOLS.map((t) => `size/${t.slug}`),
  ...TEXT_TOOLS.map((t) => `text/${t.slug}`),
  ...COLOR_TOOLS.map((t) => `color/${t.slug}`),
  ...FILE_TOOLS.map((t) => `file/${t.slug}`),
  ...DEV_TOOLS.map((t) => `dev/${t.slug}`),
  ...GEN_TOOLS.map((t) => `generate/${t.slug}`),
  ...TIME_TOOLS.map((t) => `time/${t.slug}`),
  ...SECURITY_TOOLS.map((t) => `security/${t.slug}`),
  ...IMAGE_TOOLS.map((t) => `image/${t.slug}`),
  ...PDF_TOOLS.map((t) => `pdf/${t.slug}`),
  ...AUDIO_TOOLS.map((t) => `video/${t.slug}`),
  ...zonePairs().map((p) => `time/zones/${p.slug}`),
  ...CALENDAR_TOOLS.map((t) => `calendar/${t.slug}`),
  ...CIPHER_TOOLS.map((t) => `cipher/${t.slug}`),
  ...PRODUCTIVITY_TOOLS.map((t) => `productivity/${t.slug}`),
  ...NETWORK_TOOLS.map((t) => `network/${t.slug}`),
  ...MATH_TOOLS.map((t) => `math/${t.slug}`),
  ...PHOTO_SPECS.map((s) => `photo/${s.slug}`),
  ...BIO_TOOLS.map((t) => `biology/${t.slug}`),
  ...STAT_TOOLS.map((t) => `statistics/${t.slug}`),
  ...CHEM_TOOLS.map((t) => `chemistry/${t.slug}`),
  ...PHYS_TOOLS.map((t) => `physics/${t.slug}`),
  ...HOME_TOOLS.map((t) => `home/${t.slug}`),
  ...FIN_TOOLS.map((t) => `finance/${t.slug}`),
  ...COOKING_TOOLS.map((t) => `cooking/${t.slug}`),
].sort();
await writeFile(new URL('../api/tools-allowlist.json', import.meta.url), JSON.stringify(slugs, null, 2) + '\n');
console.log(`postbuild: api/tools-allowlist.json regenerated (${slugs.length} tools)`);

await mkdir(new URL('../dist/api/data/', import.meta.url), { recursive: true });
for (const f of ['rate.php', 'stats.php', 'tools-allowlist.json', 'data/.htaccess']) {
  await copyFile(new URL(`../api/${f}`, import.meta.url), new URL(`../dist/api/${f}`, import.meta.url));
}
console.log('postbuild: ratings API copied into dist/api/');

await writeFile(new URL('../dist/llms.txt', import.meta.url), buildLlms());
console.log('postbuild: dist/llms.txt generated from registry');
