/**
 * Pull aggregate ratings from production into src/data/ratings.json so the
 * static build can render rating panels and aggregateRating schema.
 * Fail-safe: on any error the existing file is kept and the build proceeds.
 */
import { writeFile } from 'node:fs/promises';

try {
  const res = await fetch('https://lazytools.io/api/stats.php', { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (typeof data !== 'object' || data === null || Array.isArray(data)) throw new Error('unexpected payload');
  await writeFile(new URL('../src/data/ratings.json', import.meta.url), JSON.stringify(data, null, 2) + '\n');
  console.log(`fetch-ratings: ${Object.keys(data).length} tool(s) past the display threshold`);
} catch (err) {
  console.log(`fetch-ratings: skipped (${err.message}) — keeping existing ratings.json`);
}
