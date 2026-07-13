// IndexNow submission — pings participating search engines (Bing, Yandex,
// Seznam, Naver…) that URLs have changed, via the shared api.indexnow.org
// endpoint (one POST fans out to all engines that trust the key).
//
// Ownership is proven by hosting <KEY>.txt at the site root with the key as
// its body (see public/10b1ad5d09a5a265636a951d511bd5d1.txt).
//
// Usage:
//   node scripts/indexnow-submit.mjs                 # submit every URL in the sitemap
//   node scripts/indexnow-submit.mjs url1 url2 …      # submit only the given URLs (new/updated content)
//   node scripts/indexnow-submit.mjs --dry            # print what would be sent, don't POST
//
// A 200 or 202 response means the URLs were accepted for processing.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HOST = 'lazytools.io';
const KEY = '10b1ad5d09a5a265636a951d511bd5d1';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_PER_REQUEST = 10000; // IndexNow hard limit per POST

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const explicit = args.filter((a) => a.startsWith('http'));

/** Pull all <loc> URLs from the built sitemap(s) under dist/. */
function urlsFromSitemap() {
  const out = new Set();
  const files = ['dist/sitemap-index.xml', 'dist/sitemap-0.xml', 'dist/sitemap.xml'];
  for (const f of files) {
    let xml;
    try { xml = readFileSync(join(root, f), 'utf8'); } catch { continue; }
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const u = m[1].trim();
      // skip the sitemap-index's pointers to other sitemaps
      if (u.endsWith('.xml')) continue;
      out.add(u);
    }
  }
  return [...out];
}

const urlList = explicit.length ? explicit : urlsFromSitemap();

if (urlList.length === 0) {
  console.error('indexnow: no URLs to submit (build the site first, or pass URLs as args).');
  process.exit(1);
}

console.log(`indexnow: ${urlList.length} URL(s) → ${ENDPOINT} (key ${KEY.slice(0, 8)}…)`);

if (dry) {
  console.log(urlList.slice(0, 20).join('\n') + (urlList.length > 20 ? `\n… +${urlList.length - 20} more` : ''));
  process.exit(0);
}

async function submitBatch(batch) {
  const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: batch });
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body,
  });
  const text = await res.text().catch(() => '');
  return { status: res.status, text };
}

let ok = true;
for (let i = 0; i < urlList.length; i += MAX_PER_REQUEST) {
  const batch = urlList.slice(i, i + MAX_PER_REQUEST);
  const { status, text } = await submitBatch(batch);
  const good = status === 200 || status === 202;
  console.log(`indexnow: batch ${i / MAX_PER_REQUEST + 1} (${batch.length} urls) → HTTP ${status}${good ? ' ✓' : ` ✗ ${text.slice(0, 200)}`}`);
  if (!good) ok = false;
}

process.exit(ok ? 0 : 1);
