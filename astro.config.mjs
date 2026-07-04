import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://lazytools.io',
  trailingSlash: 'always',
  integrations: [
    preact(),
    sitemap({
      // Keep placeholder/coming-soon and stub pages out of the sitemap
      filter: (page) =>
        !page.includes('/coming-soon') &&
        !page.includes('/blog/') &&
        !['/calc/', '/dev/', '/file/', '/text/', '/generate/', '/time/', '/color/', '/security/', '/image/', '/pdf/', '/audio/', '/video/'].some(
          (stub) => page === `https://lazytools.io${stub}`
        ),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
