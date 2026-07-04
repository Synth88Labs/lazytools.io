/**
 * Post-build: expose the sitemap index as /sitemap.xml too.
 * (robots.txt and Search Console conventions expect /sitemap.xml;
 * @astrojs/sitemap emits sitemap-index.xml.)
 */
import { copyFile } from 'node:fs/promises';

await copyFile(new URL('../dist/sitemap-index.xml', import.meta.url), new URL('../dist/sitemap.xml', import.meta.url));
console.log('postbuild: dist/sitemap.xml created (copy of sitemap-index.xml)');
